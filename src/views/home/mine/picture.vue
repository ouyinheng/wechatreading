<template>
  	<v-card class="mx-auto picture">
	    <v-toolbar color="indigo" dark :absolute="true" class="picture_toolbar">
	      	<v-btn icon @click="back">
              	<v-icon>mdi-arrow-left</v-icon>
            </v-btn>
	      	<v-toolbar-title>Discover</v-toolbar-title>
	      	<v-spacer></v-spacer>
	      	<v-btn icon>
	        	<v-icon>mdi-magnify</v-icon>
	      	</v-btn>
	    </v-toolbar>
	    <v-container fluid class="picture-container" v-if="!error">
			<md-scroll-view ref="scrollView" :scrolling-x="false" @end-reached="$_onEndReached">
				<v-row dense>
					<v-col v-for="(item, index) in pic_list" :key="index" :cols="item.col" @click="showPic(item)">
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
				<md-scroll-view-more slot="more" :is-finished="isFinished"></md-scroll-view-more>
			</md-scroll-view>
	    </v-container>
		<md-image-viewer
			v-model="isViewerShow"
			:list="previewList"
			:has-dots="true"
			:initial-index="viewerIndex">
		</md-image-viewer>
		<!-- <md-result-page
			v-if="error"
			type="network"
			subtext="点击屏幕，重新加载">
		</md-result-page> -->
	 </v-card>
</template>

<script>
	import getRandomPicture from '@/utils/getRandomPicture'
	export default {
	    name: 'mine',
	    data: () => ({
        	picUrl: '',
        	pic_list: [],
			cards: [],
			previewList: [],
			viewerIndex: 0,
			isViewerShow: false,
			isFinished: false,
			limit: 20,
			wfl: 1,
			error: false
	    }),
	    methods: {
	    	back() {
	    		this.$router.back()
	    	},
	    	load() {
		    	getRandomPicture.getPictureList('/huaban/favorite/beauty').then(res => {
                    console.log(res)
		    		res.forEach(item => {
		    			if(item.file.width%5===0) {
		    				item.col = 6;
		    			} else {
		    				item.col = 6;
		    			}
                    })
		    		this.pic_list = res;
		    	}).catch(err => {
					this.error = true;
				})
	    	},
	    	loadmore() {
	            if(this.pic_list.length == 0) {
	                return;
				}
	            const url = `/huaban/favorite/beauty?k84h06q1&max=${this.pic_list[this.pic_list.length-1]['pin_id']}&limit=${this.limit}&wfl=${this.wfl}`;
	            getRandomPicture.getPictureList(url).then(res => {
					res.forEach(item => {
		    			if(item.file.width%5===0) {
		    				item.col = 6;
		    			} else {
		    				item.col = 6;
		    			}
		    		})
		    		this.pic_list.push(...res);
		    	}).catch(err => {
					this.error = true;
				})	
			},
			showPic(row) {
				getRandomPicture.getPictureDetails(row.pin_id).then(res => {
					this.previewList = res.pin.board.pins ? res.pin.board.pins.map(item => 'http://hbimg.huabanimg.com/'+item.file.key) : []
					this.isViewerShow = true
				})
			},
			$_onEndReached() {
				if (this.isFinished) {
					return
				}
				// async data
				setTimeout(() => {
					this.loadmore()
					this.$refs.scrollView.finishLoadMore()
				}, 1000)
			},
	    },
	    created() {
	    	this.load()
	    }
	}
</script>

<style lang="scss" scoped>
.picture {
	position: relative;
	.picture_toolbar {
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
	}
	.picture-container {
		width: 100vw;
		height: calc(100vh - 50px);
		overflow-x: hidden;
		overflow-y: auto;
		margin-top: 50px;
	}
}
</style>