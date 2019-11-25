// import _ from 'lodash'
// import mapApi from '~/api/map'

const state = () => ({
  updating: false,
  initialCamera: null,
  overlayGraphics: [],
  businessLayerMap: new Map()
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

  setInitialCamera(state, { camera }) {
    state.initialCamera = camera
  },

  addOverlayGraphics(state, { graphics }) {
    state.overlayGraphics = state.overlayGraphics.concat(graphics)
  },

  addBusinessLayer(state, { type, layer }) {
    state.businessLayerMap.set(type, layer)
  }
}

const getters = {
  businessLayer: (state) => (dataType) => state.businessLayerMap.get(dataType),

  visibleBusinessLayer: (state) => {
    const layers = []
    state.businessLayerMap.forEach((layer) => {
      if (layer.visible) {
        layers.push(layer)
      }
    })
    return layers
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
