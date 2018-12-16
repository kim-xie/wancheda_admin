<template>
  <div id="serviceProject">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">项目代码</span>
          <div class="searchInput">
            <el-input v-model="search.code" class="input" placeholder="请输入项目代码"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">项目名称</span>
          <div class="searchInput">
            <el-input v-model="search.name" class="input" placeholder="请输入项目名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">维修工种</span>
          <div class="searchInput">
            <el-select v-model="search.workTypeLK" placeholder="请选择维修工种">
              <el-option
                v-for="item in workType"
                :key="item.id"
                :label="item.value"
                :value="item.id">
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
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
          <div class="tableTitle">
            <el-button type="primary" icon="plus"  @click="addServiceProject">新增项目</el-button>
            <el-button type="danger" icon="delete"  @click="removeServiceProject">批量删除</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="20">
              <el-table :data="repairItemTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="55"> </el-table-column>
                <el-table-column align="center" prop="code" label="项目代码" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="name" label="项目名称" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="workHour" label="数量/工时"></el-table-column>
                <el-table-column align="center" prop="sum" label="单价" width="80"></el-table-column>
                <el-table-column align="center" prop="date.workTypeLK.value" label="工种" width="80"></el-table-column>
                <el-table-column align="center" prop="description" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" width="160">
                  <template scope="scope">
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
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 新增项目 -->
    <el-dialog title="新增项目" :visible.sync="showForm" class="repairItemForm">
      <el-form :model="repairItemForm" ref="repairItemForm" :rules="rules">
        <el-form-item label="项目代码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="repairItemForm.code" auto-complete="off" placeholder="请输入项目代码"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="repairItemForm.name" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="typeLK">
          <el-select v-model="repairItemForm.typeLK" placeholder="请选择项目所属分类">
            <el-option
              v-for="item in repairType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修工种" :label-width="formLabelWidth" prop="workTypeLK">
          <el-select v-model="repairItemForm.workTypeLK" placeholder="请选择维修工种">
            <el-option
              v-for="item in workType"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量/工时" :label-width="formLabelWidth" prop="workHour">
          <el-input placeholder="请输入数量/工时" type="number" v-model="repairItemForm.workHour">
          </el-input>
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth" prop="sum">
          <el-input placeholder="单价" type="number" v-model="repairItemForm.sum">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="repairItemForm.description" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="restForm('repairItemForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('repairItemForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDataFormLUP } from '@/assets/js/utils'
export default {
  name: 'serviceProject',
  data (){
    return {
      search: {
        workTypeLK: ''
      },
      repairItemTableData: [],
      repairItemForm: {},
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入项目代码', trigger: 'blur' }
        ],
        typeLK: [
          { required: true, message: '请选择项目所属分类', trigger: 'blur' }
        ],
        workTypeLK: [
          { required: true, message: '请选择维修工种', trigger: 'blur' }
        ],
        workHour: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        sum: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      workType: {},
      repairType: {},
      pageNo: 1,
      pageSize: 10,
      total: 0,
      edit: false,
      isLocked: false,
      multipleSelection: [],
      showForm: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    let _this = this
    _this.loadData(this.pageNo,this.pageSize)
    _this.getTreeData()
    getDataFormLUP('repair_type',function() {_this.repairType = this})
    getDataFormLUP('work_type',function() {_this.workType = this})
  },
  methods: {
    loadData(pageNo,pageSize) {
      this.$http.get('/supercar/repairItem/page',{
        params: {
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.repairItemTableData = response.body.data.page.content
        this.total = response.body.data.page.numberOfElements
      })
    },
    goSearch() {
      if(this.search.name || this.search.code || this.search.workTypeLK){
        this.serachData()
      }else{
        this.$message({
          type: 'info',
          message: '请输入搜索条件',
          duration: 2000,
          showClose: true
        })
      }
    },
    restSearch() {
      this.search.name = ''
      this.search.code = ''
      this.search.workTypeLK = ''
      this.search.typeLK = ''
      this.getTreeData()
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/repairItem/page',{
        params: {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.workTypeLK_eq': this.search.workTypeLK,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.repairItemTableData = response.body.data.page.content
        this.total = response.body.data.page.numberOfElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接错误，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    getTreeData() {
      this.$http.get('/supercar/lookup/getTree?lookupDefineCode=repair_type').then((response) => {
        this.treeData = response.body.data.entitys
      })
    },
    handleNodeClick(data) {
      this.search.typeLK = data.id
      this.$http.get('/supercar/repairItem/page',{
        params: {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.typeLK_eq': this.search.typeLK,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.repairItemTableData = response.body.data.page.content
        this.total = response.body.data.page.numberOfElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接错误，请重试！',
          duration: 2000,
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
      this.repairItemForm = row
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
        this.$http.delete('/supercar/repairItem/removeById',{params:{id:row.id}}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
          })
          this.loadData(1,this.pageSize)
        }, response => {
          this.$message({
            type: 'error',
            message: '网络连接错误，请重试！',
            duration: 2000,
            showClose: true
          })
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
    addServiceProject() {
      this.showForm = true
      this.repairItemForm = {
        typeLK: '',
        code: '',
        name: '',
        workTypeLK: '',
        workHour: '',
        sum: '',
        description: '',
      }
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
              url = '/supercar/repairItem/edit'
            }else{
              url = '/supercar/repairItem/new'
            }
            this.$http.post(url, this.repairItemForm,{emulateJSON:true}).then((response) => {
              this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 2000,
                showClose: true
              })
              this.restForm(formName)
              this.loadData(1,this.pageSize)
              this.isLocked = false
            }, response => {
              this.$message({
                type: 'error',
                message: '网络连接错误，请重试！',
                duration: 2000,
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
    removeServiceProject() {
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
          this.$http.delete('/supercar/repairItem/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
            this.$message({
                type: 'success',
                message: response.body.errorMsg,
                duration: 2000,
                showClose: true
            })
            this.loadData(1,this.pageSize)
          }, response => {
            this.$message({
              type: 'error',
              message: '网络连接错误，请重试！',
              duration: 2000,
              showClose: true
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除',
            duration: 2000,
            showClose: true
          })
        })
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
      this.multipleSelection = val
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

.el-select {
  width: 100%;
}

</style>
