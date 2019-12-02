import { axiosGet } from '~/api/axios'

export default {
  getRTData(stationId) {
    return axiosGet('monitor_data/get_water_real_time_data', {
      siteCode: stationId
    })
  },

  getMonitorFactoringInfo() {
    return axiosGet('monitor_data/get_water_monitoring_factors')
  },

  getRelatedPollutantSource(stationId, psCodes) {
    return axiosGet('monitor_data/get_company_by_water_site_code', {
      siteCode: stationId,
      psCodes
    })
  }
}
