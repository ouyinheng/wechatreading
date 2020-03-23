<template>
	<v-app>
        <transition name="page-transfer" mode="out-in">
			<router-view class="router_view"/>
		</transition>
	</v-app>
</template>

<script>
export default {
	name: 'App',
	components: {
	},

	data: () => ({
		//
	}),
};
</script>

<style lang="scss" scoped>
#app {
	background-color: #EBECEE;
}
</style>