export default {
  async getAppConfig() {
    const response = await fetch(`${process.env.baseUrl}/appConfig.json`)
    return response.json()
  }
}
