<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 v-100">
    <mdb-card-body class="p-2">
      <mdb-row class="h-100 v-100">
        <mdb-col>
          <mdb-card class="h-100 v-100">
            <mdb-card-body class="p-0">
              <Map
                ref="pollutant_source_enterprise_map"
                @mapInitialized="$_mapInitialized"
              />
            </mdb-card-body>
          </mdb-card>
        </mdb-col>

        <mdb-col>
          <mdb-card class="h-100 v-100">
            <mdb-card-body>
              <div class="d-flex justify-content-start">
                <mdb-btn color="cyan" rounded @click="$_mapInitialized">
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
                class="m-2"
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
import { mapGetters, mapMutations, mapState } from 'vuex'
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
      refreshTable: true
    }
  },

  computed: {
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('business-data', ['pollutantSourceEnterprises']),
    ...mapGetters('base-data', [
      'getPollutantSourceTypeByCode',
      'getControlLevelByCode',
      'getCityByCode'
    ]),

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
          // id,
          name,
          controlLevelCode,
          pollutantSourceTypeCode,
          cityCode,
          isDelete
        } = enterprise
        if (isDelete === 1) {
          rows.push({
            name,
            controlLevelName: this.getControlLevelByCode(controlLevelCode)
              .levelName,
            pollutantSourceTypeName: this.getPollutantSourceTypeByCode(
              pollutantSourceTypeCode
            ).typeName,
            cityName: this.getCityByCode(cityCode).cityName
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

    $_mapInitialized() {
      const overlays = this.pollutantSourceEnterprises.map((enterprise) => ({
        id: enterprise.id,
        type: 'PollutantSourceEnterprise',
        geometry: { type: 'point', x: enterprise.x, y: enterprise.y },
        attributes: enterprise
      }))
      const defaultSymbol = {
        type: 'picture-marker',
        url: `/images/GangDianSp-red.png`,
        width: '24px',
        height: '35px'
      }
      this.$refs.pollutant_source_enterprise_map.addOverlays({
        overlays,
        defaultSymbol
      })
    }
  }
}
</script>

<style scoped></style>
