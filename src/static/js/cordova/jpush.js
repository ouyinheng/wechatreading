/* eslint-disable */
var registrationId = ''

// 获取注册Id
function getRegistrationID (getRegistIdCallback) {
    if (!registrationId) {
        window.JPush.getRegistrationID(function (data) {
            try {
                if (data.length == 0) {
                    console.log('get registrationId fail:' + new Date().valueOf())
                    window.setTimeout(getRegistrationID, 1000, getRegistIdCallback)
                } else {
                    registrationId = data
                    if (typeof (getRegistIdCallback) === 'function') {
                        getRegistIdCallback({ code: 0, message: registrationId })
                    }
                }
            } catch (err) {
                console.log(err)
                getRegistIdCallback({ code: 1, message: err.message })
            }
        })
    } else if (typeof (getRegistIdCallback) === 'function') {
        getRegistIdCallback({ code: 0, message: registrationId })
    }
}

// 获取通知信息
function getNotifiedMessage (event) {
    var data = { msgType: 1, msgId: '', title: '', msg: '', params: {} }
    if (device.platform === "Android") {
        let msgId = ''
        let extras = event.extras
        if (extras) {
            msgId = extras['cn.jpush.android.MSG_ID'] || ''
            if (extras['cn.jpush.android.EXTRA']) {
                extras = extras['cn.jpush.android.EXTRA']
            }
        }
        data.msgId = msgId
        data.title = event.title || ''
        data.msg = event.alert
        if (extras) {
            for (var k in extras) {
                if (!['cn.jpush.android.ALERT_TYPE', 'cn.jpush.android.NOTIFICATION_ID', 'cn.jpush.android.MSG_ID', 'cn.jpush.android.ALERT'].includes(k)) {
                    data.params[k] = extras[k]
                }
            }
        }
    } else {
        let title = event.aps.title || ''
        let msg = event.aps.alert
        let extras = event.extras
        if (typeof(msg) === 'object') {
            title = title || msg.title
            msg = msg.body
        }
        data.msgId = event['_j_msgid']
        data.title = title
        data.msg = msg
        if (extras) {
            for (var k in extras) {
                if (!['isTrusted', 'aps', '_j_uid', '_j_msgid', '_j_business'].includes(k)) {
                    data.params[k] = extras[k]
                }
            }
        }
    }

    return data
}

// 获取透传信息
function getInsideMessage (event) {
    var data = { msgType: 2, msgId: '', title: '', msg: '', params: {} }
    if (device.platform === "Android") {
        let msgId = ''
        let extras = event.extras
        if (extras) {
            msgId = extras['cn.jpush.android.MSG_ID'] || ''
            if (extras['cn.jpush.android.EXTRA']) {
                extras = extras['cn.jpush.android.EXTRA']
            }
        }
        data.msgId = msgId
        data.title = event.title || ''
        data.msg = event.message
        if (extras) {
            for (var k in extras) {
                if (!['cn.jpush.android.CONTENT_TYPE', 'cn.jpush.android.MSG_ID'].includes(k)) {
                    data.params[k] = extras[k]
                }
            }
        }
    } else {
        let extras = event.extras
        data.msgId = event['_j_msgid']
        data.title = event.title || ''
        data.msg = event.content
        if (extras) {
            for (var k in extras) {
                if (!['isTrusted', 'title', 'content', '_j_msgid'].includes(k)) {
                    data.params[k] = extras[k]
                }
            }
        }
    }

    return data
}

/**
 * 初始化消息推送，应在DeviceReady事件中调用
 * @param {json} options 选项参数
 * @param {function} options.getRegistIdCallback 获取设备注册id的事件回调函数
 * @param {function} options.openNoticeCallback 点击通知栏消息进入App的事件回调函数
 * @param {function} options.receiveNoticeCallback 接收到通知消息的事件回调函数
 * @param {function} options.receiveMessageCallback 接收到透传消息的事件回调函数
 */
function initPush(options) {
    // 注册点击通知消息进入App的事件
    if (typeof (options.openNoticeCallback) === 'function') {
        document.addEventListener("jpush.openNotification", function (event) {
            try {
                var data = getNotifiedMessage(event)
                options.openNoticeCallback(data)
                if (device.platform === 'iOS') {
                    getBadge((num) => {
                        if (num > 0) {
                            setBadge(--num)
                        }
                    })
                }
            } catch (exception) {
                console.log("JPush.onOpenNotification" + exception);
            }
        }, false);
    }

    // 注册接收到通知消息的事件
    if (typeof (options.receiveNoticeCallback) === 'function') {
        document.addEventListener("jpush.receiveNotification", function (event) {
            try {
                var data = getNotifiedMessage(event)
                options.receiveNoticeCallback(data)
            } catch (exception) {
                console.log("JPush.onReceiveNotification" + exception)
            }
        }, false);
    }

    // 注册接收到透传消息的事件
    if (typeof (options.receiveMessageCallback) === 'function') {
        document.addEventListener("jpush.receiveMessage", function (event) {
            try {
                var data = getInsideMessage(event)
                options.receiveMessageCallback(data)
            } catch (exception) {
                console.log("JPush.onReceiveMessage-->" + exception);
            }
        }, false);
    }

    if (typeof (options.openNoticeCallback) === 'function') {
        // 注册获取设备注册id的事件
        document.addEventListener("jpush.receiveRegistrationId", function (event) {
            registrationId = event.registrationId;
        }, false)

        // 初始化
        try {
            window.JPush.init()
            window.JPush.setDebugMode(true)
        } catch (err) {
            alert(`消息组件初始化失败: ${err.message}`)
            console.log(err)
        }

        // 获取设备注册id
        getRegistrationID(options.getRegistIdCallback)
    }
}

/**
 * 停止推送服务
 */
function stopPush () {
    window.JPush.isPushStopped(function (result) {
        if (result !== 0) {
            window.JPush.stopPush()
        }
    })
}

/**
 * 恢复推送服务
 */
function resumePush () {
    window.JPush.isPushStopped(function (result) {
        if (result === 0) {
            window.JPush.resumePush()
        }
    })
}

/**
 * 系统是否允许应用推送
 * @param {function} callback 回调函数，参数为bool类型的结果
 */
function isEnabledPush (callback) {
    window.JPush.getUserNotificationSettings(function (result) {
        if (typeof (callback) === 'function') {
            if (device.platform === "iOS" && parseInt(device.version.split('.')[0]) >= 10) {
                callback(result.authorizationStatus > 1)
            } else {
                callback(result > 0)
            }
        }
    })
}

/**
 * 设置角标数字
 * @param {int} num 要设置的数字
 */
function setBadge(num) {
    if (device.platform === 'iOS') {
        if (num >= 0 && num <= 99999) {
            window.JPush.setApplicationIconBadgeNumber(num)
            window.JPush.setBadge(num)
        } else {
            console.log('setBadge fail: num is out of range of 0 to 99999.')
        }
    } else {
        console.log('setBadge fail: Android dose not support this method.')
    }
}

/**
 * 获取角标数字
 * @param {function} callback 回调函数，参数为角标数字
 */
function getBadge(callback) {    
    if (device.platform === 'iOS') {
        if (typeof (callback) !== 'function') {
            callback = (num) => {
                alert(num)
            }
        }
        window.JPush.getApplicationIconBadgeNumber(callback)
    } else {
        console.log('getBadge fail: Android dose not support this method.')
    }
}

// 设置别名
function setAlias (alias, fn) {
    window.JPush.setAlias({ sequence: 1, alias: alias },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 删除别名
function deleteAlias (fn) {
    window.JPush.deleteAlias({ sequence: 2 },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 获取别名
function getAlias (fn) {
    window.JPush.getAlias({ sequence: 3 },
        (result) => {
            fn({ code: 0, alias: result.alias })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 设置标签（覆盖）
function setTags (tags, fn) {
    window.JPush.setTags({ sequence: 4, tags: tags },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 新增标签
function addTags (tags, fn) {
    window.JPush.addTags({ sequence: 5, tags: tags },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 删除标签
function deleteTags (tags, fn) {
    window.JPush.deleteTags({ sequence: 6, tags: tags },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 清空标签
function cleanTags (fn) {
    window.JPush.cleanTags({ sequence: 7 },
        (result) => {
            fn({ code: 0 })
        }, (error) => {
            fn({ code: error.code })
        })
}

// 获取标签
function getTags (fn) {
    try {
        window.JPush.getAllTags({ sequence: 8 },
            (result) => {
                fn({ code: 0, tags: result.tags })
            }, (error) => {
                fn({ code: error.code })
            })
    } catch (err) {
        alert(err.message)
    }
}

export default {
    /**
     * 初始化消息推送，应在DeviceReady事件中调用
     */
    initPush,

    /**
     * 停止推送服务
     */
    stopPush,

    /**
     * 恢复推送服务
     */
    resumePush,

    /**
     * 系统是否启用应用推送
     */
    isEnabledPush,

    /**
     * 设置角标(支持苹果)
     */
    setBadge,

    /**
     * 获取角标(支持苹果)
     */
    getBadge,

    /**
     * 设置别名
     */
    setAlias,

    /**
     * 删除别名
     */
    deleteAlias,

    /**
     * 获取别名
     */
    getAlias,

    /**
     * 设置标签（覆盖）
     */
    setTags,

    /**
     * 新增标签
     */
    addTags,

    /**
     * 删除标签
     */
    deleteTags,

    /**
     * 清空标签
     */
    cleanTags,

    /**
     * 获取标签
     */
    getTags
}
