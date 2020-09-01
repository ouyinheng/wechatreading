import base from './base'
import device from './device'
import app from './app'
import db from './db' 
import net from './net'
import file from './file'
import photo from './photo'
import update from './update'
import terminal from './terminal'
import permission from './permission'
import jpush from './jpush'
import position from './position'
import browser from './browser'
import status from './status'


/**1
 * 初始化App
 * @param {json} options 选项参数
 * @param {array} options.permissions 常用权限数组
 * @param {function} options.updateWebCallback 更新Web回调含糊
 * @param {json} options.updateAppOptions 升级App选项参数
 * @param {json} options.pushOptions 消息推送初始化选项参数
 * @param {json} options.positionOptions 定位选项参数
 * @param {json} options.statusBar 状态栏参数
 */
function initApp(options) {
    base.readyDevice(() => {
        App.status.set(options.statusBar)

        if (options.permissions) {
            // 申请常用权限
            App.permission.requestPermission(options.permissions, (res) => {
                if (!res) {
                    alert('部分权限未开启。')
                }
                // 获取位置坐标
                if (options.positionOptions) {
                    App.position.getCurrentPosition(options.positionOptions)
                }
            })
        }
        
        // 更新升级
        App.update.checkUpdate((msg) => {
            if (typeof(options.updateWebCallback) === 'function') {
                options.updateWebCallback(msg)
            }
            if (msg.code === window.chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW &&  options.updateAppOptions) {
                confirm('有更新的版本，建议升级到最新版。', (buttonIndex) => {
                    if (buttonIndex === 1) {
                        App.update.updateApp(options.updateAppOptions)
                    }
                }, '发现新版本', ['立即更新', '稍后再去'])
            }
        })

        // 初始化消息推送
        if (options.pushOptions) {
            App.jpush.initPush(options.pushOptions)

            // 检查通知栏权限
            App.jpush.isEnabledPush((hasPush) => {
                if (!hasPush) {
                    alert(`应用的通知栏权限未打开，请前往设置的通知管理中进行开启。`, null, '请开启消息通知权限')
                }
            })
        }
    })
}

/**
 * App处理
 * @author chengam
 * @date 2017-08-15
 */
var App = {
    /**
     * 是否内嵌于App
     */
    isApp: base.isApp,

    /**
     * 是否桥接完成
     */
    isReady: base.isReady,

    /**
     * 添加设备就绪事件
     */
    addDeviceReadyEvent: terminal.addDeviceReadyEvent,

    initApp,
    /**
     * 执行App脚本
     */
    execScript: base.execScript,

    /**
     * 执行调用本地能力的方法（保证在桥接完成后执行）
     */
    execMethod: base.execMethod,

    /**
     * 打开业务模块页面
     */
    openModule: base.openModule,

    /**
     * 打开页面
     */
    openPage: base.openPage,

    /**
     * 设备操作
     */
    device,

    /**
     * 应用操作
     */
    app,

    // /**
    //  * 缓存操作
    //  */
    // cache,

    // /**
    //  * 通讯操作
    //  */
    // contact,
    status,
    // *
    //  * 定位操作
     
    position,

    /**
     * 文件操作
     */
    file,

    /**
     * 图片操作
     */
    photo,

    /**
     * 数据库操作
     */
    db,

    /**
     * 网络操作
     */
    net,

    /**
     * 消息处理
     */
    //message,

    /**
     * 推送对象
     */
    jpush,

    /**
     * 版本更新
     */
    update,
    
    /**
     * 权限
     */
    permission,

    browser,
}

export default App
