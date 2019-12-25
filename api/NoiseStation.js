import { axiosGet } from '~/api/axios'

export default {
  getRTData() {
    return axiosGet('/monitor_data/get_noise_real_time_data')
  }
}
