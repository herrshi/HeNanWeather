<template>
  <mdb-modal
    :show="showModal"
    size="lg"
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-modal-header>
      <mdb-modal-title>{{ cityName }}</mdb-modal-title>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子"
        @getValue="$_setOption"
      />

      <div v-if="loadingStatus !== '数据载入完成'" class="text-center">
        <p>
          <strong>{{ loadingStatus }}</strong>
        </p>
      </div>

      <v-chart v-if="loadingStatus === '数据载入完成'" :options="chartOption" />
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
import { mapGetters } from 'vuex'
// import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataset'
import moment from 'moment'

export default {
  name: 'AirQualityDetail',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbSelect
    // 'v-chart': ECharts
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
    dataType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      airQualityData: undefined,

      chartOption: undefined,

      monitoringFactor: [
        {
          text: '城市AQI',
          value: 'CITY_AQI',
          selected: true
        },
        {
          text: 'PM2.5',
          value: 'PM25_VALUE_AVG'
        },
        {
          text: 'PM10',
          value: 'PM10_VALUE_AVG'
        },
        {
          text: '一氧化碳',
          value: 'CO_VALUE_AVG'
        },
        {
          text: '二氧化氮',
          value: 'NO2_VALUE_AVG'
        },
        {
          text: '二氧化硫',
          value: 'SO2_VALUE_AVG'
        },
        {
          text: '臭氧',
          value: 'O3_VALUE_AVG'
        },
        {
          text: 'O3H8',
          value: 'O3H8_VALUE_AVG'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('base-data', ['getCityByCode']),

    cityName() {
      return this.getCityByCode(this.cityCode)
        ? this.getCityByCode(this.cityCode).cityName
        : ''
    },

    selectedFactor() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
    },

    loadingStatus() {
      if (!this.airQualityData) {
        return '数据载入中'
      } else if (Object.keys(this.airQualityData).length === 0) {
        return '无数据'
      } else {
        return '数据载入完成'
      }
    }
  },

  methods: {
    $_modal_beforeShow() {
      this.chartOption = {}
      this.airQualityData = undefined

      const result = this.getBusinessData(this.dataType)
      this.airQualityData = result.filter(
        (cityData) => this.cityCode === cityData.CITY_CODE
      )
      this.$_setOption()
    },

    $_setOption() {
      const factorName = this.selectedFactor.value
      this.chartOption = {
        // title: {
        //   text: this.selectedFactor.text
        // },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          boundaryGap: false,
          data: this.airQualityData.map((data) =>
            moment(data.TIME_NAME).format('MM-DD')
          )
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        toolbox: {
          left: 'center',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap:
          factorName === 'CITY_AQI'
            ? {
                top: 0,
                right: 0,
                pieces: [
                  {
                    gt: 0,
                    lte: 50,
                    color: '#096'
                  },
                  {
                    gt: 50,
                    lte: 100,
                    color: '#ffde33'
                  },
                  {
                    gt: 100,
                    lte: 150,
                    color: '#ff9933'
                  },
                  {
                    gt: 150,
                    lte: 200,
                    color: '#cc0033'
                  },
                  {
                    gt: 200,
                    lte: 300,
                    color: '#660099'
                  },
                  {
                    gt: 300,
                    color: '#7e0023'
                  }
                ],
                outOfRange: {
                  color: '#999'
                }
              }
            : null,
        series: {
          name: this.selectedFactor.text,
          type: 'line',
          data: this.airQualityData.map(
            (data) => data[this.selectedFactor.value]
          )
          // markLine:
          //   factorName === 'CITY_AQI'
          //     ? {
          //         silent: true,
          //         lineStyle: {
          //           color: '#2196f3'
          //         },
          //         data: [
          //           {
          //             yAxis: 50
          //           },
          //           {
          //             yAxis: 100
          //           },
          //           {
          //             yAxis: 150
          //           },
          //           {
          //             yAxis: 200
          //           },
          //           {
          //             yAxis: 300
          //           }
          //         ]
          //       }
          //     : null
        }
      }
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 750px;
  height: 400px;
}
</style>
