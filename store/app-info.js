import AppConfig from '~/api/app-config'

const state = () => ({
  appConfig: null
})

const mutations = {
  setAppConfig(state, { appConfig }) {
    state.appConfig = appConfig
  },

  setLayerActive(state, { type, active }) {
    const layer = state.appConfig.pageComponents.layerList.find(
      (layer) => layer.dataType === type
    )
    if (layer) {
      layer.active = active
    }
  }
}

const actions = {
  async getAppConfig({ commit }) {
    const appConfig = await AppConfig.getAppConfig()
    commit('setAppConfig', { appConfig })
    return appConfig
  }
}

const getters = {
  activeLayerConfig: (state) =>
    state.appConfig.pageComponents.layerList.filter(
      (layerConfig) => layerConfig.active
    )
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
