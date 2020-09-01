/* eslint-disable */
import { getLoginInfo, removeLoginInfo } from '../sign.js'
var fileSystemPathType = 1
var transferProgressSet = {}
var speedUnits = ['B/s', 'KB/s', 'MB/s', 'GB/s']
var fileSelectDom
var fileSessionSet = {}
var fileErrorMsgs = [
    'No such a file or directory',
    'Access to the files were denied',
    'Operation was abort',
    'The file or directory cannot be read',
    'The URL, mimeType or encoding is invalid',
    'The state of underlying file system prevents any writing',
    'The operation cannot be performed on the current state',
    'Syntax error',
    'The modification is not allowed',
    'No enough remainning storage space',
    'The type is mismatch',
    'The same path already exists'
]

// 获取App的数据目录
function getDataDir () {
    // Android: file:///data/user/0/{PackageId}/files/
    // iOS: file:///var/mobile/Containers/Data/Application/{UUID}/Library/NoCloud/
    return cordova.file.dataDirectory
}

// 获取App的临时目录
function getTempDir () {
    // Android: file:///data/user/0/{PackageId}/cache/
    // iOS: file:///var/mobile/Containers/Data/Application/{UUID}/tmp/
    return device.platform === 'Android' ? cordova.file.cacheDirectory : cordova.file.tempDirectory
}

// 获取App的数据库目录
function getDbDir () {
    // Android: file:///data/user/0/{PackageId}/databases/
    // iOS: file:///var/mobile/Containers/Data/Application/{UUID}/Library/LocalDatabase/
    return cordova.file.applicationStorageDirectory + (device.platform === 'Android' ?  'databases/' : 'Library/LocalDatabase/')
}

// 格式化路径
function formatPath(path) {
    let paths = { name: '', parent: '', fullPath: ''}
    let location
    let items

    if (path.startsWith('file:///')) {
        location = 'file:///'
        path = path.substr(8)
    } else if (path.startsWith('content://')) {
        location = 'content://'
        path = path.substr(10)
    } else {
        location = fileSystemPathType === 1 ? getDataDir() : getTempDir()
    }

    items = path.split(/[/\\]/g).filter(p => !!p)
    paths.name = items.slice(-1).join()
    paths.parent = location + items.slice(0, -1).join('/')
    paths.fullPath = location + items.join('/')
    
    return paths
}

// 进度处理函数
function transferProgress(transferId, evt, callback, frequency) {
    if (evt.lengthComputable) {
        let oldTime = transferProgressSet[`${transferId}_otime`]
        let oldLoaded = transferProgressSet[`${transferId}_oloaded`]
        let nowTime = new Date().getTime()
        let duration = nowTime - oldTime
        let percent = Math.round((evt.loaded / evt.total) * 100)
        let speed = (evt.loaded - oldLoaded) / duration * 1000
        let restTime = Math.round((evt.total - evt.loaded) / speed)
        let unit = speedUnits[0]

        if (percent < 100) {
            frequency = frequency || 300
            if (frequency > 0 && duration < frequency) {
                return
            }
        }
        
        for (let i = 1; i < speedUnits.length; i++) {
            if (speed / 1024 > 1) {
                speed /= 1024
                unit = speedUnits[i]
            } else {
                break
            }
        }
        speed = speed === Infinity ? ('-' + speedUnits[2]) : (speed.toFixed(1) + unit)

        transferProgressSet[`${transferId}_otime`] = nowTime
        transferProgressSet[`${transferId}_oloaded`] = evt.loaded
        
        if (typeof(callback) === 'function') {
            callback(percent, speed, restTime)
        }
    }
}

// 开始记录进度信息
function startTransferProgress (transferId) {
    transferProgressSet[`${transferId}_otime`] = new Date().getTime()
    transferProgressSet[`${transferId}_oloaded`] = 0
}

// 清空进度信息
function stopTransferProgress (transferId) {
    delete transferProgressSet[`${transferId}_otime`]
    delete transferProgressSet[`${transferId}_oloaded`]
}

// 获取随机码
function getRandomKey()
{
    let prefix = "t"
    let length = 8
    let result = prefix
    let chars = "1234567890abcdefghijklmnopqrstuvwxyz"
    let dupCount = 0
    let preIndex = 0

    for (let i = 0; i < length - prefix.length; ++i)
    {
        let index = Math.floor(Math.random() * 36.0)
        if (index == preIndex)
        {
            ++dupCount
        }
        result += chars.charAt(index)
        preIndex = index
    }
    if (length - prefix.length >= 2 && dupCount >= length - prefix.length - 2)
    {
        return getRandomKey(prefix, length)
    }

    return result
}

// 处理并获取异常对象
function getFileError(error, isTransferError) {
    if (isTransferError) {
        if (error.code === 2) {
            error.code = 17
        }
        if (error.code === 3) {
            error.code = 18
        }
        if (error.code === 4) {
            error.code = 3
        }
        if (error.code === 5) {
            error.code = 9
        }
        error.message = error.exception
    } else if (!error.message && error.code >= 1 && error.code <= 12) {
        error.message = fileErrorMsgs[error.code - 1]
    }

    return error
}

// 获取文档预览会话id
function getPreviewSessionId (url, params, success, error) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = (evt) => {
        success(JSON.parse(xhr.response).session)
    }
    xhr.onerror = error
    xhr.send(params)
}

/**
 * 文件操作
 */
var file = {
    /**
     * 使用数据目录
     */
    useDataDir () {
        fileSystemPathType = 1
    },

    /**
     * 使用临时目录
     */
    useTempDir () {
        fileSystemPathType = 2
    },

    /**
     * 检查路径是否存在，支持文件或目录
     * @param {string} path 文件或目录的路径，支持file:////路径、content://路径和不带协议的路径，若不带则从数据目录下获取路径
     * @param {bool} getFile 是否获取文件对象，当路径为文件时，支持返回文件实体还是文件对象，默认false(返回文件实体)
     */
    checkPath (path, getFile) {
        path = formatPath(path).fullPath
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(path, (entry) => {
                if (getFile && entry.isFile) {
                    entry.file((file) => {
                        resolve(file)
                    }, (err) => {
                        reject(getFileError(err))
                    })
                } else {
                    resolve(entry)
                }
            }, (err) => {
                console.log('path--->',path)
                const checkError = getFileError(err)
                if (checkError && checkError.code === 1) {
                    resolve(false)
                }else {
                    reject(checkError)
                }
            })
        })
    },
    /**
     * 获取原生路径
     * @param {string} path 文件或目录的路径，支持file:////路径、content://路径和不带协议的路径，若不带则从数据目录下获取路径
     * 
     */
    getNativePath (path) {
        return formatPath(path).fullPath;
    },
    /**
     * 下载文件
     * @param {json} options 选项参数
     * @param {string} options.requestUrl 文件请求地址
     * @param {string} options.savePath 文件保存路径，可带目录，如: a/b/address.txt，若不带前缀file:///，则保存在数据目录下
     * @param {json} options.headers 请求头信息，一般为访问凭证信息
     * @param {number} options.progressFrequency 下载进度回调函数的调用频率，单位毫秒，默认300，若不控制则指定为-1即可
     * @param {function} options.onProgress 下载进度回调函数，在下载过程中周期性地触发，有三个参数，分别为：
     * (1) 下载进度百分比，整数类型，如下载到60%会传递数字60
     * (2) 下载速度，如： 234.5B/s、24.4KB/s、2.1MB/s
     * (3) 剩余时间，整数类型，单位为秒
     */
    downloadFile (options) {
        let url = options.requestUrl
        let savePath = formatPath(options.savePath).fullPath
        let fileTransfer = new FileTransfer()
        let headers = options.headers || {}
        let transferId = getRandomKey()

        if (typeof (options.onProgress) === 'function') {
            fileTransfer.onprogress = (progressEvent) => {
                transferProgress(transferId, progressEvent, options.onProgress, options.progressFrequency)
            }
        }
        
        return new Promise((resolve, reject) => {
            file.createFile(savePath).then((createFileEntry) => {
                startTransferProgress(transferId)
                fileTransfer.download(url, createFileEntry.toURL(), (downloadFileEntry) => {
                    stopTransferProgress(transferId)
                    resolve(downloadFileEntry)
                }, (downloadError) => {
                    stopTransferProgress(transferId)    
                    console.log('downloadError', downloadError)               
                    reject(getFileError(downloadError, true))
                }, false, { headers: headers })
            }).catch((createFileError) => {
                console.log('createFileError', createFileError)   
                reject(getFileError(createFileError))
            })
        })
    },

    /**
     * 上传文件
     * @param {json}} options 选项参数
     * @param {string} options.requestUrl 上传请求地址
     * @param {string} options.filePath 本地文件路径，可带目录，如: a/b/address.txt，若不带前缀file:///，则从数据目录获取文件
     * @param {json} options.mimeType 上传文件的mime类型，无需指定（非主流文件时可提供）
     * @param {number} options.chunkSize 分片大小，若指定，则分块上传
     * @param {json} options.headers 请求头信息，一般为访问凭证信息
     * @param {json} options.params 请求参数
     * @param {number} options.progressFrequency 上传进度回调函数的调用频率，单位毫秒，默认300，若不控制则指定为-1即可
     * @param {function} options.onProgress 上传进度回调函数，在上传过程中周期性地触发，有三个参数，分别为：
     * (1) 上传进度百分比，整数类型，如上传到60%会传递数字60
     * (2) 上传速度，如： 234.5B/s、24.4KB/s、2.1MB/s
     * (3) 剩余时间，整数类型，单位为秒
     */
    uploadFile (options) {
        let url = options.requestUrl
        let paths = formatPath(options.filePath)
        let filePath =  paths.fullPath
        let fileName = paths.name
        let fileTransfer = new FileTransfer()
        let transferId = getRandomKey()
        let uploadOptions = new FileUploadOptions()
        let authorization = getLoginInfo()

        Object.assign(uploadOptions, {
            fileKey: 'file',
            fileName: fileName,
            params: options.params || {},
            headers: options.headers || {}
        })

        uploadOptions.headers['authorization'] = authorization['token_type'] + ' ' + authorization['access_token']

        if (typeof (options.onProgress) === 'function') {
            fileTransfer.onprogress = (progressEvent) => {
                transferProgress(transferId, progressEvent, options.onProgress, options.progressFrequency)
            }
        }
        
        return new Promise((resolve, reject) => {
            file.checkPath(filePath).then((fileEntry) => {
                if (fileEntry.isFile) {
                    fileEntry.file((file) => {
                        uploadOptions.mimeType = uploadOptions.mimeType || file.type
                        startTransferProgress(transferId)
                        fileTransfer.upload(fileEntry.toURL(), url, (res) => {
                            stopTransferProgress(transferId)
                            resolve(res)
                        }, (uploadError) => {
                            stopTransferProgress(transferId)
                            reject(getFileError(uploadError, true))
                        }, uploadOptions)
                    }, (fileError) => {
                        reject(getFileError(fileError))
                    })
                } else {
                    reject({ code: 1, source: filePath, target: url, message: 'No such file' })
                }
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })
        })
    },

    /**
     * 压缩文件
     * @method App.file.zipFile
     * @param {json} options 选项参数
     * @param {string} options.sourcePath 需要压缩的目录的路径
     * @param {string} options.zipPath 压缩后的zip文件路径，若不提供则在与源路径相同目录下生成zip文件
     */
    zipFile (options) {
        const srcPaths = formatPath(options.sourcePath)
        const srcPath = srcPaths.fullPath
        let destPath = '';
        if (options.zipPath) {
            destPath = formatPath(options.zipPath).fullPath
        } else {
            destPath = srcPath + '.zip'
        }
        console.log('destPath:', destPath)
        return new Promise((resolve, reject) => {
            file.checkPath(srcPath).then((dirEntry) => {
                console.log('dirEntry:', dirEntry)
                if (dirEntry.isDirectory) {
                    window.Zeep.zip({
                        from: dirEntry.toURL(),
                        to: destPath
                    }, () => {
                        resolve(destPath)
                    }, (zipError) => {
                        reject({ code: 15, message: zipError })
                    })
                } else {
                    reject({ code: 1, message: 'No such a directory' })
                }
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })            
        })
    },

    /**
     * 解压文件
     * @method App.file.unZipFile
     * @param {json} options 选项参数
     * @param {string} options.sourcePath 需要解压的zip文件路径
     * @param {string} options.folderPath 解压缩后的文件夹路径，若不提供则根据zip文件自动生成解压文件夹
     */
    unZipFile (options) {
        const srcPaths = formatPath(options.sourcePath)
        const srcPath = srcPaths.fullPath
        let destPath = ''
        if (options.folderPath) {
            destPath = formatPath(options.folderPath).fullPath
        } else {
            destPath = srcPath.substr(0, srcPath.lastIndexOf('.'))
        }

        return new Promise((resolve, reject) => {
            file.checkPath(srcPath).then((entry) => {
                window.Zeep.unzip({
                    from: entry.toURL(),
                    to: destPath
                }, () => {
                    resolve(destPath)
                }, (zipError) => {
                    reject({ code: 16, message: zipError })
                })
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })            
        })
    },

    /**
     * 创建目录
     * @param {string} dirName 目录名称，支持一次性创建多级目录，如：a/b/c/d，若不带前缀file:///，则从数据目录创建目录
     */
    createDir (dirName) {
        let paths = formatPath(dirName)
        let dirPath = paths.parent
        let folderName = paths.name
        
        return new Promise((resolve, reject) => {
            if (folderName) {
                file.createDir(dirPath).then((dirEntry) => {
                    dirEntry.getDirectory(folderName, { create: true }, (folderEntry) => {
                        resolve(folderEntry)
                    }, (folderError) => {
                        reject(getFileError(folderError))
                    })
                }).catch((err) => {
                    reject(getFileError(err))
                })
            } else {
                file.checkPath(dirPath).then((dirEntry) => {
                    resolve(dirEntry)
                }).catch((dirError) => {
                    reject(getFileError(dirError))
                })
            }
        })
    },

    /**
     * 创建文件
     * @param {string} filePath 文件保存路径，可带目录，如: download/a/b/address.txt，若不带前缀file:///，则从数据目录创建文件，若目录不存在会先创建目录
     */
    createFile (filePath) {
        let paths = formatPath(filePath)
        let dirPath = paths.parent
        let fileName = paths.name

        return new Promise((resolve, reject) => {
            file.createDir(dirPath).then((dirEntry) => {
                dirEntry.getFile(fileName, { create: true }, (fileEntry) => {
                    resolve(fileEntry)
                }, (fileError) => {
                    reject(getFileError(fileError))
                })
            }, (dirError) => {
                reject(getFileError(dirError))
            })
        })
    },

    /**
     * 删除目录或文件
     * @param {string} path 目录或文件路径，如: a/b/c，若不带前缀file:///，则从数据目录删除目录或文件
     * @param {bool} isRecursive 删除目录时是否递归删除，默认false，若目录包含子目录或文件，递归删除时，则将删除目录及包含的所有子目录和文件，不递归则删除失败
     */
    deleteFile (path, isRecursive = true) {
        path = formatPath(path).fullPath
        return new Promise((resolve, reject) => {
            file.checkPath(path).then((entry) => {
                let success = () => {
                    resolve(true)
                }
                let error = (removeError) => {
                    reject(getFileError(removeError))
                }
                if (entry.isDirectory && isRecursive) {
                    entry.removeRecursively(success, error)
                } else {
                    entry.remove(success, error)
                }
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })
        })
    },

    /**
     * 删除数据库db文件
     * @method App.file.deleteDBFile
     */
    async deleteDBFile () {
        try {
            let path = cordova.file.applicationStorageDirectory + (device.platform === 'Android' ? 'databases' : 'Library/LocalDatabase');
            console.log('deleteDBFile---->' + device.platform + path)
            const dbFileList = await file.nameList(path);
            // alert('dbFileList:'+ JSON.stringify(dbFileList))
            for (let i = 0; i < dbFileList.length; i++) {
                const dbFilePath = dbFileList[i];
                await file.deleteFile(dbFilePath)
            }
            return true;
        } catch (error) {
            console.log('deleteDBFile deleteDBFile:', error)
            throw error;
        }
        // return new Promise((resolve,reject) => {
        //     file.exists(path,root => {
        //         if (root) {
        //             root.removeRecursively(parent => {
        //                 resolve(true);
        //             },(err) => {
        //                 reject(err);
        //             })
        //         }
        //     },(err) => {
        //         reject(err);
        //     })
        // })
    },

    /**
     * 读取文件
     * @param {object/string} file 文件对象或文件路径
     * @param {number} type 读取格式（0:文本/1:ArrayBuffer数据对象，是一个字节数组/2:dataURL格式的base64字符串/3:对象url，生命周期和document绑定）
     * @param {string} encodeing 编码类型，当type为0时可指定，默认为utf-8（ios下暂无法解析gb2312）
     */
    readFile(filePath, type, encoding) {
        return new Promise((resolve, reject) => {
            if (typeof(filePath) === 'string') {
                filePath = formatPath(filePath).fullPath
                file.checkPath(filePath).then((fileEntry) => {
                    if (fileEntry.isFile) {
                        fileEntry.file((fileObj) => {
                            file.readFile(fileObj, type, encoding).then((res) => {
                                resolve(res)
                            }).catch((readError) => {
                                reject(getFileError(readError))
                            })
                        }, (fileError) => {
                            reject(getFileError(fileError))
                        })
                    } else {
                        reject({ code: 1, message: 'No such a file' })
                    }                
                }).catch((checkError) => {
                    reject(getFileError(checkError))
                })
            } else if (typeof(filePath) === 'object') {
                if (type === 3) {
                    if (filePath instanceof File) {
                        file.readFile(filePath, 1).then((buffer) => {
                            filePath = new Blob([new Uint8Array(buffer)], { type: filePath.type })
                            resolve(window.URL.createObjectURL(filePath))
                        }).catch((readError) => {
                            reject(getFileError(readError))
                        })
                    } else {
                        resolve(window.URL.createObjectURL(filePath))
                    }
                } else {
                    let reader = new FileReader()
                    reader.onloadend = function (evt) {
                        resolve(this.result)
                    }
                    reader.onerror = function (err) {
                        reject({ code: 22, message: 'Failed to read the file' })
                    }
                    switch (type) {
                        case 1:
                            /*
                            alert(file)
                            let file1 = file.slice(0,10)
                            alert(file1)
                            */
                            reader.readAsArrayBuffer(filePath)
                            break
                        case 2:
                            reader.readAsDataURL(filePath)
                            break
                        default:
                            reader.readAsText(filePath, encoding)
                            break
                    }
                }
            } else {
                reject({ code: 14, message: 'The filePath format error' })
            }            
        })
    },

    /**
     * 写文件
     * @param {string} filePath 文件路径，如: a/b/c/d.txt，若不带前缀file:///，则从数据目录查找或创建文件
     * @param {string/Blob/File/ArrayBuffer} data 要写入的内容，支持字符串(utf-8)、Blob、File、ArrayBuffer等类型
     * @param {bool} isAppend 是否追加，默认为false，若为true，则清空文件后写入
     */
    writeFile (filePath, data, isAppend) {
        return new Promise((resolve, reject) => {
            file.createFile(filePath).then((fileEntry) => {
                if (data) {
                    fileEntry.createWriter((writer) => {
                        writer.onwriteend = function () {
                            resolve(fileEntry)
                        }
                        writer.onerror = function (err) {
                            reject({ code: 21, message: err.toString() })
                        }
                        if (isAppend) {
                            writer.seek(writer.length)
                        }
                        writer.write(data)
                    }, (writeError) => {
                        reject(getFileError(writeError))
                    })
                } else {
                    reject({ code: 13, message: 'The data to write is null' })
                }
            }).catch((createError) => {
                reject(getFileError(createError))
            })
        })
    },

    /**
     * 复制文件或目录（复制目录时，如果目标目录已经存在且不为空，则报错）
     * @param {string} srcPath 源文件路径，若路径不带前缀file:///，则从数据目录下查找文件
     * @param {string} destPath 目标文件路径，若路径不带前缀file:///，则复制到数据目录下的目标路径
     */
    copyFile (srcPath, destPath) {
        let paths = formatPath(destPath)
        let destDirPath = paths.parent
        let destFileName = paths.name
        srcPath = formatPath(srcPath).fullPath

        return new Promise((resolve, reject) => {
            file.checkPath(srcPath).then((entry) => {
                file.createDir(destDirPath).then((dirEntry) => {
                    entry.copyTo(dirEntry, destFileName, (fileEntry) => {
                        resolve(fileEntry)
                    }, (moveError) => {
                        reject(getFileError(moveError))
                    })
                }, (err) => {
                    reject(getFileError(err))
                })
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })
        })
    },

    /**
     * 移动文件或目录（移动目录时，如果目标目录已经存在且不为空，则报错）
     * @param {string} srcPath 源文件路径，若路径不带前缀file:///，则从数据目录下查找文件
     * @param {string} destPath 目标文件路径，若路径不带前缀file:///，则移动到数据目录下的目标路径，若目标路径仅仅改了名称而没有改变位置，则为重命名
     */
    moveFile (srcPath, destPath) {
        let paths = formatPath(destPath)
        let destDirPath = paths.parent
        let destFileName = paths.name
        srcPath = formatPath(srcPath).fullPath

        return new Promise((resolve, reject) => {
            file.checkPath(srcPath).then((entry) => {
                file.createDir(destDirPath).then((dirEntry) => {
                    entry.moveTo(dirEntry, destFileName, (fileEntry) => {
                        resolve(fileEntry)
                    }, (moveError) => {
                        reject(getFileError(moveError))
                    })
                }, (err) => {
                    reject(getFileError(err))
                })
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })
        })
    },

    /**
     * 列出指定目录下的所有子目录和文件
     * @param {string} dirPath 目录路径，若路径不带前缀file:///，则从数据目录下查找该路径
     */
    nameList (dirPath) {
        dirPath = formatPath(dirPath).fullPath

        return new Promise((resolve, reject) => {
            file.checkPath(dirPath).then((dirEntry) => {
                if (dirEntry.isDirectory) {
                    dirEntry.createReader().readEntries((entries) => {
                        let data = []
                        for (let entry of entries) {
                            // { isFile: entry.isFile, } 
                            data.push(entry.toURL())
                        }
                        resolve(data)
                    }, (readError) => {
                        reject(getFileError(readError))
                    })
                } else {
                    reject({ code: 1, message: 'No such a directory' })
                }                
            }).catch((checkError) => {
                reject(getFileError(checkError))
            })
        })
    },

    /**
     * 选择文件，返回File对象
     * @param {string} accept 可选择文件的mime类型，多个用逗号分隔，如：image/gif、image/jpeg、image/*
     */
    selectFile (accept) {
        return new Promise((resolve, reject) => {
            if (!fileSelectDom) {
                fileSelectDom = document.createElement('input')
                fileSelectDom.type = 'file'
                fileSelectDom.style.display = 'none'
                if (accept) {
                    fileSelectDom.accept = accept
                }
                document.body.appendChild(fileSelectDom)
            }
            fileSelectDom.onchange = function (evt) {
                if (this.files.length) {
                    resolve(this.files[0])
                    this.value = ''
                } else {
                    reject({code: 1, message: 'No files selected' })
                }
            }
            fileSelectDom.click()
        })
    },

    /**
     * 预览文档
     * @param {json} options 选项参数
     * @param {number} mode 预览模式，0:预览本地文档，1:预览网络文档
     * @param {string} filePath 本地文档路径，或网络文档路径
     * @param {string} fileHostUrl 文档预览服务器地址
     * @param {string} fileName 文档名称（预览网络文档时应提供）
     * @param {string} token 文档预览服务器应用token，预览本地文档需要提供
     * @param {number} sessionTimeout 文档预览服务器会话失效时间，毫秒，默认3600000(一小时)，预览本地文档可提供
     */
    previewFile (options) {
        return new Promise((resolve, reject) => {
            if (options.mode) {
                resolve(`${options.fileHostUrl}/view/url?url=${encodeURI(options.filePath)}&name=${encodeURI(options.fileName)}&idocv_auth=sapi`)
            } else {
                let paths = formatPath(options.filePath)
                let fileSession = fileSessionSet[paths.fullPath]
                if (!fileSession) {
                    let uploadOptions = {
                        url: `${options.fileHostUrl}/doc/upload`,
                        filePath: paths.fullPath,
                        params: { token: options.token, mode: 'private', name: options.fileName || paths.name }
                    }
                    file.upload(uploadOptions).then((res) => {
                        fileSessionSet[paths.fullPath] = {
                            uuid: JSON.parse(res.response).uuid,
                            session: '',
                            expires: new Date().getTime()
                        }
                        file.previewFile(options).then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(getFileError(err))
                        })
                    }).catch((err) => {
                        reject(getFileError(err))
                    })
                } else if (fileSession.expires < new Date().getTime() + 60000) {
                    getPreviewSessionId(`${options.fileHostUrl}/session/${fileSession.uuid}`, `token=${options.token}`, (session) => {
                        fileSession.session = session
                        fileSession.expires = new Date().getTime() + (options.sessionTimeout || 3600000)
                        file.previewFile(options).then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(getFileError(err))
                        })
                    }, (err) => {
                        reject({ code: 20, message: 'Failed to get file session' })
                    })
                } else {
                    resolve(`${options.fileHostUrl}/view/${fileSession.session}`)
                }
            }
        })
    },
    /**
     * 判断文件或文件夹是否存在
     * @method App.file.exists
     * @param {string} path 文件或文件夹路径
     * @param {function} success 成功的回调，接受entry参数
     * @param {function} error 失败的回调
     */
    exists (path, success, error) {
        var resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
        resolveLocalFileSystemURL(path,success,error);
    },
    /**
     * 判断文件或文件夹是否存在
     * @method App.file.isExist
     * @param {string} name 文件或文件夹名
     */
    isExist (path) {
        path = formatPath(path).fullPath
        const resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
        return new Promise((resolve,reject) => {
            resolveLocalFileSystemURL(path,(root) => {
                resolve(true);
            },(err) => {
                resolve(false);
            });
        }) 
    },
}

export default file
