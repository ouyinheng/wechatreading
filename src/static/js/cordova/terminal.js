/* eslint-disable */
var isReady = false
var eventQueue = null

document.addEventListener('deviceready', function () {
    isReady = true

    if (eventQueue) {
        eventQueue.forEach(function (fn) {
            fn()
        })
    }
}, false)

// 添加cordova设备就绪事件
function addDeviceReadyEvent (fn) {
    if (typeof (fn) === 'function') {
        if (isReady) {
            fn()
        } else {
            if (!eventQueue) {
                eventQueue = []
            }
            eventQueue.push(fn)
        }
    }
}

export default {
    isReady,
    addDeviceReadyEvent,
}
