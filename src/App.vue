<template>
  <v-app>
    <transition name="page-transfer" mode="out-in">
        <!-- <keep-alive> -->
            <router-view class="router_view" />
        <!-- </keep-alive> -->
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