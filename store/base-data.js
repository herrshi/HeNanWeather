import { axiosGet } from '~/api/axios'

const state = () => ({
  pollutantSourceTypes: [],
  controlLevels: [],
  cities: [],
  reservesTypes: [],
  menuItems: []

  // airQualityMonitoringFactor: [
  //   {
  //     text: '城市AQI',
  //     value: 'CITY_AQI',
  //     selected: true
  //   },
  //   {
  //     text: 'PM10平均值',
  //     value: 'PM10_VALUE_AVG'
  //   },
  //   {
  //     text: 'SO2平均值',
  //     value: 'SO2_VALUE_AVG'
  //   },
  //   {
  //     text: 'O3平均值',
  //     value: 'O3_VALUE_AVG'
  //   },
  //   {
  //     text: 'NO2平均值',
  //     value: 'NO2_VALUE_AVG'
  //   },
  //   {
  //     text: 'CO平均值',
  //     value: 'CO_VALUE_AVG'
  //   },
  //   {
  //     text: 'PM25平均值',
  //     value: 'PM25_VALUE_AVG'
  //   },
  //   {
  //     text: 'O3H8平均值',
  //     value: 'O3H8_VALUE_AVG'
  //   }
  // ],
})

const mutations = {
  setAllPollutantSourceTypes(state, { types }) {
    state.pollutantSourceTypes = types
  },

  setAllControlLevels(state, { levels }) {
    state.controlLevels = levels
  },

  setAllCity(state, { cities }) {
    state.cities = cities
  },

  setAllReservesTypes(state, { types }) {
    state.reservesTypes = types
  },

  setMenuItems(state, { items }) {
    state.menuItems = items
  }
}

const getters = {
  getPollutantSourceTypeByCode: (state) => (typeCode) => {
    return state.pollutantSourceTypes.find(
      (type) => String(type.typeCode) === String(typeCode)
    )
  },

  getControlLevelByCode: (state) => (levelCode) => {
    return state.controlLevels.find(
      (level) => String(level.levelCode) === String(levelCode)
    )
  },

  getCityById: (state) => (cityId) => {
    return state.cities.find((city) => String(city.cityId) === String(cityId))
  },

  getCityByCode: (state) => (cityCode) => {
    return state.cities.find((city) => city.cityCode === cityCode)
  },

  getReservesTypeByCode: (state) => (typeCode) => {
    return state.reservesTypes.find(
      (type) => String(type.typeCode) === String(typeCode)
    )
  }
}

const actions = {
  /** 污染源类型 **/
  async getAllPollutantSourceTypes({ commit }) {
    const response = await axiosGet('/type/get_all_type')
    // const { code, data: types } = response
    // if (code === 1) {
    //   commit('setAllPollutantSourceTypes', { types })
    // }
    commit('setAllPollutantSourceTypes', { types: response })
  },

  async addPollutantSourceType({ dispatch }, typeName) {
    const result = await axiosGet('/type/add_type', { typeName })
    if (result.code === 1) {
      await dispatch('getAllPollutantSourceTypes')
    }
    return result
  },

  async editPollutantSourceType({ dispatch }, { typeName, typeCode }) {
    const result = await axiosGet('/type/update_type', { typeName, typeCode })
    if (result.code === 1) {
      await dispatch('getAllPollutantSourceTypes')
    }
    return result
  },

  async deletePollutantSourceType({ dispatch }, typeCode) {
    const result = await axiosGet('/type/delete_type', { typeCode })
    if (result.code === 1) {
      await dispatch('getAllPollutantSourceTypes')
    }
    return result
  },
  /** /.污染源类型 **/

  /** 管控级别 **/
  async getAllControlLevels({ commit }) {
    const response = await axiosGet('control_level/find_all_level')
    const levels = response.map((level) => {
      const {
        attentiondegreeCode,
        attentiondegreeName,
        createTime,
        isDelete
      } = level
      return {
        levelCode: attentiondegreeCode,
        levelName: attentiondegreeName,
        createTime,
        isDelete
      }
    })
    commit('setAllControlLevels', { levels })
  },

  async addControlLevel({ dispatch }, levelName) {
    const result = await axiosGet('/control_level/add_control_level', {
      attentiondegreeName: levelName
    })
    if (result.code === 1) {
      await dispatch('getAllControlLevel')
    }
    return result
  },

  async editControlLevel({ dispatch }, { levelCode, levelName }) {
    const result = await axiosGet('/control_level/update_control_level', {
      attentiondegreeCode: levelCode,
      attentiondegreeName: levelName
    })
    if (result.code === 1) {
      await dispatch('getAllControlLevel')
    }
    return result
  },

  async deleteControlLevel({ dispatch }, levelCode) {
    const result = await axiosGet('/control_level/delete_control_level', {
      attentiondegreeCode: levelCode
    })
    if (result.code === 1) {
      await dispatch('getAllControlLevel')
    }
    return result
  },
  /** /.管控级别 **/

  /** 城市 **/
  async getAllCities({ commit }) {
    const response = await axiosGet('/city/get_all_city')
    const cities = response.map((city) => ({
      cityId: city.id,
      cityCode: city.cityCode,
      cityName: city.cityName,
      isDelete: 1
    }))
    commit('setAllCity', { cities })
  },

  async addCity({ dispatch }, { cityCode, cityName }) {
    const result = await axiosGet('/city/add_city', {
      cityCode,
      cityName,
      provinceName: '河南省'
    })
    if (result.code === 1) {
      await dispatch('getAllCities')
    }
    return result
  },

  async editCity({ dispatch }, { cityId, cityCode, cityName }) {
    const result = await axiosGet('/city/update_city', {
      cityId,
      cityCode,
      cityName,
      provinceName: '河南省'
    })
    if (result.code === 1) {
      await dispatch('getAllCities')
    }
    return result
  },

  async deleteCity({ dispatch }, cityId) {
    const result = await axiosGet('/city/delete_city', { id: cityId })
    if (result.code === 1) {
      await dispatch('getAllCities')
    }
    return result
  },
  /** /.城市 **/

  /** 保护区类型 **/
  async getAllReservesTypes({ commit }) {
    const response = await axiosGet('zone_type/get_all_zone')
    const types = response.map((type) => ({
      typeCode: type.typeCode,
      typeName: type.typeName,
      createTime: type.createTime,
      isDelete: type.isDelete
    }))
    commit('setAllReservesTypes', { types })
  },

  async addReservesType({ dispatch }, typeName) {
    const result = await axiosGet('/zone_type/add_zone_type', { typeName })
    if (result.code === 1) {
      await dispatch('getAllReservesTypes')
    }
    return result
  },

  async editReservesType({ dispatch }, { typeName, typeCode }) {
    const result = await axiosGet('/zone_type/update_zone_type', {
      typeName,
      typeCode
    })
    if (result.code === 1) {
      await dispatch('getAllReservesTypes')
    }
    return result
  },

  async deleteReservesType({ dispatch }, typeCode) {
    const result = await axiosGet('/zone_type/delete_zone_type', { typeCode })
    if (result.code === 1) {
      await dispatch('getAllReservesTypes')
    }
    return result
  },

  async getAllMenuItems({ commit }) {
    const response = await axiosGet('/menu/get_menu_main_list')
    commit('setMenuItems', { items: response })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
