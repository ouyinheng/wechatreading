<template>
    <div class="header_com">
        <v-app-bar style absolute color="white" elevate-on-scroll scroll-target="#scrolling-techniques-7">
            <span @click="back" class="iconfont icon-right"></span>
            <v-spacer></v-spacer>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: 'header_com',
    methods: {
        back() {
            this.$router.back();
        }
    }
}
</script>

<style lang="scss" scoped>
.header_com {
    width: 100%;
	padding-top: 3rem;
}
</style>