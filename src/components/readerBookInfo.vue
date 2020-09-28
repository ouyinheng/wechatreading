<template>
	<div class="readerBookInfo">
		<div class="readerBookInfo_head">
			<div class="wr_bookCover bookInfo_cover">
				<img :src="info.cover" alt="书籍封面" class="wr_bookCover_img" />
				<div class="wr_bookCover_border"></div>
				<span
					class="wr_bookCover_decor wr_bookCover_gradientDecor wr_bookCover_borderDecor"
				></span>
			</div>
			<div class="bookInfo_right">
				<h2 class="bookInfo_title">{{ info.title }}</h2>
				<div class="bookInfo_author_container">
					<a class="bookInfo_author link">{{ info.author }}</a>
				</div>
				<div class="bookInfo_intro hasMore">
					{{ info.intro }}
				</div>
				<div
					class="bookInfo_more bookInfo_more_3children"
					v-if="showMore"
				>
					<div class="bookInfo_more_rating">
						<div class="bookInfo_more_line1">
							<span class="bookInfo_more_line1_number">
                                {{ info.rate }}</span>
                            <span class="wr_rankBar wr_rankBar_Default wr_rankBar_8 bookInfo_score_rankBar"></span>
						</div>
						<div class="bookInfo_more_line2">
							{{ info.discuss }}人点评
						</div>
					</div>
					<div class="bookInfo_more_reading">
						<div class="bookInfo_more_line1">
							<span class="bookInfo_more_line1_number">
                                {{ info.readNumber }}</span>万人
						</div>
						<div class="bookInfo_more_line2">阅读此书</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "readerBookInfo",
	props: {
        info: {
            type: Object,
            default() {
                return {
                    cover: '',
                    title: '',
                    author: '',
                    intro: '',
                    rate: 0,
                    discuss: 0,
                    readNumber: 0,
                }
            }
        },
        showMore: {
			type: Boolean,
			default: true,
		},
		// cover: {
		// 	// 封面
		// 	type: String,
		// 	default: "",
		// },
		// title: {
		// 	type: String,
		// 	default: "",
		// },
		// author: {
		// 	type: String,
		// 	default: "",
		// },
		// intro: {
		// 	// 介绍
		// 	type: String,
		// 	default: "",
		// },
		// rate: {
		// 	// 评分
		// 	type: Number,
		// 	default: 0,
		// },
		// discuss: {
		// 	// 评论人数
		// 	type: Number,
		// 	default: 0,
		// },
		
		// readNumber: {
		// 	// 阅读人数
		// 	type: Number,
		// 	default: 0,
		// },
	},
	data: () => ({}),
	methods: {},
	created() {},
};
</script>

<style lang="scss" scoped>
.readerBookInfo {
	position: relative;
	border: 0;
	.readerBookInfo_head {
		display: flex;
		position: relative;
		padding-bottom: 80px;
		padding-top: 30px;
		.bookInfo_right {
			margin-left: 20px;
			-webkit-box-flex: 1;
			flex: auto;
			.bookInfo_title {
				color: #212832;
				font-size: 20px;
			}
			.bookInfo_author_container {
				margin-top: 9px;
				.bookInfo_author.link {
					color: #1b88ee;
				}
			}
			.bookInfo_intro {
				position: relative;
				color: #858c96;
				margin-top: 10px;
				font-size: 13px;
				height: 46px;
				line-height: 23px;
				cursor: pointer;
				text-align: justify;
				overflow: hidden;
				display: -webkit-box;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;
			}
			.bookInfo_more {
				position: absolute;
				width: 100%;
				left: 0;
				bottom: 0;
				margin-top: 20px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.bookInfo_more_reading,
				.bookInfo_more_rating {
					flex: 1;
					margin-right: 10px;
					cursor: pointer;
					.bookInfo_more_line1 {
						color: #5d646e;
						font-size: 11px;
					}
					.bookInfo_more_line2 {
						color: #858c96;
						margin-top: 8px;
						font-size: 11px;
						word-break: break-all;
						line-height: 13px;
						overflow: hidden;
						height: 13px;
						display: -webkit-box;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
	}
	.wr_bookCover {
		display: block;
		-webkit-box-flex: 0;
		flex: none;
		width: 108px;
        height: 155px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
		background: #d8d8d8;
		position: relative;
		img {
			vertical-align: top;
			width: 100%;
			height: 100%;
			background-color: #d8d8d8;
			-o-object-fit: cover;
			object-fit: cover;
		}
		.wr_bookCover_decor.wr_bookCover_gradientDecor {
			background: -webkit-gradient(
				linear,
				left top,
				right top,
				from(hsla(0, 0%, 63.1%, 0.25)),
				color-stop(1%, rgba(21, 21, 20, 0.1)),
				color-stop(4%, hsla(0, 0%, 100%, 0.15)),
				color-stop(8%, hsla(0, 0%, 58%, 0.1)),
				color-stop(57%, hsla(0, 0%, 89%, 0)),
				color-stop(91%, rgba(223, 218, 218, 0.03)),
				color-stop(98%, rgba(223, 218, 218, 0.05)),
				to(hsla(0, 0%, 100%, 0.1))
			);
			background-image: linear-gradient(
				90deg,
				hsla(0, 0%, 63.1%, 0.25),
				rgba(21, 21, 20, 0.1) 1%,
				hsla(0, 0%, 100%, 0.15) 4%,
				hsla(0, 0%, 58%, 0.1) 8%,
				hsla(0, 0%, 89%, 0) 57%,
				rgba(223, 218, 218, 0.03) 91%,
				rgba(223, 218, 218, 0.05) 98%,
				hsla(0, 0%, 100%, 0.1)
			);
			box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.1);
		}
	}
	.bookInfo_right {
		-webkit-box-flex: 1;
		flex: auto;
		margin-left: 40px;
	}
}
@media (max-width: 767px) {
	.readerBookInfo {
		margin-left: 24px;
		margin-right: 24px;
		margin-bottom: 24px;
		padding-bottom: 28px;
	}
}
@media (max-width: 1023px) {
	.bookInfo_right {
		margin-left: 20px;
	}
}
@media (max-width: 1023px) {
	.readerBookInfo_head .bookInfo_cover {
		width: 108px;
		height: 155px;
	}
}
</style>