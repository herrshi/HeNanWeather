<!--
非道路移动机械
数据量较大，只显示地级市范围，不显示全省数据
-->
<template>
  <mdb-card color="white">
    <mdb-card-body>
      <!-- 地级市选择 -->
      <mdb-select
        v-model="citySelector"
        label="城市"
        color="primary"
        @getValue="$_cityChanged"
      />
      <!-- /.地级市选择 -->

      <!-- 饼图 -->
      <v-chart :options="chartOption" />
      <!-- /.饼图 -->
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbSelect } from 'mdbvue'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { loadModules } from 'esri-loader'
import 'echarts/lib/chart/pie'
// import 'echarts/lib/component/visualMap'
// import 'echarts/lib/component/toolbox'
// import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/dataset'

export default {
  name: 'NonRoadMachinery',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect
  },

  inject: ['getMap', 'getView'],

  data() {
    return {
      citySelector: null,
      machineryLayer: null,

      map: null,
      view: null,

      FeatureLayer: null,
      Graphic: null,

      machineryFields: [
        {
          name: 'OBJECTID',
          type: 'oid'
        },
        {
          name: 'mhybrand',
          type: 'string',
          alias: '汽车品牌'
        },
        {
          name: 'mhymodel',
          type: 'string',
          alias: '型号'
        },
        {
          name: 'mhytype',
          type: 'string',
          alias: '机械类型'
        },
        {
          name: 'mhyplate',
          type: 'string',
          alias: '车牌'
        },
        {
          name: 'mhyplateColor',
          type: 'string',
          alias: '车牌颜色'
        },
        {
          name: 'mhycolor',
          type: 'string',
          alias: '车身颜色'
        },
        {
          name: 'mhyframeNo',
          type: 'string',
          alias: '车架号'
        },
        {
          name: 'mhyreglocation',
          type: 'string',
          alias: '车籍地'
        },
        {
          name: 'mhyprice',
          type: 'string',
          alias: '新车购置价'
        },
        {
          name: 'ngno',
          type: 'string',
          alias: '发动机编号'
        },
        {
          name: 'ngpower',
          type: 'string',
          alias: '功率'
        },
        {
          name: 'ownerName',
          type: 'string',
          alias: '联系人'
        },
        {
          name: 'owneridNo',
          type: 'string',
          alias: '身份证号'
        },
        {
          name: 'ownerMobile',
          type: 'string',
          alias: '电话'
        },
        {
          name: 'owneraDdress',
          type: 'string',
          alias: '地址'
        },
        {
          name: 'blacklist',
          type: 'string',
          alias: '是否黑名单'
        },
        {
          name: 'oneline',
          type: 'string',
          alias: '网络状态'
        },
        {
          name: 'createTime',
          type: 'string',
          alias: '创建时间'
        },
        {
          name: 'etno',
          type: 'string',
          alias: '环保标号'
        },
        {
          name: 'elno',
          type: 'string',
          alias: '环保标示'
        },
        {
          name: 'mhyprodDate',
          type: 'string',
          alias: '生产年份'
        },
        {
          name: 'mhyweight',
          type: 'string',
          alias: '吨位，座位'
        },
        {
          name: 'mhyrespdept',
          type: 'string',
          alias: '责任单位'
        },
        {
          name: 'emissionlevel',
          type: 'string',
          alias: '排放'
        },
        {
          name: 'ngsmoke',
          type: 'string',
          alias: '烟度值'
        }
      ],
      popupFields: [],

      machineryRenderer: {
        type: 'unique-value',
        field: 'elno',
        defaultSymbol: {
          type: 'simple-marker',
          color: '#4B515D',
          size: '8px',
          outline: {
            color: 'white'
          }
        },
        uniqueValueInfos: [
          {
            value: '蓝标',
            symbol: {
              type: 'simple-marker',
              color: '#33b5e5',
              size: '8px',
              outline: {
                color: 'white'
              }
            }
          },
          {
            value: '橙标',
            symbol: {
              type: 'simple-marker',
              color: '#FF8800',
              size: '8px',
              outline: {
                color: 'white'
              }
            }
          },
          {
            value: '绿标',
            symbol: {
              type: 'simple-marker',
              color: '#00C851',
              size: '8px',
              outline: {
                color: 'white'
              }
            }
          }
        ]
      },

      chartOption: null
    }
  },

  computed: {
    ...mapState('base-data', ['cities']),
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData'])
  },

  created() {
    this.popupFields = this.machineryFields
      .filter(
        (field) => field.name !== 'OBJECTID' && field.name !== 'mhyplateColor'
      )
      .map((field) => ({ fieldName: field.name, label: field.alias }))

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

  beforeDestroy() {
    if (this.machineryLayer) {
      this.map.remove(this.machineryLayer)
      this.machineryLayer = null
    }
  },

  async mounted() {
    this.map = await this.getMap()
    this.view = await this.getView()

    const [FeatureLayer, Graphic] = await loadModules(
      ['esri/layers/FeatureLayer', 'esri/Graphic'],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.FeatureLayer = FeatureLayer
    this.Graphic = Graphic
  },

  methods: {
    ...mapActions('business-data', ['getNonRoadMachineryByCity']),
    ...mapMutations('map', ['startUpdating', 'stopUpdating']),

    async $_cityChanged() {
      this.chartOption = {}

      const selectedCity = this.citySelector.find(
        (city) => city.selected === true
      )
      if (selectedCity) {
        await this.$_showCityMachinery(selectedCity.value)
      }
    },

    /** 显示 */
    async $_showCityMachinery(cityCode) {
      const data = await this.getNonRoadMachineryByCity({
        cityCode,
        isPage: 'NO'
      })
      if (data) {
        this.$_createLayer(data)
      }
    },

    /** 创建一个图层 */
    $_createLayer(data) {
      if (this.machineryLayer) {
        this.map.remove(this.machineryLayer)
        this.machineryLayer = null
      }

      let greenCount = 0
      let blueCount = 0
      let orangeCount = 0
      let otherCount = 0
      const graphics = data.map((pointData, index) => {
        switch (pointData.elno) {
          case '蓝标':
            blueCount++
            break
          case '绿标':
            greenCount++
            break
          case '橙标':
            orangeCount++
            break
          default:
            otherCount++
        }

        if (pointData.mhyplateColor.includes(',')) {
          const colorCode = pointData.mhyplateColor.slice(
            0,
            pointData.mhyplateColor.indexOf(',')
          )
          pointData.mhyplate =
            '<span style="background-color:' +
            colorCode +
            '">' +
            pointData.mhyplate +
            '</span>'
        }
        return new this.Graphic({
          geometry: {
            type: 'point',
            x: pointData.longitude,
            y: pointData.latitude
          },
          attributes: {
            ...pointData,
            objectId: index
          }
        })
      })

      this.chartOption = {
        title: {
          text: '非道路移动机械总数: ' + data.length + '个',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '环保标识',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: greenCount, name: '绿标' },
              { value: blueCount, name: '蓝标' },
              { value: orangeCount, name: '橙标' },
              { value: otherCount, name: '其他' }
            ],
            label: {
              formatter: '{b} : {c}',
              position: 'outside'
            },
            itemStyle: {
              color: (params) => {
                switch (params.name) {
                  case '绿标':
                    return '#00C851'
                  case '蓝标':
                    return '#33b5e5'
                  case '橙标':
                    return '#FF8800'
                  case '其他':
                    return '#4B515D'
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx) => {
              return Math.random() * 200
            }
          }
        ]
      }

      this.machineryLayer = new this.FeatureLayer({
        objectIdField: 'objectId',
        geometryType: 'point',
        outFields: ['*'],
        source: graphics,
        fields: this.machineryFields,
        renderer: this.machineryRenderer,
        popupTemplate: {
          content: [
            {
              type: 'fields',
              fieldInfos: this.popupFields
            }
          ]
        }
      })
      this.map.add(this.machineryLayer)
    }
  }
}
</script>

<style scoped>
.card {
  width: 350px;
  height: 450px;
}
.echarts {
  width: 350px;
  height: 350px;
  left: -20px;
}
</style>
