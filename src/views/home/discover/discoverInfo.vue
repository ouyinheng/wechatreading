<template>
    <div class="discover_info">
        <v-app-bar style absolute color="white" elevate-on-scroll scroll-target="#scrolling-techniques-7">
			<span @click="back" class="iconfont icon-right"></span>
			<v-spacer></v-spacer>
		</v-app-bar>
		<v-sheet id="scrolling-techniques-7" class="overflow-y-auto pt-3">
			<!-- <v-container> -->
                <reader-book-info :info='readerBookInfo'></reader-book-info>
			<!-- </v-container> -->
		</v-sheet>
    </div>
</template>

<script>
import readerBookInfo from '@/components/readerBookInfo'
import bookFunc from '@/utils/book'
export default {
    name: 'info',
    data: () => ({
        link: '',
        readerBookInfo: {
        }
    }),
    components: {
        readerBookInfo
    },
    methods: {
        back() {
			this.$router.back();
        },
        getInfo(link) {
            bookFunc.getBookInfo(link).then(res => {
                console.log('readerBookInfo', res);
                this.readerBookInfo = res;
            })
        }
    },
    created() {
        this.link = this.$route.query.link;
        this.getInfo(this.link)
    }
}
</script>

<style lang="scss" scoped>
.discover_info {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-color: white;
	// padding: 1rem;
	padding-top: 3rem;
}
</style>