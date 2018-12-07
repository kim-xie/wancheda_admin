import Mock from 'mockjs'

var Accounts = {
  'success': '@pick(["true","false"])',
  'errorNo': function () {
    var errorNo = 0
    if(this.success === 'false') {
      errorNo = '1'
    }
    return errorNo
  },
  'errorMsg': function () {
    var errorMsg = ''
    if(this.errorType === '1') {
      errorMsg = '失败'
    } else {
      errorMsg = '成功'
    }
    return errorMsg
  },
  'accounts|1-3': [
    {
      'accountId': '@id',
      'accountName': '@cname',
      'password': '@string("lower", 6)',
      'mobile': '@pick(["18302778898","18102238898","13802770898"])',
      'email': '@pick(["1830277@qq.com","2238898@163.com","1380898@162.com"])',
      'forbid|1-10': true,
      'lastLoginTime': '@datetime',
      'lastLoginIp': '@ip',
      'description': '@pick(["车主嘱咐描述","备注"])',
      'createTime': '@datetime',
      'updateTime': '@datetime',
      'isDelete|1-10': true,
      'roles|1': [
        {
          'roleId': '@id',
          'name': '@pick(["超级管理员", "普通管理员"])',
          'description': '@capitalize("角色")'
        }
      ],
      'permissions|1-2': [
        {
          'parentId': '@id',
          'permissionId': '@id',
          'parentName': '@pick(["车间管理", "客户管理", "财务管理"])',
          'name': '@pick(["添加", "修改", "删除"])',
          'parentUrl': function () {
            var _url = ''
            if(this.parentName === '车间管理') {
              _url = '/plant'
            } else if (this.parentName === '客户管理') {
              _url = '/client'
            }else{
              _url = '/financial'
            }
            return _url
          },
          'url': function () {
            var _url = ''
            if(this.name === '添加') {
              _url = 'add'
            } else if (this.name === '修改') {
              _url = 'edit'
            } else {
              _url = 'remove'
            }
            return this.parentUrl + '/' + _url
          },
          'description': function () {
            return this.parentName + '/' + this.name
          }
        }
      ],
      'company': {
        'companyId': '@id',
        'name': '@pick(["深圳分店", "甘肃分店","北京分店"])',
        'code': '@string("upper", 5)',
        'address': function () { return this.name.split('分店')[0] },
        'mobile': '@pick(["18802778898","18102238898","13802770898"])',
        'defaultCarNo': '@pick(["甘A","粤A","粤B"])',
        'brand': '@pick(["辉门冠军","鼎泰冠军","欧美冠军"])',
        'type': '@pick(["快修门店","快洗门店"])',
        'serviceTime': '@time("A HH:mm:ss")',
        'email': '@email',
        'description': '@capitalize("分店")'
      }
    }
  ]
}

var Account = {
  'success': function () {
    if(this.account.forbid === true) {
      return 'false'
    } else {
      return 'true'
    }
  },
  'errorNo': function () {
    var errorNo = 0
    if(this.success === 'false') {
      errorNo = '1'
    }
    return errorNo
  },
  'errorMsg': function () {
    var errorMsg = ''
    if (this.account.forbid === true) {
      errorMsg = '账号禁用'
    } else {
      errorMsg = '成功'
    }
    return errorMsg
  },
  'account': {
    'accountId': '@id',
    'accountName': '@cname',
    'password': '@string("lower", 6)',
    'mobile': '@pick(["18302778898","18102238898","13802770898"])',
    'email': '@pick(["1830277@qq.com","2238898@163.com","1380898@162.com"])',
    'forbid|1-10': true,
    'lastLoginTime': '@datetime',
    'lastLoginIp': '@ip',
    'description': '@pick(["车主嘱咐描述","备注"])',
    'createTime': '@datetime',
    'updateTime': '@datetime',
    'isDelete|1-10': true,
    'roles|1': [
      {
        'roleId': '@id',
        'name': '@pick(["超级管理员", "普通管理员"])',
        'description': '@capitalize("角色")'
      }
    ],
    'permissions|1-2': [
      {
        'parentId': '@id',
        'permissionId': '@id',
        'parentName': '@pick(["车间管理", "客户管理", "财务管理"])',
        'name': '@pick(["添加", "修改", "删除"])',
        'parentUrl': function () {
          var _url = ''
          if(this.parentName === '车间管理') {
            _url = '/plant'
          } else if (this.parentName === '客户管理') {
            _url = '/client'
          } else {
            _url = '/financial'
          }
          return _url
        },
        'url': function () {
          var _url = ''
          if(this.name === '添加') {
            _url = 'add'
          } else if (this.name === '修改') {
            _url = 'edit'
          } else {
            _url = 'remove'
          }
          return this.parentUrl + '/' + _url
        },
        'description': function () {
          return this.parentName + '/' + this.name
        }
      }
    ],
    'company': {
      'companyId': '@id',
      'name': '@pick(["深圳分店", "甘肃分店","北京分店"])',
      'code': '@string("upper", 5)',
      'address': function () {
        return this.name.split('分店')[0]
      },
      'mobile': '@pick(["18802778898","18102238898","13802770898"])',
      'defaultCarNo': '@pick(["甘A","粤A","粤B"])',
      'brand': '@pick(["辉门冠军","鼎泰冠军","欧美冠军"])',
      'type': '@pick(["快修门店","快洗门店"])',
      'serviceTime': '@time("A HH:mm:ss")',
      'email': '@email',
      'description': '@capitalize("分店")'
    }
  }
}

var Clients = {
  'success': '@pick(["true","false"])',
  'errorNo': function () {
    var errorNo = 0
    if(this.success === 'false') {
      errorNo = '1'
    }
    return errorNo
  },
  'errorMsg': function () {
    var errorMsg = ''
    if(this.errorType === '1') {
      errorMsg = '失败'
    } else {
      errorMsg = '成功'
    }
    return errorMsg
  },
  'clients|1-5': [
    {
      'clientId': '@id',
      'gradeId': '@id',
      'carId': '@id',
      'clientName': '@cname',
      'clientSex': '@pick(["男","女"])',
      'clientMobile': '@pick(["18302778898","18102238898","13802770898"])',
      'clientEmail': '@pick(["1830277@qq.com","2238898@163.com","1380898@162.com"])',
      'clientType': '@pick(["单位","个人"])',
      'clientAddress': '@pick(["深圳", "甘肃","北京"])',
      'description': '@pick(["描述","备注"])',
      'createTime': '@datetime',
      'updateTime': '@datetime',
      'isDelete|1-10': true
    }
  ]
}

var ClientGrade = {
  'gradeId': '@id',
  'gradeName': '@pick(["超级会员","普通会员"])',
  'gradeCode': '@pick(["code1","code2"])',
  'discount': '@pick(["九折","八折"])',
  'description': '@pick(["描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

var Car = {
  'carId': '@id',
  'carNo': '@pick(["粤BNB5201","粤ANB5201"])',
  'carBrand': '@pick(["奥迪","奔驰","宝马"])',
  'carType': '@pick(["A4L","A4"])',
  'carColor': '@pick(["白色","黑色"])',
  'carVIN': '@id',
  'engineNo': '@id',
  'registrationDate': '@datetime',
  'trafficDate': '@datetime',
  'commercialDate': '@datetime',
  'acceptance': '@pick(["太平洋保险公司","平安保险公司"])',
  'sendMan': '@cName',
  'sendManMobile': '@pick(["18302778898","18102238898","13802770898"])',
  'gasoline': '@pick(["空","小于1/4","1/4","1/2","满"])',
  'mileage': '@pick(["1234km","1034km"])',
  'comeDate': '@datetime',
  'leaveDate': '@datetime',
  'description': '@pick(["车主嘱咐描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

var ServiceProject = {
  'serviceId': '@id',
  'serviceName': '@pick(["机油更换","轮胎更换"])',
  'parentId': '@id',
  'parentName': '@pick(["机油","轮胎"])',
  'price': '@pick(["￥200","￥300"])',
  'unit': '@pick(["次","小时"])',
  'count': '@integer',
  'technicianId': '@id',
  'salesmanId': '@id',
  'description': '@pick(["描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

var Production = {
  'productId': '@id',
  'productName': '@pick(["美孚机油","马牌轮胎"])',
  'parentId': '@id',
  'parentName': '@pick(["机油","轮胎"])',
  'price': '@pick(["￥200","￥300"])',
  'unit': '@pick(["瓶","个"])',
  'count': '@integer',
  'operator': '@cName',
  'salesmanId': '@id',
  'description': '@pick(["描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

var Technician = {
  'technicianId': '@id',
  'technicianName': '@cName',
  'description': '@pick(["描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

var Salesman = {
  'salesmanId': '@id',
  'salesmanName': '@cName',
  'description': '@pick(["描述","备注"])',
  'createTime': '@datetime',
  'updateTime': '@datetime',
  'isDelete|1-10': true
}

/**
 * 使用mockjs批量生成假数据
 */
//Mock.mock('/account/findAll', Accounts)
//Mock.mock('/account/findByNameAndPwd', Account)
