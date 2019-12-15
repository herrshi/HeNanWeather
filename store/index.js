const state = () => ({
  naviBreadcrumb: [],
  mapOnly: false,
  cityCode: ''
})

const mutations = {
  setNaviBreadcrumb(state, { naviBreadcrumb }) {
    state.naviBreadcrumb = naviBreadcrumb
  },

  showNav(state) {
    state.mapOnly = false
  },

  hideNav(state) {
    state.mapOnly = true
  },

  setCityCode(state, { cityCode }) {
    state.cityCode = cityCode
  }
}

const getters = {
  showLoading: (state) => {
    return state.map.updating || state['business-data'].fetching
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
