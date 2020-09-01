/* eslint-disable */
import base from './base'

var status = {
    /**
     * 设置状态栏
     * @param {json} options 选项参数
     * @param {string} options.bgColor 背景色
     * @param {string} options.isLight 是否浅色背景(浅色背景则文字为黑色，深色背景则文字为白色)
     */
    set (options) {
        let { bgColor, isLight } = options || {}

        StatusBar.overlaysWebView(false)

        if (!bgColor) {
            bgColor = base.statusBarStyle.bgColor
            isLight = false
        }

        if (isLight) {
            StatusBar.styleDefault()
            base.statusBarStyle.fgColor = '#000000'
        } else {
            StatusBar.styleLightContent()
            base.statusBarStyle.fgColor = '#ffffff'
        }

        if (!bgColor.startsWith('#')) {
            bgColor = '#' + bgColor
        }
        StatusBar.backgroundColorByHexString(bgColor)
        base.statusBarStyle.bgColor = bgColor
    },

    /**
     * 显示状态栏
     */
    show () {
        if (!StatusBar.isVisible) {
            StatusBar.show()
        }
    },

    /**
     * 隐藏状态栏
     */
    hide () {
        if (StatusBar.isVisible) {
            StatusBar.hide()
        }
    }
}

export default status