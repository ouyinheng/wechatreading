<template>
    <div class="discover">
         <swiper :options="swiperOption" ref="mySwiper" class="mySwiper" @someSwiperEvent="callback">
            <!-- slides -->
            <swiper-slide class="swiper-slide" v-for="(item, index) in recommend" :key="index">
                <v-card :loading="loading" class="mx-auto my-12 py-12 v-card" @click.stop="toBookInfo(item)">
                    <v-img :src="item.cover" class="v-img" height="150" width="100"></v-img>
                    <h3 class="title font-xl mt-8">{{item.name}}</h3>
                    <div class="grey--text font-md">
                        {{item.author}}
                    </div>
                </v-card>
            </swiper-slide>
      </swiper>
    </div>
</template>

<script>
import bookApi from '@/utils/book.js'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    name: 'discover',
    data() {
        return {
            swiperOption: {
              // some swiper options/callbacks
              // 所有的参数同 swiper 官方 api 参数
              // ...
            },
            recommend: [],
            height: '300px',
            loading: false,
            selection: 1,
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    methods:{
        reserve () {
            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
      },
        callback() {

        },
        /**
		*	本周强推 weekspush
		*	排行榜 	rankwraplist
		*/
		getHomePage() {
			this.axios.get(`/qd`).then(res => {
				let div = document.createElement('div');
				div.innerHTML = res.data;
				let list =  div.querySelectorAll('.index-two-wrap .book-list ul li');
				let weekspush = []
				Array.from(list).forEach(div => {
					let item = document.createElement('div');
	                item.appendChild(div)
	                weekspush.push({
	                	channel: item.querySelector('.channel').innerText,
	                	name: item.querySelector('.name').innerText,
	                	author: item.querySelector('.author')?item.querySelector('.author').innerText:item.querySelector('.rec').innerText
	                })
				})
				weekspush = weekspush.filter(item => item.author !== '广告')
				// console.log(weekspush)
				let rankwraplist = div.querySelectorAll('.rank-wrap .rank-list.sort-list');
				let rankwrap = []
				Array.from(rankwraplist).forEach(div => {
					let item = document.createElement('div');
	                item.appendChild(div)
	    			let list = [];
	    			let tag = item.querySelector('.wrap-title').innerText.substr();
	    			tag = tag.substr(0, tag.length-3)
	    			let list_group = item.querySelectorAll('.book-list ul li')
	    			list_group.forEach(ele => {
	    				if(ele.querySelector('.name-box .name')) {
	    					list.push({
			                	name: ele.querySelector('.num-box').innerText,
			                	rank: ele.querySelector('.name-box .name').innerText
		    				})
	    				}
	    			})
	    			rankwrap.push({tag, list})
	               	if(item.querySelector('.author a')) {
		               	 this.recommend.push({
		                	channel: item.querySelector('.author a').innerText,
                            name: item.querySelector('.book-info a').innerText,
		                	link: item.querySelector('.book-info a').getAttribute('href'),
		                	tag: item.querySelector('.digital').innerText,
		                	author: item.querySelector('.author .writer').innerText,
		                	cover: item.querySelector('.book-cover .link img').getAttribute('src'),
		                })
	               	}
				})
				// this.recommend = rankwrap
                console.log(this.recommend)
			})
		},
        toBookInfo(item) {
            this.$router.push({
                name: 'bookinfo',
                params: {
                    item
                }
            })
        }
    },
    created() {
        // this.axios.get('/api/search.php?q=诡秘之主').then(res => {
        //     console.log(parseSearch.parseHtml(res.data))
        // })
        this.getHomePage()
    },
    mounted() {
        this.swiper.slideTo(0, 1000, false);

    }
}
</script>

<style lang="scss" scoped>
    .discover {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
        .swiper-slide {
            width: 100vw;
            .v-card {
                width: 90vw;
                border-radius: 10px;
                height: calc(100vh - 100px);
                margin: 0 auto;
                text-align: center;
                box-sizing: border-box;
                .title {
                    text-align: center;
                    margin: 0 auto;
                    font-weight: bold;
                }
                .v-img {
                    margin: 0 auto;
                    border-radius: 0 ;
                }
            }
        }
    }
</style>