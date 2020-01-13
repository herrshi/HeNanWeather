// import _ from 'lodash'
// import mapApi from '~/api/map'

import { loadModules } from 'esri-loader'

const state = () => ({
  updating: false,
  initialCamera: null,
  overlayGraphics: [],
  businessLayerMap: new Map(),
  businessClusterLayerMap: new Map(),

  layerListWidgetVisible: true,
  // 要显示的图层
  showLayer: [],
  // 是否显示图例
  showLegend: false
})

const mutations = {
  setUpdating(state, { updating }) {
    state.updating = updating
  },

  startUpdating(state) {
    state.updating = true
  },

  stopUpdating(state) {
    state.updating = false
  },

  showLayerListWidget(state) {
    state.layerListWidgetVisible = true
  },

  hideLayerListWidget(state) {
    state.layerListWidgetVisible = false
  },

  setInitialCamera(state, { camera }) {
    state.initialCamera = camera
  },

  addOverlayGraphics(state, { graphics }) {
    state.overlayGraphics = state.overlayGraphics.concat(graphics)
  },

  addBusinessLayer(state, { type, layer }) {
    state.businessLayerMap.set(type, layer)
  },

  addBusinessClusterLayer(state, { type, layer }) {
    state.businessClusterLayerMap.set(type, layer)
  },

  setShowLayer(state, { showLayer }) {
    state.showLayer = showLayer
  },

  setShowLegend(state, { showLegend }) {
    state.showLegend = showLegend
  }
}

const getters = {
  businessLayer: (state) => (dataType) => state.businessLayerMap.get(dataType),

  businessClusterLayer: (state) => (dataType) =>
    state.businessClusterLayerMap.get(dataType),

  visibleBusinessLayer: (state) => {
    const layers = []
    state.businessLayerMap.forEach((layer) => {
      if (layer.visible && layer.source.length > 0) {
        layers.push(layer)
      }
    })
    return layers
  },

  allBusinessLayer: (state) => {
    const layers = []
    state.businessLayerMap.forEach((layer) => {
      if (layer.source.length > 0) layers.push(layer)
    })
    return layers
  }
}

const actions = {
  async createFeatureLayer(
    { commit, dispatch, rootState, rootGetters },
    { dataType }
  ) {
    const appConfig = rootState['app-info'].appConfig
    const layerConfig = appConfig.pageComponents.layerList.find(
      (layer) => layer.dataType === dataType
    )
    if (!layerConfig) {
      return null
    }
    const {
      name,
      renderer,
      popupTemplate,
      fields,
      // active = false,
      geometryType
    } = layerConfig

    const [FeatureLayer, Graphic] = await loadModules(
      ['esri/layers/FeatureLayer', 'esri/Graphic'],
      {
        url: `${appConfig.map.arcgis_api}/init.js`
      }
    )

    let features = rootGetters['business-data/getBusinessData'](dataType)
    if (!features) {
      await dispatch(
        `business-data/getAll${dataType}`,
        { isPage: 'NO' },
        { root: true }
      )
      features = rootGetters['business-data/getBusinessData'](dataType)
      if (!features || features.length === 0) {
        return null
      }

      const graphics = []
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const { geometry } = feature
        feature.FID = i
        if (geometry) {
          graphics.push(new Graphic({ geometry, attributes: feature }))
        }
      }
      const featureLayer = FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        visible: false,
        fields,
        renderer,
        popupTemplate
      })
      commit('addBusinessLayer', { type: dataType, layer: featureLayer })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
