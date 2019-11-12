<template>
  <div id="app">
    <Home :title="title" :sub-title="subTitle" />
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

  computed: {
    ...mapState('app-info', ['title', 'subTitle'])
  }
}
</script>

<style></style>
