<template>
  <div id="lookupList">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">名称</span>
          <div class="searchInput">
            <div class="block">
              <el-input v-model="search.name" placeholder="请输入名称"></el-input>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">代码</span>
          <div class="searchInput">
            <div class="block">
              <el-input v-model="search.code" placeholder="请输入代码" @keyup="vilidateCode"></el-input>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="goSearch" >搜 索</el-button>
          <el-button type="primary" icon="close" @click="restSearch" >重 置</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="lookupInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <el-button type="primary" icon="plus"  @click="addlookup">新增数据</el-button>
            <el-button v-if="userRole === 'super_admin' || userRole === 'company_admin'" type="danger" icon="delete"  @click="removelookup">批量删除</el-button>
          </div>
          <el-table :data="lookupTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="index" width="55"></el-table-column>
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="name" label="名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="code" label="代码" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" sortable label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" sortable label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button size="small" icon="edit" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button v-if="userRole === 'super_admin' || userRole === 'company_admin'" size="small" icon="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增数据字典定义 -->
    <el-dialog title="新增数据字典定义" :visible.sync="showForm" class="lookupForm">
      <el-form :model="lookupForm" ref="lookupForm" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="lookupForm.name" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="lookupForm.code" :disabled="codeDisable" placeholder="请输入代码"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="lookupForm.type" placeholder="请选择数据字典定义类型">
            <el-option
              v-for="item in lkupDfType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="lookupForm.description" type="textarea" :rows="2" placeholder="请输入描述信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="restForm('lookupForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('lookupForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLookupDf, removeLookupDf } from '@/service/getData'
import { getStore, isSuperAdmin } from '@/assets/js/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'lookupList',
  data (){
    return {
      usercompany: '',
      search: {},
      lookupTableData: [],
      lookupForm: {
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '代码不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      },
      lkupDfType: [
        {
          label: '普通结构',
          value: '0',
        },
        {
          label: '树形结构',
          value: '1',
        }
      ],
      edit: false,
      codeDisable: false,
      isLocked: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      showForm: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'userRole',
      'company'
    ])
  },
  created() {
    const _this = this
    if(!this.userRole){
      const userInfo = JSON.parse(getStore('session'))
      this.$store.dispatch('getSessionUserInfo', userInfo)
    }
    this.usercompany = this.company
    this.loadData(this.pageNo, this.pageSize)
  },
  mounted(){
  },
  methods: {
    vilidateCode(lookupDfCode,callback){
      this.$http.get('/supercar/lookup_definition/checkCodeRepeat?lookupDfCode='+lookupDfCode)
      .then((response) => {
        if(!response.body.success){
          this.$message({
            type: 'error',
            message: response.body.errorMsg,
            duration: 3000,
            showClose: true
          })
        }else{
          if(callback){
            callback()
          }
        }
      }, response => {
        this.$message({
          type: 'error',
          message: '网络请求异常，请重试！',
          duration: 3000,
          showClose: true
        })
      })
    },
    loadData(pageNo, pageSize) {
      let _this = this
      let param = ''
      if(isSuperAdmin(this.userRole)){
        param = {
          'loading': true,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size':pageSize
        }
      }else{
        param = {
          'loading': true,
          'search.code_ne': 'user_role',
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size':pageSize
        }
      }
      this.$http.get('/supercar/lookup_definition/page',{ params: param }).then((response) => {
        this.lookupTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'info',
          message: '网络请求失败',
          duration: 3000,
          showClose: true
        })
      })
    },
    goSearch() {
      if(this.search.name || this.search.code){
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
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/lookup_definition/page',{
        params: {
          'loading': true,
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.lookupTableData = response.body.data.page.content
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
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleEdit(index, row) {
      this.lookupForm.id = row.id
      this.lookupForm.name = row.name
      this.lookupForm.code = row.code
      this.lookupForm.type = row.type
      this.lookupForm.description = row.description
      this.showForm = true
      this.edit = true
      this.codeDisable = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 第一种传参方式传string类型参数
        this.$http.get('/supercar/lookup_definition/removeById',{params:{id:row.id}}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 3000,
              showClose: true
          })
          this.loadData(this.pageNo, this.pageSize)
        }, response => {
          this.$message({
            type: 'error',
            message: '网络请求失败，请重试！',
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
    addlookup() {
      this.showForm = true
      this.edit = false
      this.codeDisable = false
      this.lookupForm = {
        name: '',
        code: '',
        type: '',
        description: ''
      }
    },
    restForm(formName) {
      this.$refs[formName].resetFields()
      this.showForm = false
      this.edit = false
      this.codeDisable = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            var _this = this
            if(this.edit){
              _this.formSubmit(_this,'/supercar/lookup_definition/edit',_this.lookupForm,formName)
            }else{
              _this.vilidateCode(_this.lookupForm.code,function(){
                _this.formSubmit(_this,'/supercar/lookup_definition/new',_this.lookupForm,formName)
              })
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    formSubmit(obj,url,lookupForm,formName) {
      obj.$http.post(url,lookupForm,{emulateJSON:true}).then((response) => {
        obj.$message({
          type: 'success',
          message: response.body.errorMsg,
          duration: 3000,
          showClose: true
        })
        obj.restForm(formName)
        obj.loadData(this.pageNo, this.pageSize)
        obj.isLocked = false
      }, response => {
        obj.$message({
          type: 'error',
          message: '网络请求失败，请重试！',
          duration: 3000,
          showClose: true
        })
        obj.isLocked = false
      })
    },
    removelookup() {
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
          this.$http.delete('/supercar/lookup_definition/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
            this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 3000,
                showClose: true
            })
            this.loadData(this.pageNo, this.pageSize)
          }, response => {
            this.$message({
              type: 'error',
              message: '网络请求失败，请重试！',
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
      this.multipleSelection = val
    }
  }
}

</script>

<style scoped>
.searchBox {
  margin: 15px 0;
}

.searchBox .searchTitle {
  display: inline-block;
  margin-right: 6px;
  height: 36px;
  line-height: 36px;
  float: left;
  font-size: 14px;
  font-weight: 600;
}

.searchBox .searchInput {
  display: inline-block;
  width: 84%;
}

.searchBox .searchInput .block {
  display: inline-block;
  width: 100%;
}

.el-date-editor.el-input {
  width: 100%;
}

.lookupInfoBox {
  margin-bottom: 20px;
}

.tableTitle {
  margin: 5px 0 20px 0;
}

.tablePages {
  margin: 10px 0;
  float: right;
}

.el-select {
  width: 100%;
}

</style>
