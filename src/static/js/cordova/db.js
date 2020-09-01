import file from './file'

var appDbName = 'idea.db'
var appDbSet = {}
var appOpenDbSet = {}
var appDbOptionSet = {}

const database = {     
    /**
     * 打开数据库，不存在则创建
     * @param {string} dbName 数据库名，可选参数，不指定时为idea.db
     * @param {json} options 数据库配置项，可选参数
     */
    open (options) {
        const dbName = options.name || appDbName
        options = options || {}
        Object.assign(options, { name: dbName, location: 'default'})
        /*
        if (device.platform === 'Android') {
            options['androidDatabaseProvider'] = 'system'
        }
        */
        return new Promise((resolve, reject) => {
            appDbName = dbName
            appDbOptionSet[dbName] = options
            appDbSet[dbName] = window.sqlitePlugin.openDatabase(options, (db) => {
                appOpenDbSet[dbName] = true
                resolve(db)
            }, (err) => {
                reject(err)
            })
        })
    },
  
    /**
     * 关闭数据库
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    close (dbName) {
        return new Promise((resolve, reject) => {
            dbName = dbName || appDbName
            let db = appDbSet[dbName]
            if (db && appOpenDbSet[dbName]) {
                db.close(() => {
                    appOpenDbSet[dbName] = false
                    resolve()
                }, function(err) {
                    reject(err)
                })
            } else {
                resolve()
            }
        })
    },

    /**
     * 创建表
     * @param {string} tableName 表名
     * @param {string array} cols 列名和数据类型的数组，如：['Name text', 'Age integer']
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async createTable (tableName, cols, dbName) {
        try{
            const res = await database.dbExec(`CREATE TABLE IF NOT EXISTS ${tableName} (${cols.join(',')})`, [], dbName, res => true);
            return res
        }catch(error){
            if (error) {
                console.error('createTable error:',error.message)
            }
            throw error;
        }
    },

    /**
     * 删除表
     * @param {string} tableName 表名
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async dropTable (tableName, dbName) {
        try{
            const res = await database.dbExec(`DROP TABLE IF EXISTS ${tableName}`, [], dbName, res => true)
            return res;
        }catch(error){
            if (error) {
                console.error('dropTable error:',error.message)
            }
            throw error;
        }
    },


    /**
     * 删除数据库
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    drop (dbName) {
        return new Promise((resolve, reject) => {
            dbName = dbName || appDbName
            let db = appDbSet[dbName]
            if (db) {
                window.sqlitePlugin.deleteDatabase(appDbOptionSet[dbName], () => {
                    appDbName = 'idea.db'
                    delete appDbSet[dbName]
                    delete appDbOptionSet[dbName]
                    delete appOpenDbSet[dbName]
                    resolve()
                }, (err) => {
                    reject(err)
                })
            } else {
                resolve()
            }
        })
    },

    /**
     * 删除数据库
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async dropAllDB() {
        try {
            let path = cordova.file.applicationStorageDirectory + (device.platform === 'Android' ? 'databases' : 'Library/LocalDatabase');
            const dbFileList = await file.nameList(path);
            const dbNameList = dbFileList.map(dbFilePath => {
                const dirArr = dbFilePath.split('/');
                return dirArr[dirArr.length - 1];
            })
            for (let i = 0; i < dbNameList.length; i++) {
                const dbName = dbNameList[i];
                await database.drop(dbName)
            }
            return true;
        } catch (error) {
            console.error('dropAllDB deleteDBFile:', error)
            throw error;
        }
    },
    /**
     * 获取数据库访问句柄对象，并打开
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async getDb (dbName) {
        dbName = dbName || appDbName
        let db = appDbSet[dbName]
        if (!db || !appOpenDbSet[dbName]) {
            try {
                db = await database.open({ name: dbName })
            } catch (err) {
                console.error(`database open fail: ${err.message}`)
                return null
            }
        }
        return db
    },
    async dbQuery(sql, params, dbName, resultHandler) {
        try {
            const res = await database.query(sql, params, dbName, resultHandler);
            await database.close();
            return res;
        } catch (error) {
            console.error('dbQuery error:', sql, params, error);
            throw error;
        }
    },
    /**
     * 查询
     * @param {strign} sql 查询语句
     * @param {array} params 参数的数组
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     * @param {function} resultHandler 结果处理函数，可选参数，若提供，则返回处理函数处理后的结果，否则返回查询语句的结果集数组
     */
    query (sql, params, dbName, resultHandler) {
        console.log('query start-------------------------:', sql);
        return new Promise(async (resolve, reject) => {
            let db = await database.getDb(dbName)
            if (db) {
                let data
                db.readTransaction((tx) => {
                    tx.executeSql(sql, params || [], (tx, res) => {
                        if (typeof(resultHandler) === 'function') {
                            data = resultHandler(res)
                        } else {
                            data = []
                            for (let i = 0; i < res.rows.length; i++) {
                                data.push(res.rows.item(i))
                            }
                        }
                    }, (tx, err) => {
                        reject(err)
                    })
                }, (error) => {
                    console.error('query error: ' + error.message);
                    reject(error)
                }, () => {
                    console.log('query end-------------------------:', sql);
                    resolve(data);
                })
            } else {
                reject({ message: 'database not open' })
            }
        })
    },
    async dbExec (sql, params, dbName, resultHandler) {
        try {
            const res = await database.exec(sql, params, dbName, resultHandler);
            await database.close();
            return res;
        } catch (error) {
            console.error('dbExec error:', sql, params, error);
            throw error;
        }
    },
    /**
     * 执行单条sql语句
     * @param {string} sql 要执行的sql语句
     * @param {array} params 参数的数组
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     * @param {function} resultHandler 结果处理函数，可选参数，若提供，则返回处理函数处理后的结果，否则返回执行语句影响的行数
     */
    exec (sql, params, dbName, resultHandler) {
        console.log('exec start-------------------------:', sql);
        return new Promise(async (resolve, reject) => {
            let db = await database.getDb(dbName)
            if (db) {
                let data
                db.transaction((tx) => {
                    tx.executeSql(sql, params || [], (tx, res) => {
                        if (typeof(resultHandler) === 'function') {
                            data = resultHandler(res)
                        } else {
                            data = res.rowsAffected
                        }
                    }, (tx, err) => {
                        reject(err)
                    })
                }, (err) => {
                    reject(err)
                }, () => {
                    console.log('exec end-------------------------:', sql);
                    resolve(data)
                })
            } else {
                reject({ message: 'database not open' })
            }
        })
    },
    async dbBatchExec (sqls, dbName) {
        try {
            const res = await database.batchExec(sqls, dbName);
            await database.close();
            return res;
        } catch (error) {
            console.error('dbBatchExec error:', error);
            throw error;
        }
    },
    /**
     * 批量执行sql语句
     * @param {string} sqls 要批量执行的sql语句的数组
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    batchExec (sqls, dbName) {
        return new Promise(async (resolve, reject) => {
            let db = await database.getDb(dbName)
            if (db) {
                db.sqlBatch(sqls, () => {
                    resolve(true)
                }, (err) => {
                    reject(err)
                })
            } else {
                reject({ message: 'database not open' })
            }
        })
    },
    /**
     * 获取数据库信息
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async getInfo(dbName) {
        try {
            const res = await database.dbQuery('pragma database_list', [], dbName, res => {
                let data = []
                for (let i = 0; i < res.rows.length; i++) {
                    let item = res.rows.item(i)
                    if (/^\/(data|storage|var|private)/g.test(item.file)) {
                        item.file = `file://${item.file}`
                    }
                    data.push(item)
                }
                return data
            })
            return res;
        } catch(error){
            if (error) {
                console.error('getInfo error:',error.message)
            }
            throw error;
        }
    },
    /**
     * 获取数据库中所有对象（包含：表/索引/视图/触发器等，type字段有talbe/index/view/trigger等值）
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async getObjects(dbName) {
        try {
            const res = await database.dbQuery('SELECT * FROM sqlite_master UNION ALL SELECT * FROM sqlite_temp_master', [], dbName)
            return res;
        } catch (error) {
            if (error) {
                console.error('getObjects error:',error.message)
            }
            throw error;
        }
    },
    /**
     * 获取数据库版本
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async getVersion(dbName) {
        try {
            const res = await database.dbQuery('SELECT sqlite_version() AS Version', [], dbName, res => res.rows.item(0).Version)
            return res;
        } catch (error) {
            if (error) {
                console.error('getVersion error:',error.message)
            }
            throw error;
        }
    },
    /**
     * 获取表的列集合
     * @param {string} tableName 表名
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async getTableCols(tableName, dbName) {
        try {
            const res = await database.dbQuery(`pragma table_info (${tableName})`, [], dbName)
            return res;
        } catch (error) {
            if (error) {
                console.error('getTableCols error:',error.message)
            }
            throw error;
        }
    },
    /**
     * 表是否存在
     * @param {string} tableName 表名
     * @param {string} dbName 数据库名，可选参数，不指定时为最后一个打开的数据库
     */
    async isTableExist(tableName, dbName) {
        try {
            const res = await database.dbQuery('SELECT name FROM sqlite_master WHERE type=? AND name=?', ['table', tableName], dbName, res => res.rows.length > 0);
            return res;
        }catch(error) {
            if (error) {
                console.error('isTableExist error:',error.message)
            }
            throw error;
        }
    },
}

export default database