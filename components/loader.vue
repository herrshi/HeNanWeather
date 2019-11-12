<template>
  <!--  <mdb-spinner id="loading" />-->
  <div id="loading" class="spinner-border text-success" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
// import { mdbSpinner } from 'mdbvue'

export default {
  name: 'Loader'

  // components: {
  //   mdbSpinner
  // }
}
</script>

<style scoped>
#loading {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
