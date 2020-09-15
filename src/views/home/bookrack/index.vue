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
            <div
                class="book_card"
                v-for="(item, index) in bookList"
                :key="index"
                @click="toDetails(item)"
            >
                <img class="bookImg" :src="item.cover" alt="">
                <div>
                    <span class="font-sm" style="font-size: smaller">{{item.bookName}}</span>
                </div>
            </div>
        </section>
    </v-app>
</template>

<script>
import parseSearch from '@/utils/search.js'
import dbOption from '@/utils/db/bookrack.js'
export default {
    name: 'bookrack',
    data() {
        return {
            bookList: []
        }
    },
    methods: {
        toSearch() {
            this.$router.push({
                path: '/search'
            })
        },
        toDetails(item) {
            console.log(item)
            this.$router.push({
                path: '/bookDetails',
                query: {
                    link: encodeURIComponent(item.link)
                }
            })
        }
    },
    created() {
        dbOption.queryBook((res) => {
            this.bookList = res;
        });
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
    .container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .book_card {
            width: 6.125rem;
            // margin: 0 1rem;
            margin-right: 1rem;
        }
        .bookImg {
            width: 6.125rem;
            min-width: 4.125rem;
            height: 8.5rem;
            object-fit: fill;
            font-size: 0;
            margin-right: .5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
        }
    }
}
</style>