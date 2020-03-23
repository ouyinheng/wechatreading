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
	    <v-img class="header" :src="picUrl" height="300px" dark>
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
	    <v-list two-line>
	      	<v-list-item @click="">
	        	<v-list-item-icon>
	          		<v-icon color="indigo">iconfont icon-shoucang</v-icon>
	        	</v-list-item-icon>
	        	<v-list-item-content>
	          		<v-list-item-title>历史记录</v-list-item-title>
	          		<v-list-item-subtitle>history</v-list-item-subtitle>
	        	</v-list-item-content>
			</v-list-item>
		</v-list>
	  </v-card>
</template>

<script>
	import getRandomPicture from '@/utils/getRandomPicture'
	export default {
	    name: 'mine',
	    data() {
	        return {
	        	picUrl: '',
	        	pic_list: []
	        }
	    },
	    methods: {
	    	randomList() {
	    		let index = parseInt(Math.random()*(this.pic_list.length-1));
		    	this.picUrl = this.pic_list[index]
	    	}
	    },
	    created() {
	    	getRandomPicture.getPicture().then(res => {
	    		this.pic_list = res;
		    	this.randomList();
		    	// setInterval(() => {
		    	// 	this.randomList()
		    	// }, 10000)
	    	})
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