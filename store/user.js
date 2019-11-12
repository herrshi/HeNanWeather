import RoleApi from '~/api/user'
import { axiosGet } from '~/api/axios'

const state = () => ({
  userId: null,
  userName: null,
  loginStatus: null,
  allRoles: []
})

const mutations = {
  setUser(state, { userId, userName }) {
    state.userId = userId
    state.userName = userName
  },

  setLoginStatus(state, { status }) {
    state.loginStatus = status
  },

  setAllRoles(state, { roles }) {
    state.allRoles = roles
  }
}

const getters = {
  getRoleById: (state) => (id) => {
    return state.allRoles.find((role) => role.roleId === id)
  },

  getRoleByName: (state) => (roleName) => {
    return state.allRoles.find((role) => role.roleName === roleName)
  }
}

const actions = {
  async login({ commit }, { userId, password }) {
    const loginResult = await RoleApi.userLogin(userId, password)
    if (loginResult.status === 'success') {
      commit('setUser', { userId, userName: 'John Doe' })
    }
    commit('setLoginStatus', { status: loginResult.status })
  },

  async getAllRoles({ commit }) {
    const response = await axiosGet('/role/find_all_role')
    // const { code, data: roles } = response
    commit('setAllRoles', { roles: response })
  },

  async addRole({ dispatch }, roleName) {
    const result = await axiosGet('/role/add_role', { roleName })
    if (result.code === 1) {
      await dispatch('getAllRoles')
    }
    return result
  },

  async deleteRole({ dispatch }, roleId) {
    const result = await axiosGet('/role/del_role', { roleId })
    if (result.code === 1) {
      await dispatch('getAllRoles')
    }
    return result
  },

  async editRole({ dispatch }, { roleId, roleName }) {
    const result = await axiosGet('/role/edit_role', { roleId, roleName })
    if (result.code === 1) {
      await dispatch('getAllRoles')
    }
    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
