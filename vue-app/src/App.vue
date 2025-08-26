<template>
  <div id="app">
    <div>
      <Parcel :config="parcelConfig" :mountRootParcel="mountRootParcel" />
      <router-link to="/foo">foo</router-link>
      <router-link to="/bar">bar</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Parcel from '../node_modules/single-spa-vue/dist/esm/parcel';
import { mountRootParcel } from 'single-spa'

export default {
  name: 'App',
  components: {
    Parcel
  },
  data() {
    return {
      parcelConfig: window.System.import('@study/react-nav'),
      mountParcel: mountRootParcel
    }
  }
}
</script>

<style>

</style>
