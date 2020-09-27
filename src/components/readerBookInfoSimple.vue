<template>
    <div class="recommend_preview_container">
        <div class="recommend_preview_body">
            <div title="大师兄是个凡人却很强" class="recommend_preview_item">
                <a
                    href="/web/reader/4af327d071ce93a84af1f2f"
                    class="recommend_preview_item_link"
                ></a>
                <div class="recommend_preview_item_container">
                    <div class="wr_bookCover recommend_preview_cover">
                        <!----><!----><!----><img
                            src="https://wfqqreader-1252317822.image.myqcloud.com/cover/432/30315432/t6_30315432.jpg"
                            alt="书籍封面"
                            class="wr_bookCover_img"
                        />
                        <div class="wr_bookCover_border"></div>
                        <span
                            class="wr_bookCover_decor wr_bookCover_gradientDecor wr_bookCover_borderDecor"
                        ></span>
                    </div>
                    <div class="recommend_preview_info">
                        <p class="recommend_preview_title">大师兄是个凡人却很强</p>
                        <p class="recommend_preview_author">
                            <a
                                href="/web/search/books?author=%E7%B2%BE%E5%88%86%E5%A4%A7%E8%8A%92%E6%9E%9C"
                                >精分大芒果</a
                            >
                        </p>
                        <p class="recommend_preview_desc">
                            阅读《人间最得意》的人也在读
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
.recommend_preview_container {
    padding-top: 12px;
    padding-bottom: 28px;
    margin-bottom: 0;
    background-color: #17181a;
    padding: 0 20px;
}
.recommend_preview_body {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
}
.recommend_preview_item {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    margin-top: 0!important;
    padding: 10px 0;
    background-color: transparent;
    border-radius: 0;
    .recommend_preview_item_link {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        -webkit-tap-highlight-color: transparent!important;
        user-select: none;
        color: #4a7ab0;
        text-decoration: none;
    }
    .recommend_preview_item_container {
        padding: 0;
        overflow: hidden;
        box-sizing: content-box;
        text-align: center;
        .wr_bookCover {
            display: block;
            box-shadow: 0 2px 16px rgba(0,0,0,.08);
            background: #d8d8d8;
            position: relative;
            img {
                vertical-align: top;
                width: 100%;
                height: 100%;
                background-color: #d8d8d8;
                object-fit: cover;
                border: 0;
            }
            .wr_bookCover_decor.wr_bookCover_gradientDecor {
                background-image: -webkit-gradient(linear,left top,right top,from(hsla(0,0%,63.1%,.25)),color-stop(1%,rgba(21,21,20,.1)),color-stop(4%,hsla(0,0%,100%,.15)),color-stop(8%,hsla(0,0%,58%,.1)),color-stop(57%,hsla(0,0%,89%,0)),color-stop(91%,rgba(223,218,218,.03)),color-stop(98%,rgba(223,218,218,.05)),to(hsla(0,0%,100%,.1)));
                background-image: linear-gradient(90deg,hsla(0,0%,63.1%,.25),rgba(21,21,20,.1) 1%,hsla(0,0%,100%,.15) 4%,hsla(0,0%,58%,.1) 8%,hsla(0,0%,89%,0) 57%,rgba(223,218,218,.03) 91%,rgba(223,218,218,.05) 98%,hsla(0,0%,100%,.1));
                box-shadow: inset 0 0 0 0 rgba(0,0,0,.1);
            }
            .wr_bookCover_decor {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
        }
        .recommend_preview_cover {
            float: left;
            margin: 0 14px 0 0;
            width: 56px!important;
            height: 81px!important;
        }
        .recommend_preview_info {
            text-align: left;
            .recommend_preview_title {
                margin-top: 6px;
                font-size: 15px;
                font-family: PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif;
                font-weight: 700;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
                word-wrap: normal;
                color: #eef0f4;
            }
            .recommend_preview_author {
                margin-top: 5px;
                font-size: 12px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
                word-wrap: normal;
                color: #8a8c90;
                a {
                    position: relative;
                    z-index: 2;
                    color: #8a8c90;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0,0,0,.03);
                }
            }
            .recommend_preview_desc {
                padding: 0;
                margin-top: 5px;
                font-size: 11px;
                line-height: 21px;
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                line-clamp: 1;
                box-orient: vertical;
                height: auto;
                max-height: 21px;
                font-family: DIN-Regular,PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif;
                color: #8a8c90;
            }
        }
    }
}
</style>