<template>
	<v-app>
		<transition>
			<router-view/>
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