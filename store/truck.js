import { axiosGet } from '~/api/axios'

const state = () => ({
  truckList: []
})

const mutations = {
  setTruckList(state, { truckList }) {
    state.truckList = truckList
  }
}

const actions = {
  async getAllTrucks({ commit }) {
    const response = await axiosGet('car/find_car_info', { isPage: 'NO' })
    const truckList = response.data.filter((truck) => truck.isDelete === 1)
    commit('setTruckList', { truckList })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
