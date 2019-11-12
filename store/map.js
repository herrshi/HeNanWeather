import mapApi from '~/api/map'

const state = () => ({
  updating: false,
  initialCamera: null
})

const mutations = {
  setUpdating(state, { updating }) {
    state.updating = updating
  },

  setInitialCamera(state, { camera }) {
    state.initialCamera = camera
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
