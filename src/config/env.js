/**
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 */
	let baseUrl
	let routerMode
	const imgBaseUrl = 'http://47.75.131.186:8080'

	if (process.env.NODE_ENV === 'development') {
		baseUrl = 'http://47.75.131.186:8080'
		routerMode = 'hash'
	} else {
		baseUrl = 'http://47.75.131.186:8080'
		routerMode = 'hash'
	}

	export {
		baseUrl,
		routerMode,
		imgBaseUrl
	}
