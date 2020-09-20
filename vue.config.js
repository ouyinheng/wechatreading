const CopyWebpackPlugin = require("copy-webpack-plugin") //引入插件
const path = require('path')

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
            '/sapit': {
				// 目标 API 地址
				target: 'https://m.toutiao.com',
				// 如果要代理 websockets
				ws: false,
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				pathRewrite: {
                    '^/sapit': '/'
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
    ],
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([ //打包时执行拷贝
                {
                    from: path.resolve(__dirname, './src/cordovafile'),
                    to:   path.resolve(__dirname, './dist') + '',
                    ignore: ['.*']
                }
            ])
        ]
    }
}