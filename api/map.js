import { appConfig } from '~/static/js/appConfig'

export default {
  getInitialCamera() {
    return appConfig.map.initial_camera
  }
}
