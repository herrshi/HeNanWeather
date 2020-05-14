<template>
  <mdb-card
    :style="
      'width: ' + (widgetConfig.Noise.type === 'hourly' ? '400px' : '300px')
    "
  >
    <mdb-card-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子"
        color="primary"
        @getValue="$_dataChanged"
      />

      <mdb-form-inline
        v-if="widgetConfig.Noise.type !== 'rt'"
        class="justify-content-between"
      >
        <mdb-date-picker
          v-model="startDate"
          :option="dateOptions"
          :limit="[{ type: 'fromto', to: today }]"
          auto-hide
          label="开始日期"
          class="black-text my-0"
        />
        <mdb-select
          v-if="widgetConfig.Noise.type === 'hourly'"
          v-model="startTime"
          label="开始时间"
        />
      </mdb-form-inline>

      <mdb-form-inline
        v-if="widgetConfig.Noise.type !== 'rt'"
        class="justify-content-between"
      >
        <mdb-date-picker
          v-model="endDate"
          :option="dateOptions"
          :limit="[{ type: 'fromto', to: today }]"
          auto-hide
          label="结束日期"
          class="black-text my-0"
        />
        <mdb-select
          v-if="widgetConfig.Noise.type === 'hourly'"
          v-model="endTime"
          label="结束时间"
        />
      </mdb-form-inline>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import {
  mdbCard,
  mdbCardBody,
  mdbSelect,
  mdbFormInline,
  mdbDatePicker
} from 'mdbvue'
import { mapGetters, mapActions, mapState } from 'vuex'
import { loadModules } from 'esri-loader'
import moment from 'moment'
import NoiseStationApi from '~/api/NoiseStation'

export default {
  name: 'Noise',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect,
    mdbFormInline,
    mdbDatePicker
  },

  inject: ['getMap', 'getView'],

  props: {
    widgetConfig: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      FeatureLayer: null,
      Graphic: null,
      map: null,
      view: null,
      timeSlider: null,
      noiseStations: null,
      stationLayer: null,
      monitoringFactor: [
        {
          text: 'Leq',
          value: 'Leq',
          selected: true
        },
        {
          text: 'L10',
          value: 'L10'
        },
        {
          text: 'L50',
          value: 'L50'
        },
        {
          text: 'SD',
          value: 'SD'
        }
      ],
      startDate: '',
      endDate: moment().format('YYYY-MM-DD'),
      today: moment().format('YYYY-MM-DD'),
      dateOptions: {
        type: 'day',
        SundayFirst: false,
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        month: [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ],
        format: 'YYYY-MM-DD',
        color: {
          header: 'primary',
          headerText: 'primary',
          checkedDay: 'primary'
        },
        buttons: {
          ok: '确认',
          clear: '清除',
          today: '今日'
        },
        overlayOpacity: 0.5
      },
      startTime: [
        { text: '0时', value: '00:00:00', selected: true },
        { text: '1时', value: '01:00:00' },
        { text: '2时', value: '02:00:00' },
        { text: '3时', value: '03:00:00' },
        { text: '4时', value: '04:00:00' },
        { text: '5时', value: '05:00:00' },
        { text: '6时', value: '06:00:00' },
        { text: '7时', value: '07:00:00' },
        { text: '8时', value: '08:00:00' },
        { text: '9时', value: '09:00:00' },
        { text: '10时', value: '10:00:00' },
        { text: '11时', value: '11:00:00' },
        { text: '12时', value: '12:00:00' },
        { text: '13时', value: '13:00:00' },
        { text: '14时', value: '14:00:00' },
        { text: '15时', value: '15:00:00' },
        { text: '16时', value: '16:00:00' },
        { text: '17时', value: '17:00:00' },
        { text: '18时', value: '18:00:00' },
        { text: '19时', value: '19:00:00' },
        { text: '20时', value: '20:00:00' },
        { text: '21时', value: '21:00:00' },
        { text: '22时', value: '22:00:00' },
        { text: '23时', value: '23:00:00' }
      ],
      endTime: [
        { text: '0时', value: '00:00:00', selected: true },
        { text: '1时', value: '01:00:00' },
        { text: '2时', value: '02:00:00' },
        { text: '3时', value: '03:00:00' },
        { text: '4时', value: '04:00:00' },
        { text: '5时', value: '05:00:00' },
        { text: '6时', value: '06:00:00' },
        { text: '7时', value: '07:00:00' },
        { text: '8时', value: '08:00:00' },
        { text: '9时', value: '09:00:00' },
        { text: '10时', value: '10:00:00' },
        { text: '11时', value: '11:00:00' },
        { text: '12时', value: '12:00:00' },
        { text: '13时', value: '13:00:00' },
        { text: '14时', value: '14:00:00' },
        { text: '15时', value: '15:00:00' },
        { text: '16时', value: '16:00:00' },
        { text: '17时', value: '17:00:00' },
        { text: '18时', value: '18:00:00' },
        { text: '19时', value: '19:00:00' },
        { text: '20时', value: '20:00:00' },
        { text: '21时', value: '21:00:00' },
        { text: '22时', value: '22:00:00' },
        { text: '23时', value: '23:00:00' }
      ]
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData']),

    selectedFactorName() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
        .value
    },

    initStartDate() {
      switch (this.widgetConfig.Noise.type) {
        case 'hourly':
          return 1
        case 'daily':
          return 7
        case 'weekly':
          return 31
        case 'monthly':
          return 365
        default:
          return 1
      }
    }
  },

  async mounted() {
    this.map = await this.getMap()
    this.view = await this.getView()

    this.startDate = moment()
      .subtract(this.initStartDate, 'days')
      .format('YYYY-MM-DD')

    const [FeatureLayer, Graphic, TimeSlider] = await loadModules(
      ['esri/layers/FeatureLayer', 'esri/Graphic', 'esri/widgets/TimeSlider'],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.FeatureLayer = FeatureLayer
    this.Graphic = Graphic
    if (this.widgetConfig.Noise.type !== 'rt') {
      this.timeSlider = new TimeSlider({
        view: this.view,
        mode: 'instant'
      })
      this.view.ui.add(this.timeSlider, 'bottom-right')
    }

    this.noiseStations = this.getBusinessData('NoiseSurveillanceStation')
    if (!this.noiseStations) {
      await this.getAllNoiseSurveillanceStation({ isPage: 'NO' })
      this.noiseStations = this.getBusinessData('NoiseSurveillanceStation')
    }

    this.$_dataChanged()
  },

  methods: {
    ...mapActions('business-data', ['getAllNoiseSurveillanceStation']),

    $_createLayer(graphics) {
      const layerConfig = this.appConfig.pageComponents.layerList.find(
        (layerConfig) => layerConfig.dataType === 'NoiseSurveillanceStation'
      )
      const { name, fields, geometryType } = layerConfig
      const allFields = fields.concat(
        this.monitoringFactor.map((factor) => ({
          name: factor.value,
          alias: factor.text,
          type: 'single'
        }))
      )
      this.stationLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        fields: allFields
      })
    },

    async $_setRTData() {
      if (this.stationLayer) {
        this.map.remove(this.stationLayer)
      }

      const graphics = []
      let maxValue = Number.MIN_VALUE
      const rtData = await NoiseStationApi.getRTData()
      for (let i = 0; i < this.noiseStations.length; i++) {
        let station = this.noiseStations[i]
        const { id: stationId, geometry } = station
        const data = rtData.find((data) => data.siteId === stationId)
        if (data) {
          station = { ...station, ...data }
          maxValue = Math.max(maxValue, data[this.selectedFactorName])
        }
        station.FID = i
        if (geometry) {
          graphics.push(new this.Graphic({ geometry, attributes: station }))
        }
      }
      this.$_createLayer(graphics)
      this.stationLayer.renderer = {
        type: 'heatmap',
        field: this.selectedFactorName,
        maxPixelIntensity: maxValue,
        colorStops: [
          { ratio: 0, color: 'rgba(255, 255, 255, 0)' },
          { ratio: 0.2, color: '#4caf50' },
          { ratio: 0.5, color: '#ffeb3b' },
          { ratio: 0.8, color: '#ff9800' },
          { ratio: 1, color: '#f44336' }
        ]
      }
      this.map.add(this.stationLayer)
    },

    async $_setHistData() {
      if (this.stationLayer) {
        this.map.remove(this.stationLayer)
      }

      let start = this.startDate
      let end = this.endDate
      if (this.widgetConfig.Noise.type === 'hourly') {
        start += ' ' + this.startTime.find((time) => time.selected).value
        end += ' ' + this.endTime.find((time) => time.selected).value
      }

      let histData
      switch (this.widgetConfig.Noise.type) {
        case 'hourly':
          histData = await NoiseStationApi.getHourlyData(start, end)
          break
        case 'daily':
          histData = await NoiseStationApi.getDailyData(start, end)
          break
        case 'monthly':
          histData = await NoiseStationApi.getMonthlyData(start, end)
          break
      }

      const graphics = []
      let maxValue = Number.MIN_VALUE
      for (let i = 0; i < histData.length; i++) {
        const data = histData[i]
        const { siteId, recordTime } = data
        let station = this.noiseStations.find(
          (station) => station.id === siteId
        )
        if (station) {
          const time = new Date(recordTime)
          station.FID = i
          station.time = time.getTime()
          station = { ...station, ...data }
          maxValue = Math.max(maxValue, data[this.selectedFactorName])
          graphics.push(
            new this.Graphic({
              geometry: station.geometry,
              attributes: station
            })
          )
        }
      }

      const layerConfig = this.appConfig.pageComponents.layerList.find(
        (layerConfig) => layerConfig.dataType === 'NoiseSurveillanceStation'
      )
      const { name, fields, geometryType } = layerConfig
      const allFields = fields
        .concat(
          this.monitoringFactor.map((factor) => ({
            name: factor.value,
            alias: factor.text,
            type: 'single'
          }))
        )
        .concat([{ name: 'time', alias: '数据时间', type: 'date' }])
      this.stationLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        fields: allFields,
        timeInfo: {
          startField: 'time'
        }
      })
      this.stationLayer.renderer = {
        type: 'heatmap',
        field: this.selectedFactorName,
        maxPixelIntensity: maxValue,
        colorStops: [
          { ratio: 0, color: 'rgba(255, 255, 255, 0)' },
          { ratio: 0.2, color: '#4caf50' },
          { ratio: 0.5, color: '#ffeb3b' },
          { ratio: 0.8, color: '#ff9800' },
          { ratio: 1, color: '#f44336' }
        ]
      }
      this.map.add(this.stationLayer)

      await this.view.whenLayerView(this.stationLayer)
      this.timeSlider.fullTimeExtent = this.stationLayer.timeInfo.fullTimeExtent
      switch (this.widgetConfig.Noise.type) {
        case 'hourly':
          this.timeSlider.stops = {
            interval: {
              value: 1,
              unit: 'hours'
            }
          }
          break
        case 'daily':
          this.timeSlider.stops = {
            interval: {
              value: 1,
              unit: 'days'
            }
          }
          break
        case 'weekly':
          this.timeSlider.stops = {
            interval: {
              value: 1,
              unit: 'weeks'
            }
          }
          break
        case 'monthly':
          this.timeSlider.stops = {
            interval: {
              value: 1,
              unit: 'months'
            }
          }
      }
    },

    $_dataChanged() {
      if (this.widgetConfig.Noise.type === 'rt') {
        this.$_setRTData()
      } else {
        this.$_setHistData()
      }
    }
  }
}
</script>

<style scoped>
/* .card {
  width: 400px;
} */
</style>
