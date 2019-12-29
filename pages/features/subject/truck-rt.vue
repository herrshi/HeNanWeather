<template>
  <mdb-row class="h-100">
    <mdb-col :col="showLeftPanel ? '8' : '12'" class="px-1 py-0">
      <mdb-card color="white" class="h-100">
        <mdb-card-body class="m-0 p-0">
          <Map
            ref="Map"
            theme="light"
            @mapInitialized="$_getRTData"
            @mapPopupTriggerAction="$_map_popupTriggerAction"
          />
          <mdb-btn-fixed
            :icon="showLeftPanel ? 'expand-arrows-alt' : 'compress-arrows-alt'"
            :bottom="0"
            :left="0"
            @click.native="$_triggerLeftPanel"
          />
        </mdb-card-body>
      </mdb-card>
    </mdb-col>

    <mdb-col v-if="showLeftPanel" col="4" class="px-1 py-0">
      <mdb-card v-if="leftPanelType === 'rt'" color="white" class="h-100">
        <mdb-card-body>
          <mdb-datatable
            v-if="refreshRTTable"
            :data="rtTableData"
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
            @selectRow="$_rtDatatable_rowSelected"
          />
        </mdb-card-body>
      </mdb-card>

      <mdb-card v-if="leftPanelType === 'hist'" color="white" class="h-100">
        <mdb-card-body>
          <mdb-form-inline>
            <mdb-date-picker
              v-model="startDate"
              :option="dateOptions"
              :limit="[{ type: 'fromto', to: today }]"
              auto-hide
              label="开始日期"
              class="black-text my-0 mr-1"
            />
            <mdb-select v-model="startTime" label="开始时间" />
          </mdb-form-inline>

          <mdb-form-inline>
            <mdb-date-picker
              v-model="endDate"
              :option="dateOptions"
              :limit="[{ type: 'fromto', to: today }]"
              auto-hide
              label="开始日期"
              class="black-text my-0 mr-1"
            />
            <mdb-select v-model="endTime" label="开始时间" />
          </mdb-form-inline>

          <mdb-datatable
            v-if="refreshHistTable"
            :data="histTableData"
            :tfoot="false"
            :searching="false"
            :pagination="false"
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
            @selectRow="$_histDatatable_rowSelected"
          />
        </mdb-card-body>
        <mdb-card-footer>
          <mdb-btn floating color="info" @click="$_showRTPanel">
            <mdb-icon icon="undo-alt" />
          </mdb-btn>
        </mdb-card-footer>
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
  mdbCardFooter,
  mdbBtn,
  mdbBtnFixed,
  mdbIcon,
  mdbDatatable,
  mdbFormInline,
  mdbDatePicker,
  mdbSelect
} from 'mdbvue'
import moment from 'moment'
import Map from '~/components/map/map'
import { axiosGet } from '~/api/axios'

export default {
  name: 'TruckRT',

  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardFooter,
    mdbBtn,
    mdbBtnFixed,
    mdbIcon,
    mdbDatatable,
    mdbFormInline,
    mdbDatePicker,
    mdbSelect,
    Map
  },

  data() {
    return {
      showLeftPanel: true,
      leftPanelType: 'rt',
      refreshRTTable: true,
      refreshHistTable: true,
      rtTableData: {
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
      },
      histTableData: {
        columns: [
          {
            label: '序号',
            field: 'index'
          },
          {
            label: '经过时间',
            field: 'createTime'
          }
        ],
        rows: []
      },
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

  computed: {},

  mounted() {
    this.startDate = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
  },

  methods: {
    $_triggerLeftPanel() {
      this.showLeftPanel = !this.showLeftPanel
    },

    $_showRTPanel() {
      this.$refs.Map.deleteOverlays({ type: 'truck-hist' })
      this.$refs.Map.showOverlays({ type: 'truck-rt' })
      this.leftPanelType = 'rt'
      this.$_getRTData()
    },

    async $_getRTData() {
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

      this.rtTableData.rows = rtData.map((data) => ({
        id: data.id,
        ...data.carInfo
      }))
      this.refreshRTTable = false
      await this.$nextTick()
      this.refreshRTTable = true
    },

    $_rtDatatable_rowSelected(index) {
      if (index >= 0) {
        const { id } = this.rtTableData.rows[index]
        this.$refs.Map.findOverlay({ type: 'truck-rt', id })
      }
    },

    $_map_popupTriggerAction(event) {
      if (event.actionId === 'truck-hist') {
        this.leftPanelType = 'hist'
        const plateNum = event.selectedGraphic.getAttribute('plateNum')
        this.$_getHistData(plateNum)
      }
    },

    async $_getHistData(plateNum) {
      this.$refs.Map.hideOverlays({ type: 'truck-rt' })

      const histData = await axiosGet('car_tack/get_his_tack', { plateNum })

      this.histTableData.rows = histData.map((data, index) => ({
        index: index + 1,
        createTime: data.createTime
      }))
      this.refreshHistTable = false
      await this.$nextTick()
      this.refreshHistTable = true

      const path = []
      histData.forEach((data) => {
        const { x, y } = data
        path.push([x, y])
      })
      const geometry = {
        type: 'polyline',
        paths: [path]
      }
      const lineOverlay = {
        id: plateNum,
        type: 'truck-hist',
        geometry,
        symbol: {
          type: 'simple-line',
          color: '#0d47a1',
          width: 2,
          sytle: 'solid'
        }
      }
      const pointOverlays = histData.map((data, index) => ({
        id: `truck-hist-${index + 1}`,
        type: 'truck-hist',
        geometry: { type: 'point', x: data.x, y: data.y },
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          color: [0, 188, 212, 0.7],
          size: 10,
          outline: {
            color: '#2196f3',
            width: 1
          }
        },
        attributes: {
          index: index + 1,
          createTime: data.createTime
        }
      }))
      this.$refs.Map.deleteOverlays({ type: 'truck-hist' })
      await this.$refs.Map.addOverlays({ overlays: [lineOverlay] })
      await this.$refs.Map.addOverlays({
        overlays: pointOverlays,
        defaultPopupTemplate: {
          title: '{createTime}'
        }
      })
      this.$refs.Map.findOverlay({
        type: 'truck-hist',
        id: plateNum,
        showPopup: false
      })
    },

    $_histDatatable_rowSelected(index) {
      if (index >= 0) {
        const pointIndex = this.histTableData.rows[index].index
        this.$refs.Map.findOverlay({
          type: 'truck-hist',
          id: `truck-hist-${pointIndex}`
        })
      }
    }
  }
}
</script>

<style scoped></style>
