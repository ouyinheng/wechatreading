<template>
  <div class="discover">
    <!-- <swiper :options="swiperOption" ref="mySwiper" class="mySwiper" @someSwiperEvent="callback">
            <swiper-slide class="swiper-slide" v-for="(item, index) in recommend" :key="index">
                <v-card :loading="loading" class="mx-auto my-12 py-12 v-card" @click.stop="toBookInfo(item)">
                    <v-img :src="item.cover" class="v-img" height="150" width="100"></v-img>
                    <h3 class="title font-xl mt-8">{{item.name}}</h3>
                    <div class="grey--text font-md">
                        {{item.author}}
                    </div>
                </v-card>
            </swiper-slide>
    </swiper>-->
    <v-row dense>
      <v-col v-for="(item, index) in recomList" :key="index" cols="12">
        <v-card class="card_group" v-if="item.title" @click="toInfo(item)">
          <v-card-title class="headline title" v-text="item.title"></v-card-title>
          <div class="d-flex flex-no-wrap justify-space-between">
            <!-- <v-avatar class="ma-3" size="125" tile>
              <v-img class="img" :src="item.large_image_url"></v-img>
            </v-avatar> -->
			<img class="img" :src="item.large_image_url" alt="img">
            <div>
              <v-card-subtitle v-html="item.emphasized ? item.emphasized.summary : ''"></v-card-subtitle>
              <!-- <v-card-subtitle>{{item.emphasized ? item.emphasized.summary : ''}}</v-card-subtitle> -->
            </div>
          </div>
          <!-- <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="item.media_avatar_url"></v-img>
              </v-list-item-avatar>
              <v-list-item-title>{{item.media_name}}</v-list-item-title>
              <v-row align="center" justify="end">
                <span class="subheading mr-2">{{item.publish_time}}</span>
              </v-row>
            </v-list-item>
          </v-card-actions>-->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import bookApi from "@/utils/book.js";
import disCoverApi from "@/utils/getDiscover.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "discover",
  data() {
    return {
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
      },
      recommend: [],
      height: "300px",
      loading: false,
      selection: 1,
      recomList: [],
    };
  },
  computed: {
    // swiper() {
    //   return this.$refs.mySwiper.swiper;
    // },
  },
  components: {
    swiper,
    swiperSlide,
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
	callback() {},
	toInfo(item) {
		this.$router.push({
			path: '/discoverInfo',
			query: {
				id: item.group_id
			}
		})
	},
    /**
     *	本周强推 weekspush
     *	排行榜 	rankwraplist
     */
    getHomePage() {
      this.axios.get(`/qd`).then((res) => {
        let div = document.createElement("div");
        div.innerHTML = res.data;
        let list = div.querySelectorAll(".index-two-wrap .book-list ul li");
        let weekspush = [];
        Array.from(list).forEach((div) => {
          let item = document.createElement("div");
          item.appendChild(div);
          weekspush.push({
            channel: item.querySelector(".channel").innerText,
            name: item.querySelector(".name").innerText,
            author: item.querySelector(".author")
              ? item.querySelector(".author").innerText
              : item.querySelector(".rec").innerText,
          });
        });
        weekspush = weekspush.filter((item) => item.author !== "广告");
        // console.log(weekspush)
        let rankwraplist = div.querySelectorAll(
          ".rank-wrap .rank-list.sort-list"
        );
        let rankwrap = [];
        Array.from(rankwraplist).forEach((div) => {
          let item = document.createElement("div");
          item.appendChild(div);
          let list = [];
          let tag = item.querySelector(".wrap-title").innerText.substr();
          tag = tag.substr(0, tag.length - 3);
          let list_group = item.querySelectorAll(".book-list ul li");
          list_group.forEach((ele) => {
            if (ele.querySelector(".name-box .name")) {
              list.push({
                name: ele.querySelector(".num-box").innerText,
                rank: ele.querySelector(".name-box .name").innerText,
              });
            }
          });
          rankwrap.push({ tag, list });
          if (item.querySelector(".author a")) {
            this.recommend.push({
              channel: item.querySelector(".author a").innerText,
              name: item.querySelector(".book-info a").innerText,
              link: item.querySelector(".book-info a").getAttribute("href"),
              tag: item.querySelector(".digital").innerText,
              author: item.querySelector(".author .writer").innerText,
              cover: item
                .querySelector(".book-cover .link img")
                .getAttribute("src"),
            });
          }
        });
        // this.recommend = rankwrap
        console.log(this.recommend);
      });
    },
    toBookInfo(item) {
      this.$router.push({
        name: "bookinfo",
        params: {
          item,
        },
      });
    },
  },
  created() {
    // this.axios.get('/api/search.php?q=诡秘之主').then(res => {
    //     console.log(parseSearch.parseHtml(res.data))
    // })
    // this.getHomePage()
    disCoverApi.getRecommend().then((res) => {
      console.log(res);
      this.recomList = res.data.data;
    });
  },
  mounted() {
    // this.swiper.slideTo(0, 1000, false);
  },
};
</script>

<style lang="scss">
.discover {
  width: 100%;
  height: 100%;
  position: relative;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-around;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  padding-top: 2.5rem;
  padding-left: 10px;
  padding-right: 10px;
  .swiper-slide {
    width: 100vw;
    .v-card {
      width: 90vw;
      border-radius: 10px;
      height: calc(100vh - 100px);
      margin: 0 auto;
      text-align: center;
      box-sizing: border-box;
      .title {
        text-align: center;
        margin: 0 auto;
        font-weight: bold;
      }
      .v-img {
        margin: 0 auto;
        border-radius: 0;
      }
    }
  }
  .v-card__title {
    font-size: 1.2rem !important;
    line-height: 1.3rem !important;
  }
  .v-card__subtitle,
  .v-card__text,
  .v-card__title {
    padding: 0 !important;
  }
  .card_group {
    padding: 10px;
    box-shadow: none;
    border-radius: 1rem;
    .img {
      width: 6rem;
	  min-width: 6rem;
	  height: 7rem;
	  min-height: 7rem;
	  margin: 0 10px 0 0;
      object-fit: cover;
    }
    .title {
      margin-bottom: 10px;
    }
  }
}
</style>