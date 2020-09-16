module.exports = {
	devServer: {
		host: '0.0.0.0',
		port: '10086',
		// 设置代理
		proxy: {
			'/api': {
				// 目标 API 地址
				target: 'https://www.toutiao.com',
				// 如果要代理 websockets
				ws: false,
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				pathRewrite: {
                    '^/api': '/'
                }
            },
            '/apit': {
				// 目标 API 地址
				target: 'https://m.toutiao.com',
				// 如果要代理 websockets
				ws: false,
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				pathRewrite: {
                    '^/apit': '/'
                }
			},
			'/qd': {
				target:'https://www.qidian.com',
				ws: false,
				changeOrigin: true,
				pathRewrite: {
					'^/qd': '/'
				}
			},
			'/bookqd': {
				target:'https://book.qidian.com',
				ws: false,
				changeOrigin: true,
				pathRewrite: {
					'^/bookqd': '/'
				}
			},
			'/huaban': {
				target: 'https://huaban.com',
				changeOrigin: true,
				pathRewrite: {
					'^/huaban': '/'
				}
            },
            'jiutao': {
                target: 'https://www.9txs.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/jiutao': '/'
                }
            }
		}
	},
	"transpileDependencies": [
		"vuetify"
	]
}