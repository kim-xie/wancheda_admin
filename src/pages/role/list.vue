<template>
  <div id="roleList">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">角色名称</span>
          <div class="searchInput">
            <el-input v-model="search.name" class="input" placeholder="请输入角色名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">开始时间</span>
          <div class="searchInput">
            <div class="block">
              <el-date-picker v-model="search.startDate" type="datetime" placeholder="选择开始日期时间"></el-date-picker>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">结束时间</span>
          <div class="searchInput">
            <div class="block">
              <el-date-picker v-model="search.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="goSearch">搜 索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <el-button type="primary" icon="plus"  @click="addRole">新增角色</el-button>
            <el-button type="danger" icon="delete"  @click="removeRole">批量删除</el-button>
          </div>
          <el-table :data="roleTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="code" label="角色代码" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="count" label="人数" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="accountNames" label="账号名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createTime" sortable label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" sortable label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template slots-scope="scope">
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
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="showForm" class="roleForm">
      <el-form :model="roleForm" ref="roleForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="roleForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色代码"></el-input>
        </el-form-item>
        <el-form-item label="选择账号" :label-width="formLabelWidth" prop="accountNames">
          <el-select v-model="roleForm.accountName" placeholder="请选择账号">
            <el-option label="超级客户" value="accountNames"></el-option>
            <el-option label="普通客户" value="accountNames"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配权限" :label-width="formLabelWidth" prop="permissions">
          <el-select v-model="roleForm.permissions" placeholder="请选择权限">
            <el-option label="超级管理员" value="permissions"></el-option>
            <el-option label="普通管理员" value="permissions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="roleForm.description" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm('roleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'roleList',
  data (){
    return {
      search: {
        name: '',
        startDate: '',
        endDate: ''
      },
      roleTableData: [{
        name: '超级管理员',
        code: 'supermen',
        count: '1',
        accountNames: 'admin',
        description: '超级管理员，拥有至高无上的权利',
        createTime: '2017-6-16 14:38:00',
        updateTime: '2017-6-16 14:38:00'
      }],
      roleForm: {
        name: '',
        code: '',
        accountNames: '',
        permissions: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色代码不能为空', trigger: 'blur' }
        ],
        accountNames: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        permissions: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
        ]
      },
      edit: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      showForm: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.$http.get('/supercar/role/list').then((response) => {
      alert(JSON.stringify(response.body))
      this.roleTableData = response.body.data
      this.total = response.body.data.length
    })
  },
  methods: {
    goSearch() {
      if(this.search.name || this.search.startDate || this.search.endDate){
        this.$http.get('/supercar/role/page',{
          params: {
            'search.name_like': this.search.name,
            'pageNo': 1,
            'pageSize': 10
          }
        },{emulateJSON:true}).then((response) => {
          if(response.body.data.page.content.length !== 0){
            this.roleTableData = response.body.data.page.content
            this.total = response.body.data.page.total
          }else{
            this.$message({
               type: 'info',
               message: '查出无符合条件的数据',
               duration: 2000,
               showClose: true
            })
          }
        }, response => {
          this.$message({
            type: 'error',
            message: response.body.errorMsg,
            duration: 2000,
            showClose: true
          })
        })
      }else{
        this.$message({
          type: 'info',
          message: '请输入搜索条件',
          duration: 2000,
          showClose: true
        })
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
    },
    handleEdit(index, row) {
      this.roleForm = row
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
        this.$http.delete('/supercar/role/removeById',{params:{id:row.id}}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
          })
          window.location.reload()
        }, response => {
          this.$message({
            type: 'error',
            message: response.body.errorMsg,
            duration: 2000,
            showClose: true
          })
          window.location.reload()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您已取消删除',
          duration: 2000,
          showClose: true
        })
      })
    },
    addRole() {
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
          var url = ''
          if(this.edit){
            url = '/supercar/role/edit'
          }else{
            url = '/supercar/role/new'
          }
          alert(JSON.stringify(this.roleForm))
          this.$http.post(url, this.roleForm,{emulateJSON:true}).then((response) => {
            this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
            })
            this.restForm(formName)
            window.location.reload()
          }, response => {
            this.$message({
              type: 'error',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
            })
            this.restForm(formName)
            window.location.reload()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeRole() {
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
          this.$http.delete('/supercar/role/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
            this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 2000,
                showClose: true
            })
            window.location.reload()
          }, response => {
            this.$message({
              type: 'error',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
            })
            window.location.reload()
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
          duration: 2000,
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
.searchBox{margin: 15px 0;}
.searchBox .searchTitle{display:inline-block;min-width:60px;width:16%;height:36px;line-height:36px;float:left;font-size:14px;font-weight: 600;}
.searchBox .searchInput{display:inline-block;width:84%;}
.searchBox .searchInput .block{display:inline-block;width:100%;}
.el-date-editor.el-input{width:100%;}
.clientInfoBox{margin-bottom:20px;}

.tableTitle{margin:5px 0 20px 0;}
.tablePages{margin:10px 0;float: right;}
.el-select{width: 100%;}

</style>
