<template>
    <v-app class="basic_home">
        <section class="section">
            <!-- <transition name="page-transfer" mode="out-in"> -->
                <keep-alive>
                    <router-view class="router_view"/>
                </keep-alive>
            <!-- </transition> -->
        </section>
        <footer class="footer">
            <v-bottom-navigation
                :value="activeBtn"
                grow
                color="teal"
            >
                <v-btn v-for="(item, index) in bottom_btn" :key="index" @click.native="setBottomRouter(item, index)">
                    <span>{{item.name}}</span>
                    <!-- <v-icon>mdi-history</v-icon> -->
                    <!-- <v-icon>{{item.icon}}</v-icon> -->
                    <span :class="['iconfont', item.icon]"></span>
                </v-btn>
            </v-bottom-navigation>
        </footer>
    </v-app>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            activeBtn: 1,
            bottom_btn: [{
                name: '发现',
                icon: 'icon-faxian1',
                path: '/discover'
            }, {
                name: '书架',
                icon: 'icon-shujia1',
                path: ''
            }, {
                name: '看一看',
                icon: 'icon-shequ',
                path: '/lookat'
            }, {
                name: '我',
                icon: 'icon-wode',
                path: '/mine'
            }]
        }
    },
    methods: {
        setBottomRouter(row, index) {
            this.activeBtn = index;
            this.$router.replace('/home'+row.path)
        }
    },
    created() {
        let name = this.$route.name;
        switch (name) {
            case 'discover':
                this.activeBtn = 0;
                break;
            case 'bookrack':
                this.activeBtn = 1;
                break;
            case 'lookat':
                this.activeBtn = 2;
                break;
            case 'mine':
                this.activeBtn = 3;
                break;
            default:
                this.activeBtn = 1;
                break;
        }
    }
}
</script>

<style lang="scss" scoped>
.basic_home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    overflow: hidden;
    .section {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 57px;
        overflow: hidden;
    }
    .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    
}
</style>