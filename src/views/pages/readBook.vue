<template>
	<div class="readBook">
		<div class="top" :class="{
			leaveTop: leave
		}">
			<v-toolbar>
				<span @click="back" class="iconfont icon-right"></span>
				<span class="iconfont icon-add ml-6" @click="addBookrack">
					<i class="ml-2" v-if="showAdd">加入书架</i>
				</span>
				<!-- <v-toolbar-title @click="back">Title</v-toolbar-title> -->
				<v-spacer></v-spacer>
				<v-btn icon>
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</v-toolbar>
		</div>
		<section @click="setLeave">
			<div class="mb-2">
				<h3>{{nowCharpter.CharpterName}}</h3>
			</div>
			<div class="book_content" v-html="content"></div>
		</section>

		<div class="bottom" :class="{
			leaveBottom: leave
		}">
			<v-toolbar>
				<div class="v_toolbar_bottom">
					<!-- <span class="iconfont icon-caidan"></span> -->
					<v-dialog
						v-model="dialog"
						class="test"
						fullscreen
						transition="dialog-bottom-transition"
					>
						<template v-slot:activator="{ on, attrs }">
							<span class="iconfont icon-caidan" v-bind="attrs" v-on="on"></span>
						</template>
						<div class="chapter_group">
							<v-list dense>
								<v-subheader>{{title}}</v-subheader>
								<v-list-item-group v-model="select" color="primary">
									<v-list-item v-for="(item, i) in charpterList" :key="i">
										<v-list-item-content>
											<v-list-item-title v-text="item.CharpterName" @click="getChapterContent(item)"></v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</v-list-item-group>
							</v-list>
						</div>
					</v-dialog>
					<span class="iconfont icon-faxian"></span>
					<span class="iconfont icon-jindu"></span>
					<span class="iconfont icon-taiyang"></span>
					<span class="iconfont icon-A"></span>
				</div>
			</v-toolbar>
		</div>
	</div>
</template>

<script>
import jiutao from "@/utils/jiutao.js";
export default {
	name: "readBook",
	data() {
		return {
            link: "",
            select: 0,
			charpterList: [],
			content: "",
			nowCharpter: {
				CharpterName: "",
				link: "",
			},
			leave: true,
			showAdd: true,
            dialog: false,
            title: ''
		};
	},
	methods: {
		setLeave() {
			this.leave = !this.leave;
		},
		getCharpterList() {
			jiutao.getCharpter(this.link).then((res) => {
				console.log(res);
				this.charpterList = res;
				this.getChapterContent(this.charpterList[0]);
			});
		},
		getChapterContent(info) {
            this.leave = true;
            this.dialog = false;
			this.nowCharpter = info;
			jiutao.getContent(info.link).then((res) => {
				this.content = res;
			});
		},
		back() {
			this.$router.back();
		},
		addBookrack() {
			if (this.showAdd) {
				this.showAdd = false;
				dbOption.insertBook(this.params);
			} else {
				this.dialog = true;
			}
		},
	},
	created() {
		this.link = decodeURIComponent(this.$route.query.link);
		this.title = this.$route.query.title;
		this.getCharpterList();
	},
};
</script>

<style lang="scss">
.v-dialog__content {
	// background: rgba(0, 0, 0, 0.3);
}
.v-dialog--fullscreen {
	background: white !important;
	border-radius: 30px 30px 0px 0px;
	// height: 90%;
	top: 10vh;
	bottom: 2rem;
    overflow: hidden;
    .v-list-item-group {
        height: 80vh;
        overflow: auto;
    }
    .v-subheader {
        font-size: 1.4rem;
        font-weight: bold;
    }
}
.chapter_group {
	padding: 1rem;
    // box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.readBook {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: white;
	box-sizing: border-box;
	padding: 10px;
	padding-top: 3rem;
	// .mb-2 {
	//     margin-bottom: 10px;
	// }
	section {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
        h3 {
            padding: 10px 0;
            font-size: 1.5rem;
        }
		.book_content {
			box-sizing: border-box;
			p {
				padding: 5px 10px !important;
			}
		}
	}
	.top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50;
        padding-top: 2.5rem;
		background-color: white;
		transition: all 0.3s;
		z-index: 11;
        // transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) transform, 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color, 0.2s cubic-bezier(0.4, 0, 0.2, 1) left, 0.2s cubic-bezier(0.4, 0, 0.2, 1) right, 280ms cubic-bezier(0.4, 0, 0.2, 1) box-shadow, 0.25s cubic-bezier(0.4, 0, 0.2, 1) max-width, 0.25s cubic-bezier(0.4, 0, 0.2, 1) width, 0.2s cubic-bezier(0.4, 0, 0.2, 1) -webkit-transform, 280ms cubic-bezier(0.4, 0, 0.2, 1) -webkit-box-shadow;
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
        .v-toolbar {
            box-shadow: none !important;
        }
	}
	.bottom {
		position: absolute;
		bottom: 0px;
		left: 0;
		right: 0;
		height: 50px;
		background-color: pink;
		transition: all 0.3s;
		z-index: 11;
		.v_toolbar_bottom {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			span {
				font-size: 1.2rem;
			}
		}
	}
	.leaveTop {
		top: -100px;
	}
	.leaveBottom {
		bottom: -100px;
	}
}
</style>