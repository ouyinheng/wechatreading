<template>
	<v-app class="lookat">
		<van-search v-model="keyWord" shape="round" background="#4fc08d" placeholder="请输入搜索关键词" />
        <section class="main_body">
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
        </section>
		<not-found class="not-found" v-if="list.length === 0 && !loading"></not-found>
		<loading v-if="loading"></loading>
	</v-app>
</template>

<script>
import notFound from "@/components/notFound.vue";
import App from "@/static/js/cordova";
import bookApi from "@/utils/book.js";
import disCoverApi from "@/utils/getDiscover.js";
import { mapActions, mapGetters } from "vuex";
import loading from "@/components/loading.vue";
export default {
	name: "lookat",
	components: {
		notFound,
		loading,
	},
	data() {
		return {
            keyWord: '',
            list: [{a: '1'}],
            loading: false,
        };
	},
    computed: {
		...mapGetters(["getRecomList"]),
	},
	methods: {
        ...mapActions(["getRecommList"]),
		// 显示状态
		statusShow() {
			statusbarTransparent.enable();
			// App.status.show()
		},

		// 隐藏状态栏
		statusHide() {
			App.status.hide();
		},
		reload() {
			window.location.reload();
		},
        toInfo(item) {
			this.$router.push({
				path: "/discoverInfo",
				query: {
					id: item.group_id,
				},
			});
		},
	},
	mounted() {
		// App.status.hide()
		App.initApp();
        if (this.getRecomList.length === 0) {
			this.loading = true;
			this.getRecommList().then((res) => {
				this.loading = false;
				console.log("s", this.getRecomList);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.lookat {
	// padding-top: 2.5rem;
    // box-sizing: border-box;
    .van-search {
        padding-top: 3rem;
    }
    .main_body {
        width: 100%;
        height: calc(100vh - 84px - 56px );
        overflow-y: auto;
        overflow-x: hidden;
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
	.not-found {
		width: 90vw;
		margin: 10rem auto 0;
	}
}
</style>