<template>
  <mdb-modal
    :show="showModal"
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
    size="lg"
  >
    <mdb-modal-header>
      <mdb-modal-title>{{ cityName }}</mdb-modal-title>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-select
        v-model="monitoringFactor"
        @getValue="$_setOption"
        label="监测因子"
      />
      <v-chart :options="chartOption" />
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn @click="$emit('closeDetail')" color="info" rounded>
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
import ECharts from 'vue-echarts'
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
    mdbSelect,
    'v-chart': ECharts
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
      airQualityData: null,

      chartOption: null,

      monitoringFactor: [
        {
          text: '城市AQI',
          value: 'CITY_AQI',
          selected: true
        },
        {
          text: 'PM10平均值',
          value: 'PM10_VALUE_AVG'
        },
        {
          text: 'SO2平均值',
          value: 'SO2_VALUE_AVG'
        },
        {
          text: 'O3平均值',
          value: 'O3_VALUE_AVG'
        },
        {
          text: 'NO2平均值',
          value: 'NO2_VALUE_AVG'
        },
        {
          text: 'CO平均值',
          value: 'CO_VALUE_AVG'
        },
        {
          text: 'PM25平均值',
          value: 'PM25_VALUE_AVG'
        },
        {
          text: 'O3H8平均值',
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
    }
  },

  methods: {
    $_modal_beforeShow() {
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
          data: this.airQualityData.map((data) =>
            moment(data.TIME_NAME).format('YYYY-MM-DD')
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
          ),
          markLine:
            factorName === 'CITY_AQI'
              ? {
                  silent: true,
                  lineStyle: {
                    color: '#2196f3'
                  },
                  data: [
                    {
                      yAxis: 50
                    },
                    {
                      yAxis: 100
                    },
                    {
                      yAxis: 150
                    },
                    {
                      yAxis: 200
                    },
                    {
                      yAxis: 300
                    }
                  ]
                }
              : null
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
