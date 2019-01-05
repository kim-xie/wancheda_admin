<template>
  <div id="serviceProject">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6" v-if="userRole == 'super_admin'">
        <div class="grid-content">
          <span class="searchTitle">公司名称</span>
          <div class="searchInput">
            <el-select v-model="search.company" placeholder="请选择门店">
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
      <el-col :span="6" v-if="userRole != 'super_admin'">
        <div class="grid-content">
          <span class="searchTitle">适用车型</span>
          <div class="searchInput">
            <el-input v-model="search.carModel" class="input" placeholder="请输入适用车型"></el-input>
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
          <!-- <div class="tableTitle">
            <el-button type="primary" icon="plus"  @click="addProduct">新增配件</el-button>
            <el-button type="danger" icon="delete"  @click="removeProduct">批量删除</el-button>
          </div> -->
          <el-row :gutter="20">
            <!-- <el-col :span="4">
              <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" @node-click="handleNodeClick"></el-tree>
            </el-col> -->
            <el-col :span="24">
              <el-table :data="productTableData" border tooltip-effect="dark" style="width: 100%" show-summary >
                <el-table-column align="center" type="index" width="70"></el-table-column>
                <el-table-column align="center" prop="code" label="配件编号" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="name" label="配件名称" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="wholeSale" label="批发价" width="80"></el-table-column>
                <!-- <el-table-column align="center" prop="cost" label="进货价" width="80"></el-table-column> -->
                <el-table-column align="center" prop="sale" label="销售价" width="80"></el-table-column>
                <el-table-column align="center" prop="count" label="库存量" width="80"></el-table-column>
                <el-table-column align="center" prop="unitLKVal" label="单位" width="80"></el-table-column>
                <el-table-column align="center" prop="produceArea" label="产地" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="carModel" label="适用车型" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="repCodeLKVal" label="库位号" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                  <template scope="scope">
                    <el-button 
                      v-if = "scope.row.mark != 1"
                      size="small" 
                      :plain="true" 
                      type="info" 
                      @click="inpart(scope.$index, scope.row)">入 库
                    </el-button>
                    <el-button 
                      v-if="scope.row.count > 0 " 
                      size="small" 
                      :plain="true" 
                      type="danger" 
                      @click="outpart(scope.$index, scope.row)">出 库
                    </el-button>
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

    <!-- 配件入库信息 -->
    <el-dialog title="配件入库信息" :visible.sync="showInpartForm" class="inpartForm">
      <el-form :model="inpartForm" ref="inpartForm" :rules="rules">
        <el-form-item label="进货价" :label-width="formLabelWidth" prop="cost" style="width:100%;">
          <el-input v-model="inpartForm.cost" placeholder="进货价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="inpartForm.count" @change="inpartChange" :min="1" :max="10000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button @click="restForm('inpartForm')">返 回</el-button>
        <el-button type="primary" @click="inpartSubmit('inpartForm')">入 库</el-button>
      </div>
    </el-dialog>

    <!-- 配件出库信息 -->
    <el-dialog title="配件出库信息" :visible.sync="showOutpartForm" class="outpartForm">
      <el-form :model="outpartForm" ref="outpartForm" :rules="rules">
        <el-form-item label="销售价" :label-width="formLabelWidth" prop="sale" style="width:100%;">
          <el-input v-model="outpartForm.sale" placeholder="销售价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="outpartForm.count" @change="outpartChange" :min="1" :max="maxCount"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button @click="restForm('outpartForm')">返 回</el-button>
        <el-button type="primary" @click="outpartSubmit('outpartForm')">出 库</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDataFormLUP, getStore, isSuperAdmin } from '@/assets/js/utils'
import { mapGetters } from 'vuex'
export default {
  data (){
    return {
      usercompany: '',
      searchcompany: '',
      search: {
        company: ''
      },
      productTableData: [],
      outpartForm: {},
      inpartForm: {},
      operationForm: {},
      rules: {
        cost: [
          { required: true, message: '进货价不能为空', trigger: 'blur' }
        ],
        // count: [
        //   { required: true, message: '配件数量不能为空', trigger: 'blur' }
        // ],
        // supplierLK: [
        //   { required: true, message: '供应商不能为空', trigger: 'blur' }
        // ],
        // payMethhodLK: [
        //   { required: true, message: '支付方式不能为空', trigger: 'blur' }
        // ],
      },
      pCategory: {},
      unitObj: {},
      specification: {},
      outpartType: {},
      supplier: {},
      payType: {},
      companys:{},
      operateIndex: 0,
      maxCount: 0,
      showOperationForm: false,
      showOutpartForm: false,
      showInpartForm: false,
      isLocked: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
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
    this.searchCompany = this.company
    if(isSuperAdmin(_this.userRole)){
      _this.getCompanys()
    }
    this.loadData(this.pageNo, this.pageSize)
    getDataFormLUP('part_type',function() {_this.pCategory = this})
    getDataFormLUP('unit',function() {_this.unitObj = this})
    getDataFormLUP('part_specification',function() {_this.specification = this})
    getDataFormLUP('outpart_type',function() {_this.outpartType = this})
    getDataFormLUP('supplier',function() {_this.supplier = this})
    getDataFormLUP('pay_type',function() {_this.payType = this})
  },
  methods: {
    loadData(pageNo,pageSize) {
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = ''
      }
      this.$http.get('/supercar/inventory/listInventory',{
        params: {
          'loading': true,
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.productTableData = response.body.data.entitys
        var extendInfo = response.body.extendInfo
        this.getInventoryList(this.productTableData,extendInfo)
        this.total = this.productTableData.length
      })
    },
    getInventoryList(tableData,extendInfo){
      for(var i=0; i<tableData.length;i++){
        tableData[i].repCodeLKVal = extendInfo.repCodeLK[tableData[i].repCodeLK].value
        tableData[i].name = extendInfo.partId[tableData[i].partId].name
        tableData[i].code = extendInfo.partId[tableData[i].partId].code
        tableData[i].unitLK = extendInfo.partId[tableData[i].partId].unitLK
        tableData[i].sale = extendInfo.partId[tableData[i].partId].sale
        tableData[i].wholeSale = extendInfo.partId[tableData[i].partId].wholeSale
        tableData[i].produceArea = extendInfo.partId[tableData[i].partId].produceArea
        tableData[i].carModel = extendInfo.partId[tableData[i].partId].carModel
        tableData[i].createTime = extendInfo.partId[tableData[i].partId].createTime
        tableData[i].updateTime = extendInfo.partId[tableData[i].partId].updateTime
        tableData[i].isDisable = extendInfo.partId[tableData[i].partId].isDisable
        tableData[i].unitLKVal = extendInfo.unitLK[tableData[i].unitLK].value
      }
    },
    goSearch() {
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = this.search.company
      }
      if(this.search.name || this.search.code || this.search.carModel || this.search.company){
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
      this.search.carModel = ''
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = ''
      }
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/inventory/listInventory',{
        params: {
          'loading': true,
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'partName': this.search.name,
          'partCode': this.search.code,
          'carModel': this.search.carModel,
        }
      }).then((response) => {
        this.productTableData = response.body.data.entitys
        var extendInfo = response.body.extendInfo
        this.getInventoryList(this.productTableData,extendInfo)
        this.total = this.productTableData.length
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接错误，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    getCompanys() {
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    inpartChange(val){
      this.inpartForm.count = val
    },
    outpartChange(val){
      this.outpartForm.count = val
    },
    inpart(index, row) {
      this.operateIndex = index
      this.inpartForm = {
        partId: row.partId,
        supplierLK: row.supplierLK,
        count: row.count,
        repCodeLK: row.repCodeLK,
        cost: row.cost,
        company: row.company,
        code: row.code,
        name: row.name,
        carModel: row.carModel,
        wholeSale: row.wholeSale,
        sale: row.sale,
        produceArea: row.produceArea,
        unitLK: row.unitLK,
        unitLKVal: row.unitLKVal,
        repCodeLKVal: row.repCodeLKVal
      }
      this.showInpartForm = true
    },
    outpart(index, row) {
      //alert(JSON.stringify(row))
      this.maxCount = row.count
      this.operateIndex = index
      this.outpartForm = {
        inventoryId: row.id,
        supplierLK: row.supplierLK,
        count: row.count,
        repCodeLK: row.repCodeLK,
        company: row.company,
        code: row.code,
        name: row.name,
        carModel: row.carModel,
        wholeSale: row.wholeSale,
        sale: row.sale,
        produceArea: row.produceArea,
        unitLK: row.unitLK,
        unitLKVal: row.unitLKVal,
        repCodeLKVal: row.repCodeLKVal
      }
      this.showOutpartForm = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadData(this.pageNo, this.pageSize)
    },
    restForm(formName) {
      this.$refs[formName].resetFields()
      this.showOperationForm = false
      this.showOutpartForm = false
      this.showInpartForm = false
    },
    outpartSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          if(!this.isLocked){
            this.isLocked = true
            this.$store.commit('updateOutPartFormParam', this.outpartForm)
            _this.$message({
              type: 'success',
              message: '该配件已成功放入待出库中',
              duration: 3000,
              showClose: true
            })
            this.outpartForm = {}
            this.showOutpartForm = false
            this.isLocked = false
            //this.restForm(formName)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    inpartSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          if(!this.isLocked){
            this.isLocked = true
            //alert('确认入库')
            //alert(JSON.stringify(this.inpartForm))
            this.$store.commit('updateInpartFormParam', this.inpartForm)
            _this.$message({
              type: 'success',
              message: '该配件已成功放入待入库中',
              duration: 3000,
              showClose: true
            })
            this.inpartForm = {}
            this.showInpartForm = false
            this.productTableData[this.operateIndex].mark = 1
            this.isLocked = false
            //this.restForm(formName)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
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
