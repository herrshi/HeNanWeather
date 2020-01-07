<template>
  <mdb-modal
    :show="showModal"
    size="lg"
    cascade
    tabs
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-tab tabs justify class="light-blue darken-3">
      <mdb-tab-item :active="tabs === 1" @click.native.prevent="tabs = 1">
        <mdb-icon icon="table" class="mr-1" />实时
      </mdb-tab-item>
      <mdb-tab-item :active="tabs === 2" @click.native.prevent="tabs = 2">
        <mdb-icon icon="chart-line" class="mr-1" />历史
      </mdb-tab-item>
    </mdb-tab>

    <mdb-modal-body v-if="tabs === 1">
      <mdb-card>
        <mdb-card-body>
          <div class="d-flex align-items-end">
            <mdb-card-title>
              {{ stationRTData ? stationRTData.STATION_NAME : '' }}
            </mdb-card-title>
            <mdb-card-title class="h6 ml-3">
              更新时间: {{ stationRTData ? stationRTData.TIME_NAME : '' }}
            </mdb-card-title>
          </div>

          <mdb-row>
            <mdb-col>
              <mdb-tbl>
                <mdb-tbl-head>
                  <tr>
                    <th>监测因子</th>
                    <th>监测值</th>
                  </tr>
                </mdb-tbl-head>

                <mdb-tbl-body>
                  <!--                  <tr>-->
                  <!--                    <td>AQI</td>-->
                  <!--                    <td>{{ stationRTData['AQI'] }}</td>-->
                  <!--                  </tr>-->
                  <tr>
                    <td>PM2.5</td>
                    <td>{{ stationRTData['PM25'] }}</td>
                  </tr>
                  <tr>
                    <td>PM10</td>
                    <td>{{ stationRTData['PM10'] }}</td>
                  </tr>
                  <tr>
                    <td>二氧化氮</td>
                    <td>{{ stationRTData['NO2'] }}</td>
                  </tr>
                  <tr>
                    <td>二氧化硫</td>
                    <td>{{ stationRTData['SO2'] }}</td>
                  </tr>
                </mdb-tbl-body>
              </mdb-tbl>
            </mdb-col>

            <mdb-col>
              <mdb-tbl>
                <mdb-tbl-head>
                  <tr>
                    <th>监测因子</th>
                    <th>监测值</th>
                  </tr>
                </mdb-tbl-head>

                <mdb-tbl-body>
                  <tr>
                    <td>一氧化碳</td>
                    <td>{{ stationRTData['CO'] }}</td>
                  </tr>
                  <tr>
                    <td>臭氧</td>
                    <td>{{ stationRTData['O3'] }}</td>
                  </tr>
                  <tr>
                    <td>温度</td>
                    <td>{{ stationRTData['WD'] }}</td>
                  </tr>
                  <tr>
                    <td>湿度</td>
                    <td>{{ stationRTData['HU'] }}</td>
                  </tr>
                </mdb-tbl-body>
              </mdb-tbl>
            </mdb-col>
          </mdb-row>
        </mdb-card-body>
      </mdb-card>
    </mdb-modal-body>

    <mdb-modal-body v-if="tabs === 2">
      <!--      <mdb-select-->
      <!--        v-model="airStationMonitoringFactor"-->
      <!--        label="监测因子: "-->
      <!--        multiple-->
      <!--        @getValue="$_setOption"-->
      <!--      />-->
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
import { mapMutations } from 'vuex'
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalBody,
  mdbModalFooter,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbRow,
  mdbCol,
  mdbTab,
  mdbTabItem,
  mdbCard,
  mdbCardBody,
  mdbCardTitle
} from 'mdbvue'
import moment from 'moment'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataset'
import AirStationApi from '~/api/AirStation'

export default {
  name: 'AirStationDetail',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalBody,
    mdbModalFooter,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbRow,
    mdbCol,
    mdbTab,
    mdbTabItem,
    mdbCard,
    mdbCardBody,
    mdbCardTitle
  },

  props: {
    stationId: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tabs: 1,
      stationRTData: {},
      stationHistData: {},
      airStationMonitoringFactor: [
        // {
        //   text: 'AQI',
        //   value: 'AQI',
        //   selected: true
        // },
        {
          text: 'PM2.5',
          value: 'PM25',
          selected: true
        },
        {
          text: 'PM10',
          value: 'PM10',
          selected: true
        },
        {
          text: '一氧化碳',
          value: 'CO',
          selected: true
        },
        {
          text: '二氧化氮',
          value: 'NO2',
          selected: true
        },
        {
          text: '二氧化硫',
          value: 'SO2',
          selected: true
        },
        {
          text: '臭氧',
          value: 'O3',
          selected: true
        },
        {
          text: '温度',
          value: 'WD',
          selected: true
        },
        {
          text: '湿度',
          value: 'HU',
          selected: true
        }
      ],
      chartOption: null
    }
  },

  computed: {
    selectedFactors() {
      return this.airStationMonitoringFactor.filter(
        (factor) => factor.selected === true
      )
    }
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    async $_modal_beforeShow() {
      this.startFetchData()
      const result = await AirStationApi.getRTData(this.stationId)
      if (result && result.length > 0) {
        this.stationRTData = result[0]
      } else {
        this.stationRTData = {}
      }

      const startDate = moment()
        .subtract(8, 'days')
        .format('YYYY-MM-DD')
      const endDate = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
      const histData = await AirStationApi.getHistData({
        stationId: this.stationId,
        startTime: startDate,
        endTime: endDate
      })
      if (histData) {
        this.stationHistData = histData
        this.$_setOption()
      }
      this.stopFetchData()
    },

    $_setOption() {
      // const factorName = this.selectedFactor.value
      this.chartOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: { data: this.selectedFactors.map((factor) => factor.text) },
        xAxis: {
          boundaryGap: false,
          data: this.stationHistData.map((data) =>
            moment(data.TIME_NAME).format('MM-DD')
          )
        },
        yAxis: {
          type: 'value'
        },
        // toolbox: {
        //   left: 'center',
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: 'none'
        //     },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        series: this.selectedFactors.map((factor) => ({
          name: factor.text,
          type: 'line',
          smooth: true,
          data: this.stationHistData.map((data) => data[factor.value])
        }))
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
