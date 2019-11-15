<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-2">
      <mdb-row class="h-100 w-100">
        <mdb-col class="pr-1">
          <mdb-card class="h-100 w-100">
            <mdb-card-body class="p-0">
              <Map
                ref="pollutant_source_enterprise_map"
                theme="light"
                @mapInitialized="$_map_initialized"
                @mapPopupTriggerAction="$_map_popup_trigger_action"
              />
            </mdb-card-body>
          </mdb-card>
        </mdb-col>

        <mdb-col class="pr-0">
          <mdb-card class="h-100 w-100">
            <mdb-card-body class="p-0">
              <div class="d-flex justify-content-start">
                <mdb-btn color="cyan" rounded>
                  <mdb-icon icon="plus" class="mr-1" />新增{{ pageName }}
                </mdb-btn>
              </div>

              <mdb-datatable
                v-if="refreshTable"
                max-height="50vh"
                showing-text="显示"
                entries-title=""
                no-found-message="无符合记录"
                search-placeholder="搜索"
                :data="tableData"
                :tfoot="false"
                :sorting="false"
                arrows
                striped
                scroll-y
                bordered
                hover
                focus
                class="m-2"
                @selectRow="$_datatable_rowSelected"
              />
            </mdb-card-body>
          </mdb-card>
        </mdb-col>
      </mdb-row>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbCard,
  mdbCardBody,
  mdbCol,
  mdbRow,
  mdbDatatable
} from 'mdbvue'
import { mapMutations, mapState } from 'vuex'
import Map from '~/components/map/map'
export default {
  name: 'PollutantSourceEnterprise',

  components: {
    Map,
    mdbBtn,
    mdbIcon,
    mdbCard,
    mdbCardBody,
    mdbCol,
    mdbRow,
    mdbDatatable
  },

  data() {
    return {
      pageName: '重点污染源企业',
      overlayType: 'PollutantSourceEnterprise',
      refreshTable: true
    }
  },

  computed: {
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('business-data', ['pollutantSourceEnterprises']),

    tableData() {
      const columns = [
        {
          label: '企业名称',
          field: 'name'
        },
        {
          label: '管控级别',
          field: 'controlLevelName'
        },
        {
          label: '污染源类型',
          field: 'pollutantSourceTypeName'
        },
        {
          label: '所属城市',
          field: 'cityName'
        }
      ]
      const rows = []
      this.pollutantSourceEnterprises.forEach((enterprise) => {
        const {
          id,
          name,
          controlLevelName,
          pollutantSourceTypeName,
          cityName,
          isDelete
        } = enterprise
        if (isDelete === 1) {
          rows.push({
            id,
            name,
            controlLevelName,
            pollutantSourceTypeName,
            cityName
          })
        }
      })
      return { columns, rows }
    }
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.subTitle, '空间数据管理', this.pageName]
    })
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),

    $_addEnterprisesToMap() {
      const overlays = this.pollutantSourceEnterprises.map((enterprise) => ({
        id: enterprise.id,
        type: this.overlayType,
        geometry: { type: 'point', x: enterprise.x, y: enterprise.y },
        attributes: enterprise
      }))
      const defaultSymbol = {
        type: 'picture-marker',
        url: `/images/GangDianSp-red.png`,
        width: '24px',
        height: '35px'
      }
      const defaultPopupTemplate = {
        title: '{name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'cityName',
                label: '所在城市'
              },
              {
                fieldName: 'controlLevelName',
                label: '管控级别'
              },
              {
                fieldName: 'pollutantSourceTypeName',
                label: '污染源类型'
              }
            ]
          }
        ],
        actions: [
          {
            title: `编辑${this.pageName}`,
            id: 'EditPollutantSourceEnterprise',
            className: 'esri-icon-edit'
          },
          {
            title: `删除${this.pageName}`,
            id: 'DeletePollutantSourceEnterprise',
            className: 'esri-icon-trash'
          }
        ]
      }
      this.$refs.pollutant_source_enterprise_map.addOverlays({
        overlays,
        defaultSymbol,
        defaultPopupTemplate
      })
    },

    $_map_initialized() {
      this.$_addEnterprisesToMap()
    },

    $_datatable_rowSelected(index) {
      const { rows } = this.tableData
      const { id } = rows[index]
      this.$refs.pollutant_source_enterprise_map.findOverlay({
        id,
        type: this.overlayType,
        zoom: 15
      })
    },

    $_map_popup_trigger_action(event) {
      console.log(event)
    }
  }
}
</script>

<style scoped></style>
