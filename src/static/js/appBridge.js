// 原生交互Api集中在此，方便统一处理及变更
import App from './cordova'

export default {
    isApp: App.isApp,
    isNetConnected: App.net.isNetConnected,
    getConnectionType: App.net.getConnectionType, // 获取设备当前的网络连接类型 0:无网络连接/1:WIFI无线网络/2:移动网络
    addDeviceReadyEvent: App.addDeviceReadyEvent,

    downloadFile: App.file.downloadFile, // 下载文件
    uploadFile: App.file.uploadFile, // 上传文件
    zipFile: App.file.zipFile, // 压缩文件
    unZipFile: App.file.unZipFile, // 解压文件
    nameList: App.file.nameList, // 获取指定文件夹下的文件名字列表
    deleteFile: App.file.deleteFile, // 删除文件或文件夹 
    readFile: App.file.readFile, // 读取文件
    writeFile: App.file.writeFile, // 写文件
    copyFile: App.file.copyFile, // 复制文件
    exists: App.file.isExist, // 文件或文件夹是否存在
    createFile: App.file.createFile, // 创建一个新的空文件
    createDir: App.file.createDir, // 创建一个文件夹
    getNativePath: App.file.getNativePath, // 创建一个文件夹

    dbOpen: App.db.open, // 打开数据库
    dbIsOpen: App.db.isOpen, // 当前数据库是否处于打开状态
    dbClose: App.db.close, // 关闭当前已打开的数据库
    dbCreateTable : App.db.createTable, // 创建表
    dbDropTable: App.db.dropTable, // 删除表
    dbIsTableExist: App.db.isTableExist, // 判断表是否存在
    dbExec: App.db.dbExec, // 执行语句
    dbBatchExec : App.db.batchExec , // 以事务方式执行多条语句
    dbQuery: App.db.dbQuery, // 执行查询语句

    /**
     * 推送对象
     */
    jpush: App.jpush,

    /**
     * 版本更新
     */
    update: App.update,
    
    /**
     * 权限
     */
    permission: App.permission,

    device: App.device,

    position: App.position,

    photo: App.photo,

    browser: App.browser,

    db: App.db,
}

