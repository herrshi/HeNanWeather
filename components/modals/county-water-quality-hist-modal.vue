<template>
  <mdb-modal
    :show="showModal"
    size="lg"
    scrollable
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-modal-header>
      <mdb-modal-title> {{ cityName }} </mdb-modal-title>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子: "
        @getValue="$_setChartOption"
      />
      <v-chart :options="chartOption" />
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn color="info" rounded @click="$emit('closeDetail')">
        <mdb-icon icon="times" class="mr-1" />关闭
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbSelect
} from 'mdbvue'
import _ from 'lodash'
import { mapGetters, mapMutations, mapState } from 'vuex'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataset'
import WaterStationApi from '~/api/WaterStation'

export default {
  name: 'CountyWaterQualityHistModal',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbSelect
  },

  props: {
    cityCode: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    // 专题类型--小时/日/月
    subjectType: {
      type: String,
      default: 'hourly'
    }
  },

  data() {
    return {
      monitoringFactor: [],
      stationsData: [],
      chartLegendData: [],
      chartXData: [],
      chartOption: {}
    }
  },

  computed: {
    ...mapGetters('base-data', ['getCityByCode']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapState('business-data', ['waterMonitoringFactorMap']),

    selectedFactor() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
    },

    cityName() {
      const city = this.getCityByCode(this.cityCode)
      return city ? city.cityName : ''
    }
  },

  mounted() {
    for (const [key, value] of this.waterMonitoringFactorMap) {
      this.monitoringFactor.push({
        text: value.name,
        value: key
      })
    }
    this.monitoringFactor[0].selected = true
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    async $_modal_beforeShow() {
      switch (this.subjectType) {
        case 'hourly':
          this.stationsData = await WaterStationApi.getHourlyData({
            cityCode: this.cityCode,
            startTime: this.startTime,
            endTime: this.endTime
          })
          break

        case 'daily':
          this.stationsData = await WaterStationApi.getDailyData({
            cityCode: this.cityCode,
            startTime: this.startTime,
            endTime: this.endTime
          })
          break

        case 'monthly':
          this.stationsData = await WaterStationApi.getMonthlyData({
            cityCode: this.cityCode,
            startTime: this.startTime,
            endTime: this.endTime
          })
          break
      }

      this.chartLegendData = _.uniq(
        this.stationsData.map((result) => result.SITENAME)
      )
      this.chartXData = _.uniq(
        this.stationsData.map((result) => result.RECORDTIME || result.RECORDDAY)
      ).sort()
      this.$_setChartOption()
    },

    $_setChartOption() {
      const series = this.chartLegendData.map((stationName) => {
        const data = this.chartXData.map((dataTime) => {
          const stationData = this.stationsData.find(
            (stationData) =>
              stationData.SITENAME === stationName &&
              (stationData.RECORDTIME === dataTime ||
                stationData.RECORDDAY === dataTime)
          )
          if (stationData) {
            return stationData[this.selectedFactor.value]
          } else {
            return 0
          }
        })
        return { name: stationName, type: 'line', smooth: true, data }
      })

      this.chartOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartLegendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartXData
        },
        yAxis: {
          type: 'value'
        },
        series
      }
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 750px;
  height: 300px;
}
</style>
