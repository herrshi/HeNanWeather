export const appConfig = {
  app: {
    logo: '',
    title: '生态环境GIS数据',
    subTitle: '共享交换服务平台',
    apiUrl: 'http://39.98.134.198:18091'
  },
  pageComponents: {
    sideNavbarItems: [
      {
        name: '系统设置',
        icon: 'cogs',
        subItems: [
          {
            name: '角色设置',
            to: 'features-setting-role'
          },
          {
            name: '污染源类型',
            to: 'features-setting-pollutant-source-type'
          },
          {
            name: '管控级别',
            to: 'features-setting-control-level'
          },
          {
            name: '城市',
            to: 'features-setting-city'
          },
          {
            name: '保护区类型',
            to: 'features-setting-reserves-type'
          }
        ]
      },
      {
        name: '空间数据管理',
        icon: 'layer-group',
        subItems: [
          {
            name: '重点污染源企业',
            to: 'features-spatial-data-pollutant-source-enterprise'
          }
        ]
      },
      {
        name: '空气质量及大气污染专题',
        icon: 'cloud-meatball',
        subItems: [
          {
            name: '空气质量实时图',
            to: 'features-air-pollution-air-quality'
          },
          {
            name: '环境空气小时报',
            to: 'features-air-pollution-air-hour'
          },
          {
            name: '环境空气日报',
            to: 'features-air-pollution-air-day'
          },
          {
            name: '大气污染防治',
            to: 'features-air-pollution-pollution-control'
          },
          {
            name: '其他专题',
            to: 'features-air-pollution-other-theme'
          }
        ]
      },
      {
        name: '水环境质量及污染专题',
        icon: 'water',
        subItems: [
          {
            name: '水质状况',
            to: 'features-water-pollution-water-quality'
          },
          {
            name: '水质监测因子',
            to: 'features-water-pollution-water-factor'
          },
          {
            name: '水污染防治',
            to: 'features-water-pollution-pollution-control'
          },
          {
            name: '其他专题',
            to: 'features-water-pollution-other-theme'
          }
        ]
      },
      {
        name: '土壤污染专题',
        icon: 'leaf',
        subItems: [
          {
            name: '土壤污染评价',
            to: 'features-soil-pollution-pollution-evaluation'
          },
          {
            name: '土壤污染趋势',
            to: 'features-soil-pollution-pollution-trend'
          },
          {
            name: '土壤污染防治',
            to: 'features-soil-pollution-pollution-control'
          },
          {
            name: '其他专题',
            to: 'features-soil-pollution-other-theme'
          }
        ]
      }
    ]
  },
  map: {
    arcgis_api: 'http://localhost:8090/arcgis_js_api_4',
    initial_camera: {
      position: [113.705643, 30.055232, 500000],
      heading: 0,
      tilt: 45
    },
    basemaps: [
      {
        label: '矢量图',
        url:
          'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
        type: 'tiled',
        visible: true
      }
    ],
    operationalLayers: []
  }
}
