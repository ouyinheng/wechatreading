<template>
	<div class="discover">
		<header-search></header-search>
		<section class="main_body">
			<v-card
				class="mx-auto"
				style="margin: 10px 0"
				max-width="344"
				v-for="(item, index) in getDiscoverList"
				:key="index"
			>
				<div class="book_cover">
					<div class="wr_bookCover">
                        <v-img class="v_img" :src="item.cover" height="200px"></v-img>
                        <span class="wr_bookCover_decor wr_bookCover_gradientDecor wr_bookCover_borderDecor"></span>
                    </div>
				</div>
				<v-card-title> {{ item.title }} </v-card-title>
				<v-card-subtitle> {{ item.desc }} </v-card-subtitle>
				<v-card-actions>
					<!-- <v-btn text>Share</v-btn>
					<v-btn color="purple" text> Explore </v-btn> -->
					<v-spacer></v-spacer>
					<v-btn icon @click="show = !show">
						<v-icon>{{
							show ? "iconfont icon-top" : "iconfont icon-bottom"
						}}</v-icon>
					</v-btn>
				</v-card-actions>
				<v-expand-transition>
					<div v-show="show">
						<v-divider></v-divider>
						<v-card-text>
							I'm a thing. But, like most politicians, he promised
							more than he could deliver. You won't have time for
							sleeping, soldier, not with all the bed making
							you'll be doing. Then we'll go with that data file!
							Hey, you add a one and two zeros to that or we walk!
							You're going to do his laundry? I've got to find a
							way to escape.
						</v-card-text>
					</div>
				</v-expand-transition>
			</v-card>
		</section>
	</div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import loading from "@/components/loading.vue";
import headerSearch from "@/components/headerSearch.vue";
import { mapActions, mapGetters } from "vuex";
export default {
	name: "discover",
	data() {
		return {
			recommend: [],
			height: "300px",
			loading: false,
			selection: 1,
			loading: false,
			show: false,
		};
	},
	computed: {
		...mapGetters(["getDiscoverList"]),
	},
	components: {
		swiper,
		swiperSlide,
		loading,
		headerSearch,
	},
	methods: {
		...mapActions(["reqDiscoverList"]),
		reserve() {
			this.loading = true;
			setTimeout(() => (this.loading = false), 2000);
		},
		callback() {},
		/**
		 *	本周强推 weekspush
		 *	排行榜 	rankwraplist
		 */
		getHomePage() {
			this.axios.get(`/qd`).then((res) => {
				let div = document.createElement("div");
				div.innerHTML = res;
				let list = div.querySelectorAll(
					".index-two-wrap .book-list ul li"
				);
				let weekspush = [];
				Array.from(list).forEach((div) => {
					let item = document.createElement("div");
					item.appendChild(div);
					weekspush.push({
						channel: item.querySelector(".channel").innerText,
						name: item.querySelector(".name").innerText,
						author: item.querySelector(".author")
							? item.querySelector(".author").innerText
							: item.querySelector(".rec").innerText,
					});
				});
				weekspush = weekspush.filter((item) => item.author !== "广告");
				// console.log(weekspush)
				let rankwraplist = div.querySelectorAll(
					".rank-wrap .rank-list.sort-list"
				);
				let rankwrap = [];
				Array.from(rankwraplist).forEach((div) => {
					let item = document.createElement("div");
					item.appendChild(div);
					let list = [];
					let tag = item
						.querySelector(".wrap-title")
						.innerText.substr();
					tag = tag.substr(0, tag.length - 3);
					let list_group = item.querySelectorAll(".book-list ul li");
					list_group.forEach((ele) => {
						if (ele.querySelector(".name-box .name")) {
							list.push({
								name: ele.querySelector(".num-box").innerText,
								rank: ele.querySelector(".name-box .name")
									.innerText,
							});
						}
					});
					rankwrap.push({ tag, list });
					if (item.querySelector(".author a")) {
						this.recommend.push({
							channel: item.querySelector(".author a").innerText,
							name: item.querySelector(".book-info a").innerText,
							link: item
								.querySelector(".book-info a")
								.getAttribute("href"),
							tag: item.querySelector(".digital").innerText,
							author: item.querySelector(".author .writer")
								.innerText,
							cover: item
								.querySelector(".book-cover .link img")
								.getAttribute("src"),
						});
					}
				});
			});
		},
	},
	created() {
		if (this.getDiscoverList.length === 0) {
			this.reqDiscoverList().then(() => {
				console.log("asdf", this.getDiscoverList);
			});
		}
	},
	mounted() {},
};
</script>

<style lang="scss">
.discover {
	width: 100%;
	height: 100%;
	position: relative;
	overflow-x: hidden;
	overflow-y: hidden;
	position: relative;
	.main_body {
		height: calc(100vh - 2.5rem + 50px + 10px - 56px);
		box-sizing: border-box;
		padding-bottom: 150px;
		overflow-x: hidden;
		overflow-y: auto;
		.v-card {
			border-radius: 10px;
		}
		.book_cover {
			padding: 1rem 0;
			margin: 1.5rem 0;
			box-sizing: border-box;
            .wr_bookCover {
                display: block;
                width: 7rem;
                height: 10rem;
                box-shadow: 0 2px 16px rgba(0,0,0,.08);
                background: #d8d8d8;
                position: relative;
				margin: 1rem auto;
                .v_img {
                    width: 7rem;
                    height: 10rem;
                    max-height: 10rem;
                }
                .wr_bookCover_decor.wr_bookCover_gradientDecor {
                    background-image: linear-gradient(90deg,hsla(0,0%,63.1%,.25),rgba(21,21,20,.1) 1%,hsla(0,0%,100%,.15) 4%,hsla(0,0%,58%,.1) 8%,hsla(0,0%,89%,0) 57%,rgba(223,218,218,.03) 91%,rgba(223,218,218,.05) 98%,hsla(0,0%,100%,.1));
                }
            }
            .wr_bookCover_decor {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
		}
	}
}
</style>