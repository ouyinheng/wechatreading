/* eslint-disable */

/**
 * 获取app和web的版本号
 * @param {function} callback 接收版本号的回调函数
 */
function getVersion (callback) {
    window.chcp.getVersionInfo((error, data) => {
        if (typeof (callback) === 'function') {
            callback(data)
        }
    })
}

/**
 * 检查更新
 * @param {function} callback 回调函数，接收返回消息
 */
function checkUpdate(callback) {
    let chcp = window.chcp

    if (typeof (callback) !== 'function') {
        callback = (msg) => {
            alert(JSON.stringify(msg))
        }
    }
    
    // 获取更新(如果有更新则下载更新包)
    chcp.fetchUpdate((error, data) => {
        // 将发生的异常传入回调函数
        if (error) {
            callback (error)
            return
        }

        // 检测是否有更新可用于安装
        chcp.isUpdateAvailableForInstallation((error, data) => {
            if (error) {
                callback (error)
            } else {
                chcp.installUpdate((error) => {
                    if (error) {
                        callback (error)
                    } else {
                        callback ({
                                "code": 0,
                                "description": "更新成功，已为您更新到最新版本",
                                "oldVersion": data.currentVersion,
                                "newVersion": data.readyToInstallVersion
                            })
                    }
                })
            }
        })
    })
}

/**
 * 
 * @param {json} options 选项参数
 * @param {string} options.apkUrl Android版本安装包的路径
 * @param {string} options.ipaUrl iOS版本的plist文件的路径(https)
 * @param {function} options.callback 回调函数，接收返回消息
 * @param {function} options.downloadProgress Android版本安装包下载进度回调函数，参数为下载进度百分比，整数类型，如下载到60%会传递数字60，在下载过程中会一直重复调用该回调函数
 */
function updateApp(options) {
    if (!options || !options.apkUrl || !options.ipaUrl) {
        alert('缺少参数')
        return
    }

    if (typeof (options.callback) !== 'function') {
        options.callback = (msg) => {
            alert(JSON.stringify(msg))
        }
    }

    checkUpdate((msg) => {
        if (msg.code === window.chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
            if (device.platform === 'Android') {
                updateAndroidApp(options)
            } else {
                updateIosApp(options)
            }
        } else {
            options.callback(msg)
        }
    })
}

// 更新安卓App
function updateAndroidApp (options) {
    var permissions = window.cordova.plugins.permissions
    // 判断权限
    permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, (status) => {
        if (!status.hasPermission) {
            permissions.requestPermission(
                permissions.WRITE_EXTERNAL_STORAGE,
                (status) => {
                    if (!status.hasPermission) {
                        options.callback({"code": -20, "description": "升级失败，无读写存储空间的权限。"})
                    } else {
                        downloadApk(options)
                    }
                },
                options.callback)
        } else {
            downloadApk(options)
        }
    }, null)
}

// 更新苹果App
function updateIosApp (options) {
    var plistUrl = 'itms-services://?action=download-manifest&url=' + options.ipaUrl
    if (cordova.InAppBrowser) {
        cordova.InAppBrowser.open(plistUrl, '_system'/*, 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭'*/)
    } else {
        var winRef = window.open(plistUrl, '_blank'/*, 'location=no'*/)
        winRef.location = plistUrl
    }
}

// 下载apk
function downloadApk (options) {
    try {
        var fileName = options.apkUrl.substr(options.apkUrl.lastIndexOf('/') + 1)
        // apk下载存放的路径，可以使用cordova file插件进行相关配置
        var targetPath = window.cordova.file.externalApplicationStorageDirectory + fileName
        var cordovaFileTransfer = new FileTransfer()
        cordovaFileTransfer.onprogress = (progress) => {
            var downloadProgress = (progress.loaded / progress.total) * 100
            if (typeof (options.downloadProgress) === 'function') {
                options.downloadProgress(Math.floor(downloadProgress))
            }
        }
        cordovaFileTransfer.download(options.apkUrl, targetPath, (res) => {
            // 打开下载下来的apk
            cordova.plugins.fileOpener2.open(targetPath,
                'application/vnd.android.package-archive', {
                    error: function (error) {
                        if (!error.description) {
                            error.description = ''
                        }
                        error.description = '升级失败，' + error.description
                        options.callback(error)
                    },
                    success: function () {
                        options.callback({"code": 0, "description": "升级完成"})
                    }
                })
        }, (error) => {
            if (!error.description) {
                error.description = ''
            }
            error.description = '下载失败，' + error.description
            options.callback(error)
        }, {}, true)
    } catch (error) {
        options.callback({"code": -21, "description": "升级出错，" + error.message})
    }
}

export default {
    checkUpdate,
    updateApp,
    getVersion,
    updateAndroidApp,
    updateIosApp,
}