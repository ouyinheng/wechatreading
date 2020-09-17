<template>
  <v-app>
    <transition name="page-transfer" mode="out-in">
      <router-view class="router_view" />
    </transition>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  watch: {
    
  },
  data: () => ({
    //
    
  }),
  methods: {
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
#app {
  background-color: #ebecee;
}
</style>