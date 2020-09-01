<template>
    <v-app class="bookrack">
        <header class="header">
            <div class="search_group">
                <span class="iconfont icon-search"></span>
                <span class="search_input" @click="toSearch"></span>
                <span class="iconfont icon-add1"></span>
            </div>
        </header>
        <section class="container">
            section
        </section>
    </v-app>
</template>

<script>
import parseSearch from '@/utils/search.js'
export default {
    name: 'bookrack',
    data() {
        return {
        }
    },
    methods: {
        toSearch() {
            this.$router.push({
                path: '/search'
            })
        }
    },
    created() {
        // this.axios.get(`/api/search.php?q=123`).then(res => {
        //     console.log(parseSearch.parseHtml(res.data))
        // })
    }
}
</script>

<style lang="scss" scoped>
.bookrack {
    .header {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        padding: 10px 20px;
        .search_group {
            background-color: rgba(241,242,244,1);
            border-radius: 20px;
            height: 30px;
            padding: 5px;
            line-height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .search_input {
                display: inline-block;
                height: 80%;
                width: 70%;
                border-right: 1px solid gainsboro;
            }
        }
    }
}
</style>