<template>
  <mdb-card color="white">
    <mdb-card-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子: "
        @getValue="$_dateChanged"
      />

      <mdb-date-picker
        v-if="widgetConfig.AirQuality.type !== 'rt'"
        v-model="startDate"
        :option="dateOptions"
        :limit="[{ type: 'fromto', to: today }]"
        label="请选择开始日期"
        far
        auto-hide
        class="black-text"
        @getValue="$_dateChanged"
      />

      <mdb-date-picker
        v-if="widgetConfig.AirQuality.type !== 'rt'"
        v-model="endDate"
        :option="dateOptions"
        :limit="[{ type: 'fromto', from: startDate, to: today }]"
        label="请选择结束日期"
        auto-hide
        class="black-text"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbSelect, mdbDatePicker } from 'mdbvue'
import { loadModules } from 'esri-loader'
import { mapActions, mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'AirQuality',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect,
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
      map: null,
      view: null,
      cityLayer: null,
      layerRenderer: null,

      cityGraphics: [],
      layerFields: [],

      timeSlider: null,
      legend: null,

      result: null,

      startDate: '',
      endDate: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      today: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
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

      monitoringFactor: [
        {
          text: 'PM25平均值',
          value: 'PM25_VALUE_AVG',
          selected: true
        },
        {
          text: 'PM10平均值',
          value: 'PM10_VALUE_AVG'
        },
        {
          text: '二氧化氮平均值',
          value: 'NO2_VALUE_AVG'
        },
        {
          text: '二氧化硫平均值',
          value: 'SO2_VALUE_AVG'
        },
        {
          text: '一氧化碳平均值',
          value: 'CO_VALUE_AVG'
        },
        {
          text: '臭氧平均值',
          value: 'O3_VALUE_AVG'
        }
      ]
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    // ...mapState('base-data', ['airQualityMonitoringFactor']),
    ...mapGetters('business-data', ['getBusinessData']),

    // monitoringFactor() {
    //   return [].concat(
    //     JSON.parse(JSON.stringify(this.airQualityMonitoringFactor))
    //   )
    // },

    selectedFactor() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
    },

    // 实时的开始日期为昨天
    // 日统计的开始日期为上周
    // 周统计的开始日期为上月
    // 月统计的开始日期为去年
    initStartDate() {
      switch (this.widgetConfig.AirQuality.type) {
        case 'rt':
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
    const response = await fetch(
      `${process.env.baseUrl}/layer/HeNan_Prefecture_Level_City.json`
    )
    const layerData = await response.json()

    const [Graphic] = await loadModules(['esri/Graphic'], {
      url: `${this.appConfig.map.arcgis_api}/init.js`
    })
    this.cityGraphics = layerData.features.map((feature) =>
      Graphic.fromJSON(feature)
    )
    this.layerFields = layerData.fields
      .concat(
        this.monitoringFactor.map((factor) => ({
          name: factor.value,
          alias: factor.text,
          type: 'single'
        }))
      )
      .concat([
        { name: 'time', alias: '数据时间', type: 'date' },
        { name: 'PRIMARY_POLLUTANTS', alias: '首要污染物', type: 'string' }
      ])

    this.startDate = moment()
      .subtract(this.initStartDate, 'days')
      .format('YYYY-MM-DD')
    await this.$_createCityLayer()
    await this.$_dateChanged()
  },

  methods: {
    ...mapActions('business-data', [
      'getAirQualityRTData',
      'getAirQualityDailyData',
      'getAirQualityWeeklyData',
      'getAirQualityMonthlyData'
    ]),

    async $_createCityLayer() {
      const [Legend, TimeSlider, Expand] = await loadModules(
        [
          'esri/widgets/Legend',
          'esri/widgets/TimeSlider',
          'esri/widgets/Expand'
        ],
        { url: `${this.appConfig.map.arcgis_api}/init.js` }
      )

      this.map = await this.getMap()
      this.view = await this.getView()

      // 图例
      this.legend = new Legend({
        view: this.view,
        layerInfos: [
          {
            layer: this.cityLayer,
            title: '空气质量'
          }
        ]
      })
      const expandLegend = new Expand({
        view: this.view,
        content: this.legend,
        name: 'Legend',
        expandIconClass: 'esri-icon-collection',
        expandTooltip: '图例',
        expanded: false
      })
      this.view.ui.add(expandLegend, 'bottom-left')

      // 时间条
      if (this.widgetConfig.AirQuality.type !== 'rt') {
        this.timeSlider = new TimeSlider({
          view: this.view,
          // container: document.getElementById('timeSlider'),
          mode: 'instant'
        })
        this.view.ui.add(this.timeSlider, 'bottom-right')
      }
    },

    $_setRenderer(minValue, maxValue) {
      if (this.selectedFactor.value === 'CITY_AQI') {
        return {
          type: 'class-breaks',
          field: 'CITY_AQI',
          defaultSymbol: {
            type: 'simple-fill',
            color: [128, 128, 128, 0.5],
            style: 'solid',
            outline: {
              width: 1,
              color: [50, 50, 50, 0.6]
            }
          },
          defaultLabel: '无数据',
          classBreakInfos: [
            {
              minValue: 0,
              maxValue: 50,
              label: '优(0 - 50)',
              symbol: {
                type: 'simple-fill',
                color: '#096',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            },
            {
              minValue: 50.001,
              maxValue: 100,
              label: '良(51 - 100)',
              symbol: {
                type: 'simple-fill',
                color: '#ffde33',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            },
            {
              minValue: 100.001,
              maxValue: 150,
              label: '轻度污染(101 - 150)',
              symbol: {
                type: 'simple-fill',
                color: '#ff9933',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            },
            {
              minValue: 150.001,
              maxValue: 200,
              label: '中度污染(151 - 200)',
              symbol: {
                type: 'simple-fill',
                color: '#cc0033',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            },
            {
              minValue: 200.001,
              maxValue: 300,
              label: '重度污染(201 - 300)',
              symbol: {
                type: 'simple-fill',
                color: '#660099',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            },
            {
              minValue: 300.001,
              maxValue: 300,
              label: '严重污染(301+)',
              symbol: {
                type: 'simple-fill',
                color: '#7e0023',
                style: 'solid',
                outline: {
                  width: 1,
                  color: [255, 255, 255]
                }
              }
            }
          ]
        }
      } else {
        return {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            outline: {
              color: 'lightgray',
              width: 0.5
            }
          },
          visualVariables: [
            {
              type: 'color',
              field: this.selectedFactor.value,
              stops: [
                {
                  value: minValue,
                  color: '#4caf50',
                  label: minValue
                },
                {
                  value: (maxValue + minValue) / 2,
                  color: '#ffeb3b',
                  label: Math.floor((maxValue + minValue) / 2)
                },
                {
                  value: maxValue,
                  color: '#f44336',
                  label: maxValue
                }
              ]
            }
          ]
        }
      }
    },

    async $_setRTData() {
      await this.getAirQualityRTData()
      const result = this.getBusinessData('AirQualityRTData')

      let minValue = Number.MAX_VALUE
      let maxValue = Number.MIN_VALUE
      for (let i = 0; i < result.length; i++) {
        const data = result[i]
        const value = data[this.selectedFactor.value]
        if (isNaN(value)) continue
        minValue = Math.min(minValue, value)
        maxValue = Math.max(maxValue, value)

        const { CITY_CODE } = data
        const cityGraphic = this.cityGraphics.find((graphic) =>
          graphic.getAttribute('Code').includes(CITY_CODE)
        )
        if (cityGraphic) {
          // 时间转换为时间戳
          if (data.TIME_NAME) {
            const time = new Date(data.TIME_NAME)
            data.time = time.getTime()
          }
          data.FID = i
          cityGraphic.attributes = { ...cityGraphic.attributes, ...data }
        }
      }

      const [FeatureLayer, Field] = await loadModules(
        ['esri/layers/FeatureLayer', 'esri/layers/support/Field'],
        { url: `${this.appConfig.map.arcgis_api}/init.js` }
      )

      if (this.cityLayer) {
        this.map.remove(this.cityLayer)
      }
      this.cityLayer = new FeatureLayer({
        objectIdField: 'FID',
        source: this.cityGraphics,
        fields: this.layerFields.map((field) => Field.fromJSON(field)),
        outFields: ['*'],
        popupTemplate: {
          title: '{Name}',
          content: [
            {
              type: 'fields',
              fieldInfos: this.monitoringFactor
                .map((factor) => ({
                  fieldName: factor.value,
                  label: factor.text
                }))
                .concat([
                  { fieldName: 'PRIMARY_POLLUTANTS', label: '首要污染物' }
                ])
            }
          ]
        },
        labelingInfo: [
          {
            labelExpressionInfo: {
              expression: `$feature.name + ':' + $feature.${this.selectedFactor.value}`
            },
            symbol: {
              type: 'text',
              font: {
                family: 'yahei',
                size: 12
              },
              haloSize: 1,
              haloColor: 'white'
            }
          }
        ]
      })
      this.cityLayer.renderer = this.$_setRenderer(minValue, maxValue)
      this.legend.layerInfos[0].layer = this.cityLayer
      this.map.add(this.cityLayer)
    },

    async $_setDailyData() {
      let result
      switch (this.widgetConfig.AirQuality.type) {
        case 'daily':
          await this.getAirQualityDailyData({
            startTime: this.startDate,
            endTime: this.endDate
          })
          result = this.getBusinessData('AirQualityDailyData')
          break

        case 'weekly': {
          // 获取周数
          const startYearWeek = moment(this.startDate, 'YYYY-MM-DD').year()
          const startWeekNumber = moment(this.startDate, 'YYYY-MM-DD').week()
          const startTimeWeek =
            startWeekNumber < 10
              ? `${startYearWeek}0${startWeekNumber}`
              : `${startYearWeek}${startWeekNumber}`
          const endYearWeek = moment(this.endDate, 'YYYY-MM-DD').year()
          const endWeekNumber = moment(this.endDate, 'YYYY-MM-DD').week()
          const endTimeWeek =
            startWeekNumber < 10
              ? `${endYearWeek}0${endWeekNumber}`
              : `${endYearWeek}${endWeekNumber}`
          await this.getAirQualityWeeklyData({
            startTime: startTimeWeek,
            endTime: endTimeWeek
          })
          result = this.getBusinessData('AirQualityWeeklyData')
          break
        }

        case 'monthly': {
          const startYearMonth = moment(this.startDate, 'YYYY-MM-DD').year()
          const startMonthNumber =
            moment(this.startDate, 'YYYY-MM-DD').month() + 1
          const startTimeMonth =
            startMonthNumber < 10
              ? `${startYearMonth}0${startMonthNumber}`
              : `${startYearMonth}${startMonthNumber}`
          const endYearMonth = moment(this.endDate, 'YYYY-MM-DD').year()
          const endMonthNumber = moment(this.endDate, 'YYYY-MM-DD').month() + 1
          const endTimeMonth =
            endMonthNumber < 10
              ? `${endYearMonth}0${endMonthNumber}`
              : `${endYearMonth}${endMonthNumber}`
          await this.getAirQualityMonthlyData({
            startTime: startTimeMonth,
            endTime: endTimeMonth
          })
          result = this.getBusinessData('AirQualityMonthlyData')
          break
        }
      }
      const graphicSource = []

      let minValue = Number.MAX_VALUE
      let maxValue = Number.MIN_VALUE

      for (let i = 0; i < result.length; i++) {
        const data = result[i]
        const value = data[this.selectedFactor.value]
        minValue = Math.min(minValue, value)
        maxValue = Math.max(maxValue, value)

        const { CITY_CODE, TIME_NAME } = data
        const cityGraphic = this.cityGraphics.find(
          (graphic) => graphic.getAttribute('Code') === CITY_CODE
        )

        if (cityGraphic) {
          const graphic = cityGraphic.clone()
          // 时间转换为时间戳
          const time = new Date(TIME_NAME)
          data.time = time.getTime()
          data.FID = i
          graphic.attributes = { ...cityGraphic.attributes, ...data }
          graphicSource.push(graphic)
        }
      }

      if (this.cityLayer) {
        this.map.remove(this.cityLayer)
      }

      const [FeatureLayer, Field] = await loadModules(
        ['esri/layers/FeatureLayer', 'esri/layers/support/Field'],
        { url: `${this.appConfig.map.arcgis_api}/init.js` }
      )
      this.cityLayer = new FeatureLayer({
        objectIdField: 'FID',
        source: graphicSource,
        fields: this.layerFields.map((field) => Field.fromJSON(field)),
        outFields: ['*'],
        timeInfo: {
          startField: 'time'
        },
        popupTemplate: {
          title: '{Name}',
          content: [
            {
              type: 'fields',
              fieldInfos: this.monitoringFactor.map((factor) => ({
                fieldName: factor.value,
                label: factor.text
              }))
            }
          ],
          actions: [
            {
              title: '曲线图',
              id: 'airQualityChart',
              className: 'esri-icon-line-chart'
            }
          ]
        },
        labelingInfo: [
          {
            labelExpressionInfo: {
              expression: `$feature.name + ':' + $feature.${this.selectedFactor.value}`
            },
            symbol: {
              type: 'text',
              font: {
                family: 'yahei',
                size: 12
              },
              haloSize: 1,
              haloColor: 'white'
            }
          }
        ]
      })
      this.cityLayer.renderer = this.$_setRenderer(minValue, maxValue)
      this.legend.layerInfos[0].layer = this.cityLayer
      this.map.add(this.cityLayer)
      await this.view.whenLayerView(this.cityLayer)
      this.timeSlider.fullTimeExtent = this.cityLayer.timeInfo.fullTimeExtent
      switch (this.widgetConfig.AirQuality.type) {
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
      // this.timeSlider.watch('values', (values) => {
      //   this.cityLayer.labelingInfo[0].where = `time = ${values[0]}`
      // })
      // this.cityLayer.labelingInfo[0].where = `time = ${this.timeSlider.values[0]}`
    },

    async $_dateChanged() {
      switch (this.widgetConfig.AirQuality.type) {
        case 'rt':
          await this.$_setRTData()
          break
        default:
          await this.$_setDailyData()
          break
      }
    }
  }
}
</script>

<style scoped>
.card {
  width: 300px;
}
</style>
