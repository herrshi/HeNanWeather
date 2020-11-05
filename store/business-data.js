// import _ from 'lodash'
import { axiosGet, axiosPost } from '~/api/axios'
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
  getBusinessData: (state) => (dataType) => state.businessDataMap.get(dataType)
}

const actions = {
  /** 重点污染源企业 **/
  async getAllPollutantSourceEnterprise({ commit }, { isPage, page, limit }) {
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
          isDelete,
          point
        } = enterprise

        return {
          name,
          id: psCode || objectId,
          objectId,
          geometry: { type: 'point', x, y },
          controlLevelName,
          pollutantSourceTypeName,
          cityName,
          isDelete,
          point,
          type: '污染源企业',
          dataType: 'PollutantSourceEnterprise'
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
  // 国控
  async getAllSurfaceWaterSurveillanceStationGK(
    { commit, getters },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('/section/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter(
        (station) => station.isDelete === 1 && station.siteAuthor === '国控'
      )
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteNo: id,
          cityName,
          cityId,
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
          cityCode: cityId,
          geometry: { type: 'point', x, y },
          createTime,
          controlLevelName,
          riverSystem,
          river,
          stationTypeName,
          boundary,
          type: '地表水站点',
          dataType: 'SurfaceWaterSurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'SurfaceWaterSurveillanceStationGK',
        data: stations
      })
    }
    commit('stopFetchData')
  },

  // 其他
  async getAllSurfaceWaterSurveillanceStationSK(
    { commit, getters },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('/section/find_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const filter = result.data.filter(
        (station) => station.isDelete === 1 && station.siteAuthor !== '国控'
      )
      const stations = filter.map((station) => {
        const {
          objectId,
          siteName: name,
          siteNo: id,
          cityName,
          cityId,
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
          cityCode: cityId,
          geometry: { type: 'point', x, y },
          createTime,
          controlLevelName,
          riverSystem,
          river,
          stationTypeName,
          boundary,
          type: '地表水站点',
          dataType: 'SurfaceWaterSurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'SurfaceWaterSurveillanceStationSK',
        data: stations
      })
    }
    commit('stopFetchData')
  },

  // 所有
  async getAllSurfaceWaterSurveillanceStation(
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
          cityId,
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
          cityCode: cityId,
          geometry: { type: 'point', x, y },
          createTime,
          controlLevelName,
          riverSystem,
          river,
          stationTypeName,
          boundary,
          type: '地表水站点',
          dataType: 'SurfaceWaterSurveillanceStation'
        }
      })

      commit('setBusinessData', {
        dataType: 'SurfaceWaterSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },

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
  },

  async getWaterStationRTData({ commit }) {
    commit('startFetchData')
    const result = await axiosGet('monitor_data/get_water_real_time_data')
    commit('setBusinessData', { dataType: 'WaterStationRTData', data: result })
    commit('stopFetchData')
  },
  /** /.地表水监测站点 **/

  /** 重点区域空气监测站点 **/
  // 国控
  async getAllAirQualitySurveillanceStationGK(
    { commit, rootState },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('area_site/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      let filtered = result.data.filter(
        (station) => station.isDelete === 1 && station.shape === '国控'
      )
      const { cityCode } = rootState
      if (cityCode && cityCode !== '') {
        filtered = filtered.filter((station) => station.cityId === cityCode)
      }
      const stations = filtered.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          cityId,
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
          cityId,
          stationTypeName,
          status: status === 0 ? '在线' : '离线',
          geometry: { type: 'point', x, y },
          type: '空气监测站点',
          dataType: 'AirQualitySurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'AirQualitySurveillanceStationGK',
        data: stations
      })
    }
    commit('stopFetchData')
  },

  // 其他
  async getAllAirQualitySurveillanceStationSK(
    { commit, rootState },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('area_site/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      let filtered = result.data.filter(
        (station) => station.isDelete === 1 && station.shape !== '国控'
      )
      const { cityCode } = rootState
      if (cityCode && cityCode !== '') {
        filtered = filtered.filter((station) => station.cityId === cityCode)
      }
      const stations = filtered.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          cityId,
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
          cityId,
          stationTypeName,
          status: status === 0 ? '在线' : '离线',
          geometry: { type: 'point', x, y },
          type: '空气监测站点',
          dataType: 'AirQualitySurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'AirQualitySurveillanceStationSK',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  // 所有
  async getAllAirQualitySurveillanceStation(
    { commit, rootState },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('area_site/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      let filtered = result.data.filter((station) => station.isDelete === 1)
      const { cityCode } = rootState
      if (cityCode && cityCode !== '') {
        filtered = filtered.filter((station) => station.cityId === cityCode)
      }
      const stations = filtered.map((station) => {
        const {
          objectId,
          siteName: name,
          siteId: id,
          cityName,
          cityId,
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
          cityId,
          stationTypeName,
          status: status === 0 ? '在线' : '离线',
          geometry: { type: 'point', x, y },
          type: '空气监测站点',
          dataType: 'AirQualitySurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'AirQualitySurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },

  async getAirQualityRTData({ commit }) {
    commit('startFetchData')
    const result = await axiosGet('monitor_data/get_air_real_time_data')
    commit('setBusinessData', { dataType: 'AirQualityRTData', data: result })
    commit('stopFetchData')
  },

  async getAirQualityDailyData({ commit }, { startTime, endTime }) {
    commit('startFetchData')

    const result = await axiosGet('monitor_data/get_air_daily', {
      startTime,
      endTime
    })
    commit('setBusinessData', {
      dataType: 'AirQualityDailyData',
      data: result
    })

    commit('stopFetchData')
  },

  async getAirQualityWeeklyData({ commit }, { startTime, endTime }) {
    commit('startFetchData')
    const result = await axiosGet('monitor_data/get_air_week_report', {
      startTime,
      endTime
    })
    commit('setBusinessData', {
      dataType: 'AirQualityWeeklyData',
      data: result
    })
    commit('stopFetchData')
  },

  async getAirQualityMonthlyData({ commit }, { startTime, endTime }) {
    commit('startFetchData')
    const result = await axiosGet('monitor_data/get_air_Month_report', {
      startTime,
      endTime
    })
    commit('setBusinessData', {
      dataType: 'AirQualityMonthlyData',
      data: result
    })
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
          type: '医疗固废站点',
          dataType: 'MedicalWasteSurveillanceStation'
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
  async getAllRadiationSourceSurveillanceStation(
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
          type: '辐射源站点',
          dataType: 'RadiationSourceSurveillanceStation'
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

  /** 放射源 **/
  async getAllRadioactiveSourceSurveillanceStation(
    { commit },
    { isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('radioactiveSourceSite/find_area_site_page', {
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
          type: '放射源站点',
          dataType: 'RadioactiveSourceSurveillanceStation'
        }
      })
      commit('setBusinessData', {
        dataType: 'RadioactiveSourceSurveillanceStation',
        data: stations
      })
    }
    commit('stopFetchData')
  },
  /** /.放射源 **/

  /** 噪声 **/
  async getAllNoiseSurveillanceStation({ commit }, { isPage, page, limit }) {
    commit('startFetchData')
    const result = await axiosGet('noisePollutionSite/find_area_site_page', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const stations = result.data
        .filter((station) => station.isDelete === 1)
        .map((station) => {
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
            type: '噪声监测站点'
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

  /** 保护区 **/
  async getAllReserve({ commit }, { isPage, page, limit }) {
    commit('startFetchData')

    const result = await axiosGet('reserve/find_reserve_data', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const reserves = result.data
        .filter((station) => station.isDelete === 1)
        .map((area) => {
          const {
            id,
            cityName,
            cityCode,
            siteName: name,
            siteCode,
            property,
            pointList
          } = area
          const geometry = pointList.includes('rings')
            ? JSON.parse(pointList)
            : null
          if (geometry) {
            geometry.type = 'polygon'
          }
          return {
            id,
            cityName,
            cityCode,
            name,
            siteCode,
            levelName: property || '省控',
            geometry,
            type: '保护区'
          }
        })
      commit('setBusinessData', {
        dataType: 'Reserve',
        data: reserves
      })
    }

    commit('stopFetchData')
  },

  async addReserve({ commit, dispatch }, { graphic }) {
    commit('startFetchData')

    const { cityCode, name, levelName, siteCode } = graphic.attributes
    const result = await axiosPost('reserve/add_reserve', {
      cityCode,
      siteName: name,
      siteCode,
      property: levelName,
      pointList: JSON.stringify(graphic.geometry.toJSON())
    })
    if (result.code === 1) dispatch('getAllReserve', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },

  async updateReserve({ commit, dispatch }, { graphic }) {
    commit('startFetchData')

    const { id, cityCode, name, levelName, siteCode } = graphic.attributes
    const result = await axiosPost('reserve/update_reserve', {
      id,
      cityCode,
      siteName: name,
      siteCode,
      property: levelName,
      pointList: JSON.stringify(graphic.geometry.toJSON())
    })
    if (result.code === 1) dispatch('getAllReserve', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },

  async deleteReserve({ commit, dispatch }, { id }) {
    commit('startFetchData')

    const result = await axiosPost('reserve/delete_reserve', { id })
    if (result.code === 1) dispatch('getAllReserve', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },
  /** /.保护区 **/

  /** 土壤污染地块 **/
  async getAllSoilPollutantArea({ commit }, { isPage, page, limit }) {
    commit('startFetchData')

    const result = await axiosGet('soil/find_soil_data', {
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const areas = result.data
        .filter((station) => station.isDelete === 1)
        .map((area) => {
          const {
            id,
            cityName,
            cityCode,
            siteName: name,
            siteCode,
            property,
            pointList,
            colorType
          } = area
          const geometry = pointList.includes('rings')
            ? JSON.parse(pointList)
            : null
          const path = geometry.rings[0][0]
          const firstPoint = path[0]
          const lastPoint = path[path.length - 1]
          if (
            firstPoint[0] !== lastPoint[0] &&
            firstPoint[1] !== lastPoint[1]
          ) {
            geometry.rings[0][0].push(geometry.rings[0][0][0])
          }

          if (geometry) {
            geometry.type = 'polygon'
          }
          return {
            id,
            cityName,
            cityCode,
            name,
            siteCode,
            levelName: property || '省控',
            geometry,
            type: '土壤污染地块',
            colorType
          }
        })
      commit('setBusinessData', {
        dataType: 'SoilPollutantArea',
        data: areas
      })
    }

    commit('stopFetchData')
  },

  async addSoilPollutantArea({ commit, dispatch }, { graphic }) {
    commit('startFetchData')

    const { cityCode, name, levelName, siteCode } = graphic.attributes
    const result = await axiosPost('soil/add_soil', {
      cityCode,
      siteName: name,
      siteCode,
      property: levelName,
      pointList: JSON.stringify(graphic.geometry.toJSON())
    })
    if (result.code === 1) dispatch('getAllSoilPollutantArea', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },

  async updateSoilPollutantArea({ commit, dispatch }, { graphic }) {
    commit('startFetchData')

    const { id, cityCode, name, levelName, siteCode } = graphic.attributes
    const result = await axiosPost('soil/update_soil', {
      id,
      cityCode,
      siteName: name,
      siteCode,
      property: levelName,
      pointList: JSON.stringify(graphic.geometry.toJSON())
    })
    if (result.code === 1) dispatch('getAllSoilPollutantArea', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },

  async deleteSoilPollutantArea({ commit, dispatch }, { id }) {
    commit('startFetchData')

    const result = await axiosPost('soil/delete_soil', { id })
    if (result.code === 1) dispatch('getAllSoilPollutantArea', { isPage: 'NO' })
    commit('stopFetchData')
    return result
  },
  /** /.土壤污染地块 **/

  /** 机动车尾气 **/
  getAllVehicleExhaustSurveillanceStation({ commit }) {
    commit('setBusinessData', {
      dataType: 'VehicleExhaustSurveillanceStation',
      data: []
    })
  },
  /** /.机动车尾气 **/

  /** 非道路移动机械 */
  async getNonRoadMachineryByCity(
    { commit },
    { cityCode, isPage, page, limit }
  ) {
    commit('startFetchData')
    const result = await axiosGet('MVFdlydMechante/find_MVFdlydMechante_data', {
      cityCode,
      isPage,
      page,
      limit
    })
    if (result.code === 1) {
      const machineries = result.data.filter(
        (machinery) => machinery.longitude !== '' && machinery.latitude !== ''
      )
      // .map((machinery) => ({ ...machinery, id: machinery.deviceId }))
      commit('stopFetchData')
      return machineries
    }
  },

  /** /.非道路移动机械 */

  /** 遥感点 */
  async getAllTelemetryPoint({ commit }) {
    commit('startFetchData')

    const dataType = 'TelemetryPoint'

    const result = await axiosGet('monitor_data/get_y_jdc_siteinfo')
    const points = result
      .filter((point) => Number(point.DDJD) !== 0 && Number(point.DDWD) !== 0)
      .map((point, index) => {
        const { DDJD, DDWD, DWMC, DWDZ, DWBH } = point
        return {
          objectId: index,
          name: DWMC,
          id: DWBH,
          address: DWDZ,
          geometry: { type: 'point', x: Number(DDJD), y: Number(DDWD) },
          type: '机动车遥测点',
          dataType
        }
      })
    commit('setBusinessData', {
      dataType,
      data: points
    })

    commit('stopFetchData')
  },
  /** /.遥感点 */

  /** 农村农业 */
  async getAllCountryside({ commit }) {
    commit('startFetchData')

    const result = await axiosGet('area_site/find_black_odor_water_list')
    if (result.code === 1) {
      const countrySides = result.data
        .filter((countrySide) => countrySide.isDelete === 1)
        .map((countrySide) => {
          const {
            objectId: id,
            cityId,
            cityName,
            siteId,
            siteName: name,
            x,
            y
          } = countrySide
          return {
            id,
            siteId,
            name,
            type: '农村农业',
            cityId,
            cityName,
            geometry: { type: 'point', x, y }
          }
        })

      console.log(countrySides)
      commit('setBusinessData', {
        dataType: 'Countryside',
        data: countrySides
      })
    }

    commit('stopFetchData')
  },
  /** /.农村农业 */

  /** 地下水 */
  async getAllGroundwater({ commit }) {
    commit('startFetchData')

    const result = await axiosGet('area_site/find_ground_water_list')
    if (result.code === 1) {
      const groundwaters = result.data
        .filter((groundwater) => groundwater.isDelete === 1)
        .map((groundwater) => {
          const {
            objectId: id,
            cityId,
            cityName,
            siteId,
            siteName: name,
            x,
            y
          } = groundwater
          return {
            id,
            siteId,
            name,
            type: '地下水',
            cityId,
            cityName,
            geometry: { type: 'point', x, y }
          }
        })
      commit('setBusinessData', {
        dataType: 'Groundwater',
        data: groundwaters
      })
    }

    commit('stopFetchData')
  }
  /** /.地下水 */
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
