import RoleApi from '~/api/user'
import { axiosGet } from '~/api/axios'

const state = () => ({
  userId: null,
  userName: null,
  userDept: null,
  loginStatus: null,
  allRoles: []
})

const mutations = {
  setUser(state, { userId, userName }) {
    state.userId = userId
    state.userName = userName
  },

  setUserId(state, { userId }) {
    state.userId = userId
  },

  setUserName(state, { userName }) {
    state.userName = userName
  },

  setUserDept(state, { userDept }) {
    state.userDept = userDept
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
      commit('setUser', { userId, userName: '孔海燕' })
    }
    commit('setLoginStatus', { status: loginResult.status })
  },

  async getUserInfo({ commit }, userId) {
    commit('setUserId', { userId })
    try {
      const response = await axiosGet('/user/find_user_by_id', { id: userId })
      if (response) {
        const { job: userInfo } = response
        const infos = userInfo.split(';')
        const nameInfos = infos[0].split(',')
        commit('setUserName', { userName: nameInfos[1] })
        const deptInfos = infos[1].split(',')
        commit('setUserDept', { userDept: deptInfos[1] })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
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
