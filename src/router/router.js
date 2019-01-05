import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login'
import Home from '@/pages/home/home'
import Index from '@/pages/index/index'
import Billing from '@/pages/plant/billing'
import ServiceRecord from '@/pages/plant/serviceRecord'
import ServiceProject from '@/pages/plant/serviceProject'
import AccountList from '@/pages/account/list'
import AccountAdd from '@/pages/account/add'
import AccountEdit from '@/pages/account/edit'
import ClientList from '@/pages/client/list'
import ClientLevel from '@/pages/client/level'
import CompanyList from '@/pages/company/list'
import CompanyAdd from '@/pages/company/add'
import CompanyEdit from '@/pages/company/edit'
import FinancialList from '@/pages/financial/list'
import LookupList from '@/pages/lookup/list'
import LookupDFList from '@/pages/lookup/lookupDF'
import LogList from '@/pages/log/list'
import ProductList from '@/pages/product/list'
import ProductManager from '@/pages/product/manager'
import ProductAdd from '@/pages/product/add'
import ProductRemove from '@/pages/product/remove'
import RoleList from '@/pages/role/list'
import RoleAdd from '@/pages/role/add'
import RoleEdit from '@/pages/role/edit'
import NotFoundPage from '@/components/common/error'

Vue.use(Router)

export default new Router({
  mode: 'history', // 默认 hash 模式
  base: '/wancheda/',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
      	  path: '',
          name: '系统首页',
          component: Index
      	},
        {
          path: 'index',
          name: '系统首页',
          alias: 'index.html',
          component: Index
        },
        {
      	  path: 'billing',
          name: '维修开单',
          component: Billing
      	},
        {
      	  path: '/serviceRecord',
          name: '维修记录',
          component: ServiceRecord
      	},
        {
      	  path: '/serviceProject',
          name: '维修项目',
          component: ServiceProject
      	},
        {
      	  path: '/client',
          name: '客户维护',
          component: ClientList
      	},
      	{
      	  path: '/client/level',
          name: '客户级别',
          component: ClientLevel
      	},
        {
      	  path: '/product/list',
          name: '配件维护',
          component: ProductList
      	},
        {
      	  path: '/product/manager',
          name: '库存管理',
          component: ProductManager
      	},
        {
      	  path: '/product/add',
          name: '配件入库',
          component: ProductAdd
      	},
      	{
      	  path: '/product/remove',
          name: '配件出库',
          component: ProductRemove
      	},
        {
      	  path: '/financial/list',
          name: '财务统计',
          component: FinancialList
      	},
        {
      	  path: '/lookup/list',
          name: '数据字典管理',
          component: LookupList
      	},
        {
      	  path: '/lookup/lookupDF',
          name: '数据字典定义',
          component: LookupDFList
      	},
        {
      	  path: '/account/list',
          name: '账号管理',
          component: AccountList
      	},
        {
      	  path: '/account/add',
          name: '添加账号',
          component: AccountAdd
      	},
        {
      	  path: '/account/edit',
          name: '修改账号',
          component: AccountEdit
      	},
        {
      	  path: '/role/list',
          name: '角色管理',
          component: RoleList
      	},
        {
      	  path: '/role/add',
          name: '添加角色',
          component: RoleAdd
      	},
        {
      	  path: '/role/edit',
          name: '修改角色',
          component: RoleEdit
      	},
        {
      	  path: '/company/list',
          name: '公司管理',
          component: CompanyList
      	},
        {
      	  path: '/company/add',
          name: '添加门店',
          component: CompanyAdd
      	},
        {
      	  path: '/company/edit',
          name: '修改门店',
          component: CompanyEdit
      	},
        {
      	  path: '/log/list',
          name: '系统日志',
          component: LogList
      	}
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
  	  path: '*',
      name: '找不到页面',
      component: NotFoundPage
  	}
  ]
})
