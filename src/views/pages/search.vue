<template>
    <div class="search">
        <header class="header">
            <span class="iconfont icon-right back_btn" @click="back"></span>
            <div class="search_group">
                <span class="iconfont icon-search"  @click="searchHandler"></span>
                <input class="search_input font-md" v-model="keyWord" :placeholder="placeholder" @keyup.enter="searchHandler" />
                <span class="iconfont icon-" ></span>
            </div>
        </header>
        <section>
            <div class="chips_group" v-if="!showList">
                <v-chip class="chips_item ma-2" v-for="(item, index) in chips" :key="index" @click.native="chipHandler(item.value)">{{item.value}}</v-chip>
            </div>
            <div v-else>
               <v-card v-for="(item, index) in searchBookList" :key="index" color="#ffffff" outlined>
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <v-avatar class="ma-3" size="125" tile >
                            <v-img :src="item.bookImg.url"></v-img>
                        </v-avatar>
                        <div>
                            <v-card-title class="headline" v-text="item.bookname" ></v-card-title>
                            <v-card-subtitle v-text="item.bookname"></v-card-subtitle>
                        </div>
                    </div>
                </v-card>
            </div>
        </section>
    </div>
</template>

<script>
import bookFunc from '@/utils/book'
export default {
    name: 'search',
    data() {
        return {
            keyWord: '',
            placeholder: '',
            chips: [],
            searchBookList: [],
            showList: false
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        searchHandler() {
            let keyword = this.keyWord || this.placeholder;
            console.log(keyword)
            this.axios({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                params: {
                    searchkey: keyword
                },
                url: '/jiutao/search.html'
            }).then(res => {
                console.log(res)
                let div = document.createElement('div');
				div.innerHTML = res.data;
                let list =  div.querySelectorAll('.layui-main .library li');
                console.log(list)
                let bookList = [];
                Array.from(list).forEach(div => {
					let item = document.createElement('div');
	                item.appendChild(div)
	                bookList.push({
	                	chapter: {
                            url: item.querySelector('.chapter').innerText,
                            text: item.querySelector('.chapter').getAttribute('href'),
                            isLink: true
                        },
                        bookImg: {
                            url: item.querySelector('.bookimg img').getAttribute('src')
                        },
	                	bookname: item.querySelector('.bookname').innerText,
                        author: item.querySelector('.author').innerText,
                        intro: item.querySelector('.intro').innerText,
	                })
                })
                this.searchBookList = bookList;
            this.showList = true;
                console.log(bookList)
            })
            // this.axios.post(`/jiutao/search.html`, {
            //     searchkey: keyword
            // }).then(res => {
            //     console.log(res)
            //     let div = document.createElement('div');
			// 	div.innerHTML = res.data;
            //     let list =  div.querySelectorAll('.layui-main .libraryul li');
            //     console.log(list)
            // })
        },
        chipHandler(item) {
            this.keyWord = item;
            this.searchHandler()
        },
        getHotSearch() {
            this.axios.get(`/qd/ajax/Search/AutoComplete?_csrfToken=gGdpUIAGDW4UccHTmAlMpzwfpTjjgGuQQblR3vj9&siteid=1&query=`).then(res => {
                this.chips = res.data.suggestions
            })
        }
    },
    created() {
        this.getHotSearch();
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
                width: 85%;
                border-right: 1px solid gainsboro;
                outline: none;
                padding: 15px 5px 15px 0;
            }
        }
    }
    .chips_group {
        .chips_item {
        }
    }
}
</style>