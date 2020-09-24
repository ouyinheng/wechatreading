<template>
	<div class="discover">
		<v-row dense>
			<v-col v-for="(item, index) in getRecomList" :key="index" cols="12">
				<div class="app_card card_group" v-if="item.title" @click="toInfo(item)">
					<v-card-title class="headline title" v-text="item.title"></v-card-title>
					<div class="d-flex flex-no-wrap justify-space-between">
						<img class="img" :src="item.large_image_url" alt="img" />
						<div>
							<div class="v-card-subtitle" v-html="item.emphasized ? item.emphasized.summary : ''"></div>
						</div>
					</div>
				</div>
				<div class="bottom_gray" v-if="item.title"></div>
			</v-col>
		</v-row>
		<loading v-if="loading"></loading>
	</div>
</template>

<script>
import bookApi from "@/utils/book.js";
import disCoverApi from "@/utils/getDiscover.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapActions, mapGetters } from "vuex";
import loading from "@/components/loading.vue";
export default {
	name: "discover",
	data() {
		return {
			recommend: [],
			height: "300px",
			loading: false,
			selection: 1,
			loading: false,
		};
	},
	computed: {
		...mapGetters(["getRecomList"]),
	},
	components: {
		swiper,
		swiperSlide,
		loading,
	},
	methods: {
		...mapActions(["getRecommList"]),
		reserve() {
			this.loading = true;
			setTimeout(() => (this.loading = false), 2000);
		},
		callback() {},
		toInfo(item) {
			this.$router.push({
				path: "/discoverInfo",
				query: {
					id: item.group_id,
				},
			});
		},
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
				// this.recommend = rankwrap
				console.log(this.recommend);
			});
		},
		toBookInfo(item) {
			this.$router.push({
				name: "bookinfo",
				params: {
					item,
				},
			});
		},
	},
	created() {
		if (this.getRecomList.length === 0) {
			this.loading = true;
			this.getRecommList().then((res) => {
				this.loading = false;
				console.log("s", this.getRecomList);
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
	background-color: white;
	overflow-x: hidden;
	overflow-y: auto;
	position: relative;
	box-sizing: border-box;
	padding-top: 2.5rem;
	// padding-left: 10px;
	// padding-right: 10px;
	.app_card {
		width: 100%;
		background-color: white;
	}

	.v-card__title {
		font-size: 1.1rem !important;
		line-height: 1.3rem !important;
	}
	.v-card__subtitle,
	.v-card__text,
	.v-card__title {
		padding: 0 !important;
	}
	.bottom_gray {
		width: 100%;
		height: 5px;
		background-color: gainsboro;
	}
	.card_group {
		padding: 10px;
		box-shadow: none;
		.img {
			width: 7rem;
			min-width: 7rem;
			height: 5.5rem;
			min-height: 5.5rem;
			margin: 0 10px 0 0;
			object-fit: cover;
			border-radius: 5px;
		}
		.title {
			margin-bottom: 10px;
		}
		.v-card-subtitle {
			font-size: 0.9rem;
		}
	}
}
</style>