import { axiosGet } from '~/api/axios'
import WaterStationApi from '~/api/WaterStation'

const state = () => ({
  fetching: false,
  pollutantSourceEnterprises: [],
  surfaceWaterSurveillanceStations: [],
  airQualitySurveillanceStations: [],
  businessDataMap: new Map(),

  waterMonitoringFactorMap: new Map()
})

const mutations = {
  startFetchData(state) {
    state.fetching = true
  },

  stopFetchData(state) {
    state.fetching = false
  },

  setBusinessData(state, { dataType, data }) {
    state.businessDataMap.set(dataType, data)
  },

  setWaterMonitoringFactor(state, { factorName, factorInfo }) {
    state.waterMonitoringFactorMap.set(factorName, factorInfo)
  }
}

const getters = {
  getBusinessData: (state) => (dataType) => state.businessDataMap.get(dataType),

  getAirStation: (state) => (stationId) => {
    const stations = state.businessDataMap.get('AirQualitySurveillanceStation')
    return stations.find((station) => station.id === stationId)
  }
}

const actions = {
  /** 重点污染源企业 **/
  async getAllPollutantSourceEnterprises({ commit }, { isPage, page, limit }) {
    commit('startFetchData')
    const result = await axiosGet('/emphasisSourcePollutionCompany/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter((station) => station.isDelete === 1)
      const enterprises = filter.map((enterprise) => {
        const {
          name,
          objectId,
          psCode,
          x,
          y,
          property: controlLevelName,
          type: pollutantSourceTypeName,
          cityName,
          isDelete
        } = enterprise

        return {
          name,
          id: psCode,
          objectId,
          geometry: { type: 'point', x, y },
          controlLevelName,
          pollutantSourceTypeName,
          cityName,
          isDelete,
          type: '重点污染源企业'
        }
      })
      commit('setBusinessData', {
        dataType: 'PollutantSourceEnterprise',
        data: enterprises
      })
    }
    commit('stopFetchData')
  },
  /** /.重点污染源企业 **/

  /** 地表水监测站点 **/
  async getAllSurfaceWaterSurveillanceStations(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('/section/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter((station) => station.isDelete === 1)
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteNo: id,
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
          objectId,
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
          type: '地表水监测站'
        }
      })
      commit('setBusinessData', {
        dataType: 'SurfaceWaterSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.地表水监测站点 **/

  /** 重点区域空气监测站点 **/
  async getAllAirQualitySurveillanceStations(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('area_site/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter((station) => station.isDelete === 1)
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          siteTypeNa: stationTypeName,
          status,
          x,
          y
        } = station

        return {
          objectId,
          name,
          id,
          cityName,
          stationTypeName,
          status: status === 0 ? '在线' : '离线',
          geometry: { type: 'point', x, y },
          type: '空气监测站'
        }
      })
      commit('setBusinessData', {
        dataType: 'AirQualitySurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.重点区域空气监测站点 **/

  /** 医疗固废 **/
  async getAllMedicalWasteSurveillanceStation(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('medicalSolidWaste/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter((station) => station.isDelete === 1)
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          siteTypeNa: stationTypeName,
          x,
          y
        } = station

        return {
          objectId,
          name,
          id,
          cityName,
          stationTypeName,
          geometry: { type: 'point', x, y },
          type: '医疗固废监测站'
        }
      })
      commit('setBusinessData', {
        dataType: 'MedicalWasteSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.医疗固废 **/

  /** 辐射源 **/
  async getAllRadiationSourceSurveillanceStations(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('radiationSourceSite/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter((station) => station.isDelete === 1)
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          siteTypeNa: stationTypeName,
          x,
          y
        } = station

        return {
          objectId,
          name,
          id,
          cityName,
          stationTypeName,
          geometry: { type: 'point', x, y },
          type: '辐射源监测站'
        }
      })
      commit('setBusinessData', {
        dataType: 'RadiationSourceSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.辐射源 **/

  /** 噪声 **/
  async getAllNoiseSurveillanceStations({ commit }, { isPage, page, limit }) {
    commit('startFetchData')
    const result = await axiosGet('noisePollutionSite/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const stations = result.data.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          siteTypeNa: stationTypeName,
          x,
          y
        } = station

        return {
          objectId,
          name,
          id,
          cityName,
          stationTypeName,
          geometry: { type: 'point', x, y },
          type: '辐射源'
        }
      })
      commit('setBusinessData', {
        dataType: 'NoiseSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.噪声 **/

  /** 地表水监测因子基础信息 */
  async getWaterMonitorFactorInfos({ commit }) {
    const result = await WaterStationApi.getMonitorFactoringInfo()
    if (result) {
      result.forEach((monitoringFactor) => {
        const { ID, NAME, UNIT, LOWLIMIT, HIGHLIMIT } = monitoringFactor
        commit('setWaterMonitoringFactor', {
          factorName: ID,
          factorInfo: { name: NAME, unit: UNIT, low: LOWLIMIT, high: HIGHLIMIT }
        })
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
