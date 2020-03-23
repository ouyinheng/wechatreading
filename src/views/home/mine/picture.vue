<template>
  	<v-card class="mx-auto">
	    <v-toolbar color="indigo" dark>
	      	<v-btn icon @click="back">
              	<v-icon>mdi-arrow-left</v-icon>
            </v-btn>
	      	<v-toolbar-title>Discover</v-toolbar-title>
	      	<v-spacer></v-spacer>
	      	<v-btn icon>
	        	<v-icon>mdi-magnify</v-icon>
	      	</v-btn>
	    </v-toolbar>
	    <v-container fluid>
	      	<v-row dense>
	        	<v-col v-for="(item, index) in pic_list" :key="index" :cols="item.col">
		          	<v-card>
		            	<v-img
			              	:src="'http://hbimg.huabanimg.com/'+item.file.key"
			              	class="white--text align-end"
			              	gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
			              	height="200px"
		            	>
		              		<v-card-title v-text="item.user.username"></v-card-title>
		            	</v-img>
			            <v-card-actions>
			              	<v-spacer></v-spacer>
			              	<v-btn icon>
			                	<v-icon>mdi-heart</v-icon>
			              	</v-btn>
			              	<v-btn icon>
			                	<v-icon>mdi-bookmark</v-icon>
			             	</v-btn>
			              	<v-btn icon>
			                	<v-icon>mdi-share-variant</v-icon>
			              	</v-btn>
			            </v-card-actions>
		          	</v-card>
		        </v-col>
	      	</v-row>
	    </v-container>
	 </v-card>
</template>

<script>
	import getRandomPicture from '@/utils/getRandomPicture'
	export default {
	    name: 'mine',
	    data: () => ({
        	picUrl: '',
        	pic_list: [],
	      	cards: [
	        	{ title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
	        	{ title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
	        	{ title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
	      	],
	    }),
	    methods: {
	    	back() {
	    		this.$router.back()
	    	},
	    	load() {
		    	getRandomPicture.getPictureList('/huaban/favorite/beauty').then(res => {
		    		res.forEach(item => {
		    			if(item.file.width%5===0) {
		    				item.col = 12;
		    			} else {
		    				item.col = 6;
		    			}
		    		})
		    		this.pic_list = res;
		    	})
	    	},
	    	loadmore() {
	            if(this.beautyList.length == 0) {
	                return;
	            }
	            const url = `/huaban/discovery/?category=beauty?k47wco49&max=${this.beautyList[this.beautyList.length-1]['pin_id']}&limit=${this.limit}&wfl=${this.wfl}`;
	            getRandomPicture.getPictureList(url).then(res => {
		    		this.pic_list.push(...res);
		    	})
	        },
	    },
	    created() {
	    	this.load()
	    }
	}
</script>

<style lang="scss" scoped>
.mine {
	
}
</style>