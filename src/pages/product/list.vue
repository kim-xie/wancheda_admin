<template>
  <div id="serviceProject">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">配件名称</span>
          <div class="searchInput">
              <el-da<el-input v-model="search.name" class="input" placeholder="请输入配件名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">配件编号</span>
          <div class="searchInput">
            <el-input v-model="search.code" class="input" placeholder="请输入配件编号"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">配件状态</span>
          <div class="searchInput">
            <el-select v-model="search.isDisable" placeholder="请选择配件状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="false"></el-option>
              <el-option label="禁用" value="true"></el-option>
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
            <el-button type="primary" icon="plus" @click="addProduct">新增配件</el-button>
            <el-button type="danger" icon="delete" @click="removeProduct">批量删除</el-button>
          </div>
          <el-row :gutter="10">
            <el-col :span="4">
              <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="20">
              <el-table :data="productTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="55"> </el-table-column>
                <el-table-column align="center" prop="code" label="配件编号" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="name" label="配件名称" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="wholeSale" label="批发价" width="80"></el-table-column>
                <el-table-column align="center" prop="sale" label="销售价" width="80"></el-table-column>
                <el-table-column align="center" prop="date.unitLK.value" label="单位" width="80"></el-table-column>
                <el-table-column align="center" prop="produceArea" label="产地" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="carModel" label="适用车型" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="isDisable" label="状态" width="80" show-overflow-tooltip>
                  <template slots-scope="scope" >
                    <el-tag v-if="scope.row.isDisable === false" size="small" type="success">启用</el-tag>
                    <el-tag v-if="scope.row.isDisable === true" size="small" type="warning">禁用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="260">
                  <template slots-scope="scope">
                    <el-button v-if="scope.row.isDisable === false" size="small" :plain="true" type="warning" @click="handleDisable(scope.$index, scope.row)">禁用</el-button>
                    <el-button v-if="scope.row.isDisable === true" size="small" :plain="true" type="success" @click="handleDisable(scope.$index, scope.row)">启用</el-button>
                    <el-button v-if="scope.row.isDisable === false" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-if="scope.row.isDisable === false" size="small" :plain="true" type="info" @click="handleInpart(scope.$index, scope.row)">入库</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增配件 -->
    <el-dialog title="新增配件" :visible.sync="showForm" class="productForm">
      <el-form :model="productForm" ref="productForm" :rules="rules">
        <el-form-item label="配件编号" :label-width="formLabelWidth" prop="code">
          <el-input v-model="productForm.code" auto-complete="off" placeholder="请输入配件编号"></el-input>
        </el-form-item>
        <el-form-item label="配件名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入配件名称"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="pCategoryLK">
          <el-select v-model="productForm.pCategoryLK" placeholder="请选择配件所属分类">
            <el-option
              v-for="item in pCategory"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配件批发价" :label-width="formLabelWidth" prop="wholeSale">
          <el-input placeholder="配件批发价" v-model="productForm.wholeSale">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件售价" :label-width="formLabelWidth" prop="sale">
          <el-input placeholder="配件售价" v-model="productForm.sale">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件产地" :label-width="formLabelWidth" prop="produceArea">
          <el-input v-model="productForm.produceArea" placeholder="请输入配件产地"></el-input>
        </el-form-item>
        <el-form-item label="配件单位" :label-width="formLabelWidth" prop="unitLK">
          <el-select v-model="productForm.unitLK" placeholder="请选择配件单位">
            <el-option
              v-for="item in unitObj"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配件规格" :label-width="formLabelWidth" prop="specificationLK">
          <el-select v-model="productForm.specificationLK" placeholder="请选择配件规格">
            <el-option
              v-for="item in specification"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用车型" :label-width="formLabelWidth" prop="carModel">
          <el-input v-model="productForm.carModel" placeholder="请输入适用车型"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="productForm.description" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button @click="restForm('productForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('productForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 配件入库 -->
    <el-dialog title="配件入库" :visible.sync="showOperationForm" class="operationForm">
      <el-form :model="operationForm" ref="operationForm" :rules="rules">
        <el-form-item label="进货价" :label-width="formLabelWidth" prop="cost" style="width:100%;">
          <el-input v-model="operationForm.cost" placeholder="进货价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="operationForm.count" @change="" :min="1.00" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="库位号" :label-width="formLabelWidth" prop="repCodeLK" style="width:100%;">
          <el-select v-model="operationForm.repCodeLK" placeholder="请选择配件库位号">
            <el-option
              v-for="item in repCode"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="restForm('operationForm')">返 回</el-button>
        <el-button type="primary" @click="inpart('operationForm')">入 库</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDataFormLUP, getDataFormLUPById, checkPrice } from '@/assets/js/utils'
export default {
  name: 'serviceProject',
  data (){
    return {
      search: {
        isDisable: ''
      },
      productTableData: [],
      productForm: {},
      partsForm: {},
      operationForm: {},
      rules: {
        code: [
          { required: true, message: '配件编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '配件名称不能为空', trigger: 'blur' }
        ],
        pCategoryLK: [
          { required: true, message: '请选择配件分类', trigger: 'blur' }
        ],
        unitLK: [
          { required: true, message: '请选择配件单位', trigger: 'blur' }
        ],
        carModel: [
          { required: true, message: '适用车型不能为空', trigger: 'blur' }
        ],
        produceArea: [
          { required: true, message: '产地不能为空', trigger: 'blur' }
        ],
        wholeSale: [
          { required: true, message: '批发价不能为空',validator: checkPrice, trigger: 'blur' }
        ],
        sale: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        cost: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        repCodeLK: [
          { required: true, message: '库位号不能为空', trigger: 'blur' }
        ]
      },
      pCategory: {},
      unitObj: {},
      specification: {},
      repCode: {},
      supplier: {},
      payType: {},
      repCodeLKVal: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      edit: false,
      isLocked: false,
      showOperationForm: false,
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
    _this.loadData(this.pageNo, this.pageSize)
    _this.getTreeData()
    getDataFormLUP('part_type',function() {_this.pCategory = this})
    getDataFormLUP('unit',function() {_this.unitObj = this})
    getDataFormLUP('part_specification',function() {_this.specification = this})
    getDataFormLUP('repCode',function() {_this.repCode = this})
    getDataFormLUP('supplier',function() {_this.supplier = this})
    getDataFormLUP('pay_type',function() {_this.payType = this})
  },
  methods: {
    loadData(pageNo,pageSize) {
      this.$http.get('/supercar/part/page',{
        params:{
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.productTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      })
    },
    handleDisable(index,row) {
      if(row.isDisable === false){
        row.isDisable = true
      }else{
        row.isDisable = false
      }
      let updateObj = {id:row.id,isDisable:row.isDisable}
      this.$http.post('/supercar/part/edit', updateObj,{emulateJSON:true}).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功',
          duration: 2000,
          showClose: true
        })
      }, response => {
        this.$message({
          type: 'error',
          message: '操作失败',
          duration: 2000,
          showClose: true
        })
      })
    },
    goSearch() {
      if(this.search.name || this.search.code || this.search.isDisable){
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
      this.search.isDisable = ''
      this.search.pCategoryLK = ''
      this.getTreeData()
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/part/page',{
        params: {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.isDisable_eq': this.search.isDisable,
          'search.pCategoryLK_eq': this.search.pCategoryLK,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.productTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络请求失败，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    getTreeData() {
      this.$http.get('/supercar/lookup/getTree?lookupDefineCode=part_type').then((response) => {
        this.treeData = response.body.data.entitys
      })
    },
    handleNodeClick(data) {
      this.search.pCategoryLK = data.id
      this.$http.get('/supercar/part/page',{
        params: {
          'search.name_like': this.search.name,
          'search.code_like': this.search.code,
          'search.isDisable_eq': this.search.isDisable,
          'search.pCategoryLK_eq': this.search.pCategoryLK,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.productTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络请求失败，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    handleInpart(index, row) {
      this.partsForm = {
        partId: row.id,
        code: row.code,
        name: row.name,
        carModel: row.carModel,
        wholeSale: row.wholeSale,
        produceArea: row.produceArea,
        unitLK: row.unitLK,
        unitLKVal: row.date.unitLK.value
      }
      this.operationForm = {
        repCodeLK: '',
        cost: '',
        count: 1
      }
      this.showOperationForm = true
    },
    inpart(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            let _this = this
            this.partsForm.repCodeLK = this.operationForm.repCodeLK
            this.partsForm.cost = this.operationForm.cost
            this.partsForm.count = this.operationForm.count
            getDataFormLUPById(this.operationForm.repCodeLK,function() {
              _this.partsForm.repCodeLKVal = this.value
              _this.$store.commit('updateInpartFormParam', _this.partsForm)
              _this.$message({
                type: 'success',
                message: '该配件已成功放入待入库中',
                duration: 3000,
                showClose: true
              })
              _this.partsForm = {}
              _this.$refs[formName].resetFields()
              _this.showOperationForm = false
              _this.isLocked = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      });
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
      this.productForm.id = row.id
      this.productForm.name = row.name
      this.productForm.code = row.code
      this.productForm.sale = row.sale
      this.productForm.wholeSale = row.wholeSale
      this.productForm.produceArea = row.produceArea
      this.productForm.carModel = row.carModel
      this.productForm.unitLK = row.unitLK
      this.productForm.specificationLK = row.specificationLK
      this.productForm.pCategoryLK = row.pcategoryLK
      this.productForm.description = row.description
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
        this.$http.delete('/supercar/part/removeById',{params:{id:row.id}}).then((response) => {
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
            message: response.body.errorMsg,
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
    addProduct() {
      this.showForm = true
      this.productForm = {
        unitLK: '',
        specificationLK: '',
        pCategoryLK: ''
      }
    },
    restForm(formName) {
      this.showForm = false
      this.showOperationForm = false
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            var url = ''
            if(this.edit){
              url = '/supercar/part/edit'
            }else{
              url = '/supercar/part/new'
            }
            this.$http.post(url, this.productForm,{emulateJSON:true}).then((response) => {
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
                message: '网络请求失败，请重试！',
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
      });
    },
    removeProduct() {
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
          this.$http.delete('/supercar/part/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
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

.el-input-number {
  width: 100%
}

.el-form-item {
  width: 50%;
  float: left;
}

</style>
