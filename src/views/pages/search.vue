<template>
    <div class="search">
        <header class="header">
            <span class="iconfont icon-right back_btn" @click="back"></span>
            <div class="search_group">
                <span class="iconfont icon-search"  @click="searchHandler"></span>
                <input class="search_input font-md" v-model="keyWord" :placeholder="placeholder" @keyup.enter="searchHandler" />
                <span class="iconfont icon-shanchu1" v-if="keyWord" @click="clearInput"></span>
                <span class="iconfont" v-else>&nbsp;</span>
            </div>
        </header>
        <section>
            <div class="chips_group" v-if="!showList">
                <v-chip class="chips_item ma-2" v-for="(item, index) in chips" :key="index" @click.native="chipHandler(item.value)">{{item.value}}</v-chip>
            </div>
            <div v-else>
               <v-card v-for="(item, index) in searchBookList" :key="index" color="#ffffff" outlined @click="toDetails(item)">
                    <div class="d-flex flex-no-wrap book-layout">
                        <img class="bookImg" :src="item.bookImg.url" alt="">
                        <div class="book_cell">
                            <h4 class="book_title">
                                {{item.bookname}}
                            </h4>
                            <p class="book_desc">
                                {{item.intro}}
                            </p>
                            <div class="book-meta">
                                <div class="book-meta-l">
                                    <span class="iconfont icon-renwu"></span>
                                    <span class="book-author">{{item.author}}</span>
                                </div>
                                <div class="book-meta-r">
                                    <span></span>
                                </div>
                            </div>
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
        clearInput() {
            this.keyWord = '';
        },
        searchHandler() {
            let keyword = this.keyWord || this.placeholder;
            this.keyWord = keyword;
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
                            url: item.querySelector('.bookimg img').getAttribute('src'),
                            link: item.querySelector('.bookimg').getAttribute('href')
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
        },
        toDetails(item) {
            console.log(item)
            this.$router.push({
                path: '/bookDetails',
                query: {
                    link: encodeURIComponent(item.bookImg.link)
                }
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
    padding-top: 2.5rem;
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
            height: 2.5rem;
            padding: 5px;
            line-height: 2.8rem;
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
            .icon-shanchu1 {
                color: gray;
            }
        }
    }
    .chips_group {
        .chips_item {
        }
    }
    section {
        .book-layout {
            position: relative;
            display: block;
            overflow: hidden;
            padding: 1rem;
            -webkit-transition: padding-left .15s;
            transition: padding-left .15s;
        }
        .bookImg {
            width: 4.125rem;
            min-width: 4.125rem;
            height: 5.5rem;
            object-fit: fill;
            font-size: 0;
            margin-right: .5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
        }
        .book_cell {
            overflow: hidden;
            .book_title {
                line-height: 1.4;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                // mark {
                //     color: #ed424b;
                //     background-color: transparent;
                // }
            }
            .book_desc {
                line-height: 1.1875rem;
                display: -webkit-box;
                height: 2.25rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                font-size: .875rem;
                overflow: hidden;
                margin: .375rem 0;
                color: #969ba3;
            }
            .book-meta {
                font-size: .75rem;
                overflow: hidden;
                .book-meta-l {
                    display: flex;
                    align-items: center;
                    color: #969ba3;
                }
                .book-author {
                    font-size: .8125rem;
                    display: block;
                    overflow: hidden;
                    max-width: 10em;
                    max-width: calc(100vw - 2rem - (176rem / 16));
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>