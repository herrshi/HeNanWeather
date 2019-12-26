import { axiosGet } from '~/api/axios'

export default {
  getRTData() {
    return axiosGet('/monitor_data/get_noise_real_time_data')
  },

  getHourlyData(startTime, endTime) {
    return axiosGet('/monitor_data/get_noise_hour_data', { startTime, endTime })
  },

  getDailyData(startTime, endTime) {
    return axiosGet('/monitor_data/get_noise_day_data', { startTime, endTime })
  },

  getMonthlyData(startTime, endTime) {
    return axiosGet('/monitor_data/get_noise_month_data', {
      startTime,
      endTime
    })
  }
}
