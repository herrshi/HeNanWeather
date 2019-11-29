import { axiosGet } from '~/api/axios'

export default {
  getRTData(stationId) {
    return axiosGet('monitor_data/get_water_real_time_data', {
      siteCode: stationId
    })
  },

  getMonitorFactoringInfo() {
    return axiosGet('monitor_data/get_water_monitoring_factors')
  }
}
