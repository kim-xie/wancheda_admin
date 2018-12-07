<template>
  <div id="companyList">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">门店名称</span>
          <div class="searchInput">
            <el-input v-model="search.name" class="input" placeholder="请输入门店名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">门店代码</span>
          <div class="searchInput">
            <el-input v-model="search.code" class="input" placeholder="请输入门店代码"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">门店地址</span>
          <div class="searchInput">
            <el-input v-model="search.address" class="input" placeholder="请输入门店地址"></el-input>
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
          <div class="tableTitle" v-if="userRole=='super_admin'">
            <el-button type="primary" icon="plus"  @click="addCompany">新增门店</el-button>
            <el-button type="danger" icon="delete"  @click="removeCompany">批量删除</el-button>
          </div>
          <el-table :data="companyTableData" border tooltip-effect="dark" style="width: 100%" :default-sort="{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column type="expand">
              <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="门店品牌">
                    <span>{{ props.row.brand }}</span>
                  </el-form-item>
                  <el-form-item label="门店类型">
                    <span>{{ props.row.date.type.value }}</span>
                  </el-form-item>
                  <el-form-item label="客服热线">
                    <span>{{ props.row.mobile }}</span>
                  </el-form-item>
                  <el-form-item label="默认车牌">
                    <span>{{ props.row.carNo }}</span>
                  </el-form-item>
                  <el-form-item label="门店邮箱">
                    <span>{{ props.row.email }}</span>
                  </el-form-item>
                  <el-form-item label="营业时间">
                    <span>{{ props.row.openTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="name" label="门店名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="code" label="门店代码" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="address" label="门店地址" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="count" label="人数" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="accounts" label="已分配账号" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" sortable label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" sortable label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="200" v-if="userRole=='super_admin' || userRole=='company_admin'" >
              <template scope="scope">
                <el-button 
                  size="small" 
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button 
                  v-if="userRole=='super_admin'" 
                  size="small" 
                  type="danger" 
                  :plain="true"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增门店 -->
    <div>
      <el-dialog title="新增门店" :visible.sync="showForm">
        <el-form ref="companyForm" :model="companyForm" :rules="rules">
          <el-form-item label="门店名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="companyForm.name" auto-complete="off" placeholder="请输入门店名称"></el-input>
          </el-form-item>
          <el-form-item label="门店代码" :label-width="formLabelWidth" prop="code">
            <el-input v-model="companyForm.code" placeholder="请输入门店代码"></el-input>
          </el-form-item>
          <el-form-item label="门店类型" :label-width="formLabelWidth" prop="type">
            <el-select v-model="companyForm.type" placeholder="请选择门店类型">
              <el-option
                v-for="item in companyType"
                :key="item.id"
                :label="item.value"
                :value="item.id">
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="companyForm.address" placeholder="请输入门店地址"></el-input>
          </el-form-item>
          <el-form-item label="门店品牌" :label-width="formLabelWidth" prop="brand">
            <el-input v-model="companyForm.brand" placeholder="请输入门店品牌"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分配账号" :label-width="formLabelWidth" prop="accounts">
            <el-select v-model="companyForm.accounts" multiple filterable placeholder="请选择账号可搜索">
              <el-option label="kings" value="1"></el-option>
              <el-option label="xdj" value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="客服热线" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="companyForm.mobile" placeholder="请输入客服热线"></el-input>
          </el-form-item>
          <el-form-item label="门店邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="companyForm.email" placeholder="请输入门店邮箱"></el-input>
          </el-form-item>
          <!-- <el-form-item label="门店人数" :label-width="formLabelWidth" prop="count">
            <el-input v-model="companyForm.count" placeholder="请输入门店人数"></el-input>
          </el-form-item> -->
          <el-form-item label="默认车牌" :label-width="formLabelWidth" prop="carNo">
            <el-input v-model="companyForm.carNo" placeholder="请输入默认车牌"></el-input>
          </el-form-item>
          <!-- <el-form-item label="营业时间" :label-width="formLabelWidth" prop="openTime">
            <el-time-picker is-range v-model="companyForm.openTime" placeholder="请选择营业时间"></el-time-picker>
          </el-form-item> -->
          <el-form-item label="备注" :label-width="formLabelWidth" style="width:100%;">
            <el-input v-model="companyForm.description" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button @click="restForm('companyForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('companyForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    

  </div>
</template>

<script>
import { getDataFormLUP } from '@/assets/js/utils'
export default {
  name: 'companyList',
  data (){
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      search: {},
      companyTableData: [],
      companyForm: {
        name: '',
        code: '',
        type: '',
        address: '',
        brand: '',
        mobile: '',
        email: '',
        carNo: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '门店代码不能为空', trigger: 'blur' }
        ],
        accounts: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ],
        carNo: [
          { required: true, message: '默认车牌不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '客服热线不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '门店类型不能为空', trigger: 'blur' }
        ]
      },
      edit: false,
      isLocked: false,
      companyType: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      showForm: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    let _this = this
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
      _this.loadData(_this.pageNo, _this.pageSize)
    },1000)
    getDataFormLUP('company_type',function() {_this.companyType = this})
  },
  methods: {
    goSearch() {
      if(this.userRole == 'super_admin'){
        this.usercompany = this.search.company
      } 
      if(this.search.name || this.search.code || this.search.address || this.search.company){
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
      this.search.name = ''
      this.search.code = ''
      this.search.address = ''
      if(this.userRole == 'super_admin'){
        this.usercompany = ''
      }
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/company/page',{
        params: {
          'search.id_eq': this.usercompany,
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.address_like': this.search.address,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.companyTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接错误，请重试！',
          duration: 3000,
          showClose: true
        })
      })
    },
    loadData(pageNo,pageSize) {
      if(this.userRole == 'super_admin'){
        this.usercompany = ''
      }
      this.$http.get('/supercar/company/page',{
        params:{
          'search.id_eq': this.usercompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
          this.companyTableData = response.body.data.page.content
          this.total = response.body.data.page.totalElements
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
      this.companyForm.id = row.id
      this.companyForm.name = row.name
      this.companyForm.code = row.code
      this.companyForm.type = row.type
      this.companyForm.address = row.address
      this.companyForm.brand = row.brand
      this.companyForm.mobile = row.mobile
      this.companyForm.email = row.email
      this.companyForm.carNo = row.carNo
      this.companyForm.description = row.description
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
        this.$http.delete('/supercar/company/removeById',{params:{id:row.id}}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 3000,
              showClose: true
          })
          this.loadData(1,this.pageSize)
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
    addCompany() {
      this.companyForm = {
        name: '',
        code: '',
        type: '',
        address: '',
        brand: '',
        mobile: '',
        email: '',
        carNo: '',
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
            if(this.edit){
              url = '/supercar/company/edit'
            }else{
              url = '/supercar/company/new'
            }
            //alert(JSON.stringify(this.companyForm))
            this.$http.post(url, this.companyForm,{emulateJSON:true}).then((response) => {
              this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 3000,
                showClose: true
              })
              this.restForm(formName)
              this.loadData(1,this.pageSize)
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
    removeCompany() {
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
          this.$http.delete('/supercar/company/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
            this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 3000,
                showClose: true
            })
            this.loadData(1,this.pageSize)
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
      //alert(JSON.stringify(val))
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

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

</style>
