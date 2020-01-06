import { axiosGet } from '~/api/axios'

const airFactors = new Map()
airFactors.set('VALUE1', { alias: '烟尘原始实测', unit: 'mg/m3' })
airFactors.set('VALUEZS1', { alias: '烟尘原始折算', unit: 'mg/m3' })
airFactors.set('VALUE2', { alias: 'SO2', unit: 'μg/m3' })
export default {
  async getAirRTData(code) {
    const results = await axiosGet('monitor_data/get_company_air_factors', {
      psCode: code
    })
    if (results && results.length >= 1) {
      results.forEach((results) => {})
    } else {
      return null
    }
  }
}
