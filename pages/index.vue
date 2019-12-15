<template>
  <div id="app">
    <Home :title="appConfig.app.title" :sub-title="appConfig.app.subTitle" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Home from '~/components/home'

export default {
  name: 'App',

  components: {
    Home
  },

  async asyncData({ store }) {
    await store.dispatch('app-info/getAppConfig')
  },

  computed: {
    ...mapState('app-info', ['appConfig'])
  }
}
</script>

<style></style>
