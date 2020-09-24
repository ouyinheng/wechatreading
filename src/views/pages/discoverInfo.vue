<template>
	<div class="discover_info">
		<!-- <header class="article__header">
			<h1 class="article_title">{{info.title}}</h1>
		</header>
		<section>
			<p v-html="info.content"></p>
		</section>-->
		<v-app-bar style absolute color="white" elevate-on-scroll scroll-target="#scrolling-techniques-7">
			<!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
			<span @click="back" class="iconfont icon-right"></span>

			<!-- <v-toolbar-title>Title</v-toolbar-title> -->
			<v-spacer></v-spacer>
			<!-- <v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-heart</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn>-->
		</v-app-bar>
		<v-sheet id="scrolling-techniques-7" class="overflow-y-auto pt-3">
			<v-container>
				<h1 class="article_title">{{info.title}}</h1>
				<p class="container" v-html="info.content"></p>
			</v-container>
		</v-sheet>
	</div>
</template>

<script>
export default {
	name: "info",
	data() {
		return {
			id: "",
			info: {
				content: "",
			},
		};
	},
	methods: {
		getInfo() {
			this.axios
				.get(
					`/sapit/${this.id}/info/v2/?_signature=_02B4Z6wo00f01rbbj-gAAIBBr4Vp3V8sLGa2yotAAPLjcd`
				)
				.then((res) => {
					console.log(res);
					this.info = res.data;
				});
		},
		back() {
			this.$router.back();
		},
	},
	created() {
		this.id = "i" + this.$route.query.id;
		this.getInfo();
		// https://m.toutiao.com/i6840840206191428109/info/v2/?_signature=_02B4Z6wo00f01rbbj-gAAIBBr4Vp3V8sLGa2yotAAPLjcd
	},
};
</script>

<style lang="scss">
.discover_info {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-color: white;
	// padding: 1rem;
	padding-top: 3rem;
	.pt-3 {
		padding-top: 3rem !important;
		padding-bottom: 3rem !important;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		.container h1 {
			font-size: 1.2rem;
		}
		.article_title {
			line-height: 2rem;
			font-weight: 700;
			color: #222;
			font-size: 1.8rem;
			margin-bottom: 1rem;
		}
		p {
			margin-top: 18px;
			margin-bottom: 18px;
		}

		.pgc-img {
			margin: 18px 0;
		}
		img {
			max-width: 100%;
			display: block;
			margin: 0 auto;
		}
	}
	header {
		padding-top: 3rem;
		box-sizing: content-box;
	}
}
</style>