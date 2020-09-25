<template>
	<header class="header">
		<div class="search_group">
			<span class="iconfont icon-search"></span>
			<span class="search_input" @click="toSearch"></span>
			<v-menu transition="slide-y-transition" bottom offset-y>
				<template v-slot:activator="{ on, attrs }">
					<span
						class="iconfont icon-add1"
						v-bind="attrs"
						v-on="on"
					></span>
				</template>
				<v-list>
					<v-list-item v-for="(item, i) in items" :key="i">
						<v-list-item-title @click="optionHandler(item)">{{
							item.title
						}}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</header>
</template>

<script>
export default {
	name: "header-search",
	data: () => ({
		items: [
			{
				title: "从本地导入",
				route: "/local",
			},
		],
	}),
	methods: {
        toSearch() {
			this.$router.push({
				path: "/search",
			});
        },
		optionHandler(item) {
			this.$router.push("/local");
		},
	},
};
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	// height: 60px;
    height: calc(2.5rem + 50px + 10px);
	box-sizing: border-box;
	padding: 2.5rem 20px 10px;
    background-color: white;
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
</style>