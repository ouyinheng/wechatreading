<template>
	<div class="load_group">
		<img class="img" :src="loadSvg" alt="loading" />
	</div>
</template>

<script>
import loadSvg from "@/static/svg/load.svg";
export default {
	name: "notFound",
	data() {
		return {
			loadSvg: loadSvg,
		};
	},
	methods: {},
	created() {},
};
</script>

<style lang="scss" scoped>
.load_group {
    position: absolute;
	display: flex;
	justify-content: space-around;
	align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
	.img {
		width: 120px;
	}
}
</style>