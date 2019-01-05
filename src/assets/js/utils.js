import Vue from 'vue'

/**
 * [KimAjax ajax封装]
 * @method KimAjax
 * @param  {[type]} method          [description]
 * @param  {[type]} url             [description]
 * @param  {[type]} params          [description]
 * @param  {[type]} successCallback [description]
 * @param  {[type]} errorCallback   [description]
 */
export const KimAjax = (method, url, params, successCallback, errorCallback) => {
  Vue.http(
    {
      method: method || 'GET', // 请求方法
      url: url, // 请求的链接
      data: params || {}, // 请求的URL参数对象
      headers: {'X-Requested-With': 'XMLHttpRequest'}, // 请求头
      body: '', // 请求体
      responseType: 'json', // 响应的数据格式
      timeout: 10000, // 单位为毫秒的请求超时时间
      before: function () {}, // 请求发送前的处理函数，类似于jQuery的beforeSend函数
      progress: function () {}, // ProgressEvent回调处理函数
      credentials: true, // 表示跨域请求时是否需要使用凭证
      emulateHTTP: true, // 发送PUT, PATCH, DELETE请求时以HTTP POST的方式发送，并设置请求头的X-HTTP-Method-Override 在web服务器不识别PUT, PATCH, DELETE请求时
      emulateJSON: true // 将requestbody以application/x-www-form-urlencoded content type发送 在Web服务器无法处理编码为application/json的请求
    }
  ).then(successCallback, errorCallback)
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return
	if (typeof content !== 'string') {
		content = JSON.stringify(content)
	}
	window.sessionStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return
	return window.sessionStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return
	window.sessionStorage.removeItem(name)
}

/**
 * [设置cookies]
 * @method setCookie
 * @param  {[type]}  name  [cookies名称]
 * @param  {[type]}  value [cookies值]
 * @param  {[type]}  days  [cookies失效时间]
 */
export const setCookie = (name, value, days) => {
  var Days = 30
  if (days) {
    Days = days
  }
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/**
 * [读取cookies]
 * @method getCookie
 * @param  {[type]}  name [description]
 * @return {[type]}       [description]
 */
export const getCookie = name => {
  if (document.cookie.length > 0) {
    var start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      var end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

/**
 * [删除cookies]
 * @method delCookie
 * @param  {[type]}  name [description]
 * @return {[type]}       [description]
 */
export const delCookie = name => {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
 * [根据数据字典定义CODE查询出对应的数据字典]
 * @method getDataFormLUP
 * @param  {[type]}       lookupDefineCode [数据字典定义code]
 * @return {[type]}                        [description]
 */
export const getDataFormLUP = (lookupDefineCode, callback) => {
  Vue.http.get('/supercar/lookup/pageByDefineCode', {
    params: {
      lookupDefineCode: lookupDefineCode,
      pageNo: 1,
      pageSize: 1000
    }
  }).then((response) => {
    //alert(JSON.stringify(response.body.data.entitys))
    if (callback && typeof callback == 'function' && response.body.data.page) {
      callback.call(response.body.data.page.content)
    }
    //return response.body.data.entitys
  }, response => {
    console.log('加载数据字典时，根据当前数据字典定义code获取数据字典请求失败...')
    //return {}
  })
}

/**
 * [getDataFormLUPById description]
 * @method getDataFormLUPById
 * @param  {[type]}           lookupId [description]
 * @param  {Function}         callback [description]
 * @return {[type]}                    [description]
 */
export const getDataFormLUPById = (lookupId, callback) => {
  Vue.http.get('/supercar/lookup/getById', {params: {id: lookupId}}).then((response) => {
    //alert(JSON.stringify(response.body.data.entitys))
    if (callback && typeof callback == 'function' && response.body.data) {
      callback.call(response.body.data.entity)
    }
    //return response.body.data.entitys
  }, response => {
    console.log('加载数据字典时，根据当前数据字典id获取数据字典请求失败...')
    //return {}
  })
}

/**
 * [getDataById description]
 * @method getDataById
 * @param  {[type]}           id [description]
 * @param  {Function}         callback [description]
 * @return {[type]}                    [description]
 */
export const getDataById = (obj, id, callback) => {
  Vue.http.get('/supercar/'+obj+'/getById', {params: {id: id}}).then((response) => {
    //alert(JSON.stringify(response.body.data.entitys))
    if (callback && typeof callback == 'function' && response.body.data) {
      callback.call(response.body.data.entity)
    }
    //return response.body.data.entitys
  }, response => {
    console.log('加载数据字典时，根据当前数据字典id获取数据字典请求失败...')
    //return {}
  })
}
/**
 * [checkPrice description]
 * @method checkPrice
 * @param  {[type]}   rule     [description]
 * @param  {[type]}   value    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export const checkPrice = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('价格不能为空'))
  }
  setTimeout(() => {
    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
    if(!reg.test(value)) {
      callback(new Error('价格必须是为非负数'))
    } else {
      callback()
    }
  }, 0)
}
/**
 * 数量和工时校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const checkWorkHour = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('数量/工时不能为空'))
  }
  setTimeout(() => {
    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
    if (!reg.test(value)) {
      callback(new Error('数量/工时必须是为非负数'))
    } else {
      callback()
    }
  }, 0)
}
/**
 * [checkDiscount description]
 * @method checkDiscount
 * @param  {[type]}      rule     [description]
 * @param  {[type]}      value    [description]
 * @param  {Function}    callback [description]
 * @return {[type]}               [description]
 */
export const checkDiscount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('折扣不能为空'))
  }
  setTimeout(() => {
    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
    if(!reg.test(value)) {
      callback(new Error('折扣必须是为非负数'))
    } else if(Number(value) > 10) {
      callback(new Error('折扣不能大于10'))
    } else {
      callback()
    }
  }, 0)
}

// Date.prototype.format = function (format) {
//   var date = {
//     'M+': this.getMonth() + 1,
//     'd+': this.getDate(),
//     'h+': this.getHours(),
//     'm+': this.getMinutes(),
//     's+': this.getSeconds(),
//     'q+': Math.floor((this.getMonth() + 3) / 3),
//     'S+': this.getMilliseconds()
//   }
//   if (/(y+)/i.test(format)) {
//     format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
//   }
//   for (var k in date) {
//     if (new RegExp('(' + k + ')').test(format)) {
//       format = format.replace(RegExp.$1, RegExp.$1.length === 1
//       ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
//     }
//   }
//   return format
// }

/**************************************时间格式化处理************************************/
export const dateFormat = (format, date) => {  
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length))  
  }  
     
  for (var k in o) {
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))   
    }  
  }  

  return format  
}

// 权限判断
export const isSuperAdmin = (roleName) => {
  if (roleName === 'super_admin'){
    return true
  }else{
    return false
  }
}
