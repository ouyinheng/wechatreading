<template>
	<div class="bookinfo">
		<div class="top" :class="{
			leaveTop: leave
		}">
			<v-toolbar>
				<span @click="back" class="iconfont icon-right"></span>
				<span class="iconfont icon-add ml-6" @click="addBookrack">
					<i class="ml-2" v-if="showAdd">加入书架</i>
				</span>
				<!-- <v-toolbar-title @click="back">Title</v-toolbar-title> -->
				<v-spacer></v-spacer>
				<v-btn icon>
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</v-toolbar>
		</div>
		<div class="bottom" :class="{
			leaveBottom: leave
		}">
			<v-toolbar></v-toolbar>
		</div>
		<div :loading="loading" class="mx-auto my-4 v-cards card_group" @click="setLeave">
			<v-img width="100" height="150" :src="info.cover"></v-img>
			<v-card-title>{{info.name}}</v-card-title>
			<v-card-text>
				<!-- <v-row align="center" class="mx-0">
			        <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>
			        <div class="grey--text ml-4">4.5 (413)</div>
				</v-row>-->
				<div class="my-4 subtitle-1">{{info.author}}</div>
				<div class="book_desc">{{info.desc}}</div>
			</v-card-text>
			<v-divider class="mx-4"></v-divider>
			<v-card-title>标签</v-card-title>
			<v-card-text>
				<v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
					<v-chip v-for="(item, index) in info.author_tag" :key="index">{{item}}</v-chip>
				</v-chip-group>
			</v-card-text>
			<v-card-actions>
				<v-btn color="deep-purple lighten-2" text @click="reserve">Reserve</v-btn>
			</v-card-actions>
		</div>

		<v-dialog v-model="dialog" max-width="500px">
			<v-card>
				<v-list disabled>
					<v-list-item-group v-model="item" color="primary">
						<v-list-item v-for="(item, i) in items" :key="i" @click="dialog = false">
							<v-list-item-icon>
								<v-icon v-text="item.icon"></v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title v-text="item.title" :class="item.class"></v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-card>
		</v-dialog>
		<v-dialog v-model="desc_details" class="desc_details">
			<v-card>adf</v-card>
		</v-dialog>
	</div>
</template>

<script>
import parseSearch from "@/utils/search.js";
import origin from "@/utils/book.js";
import dbOption from "@/utils/db/bookrack.js";
export default {
	name: "bookinfo",
	data: () => ({
		loading: true,
		selection: 0,
		leave: true,
		showAdd: true,
		dialog: false,
		desc_details: false,
		item: "",
		items: [
			{
				title: "下载到本地",
				icon: "iconfont icon-xiazai",
				class: "",
			},
			{
				title: "移动到...",
				icon: "iconfont icon-bianji",
				class: "",
			},
			{
				title: "移除书架",
				icon: "iconfont icon-shanchu danger",
				class: "danger",
			},
		],
		info: {},
		params: {
			id: "",
			bookName: "",
			link: "",
			cover: "",
			newCharpter: "",
			author: "",
		},
	}),

	methods: {
		reserve() {
			// this.loading = true
			// setTimeout(() => (this.loading = false), 2000)
			this.$router.push({
				path: "/readBook",
				query: {
                    link: encodeURIComponent(this.info.link),
                    title: this.info.name
				},
			});
		},
		setLeave() {
			this.leave = !this.leave;
		},
		back() {
			this.$router.back();
		},
		addBookrack() {
			if (this.showAdd) {
				this.showAdd = false;
				dbOption.insertBook(this.params);
			} else {
				this.dialog = true;
			}
		},
		getBookInfo(link) {
			this.params.id = link.split(".")[0].split("/")[2];
			this.axios.get(`/jiutao/${link}`).then((res) => {
				this.loading = false;
				console.log(res);
				let div = document.createElement("div");
				div.innerHTML = res.data;
				let dom = div.querySelector(".layui-main .detail");
				let content = div.querySelector(".layui-main .content");
				this.info = {
					cover: dom
						.querySelector(".bookimg img")
						.getAttribute("src"),
					name: dom.querySelector("h1").innerText,
					channel: dom.querySelector("p").innerText,
					tag: [],
					author: dom.querySelector("p").innerText,
					desc: content.querySelector(".intro").innerText,
					link: dom.querySelector(".action a").getAttribute("href"),
					author_tag: [],
				};
				this.params.bookName = this.info.name;
				this.params.link = link;
				this.params.cover = this.info.cover;
				// this.params.newCharpter = this.info.newCharpter;
				this.params.author = this.info.author;
				console.log(this.params);
			});
		},
	},
	created() {
		let link = decodeURIComponent(this.$route.query.link);
		this.getBookInfo(link);
		// origin.getOriginSearch(info.link).then(res => {
		// 	this.loading = false;
		// 	let qd_info = res
		// 	this.info = {
		// 		cover: info.cover,
		// 		name: info.name,
		// 		channel: info.channel,
		// 		tag: qd_info.tag,
		// 		author: info.author,
		// 		desc: qd_info.intro,
		// 		link: info.link,
		// 		author_tag: [info.tag, ...qd_info.author_tag, ...qd_info.tag]
		// 	}
		// })
	},
};
</script>

<style lang="scss" scoped>
.bookinfo {
	position: relative;
	overflow: hidden;
	.card_group {
		background-color: white;
		border-radius: 5px;
		box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
			0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
	}
	.top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50px;
		background-color: pink;
		transition: all 0.3s;
		z-index: 11;
	}
	.bottom {
		position: absolute;
		bottom: 0px;
		left: 0;
		right: 0;
		height: 50px;
		background-color: pink;
		transition: all 0.3s;
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
			0px 0px 1px 0px rgba(0, 0, 0, 0.12) !important;
	}
	.book_desc {
		line-height: 1.1875rem;
		display: -webkit-box;
		height: 5rem;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		font-size: 0.875rem;
		overflow: hidden;
		margin: 0.375rem 0;
		color: #969ba3;
	}
	.v-image {
		margin: 0 auto;
		.v-image__image.v-image__image--cover {
			transform: scale(100);
		}
	}
}
.v-dialog {
	margin: 45px;
	.v-card {
		border-radius: 10px;
	}
	.v-list-item__icon {
		margin-right: 10px;
	}
	.danger {
		color: red !important;
	}
}
</style>