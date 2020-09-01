/* eslint-disable */
import base from './base'
var appWebview

function optionStringtoJson (str) {
    let options = str.split(',')
    let result = {}

    for (let op of options) {
        result[op.split('=')[0]] = op.split('=')[1]
    }

    return result
}

function jsonToOptionString (json) {
    let result = ''

    for (let key in json) {
        result += `,${key}=${json[key]}`
    }

    if (result) {
        result = result.substr(1)
    }

    return result
}

var browser = {    
    /**
     * 在内置浏览器中打开网址
     * @param {json} options 选项参数
     * @param {string} options.url 网址
     * @param {string} options.feature 一个可选的字符串，生命了新窗口要现实的浏览器的特征
     * @param {string} options.jsCode 要注入的js代码
     * @param {string} options.jsCodeCallback 注入js代码的回调函数
     * @param {string} options.jsFile 要注入的js文件路径
     * @param {string} options.jsFileCallback 注入js文件的回调函数
     * @param {string} options.cssCode 要注入的css代码
     * @param {string} options.cssCodeCallback 注入css代码的回调函数
     * @param {string} options.cssFile 要注入的css文件路径
     * @param {string} options.cssFileCallback 注入css文件的回调函数
     * @param {function} options.start 开始加载窗口的回调函数
     * @param {function} options.finish 完成加载窗口的回调函数
     * @param {function} options.error 加载错误的回调函数
     * @param {function} options.exit 窗口关闭的回调函数
     * @param {function} options.message 接收消息的回调函数
     */
    open (options) {
        if (typeof(options) === 'string') {
            options = { url: options }
        }
        if (cordova && cordova.InAppBrowser) {
            let op = {
                closebuttoncaption: '返回',
                closebuttoncolor: base.statusBarStyle.fgColor,
                toolbarcolor: base.statusBarStyle.bgColor,
                hidenavigationbuttons: 'yes',
                hideurlbar: 'yes',
                usewkwebview: 'yes',
                toolbarposition: 'top'
            }
            if (device.platform === 'iOS') {
                op['location'] = 'no'
            }
            if (device.platform === 'Android') {
                op['lefttoright'] = 'yes'
            }
            if (options.feature) {
                let feature = optionStringtoJson(options.feature)
                Object.assign(op, feature)
                if (device.platform === 'Android' && feature['toolbar'] === 'no') {
                    op['location'] = 'no'
                }
            }
            op = jsonToOptionString(op)
            appWebview = cordova.InAppBrowser.open(options.url, '_blank', op)

            if (typeof(options.start) === 'function') {
                appWebview.addEventListener('loadstart', options.start)
            }
            if (options.jsCode || options.jsFile || options.cssCode || options.cssFile || typeof(options.finish) === 'function') {
                appWebview.addEventListener('loadstop', function (params) {
                    if (options.jsCode) {
                        appWebview.executeScript({ code: options.jsCode }, (params) => {
                            if (typeof(options.jsCodeCallback) === 'function') {
                                options.jsCodeCallback(params[0])
                            }
                        })
                    }
                    if (options.jsFile) {
                        appWebview.executeScript({ file: options.jsFile }, (params) => {
                            if (typeof(options.jsFileCallback) === 'function') {
                                options.jsFileCallback()
                            }
                        })
                    }
                    if (options.cssCode) {
                        appWebview.insertCSS({ code: options.cssCode }, (params) => {
                            if (typeof(options.cssCodeCallback) === 'function') {
                                options.cssCodeCallback()
                            }
                        })
                    }
                    if (options.cssFile) {
                        appWebview.insertCSS({ file: options.cssFile }, (params) => {
                            if (typeof(options.cssFileCallback) === 'function') {
                                options.cssFileCallback()
                            }
                        })
                    }
                    if (typeof(options.finish) === 'function') {
                        options.finish()
                    }
                })
            }
            if (typeof(options.error) === 'function') {
                appWebview.addEventListener('loaderror', (params) => {
                    options.error({ code: params.code, message: params.message })
                })
            }
            if (typeof(options.message) === 'function') {
                appWebview.addEventListener('message', (params) => {
                    options.message(params.data)
                })
            }
            if (typeof(options.exit) === 'function') {
                appWebview.addEventListener('exit', (params) => {
                    options.exit()
                })
            }
        } else {
            appWebview = window.open(options.url, '_blank', options.feature)
        }
        return appWebview
    },

    /**
     * 在系统浏览器中打开网址
     * @param {string} url 
     */
    openSystem (url) {
        if (cordova && cordova.InAppBrowser) {
            appWebview = cordova.InAppBrowser.open(url, '_system')
        } else {
            appWebview = window.open(url, '_system')
        }
        return appWebview
    },

    /**
     * 关闭窗口
     * @param {object} ref 窗口句柄，可选参数
     */
    close (ref) {
        appWebview = ref || appWebview
        appWebview && appWebview.close()
    },

    /**
     * 显示窗口
     * @param {object} ref 窗口句柄，可选参数
     */
    show (ref) {
        appWebview = ref || appWebview
        appWebview && appWebview.show()
    },

    /**
     * 隐藏窗口
     * @param {object} ref 窗口句柄，可选参数
     */
    hide (ref) {
        appWebview = ref || appWebview
        appWebview && appWebview.hide()
    }
}

export default browser