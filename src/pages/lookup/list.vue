<template>
  <div id="lookupList">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="10">
        <div class="grid-content">
          <span class="searchTitle">数据字典定义</span>
          <div class="searchInput">
            <el-select v-model="search.code" @change="lookupChange" filterable placeholder="请选择数据字典">
              <el-option
                v-for="(item, index) in lookupDfds"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                :id="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">字典代码</span>
          <div class="searchInput">
            <div class="block">
              <el-input v-model="search.code" placeholder="请输入字典代码"></el-input>
            </div>
          </div>
        </div>
      </el-col> -->
      <el-col :span="6">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="lookupChange">搜 索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="lookupInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <el-button type="primary" icon="plus" @click="addlookup">新增数据</el-button>
            <el-button type="danger" icon="delete" @click="removelookup">批量删除</el-button>
          </div>
          <el-table :data="lookupTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="index" width="55"></el-table-column>
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="value" label="名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="code" label="代码" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="lookupDfName == '客户级别'" align="center" prop="additional" label="折扣" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="lookupDfType == 1" align="center" prop="zzIsLeaf" label="父节点">
              <template scope="scope">
                <el-tag v-if="scope.row.zzIsLeaf == false || scope.row.zzIsLeaf == undefined" :type="scope.row.zzIsLeaf != true ? 'success' : 'primary'" close-transition>
                  是
                </el-tag>
                <el-tag v-if="scope.row.zzIsLeaf == true" :type="scope.row.zzIsLeaf != true ? 'success' : 'primary'" close-transition>
                  否
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button size="small" icon="edit" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" icon="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增数据字典 -->
    <el-dialog title="新增数据字典" :visible.sync="showForm" class="lookupForm">
      <el-form :model="lookupForm" ref="lookupForm" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="value">
          <el-input v-model="lookupForm.value" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="lookupForm.code" :disabled="codeDisable" placeholder="请输入代码"></el-input>
        </el-form-item>
        <template v-if="lookupDfType == 1">
          <el-form-item label="父节点" :label-width="formLabelWidth" prop="parentId">
            <el-select v-model="lookupForm.parentId" clearable placeholder="请选择父节点">
              <el-option
                v-for="item in treeData"
                :key="item.id"
                :label="item.value"
                :value="item.id">
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="lookupDfName == '客户级别'">
          <el-form-item label="折扣" :label-width="formLabelWidth" prop="additional">
            <el-input placeholder="客户折扣" v-model="lookupForm.additional">
              <template slot="append">折</template>
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
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
import { checkDiscount } from '@/assets/js/utils'
export default {
  name: 'lookupList',
  data (){
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      searchcompany: '',
      search: {
        code: ''
      },
      lookupDfds: '',
      loading: false,
      lookupTableData: [],
      lookupForm: {},
      rules: {
        value: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '代码不能为空', trigger: 'blur' }
        ],
        additional: [
          { required: true, validator: checkDiscount, trigger: 'blur' }
        ]
      },
      lookupDefineCode: '',
      lookupDfType: 0,
      lookupDfName: '',
      treeData: {},
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
  created() {
    
  },
  mounted(){
    let _this = this
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
      _this.searchcompany = _this.$store.state.userInfo.company
      _this.loadData(_this.pageNo,_this.pageSize)
    },1000)
  },
  methods: {
    loadData(pageNo,pageSize) {
      let _this = this
      if(this.lookupDefineCode){
        _this.loadLookupData(_this.lookupDefineCode,pageNo,pageSize)
      }else{
        let param = ''
        if(_this.userRole == 'super_admin'){
          param = {
            'search.isDeleted_eq': false,
            'page.pn': 1,
            'page.size':1000
          }
        }else{
          param = {
            'search.code_ne': 'user_role',
            'search.isDeleted_eq': false,
            'page.pn': 1,
            'page.size':1000
          }
        }
        this.$http.get('/supercar/lookup_definition/page',{ params: param }).then((response) => {
          //获取所有数据字典定义
          _this.lookupDfds = response.body.data.page.content
          //默认查询第一个数据字典定义
          _this.search.code = _this.lookupDfds[0].code
          _this.lookupDfName = _this.lookupDfds[0].name
        }, response => {
          console.log('初次加载数据字典时，获取所有数据字典定义请求失败...')
        })
      }
    },
    lookupChange(lookupDefineCode){
      let _this = this
      if(typeof lookupDefineCode !== "string"){
        lookupDefineCode = _this.search.code
      }
      //将数据字典定义code放到全局环境中
      this.lookupDefineCode = lookupDefineCode
      this.loadData(this.pageNo,this.pageSize)
    },
    loadLookupData(lookupDefineCode,pageNo,pageSize){
      let _this = this
      //根据数据字典定义code去分页查询出数据字典
      _this.$http.get('/supercar/lookup/pageByDefineCode',
        {
          params:{
            lookupDefineCode: lookupDefineCode,
            pageNo: pageNo,
            pageSize: pageSize
        }
      }).then((response) => {
        //查询数据字典的数据
        if(response.body.data.page != null){
          _this.lookupTableData = response.body.data.page.content
          _this.total = response.body.data.page.totalElements
        }else{
          _this.lookupTableData = []
          _this.total = 0
        }
        //返回的数据字典没有数据时
        if(_this.lookupTableData.length === 0){
          for(var i=0;i<_this.lookupDfds.length;i++){
            //当前选中的数据字典找到对应的数据字典定义Id、类型、名称
            if(lookupDefineCode === _this.lookupDfds[i].code){
              _this.lookupForm.definitionId = _this.lookupDfds[i].id
              _this.lookupDfType = _this.lookupDfds[i].type
              _this.lookupDfName = _this.lookupDfds[i].name
              //如果是树形数据字典则需要去加载树形下拉数据
              if(_this.lookupDfType === '1'){
                _this.$http.get('/supercar/lookup/pageByDefineCode',
                {
                  params:{
                    lookupDefineCode: _this.lookupDfds[i].code,
                    pageNo: 1,
                    pageSize: 1000
                  }
                }).then((response) => {
                  _this.treeData = response.body.data.page.content
                }, response => {
                  console.log('选择数据字典定义时，根据数据字典定义code获取数据字典请求失败...')
                })
              }
              break
            }
          }
        }else{
          //返回的数据字典有数据
          //拿到数据字典定义Id
          _this.lookupForm.definitionId = _this.lookupTableData[0].definitionId
          //找到选中的数据字典定义名称、类型
          for(var i=0;i<_this.lookupDfds.length;i++){
            if(_this.lookupForm.definitionId === _this.lookupDfds[i].id){
              _this.lookupDfType = _this.lookupDfds[i].type
              _this.lookupDfName = _this.lookupDfds[i].name
              //如果是树形数据字典则需要去加载树形下拉数据
              if(_this.lookupDfType === '1'){
                _this.$http.get('/supercar/lookup/pageByDefineCode',
                {
                  params:{
                    lookupDefineCode: _this.lookupDfds[i].code,
                    pageNo: 1,
                    pageSize: 1000
                  }
                }).then((response) => {
                  _this.treeData = response.body.data.page.content
                }, response => {
                  console.log('选择数据字典定义时，根据数据字典定义code获取数据字典请求失败...')
                })
              }
              break
            }
          }
        }
      }, response => {
        console.log('选择数据字典定义时，根据数据字典定义code获取数据字典请求失败...')
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
      this.lookupForm = row
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
        this.$http.delete('/supercar/lookup/removeById',{params:{id:row.id}}).then((response) => {
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
            message: '网络请求异常，请重试！',
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
    vilidateCode(definitionId,lookupCode,callback){
      this.$http.get('/supercar/lookup/checkCodeRepeat?definitionId='+definitionId+'&lookupCode='+lookupCode)
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
    addlookup() {
      //alert(JSON.stringify(this.lookupForm.definitionId))
      this.edit = false
      this.codeDisable = false
      this.lookupForm = {
        definitionId: this.lookupForm.definitionId,
        value: '',
        code: '',
        parentId: '',
        description: ''
      }
      this.showForm = true
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
              _this.formSubmit(_this,'/supercar/lookup/edit',_this.lookupForm,formName)
            }else{
              _this.vilidateCode(_this.lookupForm.definitionId,_this.lookupForm.code,function(){
                _this.formSubmit(_this,'/supercar/lookup/new',_this.lookupForm,formName)
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
      //alert(JSON.stringify(lookupForm))
      obj.$http.post(url,lookupForm,{emulateJSON:true}).then((response) => {
        obj.$message({
          type: 'success',
          message: response.body.errorMsg,
          duration: 3000,
          showClose: true
        })
        obj.restForm(formName)
        obj.loadData()
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
          this.$http.delete('/supercar/lookup/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
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
              message: '网络请求失败，请重试！',
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
  height: 36px;
  line-height: 36px;
  width: 16%;
  float: left;
  margin-right: 6px;
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
