<template>
    <div class="search">
        <header class="header">
            <span class="iconfont icon-right back_btn" @click="back"></span>
            <div class="search_group">
                <span class="iconfont icon-search"></span>
                <input class="search_input font-md" v-model="keyWord" :placeholder="placeholder" />
                <span class="">&nbsp;</span>
            </div>
        </header>
    </div>
</template>

<script>
import bookFunc from '@/utils/book'
export default {
    name: 'search',
    data() {
        return {
            keyWord: '',
            placeholder: ''
        }
    },
    methods: {
        back() {
            this.$router.back();
        }
    },
    created() {
        bookFunc.getPlaceholder().then(res => {
            this.placeholder = res;
        })
    }
}
</script>

<style lang="scss" scoped>
.search {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: white;
    .header {
        width: 100%;
        height: 3rem;
        box-sizing: border-box;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        .back_btn {
            font-size: 1rem;
            font-weight: bold;
            display: inline-block;
            padding: 0 10px 0 0;
        }
        .search_group {
            width: 90%;
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
                height: 90%;
                width: 70%;
                border-right: 1px solid gainsboro;
                outline: none;
                padding: 0 5px;
            }
        }
    }
}
</style>