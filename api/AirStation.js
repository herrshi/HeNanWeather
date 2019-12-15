import { axiosGet } from '~/api/axios'

export default {
  getRTData(stationId) {
    return axiosGet('monitor_data/get_air_min_data', {
      siteCode: stationId
    })
  },

  getHistData({ stationId, startTime, endTime }) {
    return axiosGet('monitor_data/get_air_hour_date_data', {
      siteCode: stationId,
      startTime,
      endTime
    })
  }
}
