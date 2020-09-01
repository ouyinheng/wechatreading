/* eslint-disable */

var appIsReady = false
var docIsReady = false
var readyEventQueue = null
var statusBarStyle = { bgColor: '#35495e', fgColor: '#ffffff' }

// 页面加载状态改变事件
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        docIsReady = true
    }
}

// 设备就绪
document.addEventListener('deviceready', function () {
    appIsReady = true

    if (readyEventQueue) {
        readyEventQueue.forEach(function (fn) {
            fn()
        })
    }
}, false)

// 添加cordova设备就绪事件
function readyDevice (fn) {
    if (typeof (fn) === 'function') {
        if (appIsReady) {
            fn()
        } else {
            if (!readyEventQueue) {
                readyEventQueue = []
            }
            readyEventQueue.push(fn)
        }
    }
}

// 将页面的对话框转为App的原生对话框
var _windowAlert = window.alert
var _windowConfirm = window.confirm
var _windowPrompt = window.prompt

// 警告框
window.alert = function (msg, callback, title, buttonName) {
    if (isApp() && navigator.notification && navigator.notification.alert) {
        title = title || '[提示]'
        buttonName = buttonName || '确定'
        navigator.notification.alert(msg, callback, title, buttonName)
    } else {
        _windowAlert(msg)
    }
}

// 确认框
window.confirm = function (msg, callback, title, buttonNames) {
    if (isApp() && navigator.notification && navigator.notification.confirm) {
        title = title || '[确认]'
        buttonNames = buttonNames || ['确定', '取消']
        return navigator.notification.confirm(msg, callback, title, buttonNames)
    } else {
        return _windowConfirm(msg)
    }
}

// 输入框
window.prompt = function (msg, callback, title, buttonNames, defaultText) {
    if (isApp() && navigator.notification && navigator.notification.prompt) {
        title = title || '[输入]'
        buttonNames = buttonNames || ['确定', '取消']
        return navigator.notification.prompt(msg, callback, title, buttonNames, defaultText)
    } else {
        return _windowPrompt(msg, defaultText)
    }
}

// 蜂鸣（参数为次数）
window.beep = function (times) {
    if (isApp() && navigator.notification && navigator.notification.beep) {
        navigator.notification.beep(times)
    }
}

// 振动（参数为振动时间，或时间的数组，单位毫秒；如果是数组，则依次为振动、等待、振动、等待...的时间，数组参数只支持Android，且iOS会忽略时间参数，而是采用预设的振动时间）
window.vibrate = function(time) {
    if (isApp() && navigator.vibrate) {
        if (device.platform === 'iOS' && Array.isArray(time)) {
            navigator.vibrate(time[0])
        } else {
            navigator.vibrate(time)
        }
    }
}

// 全局异常处理
window.onerror = function (err, file, line) {
    var msg = `发生异常：${err}\n位于：${file}\n第${line}行`
    console.error(msg)
    // 页面应封装记录异常的公共方法，以备调用
}

/**
 * 是否内嵌于App
 * @method App.isApp()
 */
function isApp () {
    return ('_cordovaNative' in window || 'cordova' in window)
}

/**
 * 是否桥接完成
 * @method App.isReady()
 * @param {boolean} inApp 是否强制判断App桥接完成与否（不兼容HTML文档状态）
 */
function isReady () {
    return isApp() ? appIsReady : docIsReady
}

export default {
    isApp,
    isReady,
    readyDevice,
    statusBarStyle
}
