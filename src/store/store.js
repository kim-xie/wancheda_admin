import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import {getStore, getDataFormLUPById} from '@/assets/js/utils'
Vue.use(Vuex)
Vue.use(ElementUI)

/**
 * [state description]
 * @type {Object}
 */
const state = {
  'appName': '后台管理系统',
  'version': 'v1.0.0',
  'loading': true,
  'userInfo': {}, //用户信息
  'inpartCount': '', // 待入库数量
  'outpartCount': '', // 待出库数量
  'inpartFormParam': [], // 待入库表单
  'outpartFormParam': [], // 待出库表单
  'repairItemCount': '' // 维修订单
}

const getters = {

}

const mutations = {
  //获取当前登录用户的角色
  getUserRole (state, roleId){
    getDataFormLUPById(roleId, function() {
      state.userInfo.roleName = this.code
    })
  },

  //页面加载数据
  loading (state, loading){
    state.loading = loading
  },

  // 更新用户信息
  updateUserInfo (state, newUserInfo) {
    state.userInfo = newUserInfo
  },

  // 获取用户信息
  getUserInfo (state) {
    state.userInfo.userName = getStore('kim_un')
    state.userInfo.id = getStore('kim_id')
    state.userInfo.company = getStore('kim_cp')
    state.userInfo.role = getStore('kim_rl')
  },

  // 更新待入库数量
  updateInPartCount (state, newInpartCount) {
    state.inpartCount = newInpartCount
  },

  // 更新待出库数量
  updateOutPartCount (state, newOutpartCount) {
    state.outpartCount = newOutpartCount
  },

  // 更新待入库表单
  updateInpartFormParam (state, newInpartFormParam) {
    let inpartFormLen = state.inpartFormParam.length
    let _this = this
    for (var i = 0; i < state.inpartFormParam.length; i++) {
        if(newInpartFormParam.partId == state.inpartFormParam[i].partId){
          alert('该配件已存在在待入库中，请前往待入库进行操作！')
         /* this.$alert('该配件已存在在待入库中，请前往待入库进行操作！', '温馨提示', {
            confirmButtonText: '确定',
          });*/
          return false
        }
    }
    state.inpartCount = inpartFormLen + 1
    state.inpartFormParam.push(newInpartFormParam)
  },

  // 更新待出库表单
  updateOutPartFormParam (state, newOutpartFormParam) {
    let outpartFormLen = state.outpartFormParam.length
    for (var i = 0; i < state.outpartFormParam.length; i++) {
        if(newOutpartFormParam.partId == state.outpartFormParam[i].partId){
          alert('该配件已存在在待出库中，请前往待出库进行操作！')
         /* this.$alert('该配件已存在在待入库中，请前往待入库进行操作！', '温馨提示', {
            confirmButtonText: '确定',
          });*/
          return false
        }
    }
    state.outpartCount = outpartFormLen + 1
    state.outpartFormParam.push(newOutpartFormParam)
  },

  // 更新维修订单
  updateRepairItemCount (state, newRepairItemCount) {
    state.repairItemCount = newRepairItemCount
  }

}

const actions = {
  // 获取用户信息
  getUserInfo ({commit}) {
    getDataFormLUPById(getStore('kim_rl'), function(){
      commit('updateUserInfo', {
        'userName': getStore('kim_un'),
        'id': getStore('kim_id'),
        'company': getStore('kim_cp'),
        'role': getStore('kim_rl'),
        'roleName': this.code
      })
    })
  },

}

const modules = {

}

export default new Vuex.Store({
	state,
	getters,
	mutations,
  actions,
  modules
})
