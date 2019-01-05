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
          <span class="searchTitle">供应商</span>
          <div class="searchInput">
            <el-select v-model="search.supplierLK" placeholder="请选择供应商">
              <el-option
                v-for="item in supplier"
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
        <div class="grid-content">
          <span class="searchTitle">入库单号</span>
          <div class="searchInput">
            <el-input v-model="search.workOrderNo" class="input" placeholder="请输入入库单号"></el-input>
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

    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-date"></i> 待入库
          <el-badge class="mark" :value="this.$store.state.inpartCount" />
        </span>
        <el-row class="clientInfoBox">
          <el-col :span="24">
            <div class="grid-content">
              <el-row :gutter="20">
                <el-form :model="inpartingForm" ref="inpartingForm" class="inpartingForm" :rules="rules">
                    <el-form-item label="结算方式" :label-width="formLabelWidth" prop="payMethhodLKVal">
                      <el-select v-model="inpartingForm.payMethhodLKVal" placeholder="请选择支付方式">
                        <el-option
                          v-for="item in payType"
                          :key="item.id"
                          :label="item.value"
                          :value="item.id">
                          <span style="float: left">{{ item.value }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="供应商" :label-width="formLabelWidth" prop="supplierLK">
                      <el-select v-model="inpartingForm.supplierLK" placeholder="请选择供应商">
                        <el-option
                          v-for="item in supplier"
                          :key="item.id"
                          :label="item.value"
                          :value="item.id">
                          <span style="float: left">{{ item.value }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item style="margin-left:20px;width:300px;" >
                      <span>总金额:</span>
                      <strong class="fs18" style="margin-right:20px;">￥
                        <span class="total" style="color:rgb(236, 85, 45);">{{Number(inpartsTotal)}}</span>
                      </strong>
                      <span style="margin-right:10px;">元</span>
                      <el-button type="primary" @click="saveProduction('inpartingForm')">结 算</el-button>
                    </el-form-item>
                </el-form>
              </el-row>
              <el-table :data="selectTableData" border tooltip-effect="dark" style="width: 100%" highlight-current-row
              @current-change="selectCurrentRow" >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column align="center" prop="code" label="商品编号" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="name" label="商品名称" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column align="center" prop="supplierLKVal" label="供应商" show-overflow-tooltip></el-table-column> -->
                <el-table-column align="center" prop="cost" label="进货价" width="80"></el-table-column>
                <el-table-column align="center" prop="count" label="数量" width="80"></el-table-column>
                <el-table-column align="center" prop="unitLKVal" label="单位" width="80"></el-table-column>
                <el-table-column align="center" prop="subtotal" label="金额" width="80"></el-table-column>
                <el-table-column align="center" prop="repCodeLKVal" label="库位号" width="80"></el-table-column>
                <el-table-column align="center" prop="produceArea" label="产地" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="carModel" label="适用车型" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column align="center" prop="createTime" sortable label="创建时间" show-overflow-tooltip> </el-table-column> -->
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                  <template scope="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tablePages">
                <el-pagination
                  @size-change="selectHandleSizeChange"
                  @current-change="selectHandleCurrentChange"
                  :current-page="selectPageNo"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="selectPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="selectTotal">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane>
        <span slot="label"><i class="el-icon-circle-check"></i> 已入库({{total}})</span>
        <el-row :gutter="20">
          <el-col :span="24" >
            <el-row class="clientInfoBox">
              <el-col :span="24">
                <div class="grid-content">
                  <el-table :data="productTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" show-summary>
                    <el-table-column align="center" type="index" width="70"> </el-table-column>
                    <el-table-column align="center" prop="workOrderNo" label="工单编号" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.code" label="商品编号" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.name" label="商品名称" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.supplierLK.value" label="供应商" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="cost" label="进货价" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="count" label="数量" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.unitLK.value" label="单位" width="80" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column align="center" prop="sum" label="金额" width="80" show-overflow-tooltip> </el-table-column> -->
                    <el-table-column align="center" prop="date.repositoryCodeLK.value" label="库位号"  width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.produceArea" label="产地" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.carModel" label="适用车型" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.workOrderNo.inTime" sortable label="入库时间" show-overflow-tooltip></el-table-column>
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
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="批量添加">批量添加</el-tab-pane> -->
    </el-tabs>

    <!-- 配件入库 -->
    <el-dialog title="配件入库" :visible.sync="showForm" class="inpartForm">
      <el-form :model="inpartForm" ref="inpartForm" :rules="rules">
        <el-form-item label="进货价" :label-width="formLabelWidth" prop="cost" style="width:100%;">
          <el-input v-model="inpartForm.cost" placeholder="进货价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="inpartForm.count" @change="" :min="1.00" :max="10000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="restForm('inpartForm')">返 回</el-button>
        <el-button type="primary" @click="submitForm('inpartForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDataFormLUP, getDataFormLUPById, getStore, isSuperAdmin } from '@/assets/js/utils'
import { mapGetters } from 'vuex'
export default {
  data (){
    return {
      usercompany: '',
      searchcompany: '',
      search: {
        supplierLK: '',
        company: ''
      },
      productTableData: [],
      inpartForm: {},
      inpartingForm: {
        payMethhodLKVal: '',
        supplierLK: ''
      },
      selectTableData: [],
      rules: {
        supplierLK: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        payMethhodLKVal: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      },
      inpartsTotal: 0.00,
      supplierLK: '',
      unitObj: {},
      pCategory: {},
      repCode: {},
      specification: {},
      supplier: {},
      payType: {},
      companys:{},
      payMethhodLKVal: '',
      pageNo: 1,
      pageSize: 10,
      selectPageNo: 1,
      selectPageSize: 10,
      total: 0,
      selectTotal: 0,
      showForm: false,
      isLocked: false,
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
    this.loadInpartFormData()
    getDataFormLUP('unit',function() {_this.unitObj = this})
    getDataFormLUP('part_type',function() {_this.pCategory = this})
    getDataFormLUP('repCode',function() {_this.repCode = this})
    getDataFormLUP('part_specification',function() {_this.specification = this})
    getDataFormLUP('supplier',function() {_this.supplier = this})
    getDataFormLUP('pay_type',function() {_this.payType = this})
  },
  methods: {
    loadData(pageNo, pageSize) {
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = ''
      }
      this.$http.get('/supercar/inPartInfo/extendPage',{
        params: {
          'loading': true,
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
          this.productTableData = response.body.data.page.content
          this.total = response.body.data.page.totalElements
      })
    },
    loadInpartFormData() {
      if(this.$store.state.inpartFormParam){
        let totals = 0
        let _this = this
        this.selectTableData = this.$store.state.inpartFormParam
        console.log(this.selectTableData)
        this.selectTotal = this.selectTableData.length
        for(var i=0;i<_this.selectTableData.length;i++){
          _this.selectTableData[i].subtotal = Number(_this.selectTableData[i].cost) * Number(_this.selectTableData[i].count)
          totals += Number(_this.selectTableData[i].subtotal)
        }
        this.inpartsTotal = totals
      }
    },
    getCompanys() {
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    goSearch() {
      if(this.search.supplierLK || this.search.workOrderNo || this.search.company){
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
      this.search.supplierLK = ''
      this.search.workOrderNo = ''
      this.search.company = ''
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/inPartInfo/extendPage',{
        params: {
          'search.supplierLK_eq': this.search.supplierLK,
          'search.workOrderNo_eq': this.search.workOrderNo,
          'search.company_eq': this.search.company,
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
          message: '网络连接失败，请重试！',
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
    selectHandleSizeChange(val) {
      this.selectPageSize = val
      this.loadData(this.selectPageNo, this.selectPageSize)
    },
    selectHandleCurrentChange(val) {
      this.selectPageNo = val
      this.loadData(this.selectPageNo, this.selectPageSize)
    },
    handleEdit(index, row) {
      this.inpartForm = {
        partId: row.partId,
        code: row.code,
        name: row.name,
        carModel: row.carModel,
        wholeSale: row.wholeSale,
        produceArea: row.produceArea,
        unitLK: row.unitLK,
        unitLKVal: row.unitLKVal,
        count: row.count,
        cost: row.cost,
        repCodeLK: row.repCodeLK,
        repCodeLKVal: row.repCodeLKVal,
        subtotal: row.subtotal
      }
      this.inpartForm.index = index
      this.showForm = true
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let Len = this.selectTableData.length
        this.selectTableData.splice(index,1)
        this.inpartsTotal = this.inpartsTotal-row.subtotal
        this.$store.commit('updateInPartCount', Len - 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您已取消删除',
          duration: 2000,
          showClose: true
        })
      })
    },
    selectCurrentRow(val) {
      //alert(JSON.stringify(val))
    },
    saveProduction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            let _this = this
            let inpartInfos = []
            for(var i=0;i< _this.selectTableData.length;i++){
              let inpartInfoObj = {
                "workOrderNo": "",
                "partId": _this.selectTableData[i].partId,
                "count": _this.selectTableData[i].count,
      		      "cost": _this.selectTableData[i].cost,
                "supplierLK": _this.inpartingForm.supplierLK,
                "repositoryCodeLK": _this.selectTableData[i].repCodeLK,
                "isDeleted": false
              }
              inpartInfos.push(inpartInfoObj)
            }
            let formObj = {
              "inPart": {
                  "workOrderNo": "",
                  "payMethhodLK": _this.inpartingForm.payMethhodLKVal,
                  "sum": _this.inpartsTotal,
                  "inTime": "",
                  "supplierLK": _this.inpartingForm.supplierLK,
                  "company": _this.usercompany,
                  "isDeleted": false
              },
              "inpartInfos": inpartInfos
            }
            if(_this.selectTableData.length>0){
              this.$http.post('/supercar/inPart/newInPart',formObj).then((response) => {
                if(response.body.success){
                  this.$message({
                  type: 'success',
                  message: '入库成功',
                  duration: 2000,
                  showClose: true
                })
                  this.selectTableData.splice(0,this.selectTableData.length)
                  this.inpartsTotal = 0
                  this.loadData(1,this.pageSize)
                  this.$store.commit('updateInPartCount', 0)
                  $('.el-tabs__item').first().trigger('click')
                }
              }, response => {
                this.$message({
                  type: 'error',
                  message: '网络连接失败，请重试！',
                  duration: 2000,
                  showClose: true
                })
              })
            }else{
              this.$message({
                type: 'error',
                message: '出库信息为空，请选择配件！',
                duration: 2000,
                showClose: true
              })
            }
            this.isLocked = false
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    restForm(formName) {
      this.$refs[formName].resetFields()
      this.showForm = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            //alert(this.inpartForm.index+"-"+this.inpartForm.cost +"-"+ this.inpartForm.count)
            this.inpartsTotal = this.inpartsTotal - this.selectTableData[this.inpartForm.index].subtotal
            this.selectTableData[this.inpartForm.index].subtotal = Number(this.inpartForm.cost) * Number(this.inpartForm.count)
            this.inpartsTotal = this.inpartsTotal + this.selectTableData[this.inpartForm.index].subtotal
            this.inpartForm.subtotal = Number(this.inpartForm.cost) * Number(this.inpartForm.count)
            //alert(JSON.stringify(this.inpartForm))
            this.selectTableData[this.inpartForm.index] = this.inpartForm
            this.showForm = false
            this.isLocked = false
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

.searchTitle {
  display: inline-block;
  min-width: 60px;
  width: 16%;
  height: 36px;
  line-height: 36px;
  float: left;
  font-size: 14px;
  font-weight: 600;
}

.searchInput {
  display: inline-block;
  width: 80%;
}

.searchInput .block {
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

.mark {
  background-color: transparent;
  padding: 0;
}

.inpartingForm .el-form-item {
  width: 20%;
  float: left;
}
</style>
