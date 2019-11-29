<template>
  <mdb-modal
    :show="showModal"
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
    size="lg"
  >
    <mdb-modal-header>
      <div class="d-flex align-items-end">
        <mdb-modal-title>{{ stationRTData.STATION_NAME }}</mdb-modal-title>
        <mdb-modal-title class="h6 ml-3">
          更新时间: {{ stationRTData.TIME_NAME }}
        </mdb-modal-title>
      </div>
    </mdb-modal-header>

    <mdb-modal-body>
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
              <tr>
                <td>NO</td>
                <td>{{ stationRTData['NO'] }}</td>
              </tr>
              <tr>
                <td>DEWT</td>
                <td>{{ stationRTData['DEWT'] }}</td>
              </tr>
              <tr>
                <td>O3</td>
                <td>{{ stationRTData['O3'] }}</td>
              </tr>
              <tr>
                <td>PREC</td>
                <td>{{ stationRTData['PREC'] }}</td>
              </tr>
              <tr>
                <td>CO2</td>
                <td>{{ stationRTData['CO2'] }}</td>
              </tr>
              <tr>
                <td>RELH</td>
                <td>{{ stationRTData['RELH'] }}</td>
              </tr>
              <tr>
                <td>NOX</td>
                <td>{{ stationRTData['NOX'] }}</td>
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
                <td>HU</td>
                <td>{{ stationRTData['HU'] }}</td>
              </tr>
              <tr>
                <td>WD</td>
                <td>{{ stationRTData['WD'] }}</td>
              </tr>
              <tr>
                <td>THC</td>
                <td>{{ stationRTData['THC'] }}</td>
              </tr>
              <tr>
                <td>SNWD</td>
                <td>{{ stationRTData['SNWD'] }}</td>
              </tr>
              <tr>
                <td>CO2</td>
                <td>{{ stationRTData['CO2'] }}</td>
              </tr>
              <tr>
                <td>NO2</td>
                <td>{{ stationRTData['NO2'] }}</td>
              </tr>
              <tr>
                <td>AP</td>
                <td>{{ stationRTData['AP'] }}</td>
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
                <td>AQI</td>
                <td>{{ stationRTData['AQI'] }}</td>
              </tr>
              <tr>
                <td>PM25</td>
                <td>{{ stationRTData['PM25'] }}</td>
              </tr>
              <tr>
                <td>PM10</td>
                <td>{{ stationRTData['PM10'] }}</td>
              </tr>
              <tr>
                <td>WS</td>
                <td>{{ stationRTData['WS'] }}</td>
              </tr>
              <tr>
                <td>NMHC</td>
                <td>{{ stationRTData['NMHC'] }}</td>
              </tr>
              <tr>
                <td>VOC</td>
                <td>{{ stationRTData['VOC'] }}</td>
              </tr>
              <tr>
                <td>CH4</td>
                <td>{{ stationRTData['CH4'] }}</td>
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
                <td>NJD</td>
                <td>{{ stationRTData['NJD'] }}</td>
              </tr>
              <tr>
                <td>SNSD</td>
                <td>{{ stationRTData['SNSD'] }}</td>
              </tr>
              <tr>
                <td>O3H8</td>
                <td>{{ stationRTData['O3H8'] }}</td>
              </tr>
              <tr>
                <td>SO2</td>
                <td>{{ stationRTData['SO2'] }}</td>
              </tr>
              <tr>
                <td>CO</td>
                <td>{{ stationRTData['CO'] }}</td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>
      </mdb-row>
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn @click="$emit('closeDetail')" color="info" rounded>
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
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbRow,
  mdbCol
} from 'mdbvue'
import AirStationApi from '~/api/AirStation'
export default {
  name: 'AirStationDetail',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbRow,
    mdbCol
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
      stationRTData: {}
    }
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    async $_modal_beforeShow() {
      this.startFetchData()
      const result = await AirStationApi.getRTData(this.stationId)
      this.stopFetchData()
      if (result) {
        this.stationRTData = result[0]
      }
    }
  }
}
</script>

<style scoped></style>
