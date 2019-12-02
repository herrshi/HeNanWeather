const state = () => ({
  naviBreadcrumb: [],
  mapOnly: false
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
