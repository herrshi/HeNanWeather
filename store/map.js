// import _ from 'lodash'
import mapApi from '~/api/map'

const state = () => ({
  updating: false,
  initialCamera: null,
  overlays: []
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

  addOverlays(
    state,
    { overlays, defaultSymbol, defaultVisible = true, defaultButtons }
  ) {
    overlays.forEach((overlay) => {
      // 混合默认属性和单独属性
      if (!overlay.symbol) {
        overlay.symbol = defaultSymbol
      }
      if (!overlay.buttons) {
        overlay.buttons = defaultButtons
      }
      if (overlay.visible === undefined) {
        overlay.visible = defaultVisible
      }
    })

    // const newArray = overlays.concat(state.overlays)
    // state.overlays = _.uniqBy(newArray, (overlay) => overlay.id && overlay.type)
    state.overlays = overlays
  }
}

const actions = {
  getInitialCamera({ commit }) {
    const camera = mapApi.getInitialCamera()
    commit('setInitialCamera', { camera })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
