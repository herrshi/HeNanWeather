import { axiosGet } from '~/api/axios'

const state = () => ({
  fetching: false,
  pollutantSourceEnterprises: []
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
  }
}

const actions = {
  /** 重点污染源企业 **/
  async getAllPollutantSourceEnterprises(
    { commit, rootGetters },
    { isPage, page, limit }
  ) {
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
          controlLevel,
          sourcePositionType,
          sysCity,
          isDelete
        } = enterprise

        const controlLevelCode = controlLevel.attentiondegreeCode
        const controlLevelName = rootGetters['base-data/getControlLevelByCode'](
          controlLevelCode
        ).levelName

        const pollutantSourceTypeCode = sourcePositionType.typeCode
        // eslint-disable-next-line standard/computed-property-even-spacing
        const pollutantSourceTypeName = rootGetters[
          'base-data/getPollutantSourceTypeByCode'
        ](pollutantSourceTypeCode).typeName

        const cityCode = sysCity.cityCode
        const cityName = rootGetters['base-data/getCityByCode'](cityCode)
          .cityName

        return {
          name,
          id: objectId,
          x,
          y,
          controlLevelCode,
          controlLevelName,
          pollutantSourceTypeCode,
          pollutantSourceTypeName,
          cityCode,
          cityName,
          isDelete
        }
      })
      commit('setAllPollutantSourceEnterprises', { enterprises })
    }
    commit('stopFetchingData')
  }
  /** /.重点污染源企业 **/
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
