import { axiosGet } from '~/api/axios'

const state = () => ({
  truckList: []
})

const mutations = {
  setTruckList(state, { truckList }) {
    state.truckList = truckList
  }
}

const getters = {
  getTruckById: (state) => (id) => {
    return state.truckList.find((truck) => truck.id === id)
  }
}

const actions = {
  async getAllTrucks({ commit }) {
    const response = await axiosGet('car/find_car_info', { isPage: 'NO' })
    const truckList = response.data.filter((truck) => truck.isDelete === 1)
    commit('setTruckList', { truckList })
  },

  async addTruck(
    { dispatch },
    { driverName, gpsPhone, plateNum, company, chargePerson, phone }
  ) {
    const response = await axiosGet('car/add_car_info', {
      driverName,
      gpsPhone,
      plateNum,
      company,
      chargePerson,
      phone
    })
    if (response.code === 1) {
      await dispatch('getAllTrucks')
    }
    return response
  },

  async updateTruck(
    { dispatch },
    { id, driverName, gpsPhone, plateNum, company, chargePerson, phone }
  ) {
    const response = await axiosGet('car/update_car_info', {
      id,
      driverName,
      gpsPhone,
      plateNum,
      company,
      chargePerson,
      phone
    })
    if (response.code === 1) {
      await dispatch('getAllTrucks')
    }
    return response
  },

  async deleteTruck({ dispatch }, { id }) {
    const response = await axiosGet('car/delete_car_info', { id })
    if (response === 1) {
      await dispatch('getAllTrucks')
    }
    return response
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
