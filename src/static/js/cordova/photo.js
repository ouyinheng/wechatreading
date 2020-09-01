/* eslint-disable */
import base from './base'
import file from './file'

/**
 * 图片操作
 */
var photo = {
    /**
     * 拍照
     * @param {json} options 选项参数
     * @param {number} options.quality 图片保存质量，0-100，如果是100则不压缩质量，默认50
     * @param {number} options.targetWidth 缩放图片的宽度，单位像素，图片缩放时不会改变长宽比例，应同时指定，以按比例算更小者为准
     * @param {number} options.targetHeight 缩放图片的高度，单位像素，说明同宽度
     * @param {bool} options.saveToPhotoAlbum 是否保存到系统相册，默认false
     * @param {bool} options.correctOrientation 横向拍照时自动旋转，默认true
     * @param {bool} options.allowEdit 是否允许简单剪裁编辑，默认false
     */
    camera (options) {
        options = options || {}
        Object.assign(options, {
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true,
            cameraDirection: Camera.Direction.BACK
        })
        return new Promise((resolve, reject) => {
            navigator.camera.getPicture((data) => {
                resolve(data)
            }, (err) => {
                reject(err)
            }, options)
        })
    },

    /**
     * 扫码
     */
    scan () {
        let options = {
            //preferFrontCamera : false,
            showFlipCameraButton : false,
            showTorchButton : false,
            torchOn: false,
            saveHistory: true,
            prompt : '扫描二维码/条形码',
            resultDisplayDuration: 0,
            //formats : 'all',
            //orientation : "landscape",
            disableAnimations : true,
            disableSuccessBeep: false
        }
        return new Promise((resolve, reject) => {
            window.cordova.plugins.barcodeScanner.scan((data) => {
                resolve(data)
            }, (err) => {
                reject(err)
            }, options)
        })
    },

    /**
     * 选择图片
     * @param {json} options 选项参数
     * @param {number} options.quality 图片保存质量，0-100，如果是100则不压缩质量，默认50
     * @param {number} options.targetWidth 缩放图片的宽度，单位像素，图片缩放时不会改变长宽比例，应同时指定，以按比例算更小者为准(但Android拍照且允许剪裁时会严格按照指定尺寸缩放图片)
     * @param {number} options.targetHeight 缩放图片的高度，单位像素，说明同宽度
     * @param {bool} options.allowEdit 是否允许简单剪裁编辑，默认false
     */
    selectImage (options) {
        options = options || {}
        Object.assign(options, {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.FILE_URI,
            mediaType: Camera.MediaType.PICTURE
        })
        return new Promise((resolve, reject) => {
            navigator.camera.getPicture(async (data) => {
                if (data.startsWith('/storage')) {
                    data = `file://${data}`
                    resolve(data)
                }else if (data.startsWith('content://')) {
                    window.FilePath.resolveNativePath(data, (realPath) => {
                        resolve(realPath)
                    }, (pathError) => {
                        reject(pathError.message)
                    })
                } else {
                    resolve(data)
                } 
            }, (selectError) => {
                reject(selectError)
            }, options)
        })
    },

    /**
     * 查看图片文件
     * @param {string} path 文件路径
     */
    openImage (path) {
        if (base.isApp()) {
            var sourcePath = base.getSysPath(path)
            var extName = sourcePath.substr(sourcePath.lastIndexOf('.') + 1).toLowerCase()
            if (['jpg', 'jpeg', 'png', 'gif'].indexOf(extName) !== -1) {
                NativeUtil.open(sourcePath)
            } else {
                alert('不支持查看非图片文件。')
            }
        } else {
            alert('不支持查看图片。')
        }
    },

    /**
     * 读取图片的dataURL（dataURL格式的base64字符串，可以用来对img的src赋值）
     * @param {File/ArrayBuffer/Blob} data 图片文件对象、读取图片文件的结果、或者下载图片文件的结果(xhr.response)
     * @param {string} mimeType 图片文件的mime类型，data为ArrayBuffer时可指定，默认为image/jpeg
     */
    getDataUrl(data, mimeType) {
        let blob
        if (data instanceof File || data instanceof Blob) {
            blob = data
        } else if (data instanceof ArrayBuffer) {
            blob = new Blob([new Uint8Array(data)], { type: mimeType || 'image/jpeg' })
        }

        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onloadend = function (evt) {
                resolve(this.result)
            }
            reader.onerror = function (err) {
                reject('Failed to read the data url of the file')
            }
            reader.readAsDataURL(blob)
        })
    },

    /**
     * 把base64图片转成Image图片，并保存
     * @param {string} folderpath 文件路径
     * @param {string} filename 文件名称
     * @param {string} content base64图片
     * @return
     */
    saveAsImage(folderpath, filename, content) {
        let native_path = file.getNativePath(folderpath);
        return new Promise((resolve,reject) => {
            file.createDir(native_path).then((floderFileEntry) => {
                floderFileEntry.getFile(filename, {create:true}, file => {
                    file.createWriter( fileWriter => {
                        fileWriter.write(content);
                        fileWriter.onwriteend = function() {
                            resolve(native_path + '/' + filename);
                        };
                        fileWriter.onerror = function (e) {
                            reject(e);
                        };
                    }, err => {
                        reject(err) 
                    });
                }, err => {
                    reject(err) 
                });
            }).catch(err => {
                reject(err) 
            })
        })
    },
    /**
     * 获取图片的对象url（可以用来对img的src赋值，它的生命周期和document绑定）
     * @param {File/ArrayBuffer/Blob} data 图片文件对象、读取图片文件的结果、或者下载图片文件的结果(xhr.response)
     * @param {string} mimeType 图片文件的mime类型，data为ArrayBuffer时可指定，默认为image/jpeg
     */
    getObjectUrl(data, mimeType) {
        return new Promise((resolve, reject) => {
            if (data instanceof File) {
                let reader = new FileReader()
                reader.onloadend = function (evt) {
                    data = new Blob([new Uint8Array(this.result)], { type: data.type })
                    resolve(window.URL.createObjectURL(data))
                }
                reader.onerror = function (err) {
                    reject('Failed to read the array buffer of the file')
                }
                reader.readAsArrayBuffer(data)
            } else if (data instanceof ArrayBuffer) {
                data = new Blob([new Uint8Array(data)], { type: mimeType || 'image/jpeg' })
                resolve(window.URL.createObjectURL(data))
            } else {
                resolve(window.URL.createObjectURL(data))
            }
        })
    }
}

export default photo
