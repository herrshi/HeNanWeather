const state = () => ({
  naviBreadcrumb: []
})

const mutations = {
  setNaviBreadcrumb(state, { naviBreadcrumb }) {
    state.naviBreadcrumb = naviBreadcrumb
  }
}

const getters = {
  showLoading: (state) => {
    return state.map.updating
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
