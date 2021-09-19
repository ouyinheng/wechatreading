window.globalConfig = process.env.NODE_ENV === 'production' ?  {
    api: 'https://www.toutiao.com',
    sapit: 'https://m.toutiao.com',
    qd: 'https://m.qidian.com/', 
    bookqd: 'https://book.qidian.com', 
    huaban: 'https://huaban.com',
    jiutao: 'https://www.9txs.com'
} : {
    api: 'api',
    sapit: 'sapit',
    qd: '/qd', 
    bookqd: '/bookqd', 
    huaban: '/huaban',
    jiutao: 'jiutao'
}
