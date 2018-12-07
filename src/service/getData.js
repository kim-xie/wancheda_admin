import fetch from '../config/fetch'
import * as login from './tempdata/login'

/**
 * 创建临时数据
 */
const setpromise = data => {
	return new Promise((resolve, reject) => {
		resolve(data)
	})
}

// 编译环境使用真实数据
if (process.env.NODE_ENV !== 'development') {
	var getLookupDf = () => fetch('GET', '/supercar/lookup_definition/list')
	var removeLookupDf = (id) => fetch('POST', '/supercar/lookup_definition/removeById', {
		id: id
	})

} else {
	// cityGuess = () => setpromise(home.guesscity)
	getLookupDf = () => fetch('GET', '/supercar/lookup_definition/list')
	removeLookupDf = (id) => fetch('POST', '/supercar/lookup_definition/removeById', {
		id: id
	})
}


/**
 * 以下Api接口不需要进行反向代理
 */
var sendLogin = (code, mobile) => setpromise(login.userInfo)

export {getLookupDf, removeLookupDf, sendLogin}
