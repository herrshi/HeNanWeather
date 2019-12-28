<template>
  <mdb-row class="h-100">
    <mdb-col :col="showLeftPanel ? '8' : '12'" class="px-1 py-0">
      <mdb-card color="white" class="h-100">
        <mdb-card-body class="m-0 p-0">
          <Map ref="Map" theme="light" @mapInitialized="getRTData" />
          <mdb-btn-fixed
            :icon="showLeftPanel ? 'expand-arrows-alt' : 'compress-arrows-alt'"
            :bottom="0"
            :left="0"
            @click.native="showLeftPanel = !showLeftPanel"
          />
        </mdb-card-body>
      </mdb-card>
    </mdb-col>

    <mdb-col v-if="showLeftPanel" col="4" class="px-1 py-0">
      <mdb-card color="white" class="h-100">
        <mdb-card-body>
          <mdb-datatable
            v-if="refreshTable"
            :data="tableData"
            :tfoot="false"
            max-height="50vh"
            showing-text="显示"
            entries-title=""
            no-found-message="无符合记录"
            search-placeholder="搜索"
            arrows
            striped
            bordered
            focus
            fixed
            class="m-2"
            @selectRow="$_datatable_rowSelected"
          />
        </mdb-card-body>
      </mdb-card>
    </mdb-col>
  </mdb-row>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbCard,
  mdbCardBody,
  mdbBtnFixed,
  mdbDatatable
} from 'mdbvue'
import Map from '~/components/map/map'
import { axiosGet } from '~/api/axios'

export default {
  name: 'TruckRT',

  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbBtnFixed,
    mdbDatatable,
    Map
  },

  data() {
    return {
      showLeftPanel: true,
      leftPanelType: 'rt',
      refreshTable: true,
      tableData: {
        columns: [
          {
            label: '司机姓名',
            field: 'driverName'
          },
          {
            label: '车牌号码',
            field: 'plateNum'
          }
        ],
        rows: []
      }
    }
  },

  methods: {
    async getRTData() {
      const rtData = await axiosGet('car_tack/get_real_time_tack')
      const overlays = rtData.map((data) => {
        const { id, plateNum, speed, x, y, carInfo: truckInfo } = data
        const { driverName, gpsPhone, company, chargePerson, phone } = truckInfo
        const geometry = { type: 'point', x, y }
        return {
          id,
          type: 'truck-rt',
          geometry,
          symbol: {
            type: 'picture-marker',
            url: '/images/JingChe-blue.png',
            width: '24px',
            height: '35px',
            yoffset: '12px'
          },
          attributes: {
            plateNum,
            speed,
            driverName,
            gpsPhone,
            company,
            chargePerson,
            phone
          }
        }
      })
      const defaultPopupTemplate = {
        title: '{plateNum}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'driverName',
                label: '司机姓名'
              },
              {
                fieldName: 'company',
                label: '公司名称'
              },
              {
                fieldName: 'chargePerson',
                label: '管理人员'
              },
              {
                fieldName: 'phone',
                label: '联系电话'
              },
              {
                fieldName: 'gpsPhone',
                label: 'GPS号码'
              }
            ]
          }
        ],
        actions: [
          {
            title: '历史轨迹',
            id: 'truck-hist',
            className: 'esri-icon-polyline'
          }
        ]
      }

      this.$refs.Map.deleteOverlays({ type: 'truck-rt' })
      await this.$refs.Map.addOverlays({ overlays, defaultPopupTemplate })

      this.tableData.rows = rtData.map((data) => ({
        id: data.id,
        ...data.carInfo
      }))
      this.refreshTable = false
      await this.$nextTick()
      this.refreshTable = true
    },

    $_datatable_rowSelected(index) {
      if (index >= 0) {
        const { id } = this.tableData.rows[index]
        this.$refs.Map.findOverlay({ type: 'truck-rt', id })
      }
    }
  }
}
</script>

<style scoped></style>
