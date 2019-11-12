import user from '~/api/user-authority'

const state = {
  userId: null,
  userName: null,
  loginStatus: null
}

const mutations = {
  setUser(state, { userId, userName }) {
    state.userId = userId
    state.userName = userName
  },

  setLoginStatus(state, { status }) {
    state.loginStatus = status
  }
}

const actions = {
  async login({ commit, state }, { userId, password }) {
    const loginResult = await user.userLogin(userId, password)
    if (loginResult.status === 'success') {
      commit('setUser', { userId, userName: 'John Doe' })
    }
    commit('setLoginStatus', { status: loginResult.status })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
