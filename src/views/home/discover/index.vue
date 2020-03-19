<template>
    <div class="discover">
         <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
            <!-- slides -->
            <swiper-slide v-for="(item, index) in recommend" :key="index">
                <ul>
                    <li v-for="(ele, ind) in item.list" :key="ind">{{item.tag}}</li>
                </ul>
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
            recommend: []
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
	               	// if(item.querySelector('.author a')) {
		               // 	 rankwrap.push({
		               //  	channel: item.querySelector('.author a').innerText,
		               //  	name: item.querySelector('.book-info a').innerText,
		               //  	tag: item.querySelector('.digital').innerText,
		               //  	author: item.querySelector('.author .writer').innerText,
		               //  	cover: item.querySelector('.book-cover .link img').getAttribute('src'),
		               //  })
	               	// }
				})
				this.recommend = rankwrap
			})
		},
    },
    created() {
        // this.axios.get('/api/search.php?q=诡秘之主').then(res => {
        //     console.log(parseSearch.parseHtml(res.data))
        // })
        this.getHomePage()
    },
    mounted() {
        this.swiper.slideTo(3, 1000, false)
    }
}
</script>

<style lang="scss">
    .discover {
        height: 90%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .swiper-container {
            width: 90vw;
            height: 96%;
            box-shadow: 0px 0px 1px 1px gainsboro;
            border-radius: 10px;
            padding: 10px 20px 10px 20px;
        }
    }
</style>