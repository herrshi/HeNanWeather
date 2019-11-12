<template>
  <mdb-spinner id="loading" small multicolor/>
</template>

<script>
  import {mdbSpinner} from "mdbvue";

  export default {
    name: "Loader",

    components: {
      mdbSpinner
    }
  }
</script>

<style scoped>
  #loading {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
</style>