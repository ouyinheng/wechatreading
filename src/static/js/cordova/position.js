/* eslint-disable */

// 获取定位选项参数
function getPositionOption(options, isWatch) {
    options = options || {}
    let success = options.success

    if (typeof(success) !== 'function') {
        options.success = (pos) => {
            alert(JSON.stringify(getPositionInfo(pos)))
        }
    } else {
        options.success = (pos) => {
            success(getPositionInfo(pos))
        }
    }
    if (typeof(options.error) !== 'function') {
        options.error = (err) => {
            console.log(`positioning fail, code: ${err.code}, message: ${err.message}`)
        }
    }
    if (!options.config) {
        options.config = {}
    }
    // 是否启用高精度定位
    if (!options.config.hasOwnProperty('enableHighAccuracy')) {
        options.config['enableHighAccuracy'] = true
    }
    // 坐标缓存时间，在该时间内重新获取位置则会取自缓存
    if (!options.config.hasOwnProperty('maximumAge')) {
        options.config['maximumAge'] = isWatch ? 1000 : 60000
    }
    // 定位超时时间
    if (!options.config.hasOwnProperty('timeout')) {
        options.config['timeout'] = 10000
    }

    return options
}

// 获取位置坐标对象
function getPositionInfo(pos) {
    let result = {}
    for (let key in pos.coords) {
        result[key] = pos.coords[key]
    }
    result['timestamp'] = pos.timestamp
    return result
}

var position = {
    /**
     * 获取设备当前位置坐标
     * @param {json} options 选项参数
     * @param {json} options.success 成功回调函数，参数为位置坐标对象
     * @param {json} options.error 错误回调函数，参数为错误对象，格式为{code:1,message:'xxx'}
     * @param {json} options.config 用于位置检索的自定义参数
     */
    getCurrentPosition (options) {
        options = getPositionOption(options)
        navigator.geolocation.getCurrentPosition(options.success, options.error, options.config)
    },

    /**
     * 开始实时定位
     * @param {json} options 选项参数
     * @param {json} options.success 成功回调函数，参数为位置坐标对象
     * @param {json} options.error 错误回调函数，参数为错误对象，格式为{code:1,message:'xxx'}
     * @param {json} options.config 用于位置检索的自定义参数
     */
    startPosition(options) {
        options = getPositionOption(options, true)
        return navigator.geolocation.watchPosition(options.success, options.error, options.config)
    },

    /**
     * 停止实时定位
     */
    stopPosition(watchPositionId) {
        if (watchPositionId) {
            navigator.geolocation.clearWatch(watchPositionId)
        }
    }
}

export default position