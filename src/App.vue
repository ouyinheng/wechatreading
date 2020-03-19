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
