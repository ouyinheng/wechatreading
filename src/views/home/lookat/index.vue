<template>
    <v-app class="lookat">
        <not-found class="not-found"></not-found>
        <!-- <v-btn color="primary" @click.native="statusShow">显示</v-btn>
        <v-btn color="error" @click.native="statusHide">隐藏</v-btn>
        <v-btn color="error" @click.native="reload">隐藏</v-btn> -->
    </v-app>
</template>

<script>
import notFound from '@/components/notFound.vue'
import App from '@/static/js/cordova'
export default {
    name: 'lookat',
    components: {
        notFound
    },
    data() {
        return {
        }
    },
    methods: {
        
        // 显示状态
        statusShow () {
            statusbarTransparent.enable();
            // App.status.show()
        },

        // 隐藏状态栏
        statusHide () {
            App.status.hide()
        },
        reload() {
            window.location.reload()
        },
    },
    mounted() {
        // App.status.hide()
        App.initApp()
    }
}
</script>

<style lang="scss" scoped>
.lookat {
    padding-top: 2.5rem;;
    .not-found {
        width: 90vw;
        margin: 10rem auto 0;
    }
}
</style>