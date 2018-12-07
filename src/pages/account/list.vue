<template>
  <div id="accountList">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6" v-if="userRole == 'super_admin'">
        <div class="grid-content">
          <span class="searchTitle">公司名称</span>
          <div class="searchInput">
            <el-select v-model="search.company" placeholder="请选择账号所属门店">
              <el-option
                v-for="item in companys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">账号名称</span>
          <div class="searchInput">
            <el-input v-model="search.username" class="input" placeholder="请输入账号名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">手机号码</span>
          <div class="searchInput">
            <el-input v-model="search.mobile" class="input" placeholder="请输入手机号码"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="goSearch">搜 索</el-button>
          <el-button type="primary" icon="close" @click="restSearch">重 置</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle" v-if="userRole == 'super_admin' || userRole == 'company_admin'">
            <el-button type="primary" icon="plus"  @click="addAccount">新增账号</el-button>
            <el-button type="danger" icon="delete"  @click="removeAccount">批量删除</el-button>
          </div>
          <el-table :data="accountTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="username" width="120" label="账号名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="fullname" width="120" label="真实姓名" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="password" label="账号密码" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" prop="mobile" width="130" label="手机号码" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="date.role.value" label="所属角色" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="date.company.name" label="所属分店" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" sortable width="180" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" sortable width="180" label="更新时间" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="isDisable" label="状态" width="80" show-overflow-tooltip>
              <template slots-scope="scope" >
                <el-tag v-if="scope.row.isDisable === false" size="small" type="success">启用</el-tag>
                <el-tag v-if="scope.row.isDisable === true" size="small" type="warning">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" v-if="userRole=='super_admin' || userRole=='company_admin'">
              <template slots-scope="scope">
                <el-button v-if="scope.row.isDisable === false" size="small" :plain="true" type="warning" @click="handleDisable(scope.$index, scope.row)">禁用</el-button>
                <el-button v-if="scope.row.isDisable === true" size="small" :plain="true" type="success" @click="handleDisable(scope.$index, scope.row)">启用</el-button>
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tablePages">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增账号 -->
    <el-dialog title="新增账号" :visible.sync="showForm" class="accountForm">
      <el-form :model="accountForm" ref="accountForm" :rules="rules">
        <el-form-item label="账号名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="accountForm.username" auto-complete="off" placeholder="请输入账号名称"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="fullname">
          <el-input v-model="accountForm.fullname" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" :label-width="formLabelWidth" prop="company">
          <el-select v-model="accountForm.company" placeholder="请选择账号所属门店">
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="accountForm.role" placeholder="请选择账号所属角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初始密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="accountForm.password" type="password" placeholder="请输入初始密码"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="accountForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-radio-group v-model="accountForm.sex">
            <el-radio class="radio" :label="true">男</el-radio>
            <el-radio class="radio" :label="false">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否禁用" :label-width="formLabelWidth" prop="isDisable">
          <el-radio-group v-model="accountForm.isDisable">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="accountForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="accountForm.description" type="textarea" :rows="2" placeholder="请输入客户信息备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="restForm('accountForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('accountForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CryptoJS from 'crypto-js/core'
import MD5 from 'crypto-js/md5'
import AES from 'crypto-js/aes'
import {getDataFormLUP, getDataFormLUPById, getStore} from '@/assets/js/utils'
import { mapState } from 'vuex'
export default {
  name: 'accountList',
  data (){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.accountForm.checkPass !== '') {
          this.$refs.accountForm.validateField('checkPass')
        }
        callback()
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.accountForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      search: {
        company: ''
      },
      accountTableData: [],
      accountForm: {
        username: '',
        sex: '',
        fullname: '',
        password: '',
        mobile: '',
        email: '',
        role: '',
        company: '',
        isDisable: false,
        description: ''
      },
      rules: {
        username: [
          { required: true, message: '账号名不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '所属角色不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '所属门店不能为空', trigger: 'blur' }
        ]
      },
      roles: [],
      companys: [],
      edit: false,
      isLocked: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      showForm: false,
      formLabelWidth: '120px'
    }
  },
  beforeCreate() {

  },
  created() {
    
  },
  beforeMount(){

  },
  mounted(){
    let _this = this
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
      _this.loadData(_this.pageNo, _this.pageSize)
      _this.getCompanys()
      getDataFormLUP('user_role',function(){
        let newUserRole = this
        if(_this.userRole == 'super_admin'){
            _this.roles = newUserRole
        }else{
          for(var i=0;i<newUserRole.length;i++){
            if(newUserRole[i].code == 'super_admin'){
               newUserRole.splice(i,1)
            }
          }
          _this.roles = newUserRole
        }
      })
    },1000)
  },
  beforeUpdate(){

  },
  updated(){

  },
  beforeDestory(){

  },
  destroyed(){

  },
  computed: mapState({

  }),
  methods: {
    loadData(pageNo,pageSize) {
      if(this.userRole == 'super_admin'){
        this.usercompany = '',
        this.userId = ''
      } else if(this.userRole == 'company_admin'){
        this.userId = ''
      }
      this.$http.get('/supercar/user/page',{
        params:{
          'search.id_eq': this.userId,
          'search.company_eq': this.usercompany,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.accountTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      })
    },
    goSearch() {
      if(this.userRole == 'super_admin'){
        this.usercompany = this.search.company,
        this.userId = ''
      } else if(this.userRole == 'company_admin'){
        this.userId = ''
      }
      if(this.search.username || this.search.company || this.search.mobile){
        this.serachData()
      }else{
        this.$message({
          type: 'info',
          message: '请输入搜索条件',
          duration: 3000,
          showClose: true
        })
      }
    },
    restSearch() {
      this.search.username = ''
      this.search.company = ''
      this.search.mobile = ''
      if(this.userRole == 'super_admin'){
        this.usercompany = this.search.company,
        this.userId = ''
      } else if(this.userRole == 'company_admin'){
        this.userId = ''
      }
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/user/page',{
        params: {
          'search.id_eq': this.userId,
          'search.username_like': this.search.username,
          'search.company_eq': this.usercompany,
          'search.mobile_like': this.search.mobile,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.accountTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接失败，请重试！',
          duration: 3000,
          showClose: true
        })
      })
    },
    handleDisable(index,row) {
      if(row.isDisable === false){
        row.isDisable = true
      }else{
        row.isDisable = false
      }
      let updateObj = {id:row.id,isDisable:row.isDisable}
      this.$http.post('/supercar/user/edit', updateObj, {emulateJSON:true}).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功',
          duration: 3000,
          showClose: true
        })
      }, response => {
        this.$message({
          type: 'error',
          message: '操作失败',
          duration: 3000,
          showClose: true
        })
      })
    },
    getCompanys() {
      let _this = this
      this.$http.get('/supercar/company/page?search.id_eq='+_this.usercompany+'&search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleEdit(index, row) {
      this.accountForm.id = row.id
      this.accountForm.username = row.username
      this.accountForm.sex = row.sex
      this.accountForm.fullname = row.fullname
      this.accountForm.password = row.password
      this.accountForm.mobile = row.mobile
      this.accountForm.email = row.email
      this.accountForm.role = row.role
      this.accountForm.company = row.company
      this.accountForm.isDisable = row.isDisable
      this.accountForm.description = row.description
      this.showForm = true
      this.edit = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 第一种传参方式传string类型参数
        this.$http.delete('/supercar/user/removeById',{params:{id:row.id}}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 3000,
              showClose: true
          })
          this.loadData(1, this.pageSize)
        }, response => {
          this.$message({
            type: 'error',
            message: '网络连接错误，请重试！',
            duration: 3000,
            showClose: true
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您已取消删除',
          duration: 3000,
          showClose: true
        })
      })
    },
    addAccount() {
      this.accountForm = {
        username: '',
        sex: '',
        fullname: '',
        password: '',
        mobile: '',
        email: '',
        role: '',
        company: '',
        isDisable: false,
        description: ''
      }
      this.showForm = true
    },
    restForm(formName) {
      this.$refs[formName].resetFields()
      this.showForm = false
      this.edit = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            var url = ''
            var _this = this
            if(this.edit){
              url = '/supercar/user/edit'
            }else{
              url = '/supercar/user/register'
            }
            if(this.accountForm.password.length != 32){
              this.accountForm.password = CryptoJS.MD5(this.accountForm.password).toString()
            }
            this.$http.post(url, this.accountForm, {emulateJSON:true}).then((response) => {
              this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 3000,
                showClose: true
              })
              this.restForm(formName)
              this.loadData(1, this.pageSize)
              this.isLocked = false
            }, response => {
              this.$message({
                type: 'error',
                message: '网络连接错误，请重试！',
                duration: 3000,
                showClose: true
              })
              this.isLocked = false
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    removeAccount() {
      if(this.multipleSelection.length > 1){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = []
          for(var i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id)
          }
          this.$http.delete('/supercar/user/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
            this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 3000,
                showClose: true
            })
            this.loadData(1, this.pageSize)
          }, response => {
            this.$message({
              type: 'error',
              message: '网络连接错误，请重试！',
              duration: 3000,
              showClose: true
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除'
          });
        });
      }else{
        this.$message({
          type: 'warning',
          message: '抱歉!此操作只适用于批量数据!',
          duration: 3000,
          showClose: true
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
}

</script>

<style scoped>
.searchBox {
  margin: 15px 0;
}

.searchBox .searchTitle {
  display: inline-block;
  min-width: 60px;
  width: 16%;
  height: 36px;
  line-height: 36px;
  float: left;
  font-size: 14px;
  font-weight: 600;
}

.searchBox .searchInput {
  display: inline-block;
  width: 80%;
}

.searchBox .searchInput .block {
  display: inline-block;
  width: 100%;
}

.el-date-editor.el-input {
  width: 100%;
}

.clientInfoBox {
  margin-bottom: 20px;
}

.tableTitle {
  margin: 5px 0 20px 0;
}

.tablePages {
  margin: 10px 0;
  float: right;
}

.el-form-item {
  width: 50%;
  float: left;
}

.el-select {
  width: 100%;
}

</style>
