<template>
	<div class="bookinfo">
		<div class='top' :class="{
			leaveTop: leave
		}">
		<v-toolbar>
            <v-btn class="hidden-xs-only iconfont icon-faxian">
                <!-- <v-icon>mdi-arrow-left</v-icon> -->
                <span class="iconfont icon-faxian"></span>
            </v-btn>
            <v-toolbar-title @click="back">Title</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="hidden-xs-only">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
       </v-toolbar>
	</div>
		<div class="bottom" :class="{
			leaveBottom: leave
		}">
			<v-toolbar>
	            <v-btn icon class="hidden-xs-only">
	                <!-- <v-icon>mdi-arrow-left</v-icon> -->
	                <span class="iconfont icon-down"></span>
	            </v-btn>
	            <v-toolbar-title>Title</v-toolbar-title>
	            <v-spacer></v-spacer>
	            <v-btn icon class="hidden-xs-only">
	              <v-icon>mdi-magnify</v-icon>
	            </v-btn>
	       </v-toolbar>
		</div>
		<v-card :loading="loading" class="mx-auto my-4 v-cards" @click="setLeave">
		    <v-img width="100" height="150" :src="info.cover"></v-img>
    		<v-card-title>{{info.name}}</v-card-title>
		    <v-card-text>
		      	<!-- <v-row align="center" class="mx-0">
			        <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>
			        <div class="grey--text ml-4">4.5 (413)</div>
		      	</v-row> -->
		      	<div class="my-4 subtitle-1">
		        	{{info.author}}
		      	</div>
		      <div>{{info.desc}}</div>
		    </v-card-text>
		    <v-divider class="mx-4"></v-divider>
		    <v-card-title>标签</v-card-title>
		    <v-card-text>
		      	<v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
			        <v-chip v-for="(item, index) in info.author_tag" :key="index">{{item}}</v-chip>
			    </v-chip-group>
		    </v-card-text>
		    <v-card-actions>
			      <v-btn color="deep-purple lighten-2" text @click="reserve">
			        	Reserve
			      </v-btn>
		    </v-card-actions>
		</v-card>
	</div>
</template>

<script>
	import parseSearch from '@/utils/search.js'
	import origin from '@/utils/book.js'
	export default {
		name: 'bookinfo',
		data: () => ({
			loading: true,
	      	selection: 0,
	      	leave: true,
	      	info: {
	      		
	      	}
		}),

	    methods: {
	      	reserve () {
	        	this.loading = true
	        	setTimeout(() => (this.loading = false), 2000)
	      	},
	      	setLeave() {
	      		this.leave = !this.leave
	      	},
	      	back() {
	      		this.$router.back()
	      	}
	    },
		created() {
			let info = this.$route.params.item
			origin.getOriginSearch(info.link).then(res => {
				this.loading = false;
				let qd_info = res 
				this.info = {
					cover: info.cover,
					name: info.name,
					channel: info.channel,
					tag: qd_info.tag,
					author: info.author,
					desc: qd_info.intro,
					link: info.link,
					author_tag: [info.tag, ...qd_info.author_tag, ...qd_info.tag]
				}
			})
			
		}
	}
</script>

<style lang="scss" scoped>
	.bookinfo {
		position: relative;
		.top {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 50px;
			background-color: pink;
			transition: all .3s;
			z-index: 11;
		}
		.bottom {
			position: absolute;
			bottom: -10px;
			left: 0;
			right: 0;
			height: 50px;
			background-color: pink;
			transition: all .3s;
			z-index: 11;
		}
		.leaveTop {
			top: -100px;
		}
		.leaveBottom {
			bottom: -100px;
		}
		.v-cards {
			width: 95vw;
			height: 95vh;
			padding: 40px 0 0 0;
			box-sizing: border-box;
			box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2), 
						0px 0px 2px 0px rgba(0, 0, 0, 0.14), 
						0px 0px 1px 0px rgba(0, 0, 0, 0.12)!important;
		}
		.v-image {
			margin: 0 auto;
			.v-image__image.v-image__image--cover {
				transform: scale(100)
			}
		}
	}
</style>