<template>
    <!-- <v-app class="mine">
        <header class="header">
        	<div class="header-btn">
        		<v-btn icon>
			        <v-icon>iconfont icon-youxiang</v-icon>
			    </v-btn>
			    <v-btn icon>
			        <v-icon>iconfont icon-shezhi</v-icon>
			    </v-btn>
        	</div>
        </header>
        <section></section>
    </v-app> -->
    <v-card class="mine mx-auto">
	    <v-img class="header" :src="picUrl" :lazy-src="lazyImg" height="350px" dark>
		    <div>
		        <v-card-title class="header-btn">
		          	<v-btn dark icon>
		            	<v-icon>iconfont icon-youxiang</v-icon>
		          	</v-btn>
		          	<v-spacer></v-spacer>
		          	<v-btn dark icon>
		            	<v-icon>iconfont icon-shezhi</v-icon>
		          	</v-btn>
		        </v-card-title>
		        <v-spacer></v-spacer>
		        <v-card-title class="white--text pl-12 pt-12">
		          	<div class="display-1 pl-12 pt-12">Ali Conners</div>
		        </v-card-title>
		    </div>
	    </v-img>
	    <v-list dense>
	      	<v-list-item @click="">
	        	<v-list-item-icon>
	          		<v-icon color="indigo">iconfont icon-shoucang</v-icon>
	        	</v-list-item-icon>
	        	<v-list-item-content>
	          		<v-list-item-title>历史记录</v-list-item-title>
	          		<!-- <v-list-item-subtitle>history</v-list-item-subtitle> -->
	        	</v-list-item-content>
			</v-list-item>
			<v-list-item @click="toPictureHandler">
	        	<v-list-item-icon>
	          		<v-icon color="indigo">iconfont icon-tupian</v-icon>
	        	</v-list-item-icon>
	        	<v-list-item-content>
	          		<v-list-item-title>图片</v-list-item-title>
	          		<!-- <v-list-item-subtitle>picture</v-list-item-subtitle> -->
	        	</v-list-item-content>
			</v-list-item>
            <v-list-item @click="toShowCompoent">
	        	<v-list-item-icon>
	          		<v-icon color="indigo">iconfont icon-tupian</v-icon>
	        	</v-list-item-icon>
	        	<v-list-item-content>
	          		<v-list-item-title>组件</v-list-item-title>
	          		<!-- <v-list-item-subtitle>picture</v-list-item-subtitle> -->
	        	</v-list-item-content>
			</v-list-item>
		</v-list>
	  </v-card>
</template>

<script>
    import getRandomPicture from '@/utils/getRandomPicture'
    import lazyImg from '@/static/images/lazy_img.jpg'
    import { mapGetters, mapActions } from 'vuex'
	export default {
	    name: 'mine',
	    data() {
	        return {
	        	picUrl: '',
                pic_list: [],
                lazyImg: lazyImg
	        }
        },
        computed: {
            ...mapGetters(['getPicList'])
        },
	    methods: {
            ...mapActions(['getPictureList']),
	    	randomList() {
				let index = parseInt(Math.random()*(this.getPicList.length-1));
		    	this.picUrl = this.getPicList[index]
	    	},
	    	toPictureHandler() {
	    		this.$router.push({
	    			name: 'picture'
	    		})
            },
            toShowCompoent() {
                this.$router.push({
                    name: 'showComponent'
                })
            }
	    },
	    created() {
	    	// getRandomPicture.getPicture('/huaban/favorite/beauty').then(res => {
	    	// 	this.pic_list = res;
		    // 	this.randomList();
            // })
            if(this.getPicList.length === 0) {
                this.getPictureList().then(() => {
                    this.randomList();
                })
            } else {
                this.randomList();
            }
	    }
	}
</script>

<style lang="scss" scoped>
.mine {
	.v-image {
		backgroud-color: gray;
	}
    .header {
        width: 100%;
        padding-top: 2rem;
		&-btn {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.v-card__title {
				line-height: 1rem;
			}
		}
    }
}
</style>