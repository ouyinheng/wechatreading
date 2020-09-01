/* eslint-disable */

/**
 *  获取常用权限对象集合
 */
function getPermissions () {
    let result = {}
    const perm = window.cordova.plugins.permissions
    const keys = [
        'READ_PHONE_STATE',
        'INTERNET',
        'ACCESS_NETWORK_STATE',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'CAMERA',
        'RECORD_AUDIO',
        /*'MOUNT_UNMOUNT_FILESYSTEMS',*/
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
    ]

    for (let key of keys) {
        result[key] = perm[key]
    }

    return result
}

function getPermissionArray(keys) {
    let permissions = getPermissions()
    let result = []

    if (!Array.isArray(keys)) {
        keys = [keys]
    }
    for (let key of keys) {
        result.push(permissions[key])
    }

    return result
}

/**
 * 检查是否有权限
 * @param {*} permissionkey 权限key或其数组，如：CAMERA，['CAMERA', 'RECORD_AUDIO']都可以作为参数
 * @param {*} success 成功回调，参数为bool类型的结果
 * @param {*} error 异常回调，有一个参数，为错误消息
 */
function checkPermission(permissionkey, success, error) {
    let perms = getPermissionArray(permissionkey)
    let successResult = []
    let errorResult = []

    if (typeof (success) !== 'function') {
        success = (res) => {
            alert(res ? 'The checked permissons are turned on.' : 'Some permissions are not turned on.')
        }
    }
    if (typeof (error) !== 'function') {
        error = (res) => {
            console.log(`checkPermission fail: ${JSON.stringify(res)}`)
        }
    }

    let callback = () => {
        if (successResult.length === perms.length) {
            if (errorResult.length) {
                error(errorResult)
            } else {
                success(!successResult.includes(false))
            }
        }
    }
    
    if (perms.length) {
        for (var perm of perms) {
            window.cordova.plugins.permissions.checkPermission(perm, (status) => {
                successResult.push(status.hasPermission)
                callback()
            }, (err) => {
                successResult.push(false)
                errorResult.push(err)
                callback()
            })
        }
    } else {
        alert(`权限${permissionkey}不存在`)
    }
}

/**
 * 申请权限
 * @param {*} permissionkey 权限key或其数组，如：CAMERA，['CAMERA', 'RECORD_AUDIO']都可以作为参数
 * @param {*} success 成功回调，有一个json参数，格式为{hasPermission:bool}
 * @param {*} error 异常回调，有一个参数，为错误消息
 */
function requestPermission(permissionkey, success, error) {
    if (typeof (success) !== 'function') {
        success = (res) => {
            alert(res ? 'The requested permissons are turned on.' : 'Some permissions are not turned on.')
        }
    }
    if (typeof (error) !== 'function') {
        error = (res) => {
            console.log(`requestPermission fail: ${JSON.stringify(res)}`)
        }
    }

    checkPermission(permissionkey, (res) => {
        if (!res) {
            let perms = getPermissionArray(permissionkey)
            window.cordova.plugins.permissions.requestPermissions(perms, (status) => {
                success(status.hasPermission)
            }, error)
        } else {
            success(true)
        }
    }, error)
}

export default {
    getPermissions,
    checkPermission,
    requestPermission
}
