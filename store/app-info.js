import { appConfig } from '~/static/js/appConfig'

const state = () => ({
  title: appConfig.app.title,
  subTitle: appConfig.app.subTitle
})

export default {
  namespaced: true,
  state
}
