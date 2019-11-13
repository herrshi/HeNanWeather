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
          controlLevel,
          sourcePositionType,
          sysCity,
          isDelete
        } = enterprise

        return {
          name,
          id: objectId,
          x,
          y,
          controlLevelCode: controlLevel.attentiondegreeCode,
          pollutantSourceTypeCode: sourcePositionType.typeCode,
          cityCode: sysCity.cityCode,
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
