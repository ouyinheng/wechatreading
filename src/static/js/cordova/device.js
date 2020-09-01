/* eslint-disable */
import base from './base'

/**
 * 设备操作
 */
var deviceModel = {
    /**
     * 获取操作系统（返回：ios/Android/wp8等）
     * @method App.device.getOsName
     */
    getOsName () {
        return base.isApp() ? device.platform : 'pc'
    },

    /**
     * 获取操作系统版本
     * @method App.device.getOsVersion
     */
    getOsVersion () {
        return base.isApp() ? device.version: ''
    },

    /**
     * 获取设备类型（返回：phone:手机/pad:平板/pc:电脑）
     * @method App.device.getType
     */
    // getType () {
    //     return base.isApp() ? DeviceUtil.model : 'pc'
    // },

    /**
     * 获取设备型号（如：htc 6950）
     * @method App.device.getModel
     */
    getModel () {
        return base.isApp() ? device.model : 'pc'
    },

    /**
     * 获取设备的设备序列号（iphone、wp8无法获得，返回的是内部自定义字符串）
     * @method App.device.getEsn
     */
    getEsn () {
        return base.isApp() ? device.serial : ''
    },

    /**
     * 获取设备mac值
     * @method App.device.getMac
     */
    // getMac () {
    //     return base.isApp() ? DeviceUtil.getMac() : ''
    // },

    /**
     * 获取App的客户端ID
     * @method App.app.getClientId
     */
    getClientId () {
        return base.isApp() ? device.uuid : ''
    },

    /**
     * 根据appid获取App信息
     * @method App.device.getApp
     */
    // getApp (appId) {
    //     return base.isApp() ? ClientUtil.getApplicationInfo(appId) : null
    // }
}

export default deviceModel
