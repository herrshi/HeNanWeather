import { axiosGet } from '~/api/axios'

const state = () => ({
  fetching: false,
  pollutantSourceEnterprises: [],
  surfaceWaterSurveillanceStations: [],
  airQualitySurveillanceStations: [],
  businessDataMap: new Map()
})

const mutations = {
  startRefreshData(state) {
    state.fetching = true
  },

  stopFetchingData(state) {
    state.fetching = false
  },

  setAllPollutantSourceEnterprises(state, { enterprises }) {
    state.pollutantSourceEnterprises = enterprises
    state.businessDataMap.set('PollutantSourceEnterprise', enterprises)
  },

  setAllSurfaceWaterSurveillanceStations(state, { stations }) {
    state.surfaceWaterSurveillanceStations = stations
    state.businessDataMap.set('SurfaceWaterSurveillanceStation', stations)
  },

  setAllAirQualitySurveillanceStations(state, { stations }) {
    state.airQualitySurveillanceStations = stations
    state.businessDataMap.set('AirQualitySurveillanceStation', stations)
  }
}

const getters = {
  getBusinessData: (state) => (dataType) => state.businessDataMap.get(dataType)
}

const actions = {
  /** 重点污染源企业 **/
  async getAllPollutantSourceEnterprises({ commit }, { isPage, page, limit }) {
    commit('startRefreshData')
    const result = await axiosGet('/emphasisSourcePollutionCompany/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const enterprises = result.data.map((enterprise) => {
        const {
          name,
          objectId,
          x,
          y,
          property: controlLevelName,
          type: pollutantSourceTypeName,
          cityName,
          isDelete
        } = enterprise

        return {
          name,
          id: objectId,
          geometry: { type: 'point', x, y },
          controlLevelName,
          pollutantSourceTypeName,
          cityName,
          isDelete,
          type: '重点污染源企业'
        }
      })
      commit('setAllPollutantSourceEnterprises', { enterprises })
    }
    commit('stopFetchingData')
  },
  /** /.重点污染源企业 **/

  /** 地表水监测站点 **/
  async getAllSurfaceWaterSurveillanceStations(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startRefreshData')
    const result = await axiosGet('/section/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const stations = result.data.map((station) => {
        const {
          siteName: name,
          siteId: id,
          cityName,
          waterBasin: riverSystem,
          waterSyste: river,
          siteTypeNa: stationTypeName,
          property: boundary,
          siteAuthor: controlLevelName,
          x,
          y,
          createTime
        } = station
        return {
          name,
          id,
          cityName,
          geometry: { type: 'point', x, y },
          createTime,
          controlLevelName,
          riverSystem,
          river,
          stationTypeName,
          boundary,
          type: '地表水'
        }
      })
      commit('setAllSurfaceWaterSurveillanceStations', { stations })
    }
    commit('stopFetchingData')
  },
  /** /.地表水监测站点 **/

  /** 重点区域空气监测站点 **/
  async getAllAirQualitySurveillanceStations(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startRefreshData')
    const result = await axiosGet('area_site/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const stations = result.data.map((station) => {
        const {
          siteName: name,
          siteId: id,
          cityName,
          siteTypeNa: stationTypeName,
          status,
          x,
          y
        } = station

        return {
          name,
          id,
          cityName,
          stationTypeName,
          status: status === 0 ? '在线' : '离线',
          geometry: { type: 'point', x, y },
          type: '空气'
        }
      })
      commit('setAllAirQualitySurveillanceStations', { stations })
    }
    commit('stopFetchingData')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
