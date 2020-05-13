<template>
  <mdb-card style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-2">
      <mdb-select
        v-model="citySelector"
        label="城市"
        color="primary"
        style="position: absolute; left: 300px; top: 15px; z-index: 99;"
        @getValue="$_cityChanged"
      />

      <mdb-datatable
        v-if="refreshTable"
        :data="tableData"
        :tfoot="false"
        max-height="50vh"
        max-width="3000px"
        showing-text="显示"
        entries-title="每页"
        no-found-message="无记录"
        search-placeholder="搜索"
        arrows
        striped
        scroll-y
        bordered
        hover
        responsive-xl
        class="m-2"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbDatatable, mdbSelect } from 'mdbvue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'RadiationSource',

  components: {
    mdbCard,
    mdbCardBody,
    mdbDatatable,
    mdbSelect
  },

  data() {
    return {
      citySelector: null,
      refreshTable: true,
      tableData: {
        columns: [
          {
            field: 'mhybrand',
            label: '汽车品牌'
          },
          {
            field: 'mhymodel',
            label: '型号'
          },
          {
            field: 'mhytype',
            label: '机械类型'
          },
          {
            field: 'mhyplate',
            label: '车牌'
          },
          {
            field: 'mhyplateColor',
            label: '车牌颜色'
          },
          {
            field: 'mhycolor',
            type: 'string',
            label: '车身颜色'
          },
          {
            field: 'mhyframeNo',
            label: '车架号'
          },
          {
            field: 'mhyreglocation',
            label: '车籍地'
          },
          {
            field: 'mhyprice',
            label: '新车购置价'
          },
          {
            field: 'ngno',
            label: '发动机编号'
          },
          {
            field: 'ngpower',
            label: '功率'
          },
          {
            field: 'ownerName',
            label: '联系人'
          },
          {
            field: 'owneridNo',
            label: '身份证号'
          },
          {
            field: 'ownerMobile',
            label: '电话'
          },
          {
            field: 'owneraDdress',
            label: '地址'
          },
          {
            field: 'blacklist',
            label: '是否黑名单'
          },
          {
            field: 'oneline',
            label: '网络状态'
          },
          {
            field: 'createTime',
            label: '创建时间'
          },
          {
            field: 'etno',
            label: '环保标号'
          },
          {
            field: 'elno',
            label: '环保标示'
          },
          {
            field: 'mhyprodDate',
            label: '生产年份'
          },
          {
            field: 'mhyweight',
            label: '吨位，座位'
          },
          {
            field: 'mhyrespdept',
            label: '责任单位'
          },
          {
            field: 'emissionlevel',
            label: '排放'
          },
          {
            field: 'ngsmoke',
            label: '烟度值'
          }
        ],
        rows: []
      }
    }
  },

  computed: {
    ...mapState('base-data', ['cities']),
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData'])
  },

  created() {
    this.citySelector = this.cities
      .filter(
        // 地级市列表
        (city) =>
          city.cityCode === '419001000' ||
          (city.cityCode.includes('00000') && city.cityCode !== '419000000')
      )
      .sort((a, b) => a.cityCode - b.cityCode)
      .map((city) => ({
        text: city.cityName,
        value: city.cityCode
      }))
  },

  methods: {
    ...mapActions('business-data', ['getNonRoadMachineryByCity']),
    $_cityChanged() {
      const selectedCity = this.citySelector.find(
        (city) => city.selected === true
      )
      if (selectedCity) {
        this.$_showCityMachinery(selectedCity.value)
      }
    },

    async $_showCityMachinery(cityCode) {
      const data = await this.getNonRoadMachineryByCity({
        cityCode,
        isPage: 'NO'
      })
      if (data) {
        this.tableData.rows = data
        // 刷新datatable
        this.refreshTable = false
        await this.$nextTick()
        this.refreshTable = true
      }
    }
  }

  // async asyncData({ store }) {
  //   const columns = [
  //     {
  //       label: '站点名称',
  //       field: 'name'
  //     },
  //     {
  //       label: '所在城市',
  //       field: 'cityName'
  //     },
  //     {
  //       label: '站点类型',
  //       field: 'stationTypeName'
  //     }
  //   ]
  //   let rows = store.getters['business-data/getBusinessData'](
  //     'RadioactiveSourceSurveillanceStation'
  //   )
  //   if (!rows) {
  //     await store.dispatch(
  //       'business-data/getAllRadioactiveSourceSurveillanceStation',
  //       { isPage: 'NO' }
  //     )
  //     rows = store.getters['business-data/getBusinessData'](
  //       'RadioactiveSourceSurveillanceStation'
  //     )
  //   }

  //   return {
  //     tableData: { columns, rows }
  //   }
  // }
}
</script>

<style scoped />
