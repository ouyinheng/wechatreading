<template>
	<v-app class="bookrack">
		<header class="header">
			<div class="search_group">
				<span class="iconfont icon-search"></span>
				<span class="search_input" @click="toSearch"></span>
				<v-menu transition="slide-y-transition" bottom offset-y>
					<template v-slot:activator="{ on, attrs }">
						<!-- <v-btn class="purple" color="primary" dark v-bind="attrs" v-on="on"> -->
						<span class="iconfont icon-add1" v-bind="attrs" v-on="on"></span>
						<!-- </v-btn> -->
					</template>
					<v-list>
						<v-list-item v-for="(item, i) in items" :key="i">
							<v-list-item-title @click="optionHandler(item)">{{ item.title }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
		</header>
		<section class="container">
			<div class="book_card" v-for="(item, index) in bookList" :key="index" @click="toDetails(item)">
				<div style="display:flex;flex-direction:column;align-items:center;">
					<img class="bookImg" :src="item.cover" alt />
                    <span class="font-md mt-2">{{item.bookName}}</span>
				</div>
			</div>
		</section>
	</v-app>
</template>

<script>
import parseSearch from "@/utils/search.js";
import dbOption from "@/utils/db/bookrack.js";
export default {
	name: "bookrack",
	data() {
		return {
			bookList: [],
			items: [
				{
					title: "从本地导入",
					route: "/local",
				},
			],
		};
	},
	methods: {
		toSearch() {
			this.$router.push({
				path: "/search",
			});
		},
		toDetails(item) {
			console.log(item);
			this.$router.push({
				path: "/bookDetails",
				query: {
					link: encodeURIComponent(item.link),
				},
			});
		},
		optionHandler(item) {
			this.$router.push("/local");
		},
	},
	created() {
		dbOption.queryBook((res) => {
			this.bookList = res;
		});
		// this.axios.get(`/api/search.php?q=123`).then(res => {
		//     console.log(parseSearch.parseHtml(res.data))
		// })
	},
};
</script>

<style lang="scss" scoped>
.bookrack {
	padding-top: 2.5rem;
	.header {
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding: 10px 20px;
		.search_group {
			background-color: rgba(241, 242, 244, 1);
			border-radius: 20px;
			height: 2.5rem;
			padding: 5px;
			line-height: 2.8rem;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.search_input {
				display: inline-block;
				height: 80%;
				width: 70%;
				border-right: 1px solid gainsboro;
			}
		}
	}
	.container {
		display: flex;
		flex-wrap: wrap;
		.book_card {
			width: 33.3%;
            margin-bottom: 10px;
			// margin: 0 1rem;
			//   margin-right: 1rem;
		}
		.bookImg {
			width: 5.8rem;
			min-width: 4.125rem;
			height: 8.5rem;
			object-fit: fill;
			font-size: 0;
			margin-right: 0.5rem;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
			margin: 0 auto;
		}
	}
}
</style>