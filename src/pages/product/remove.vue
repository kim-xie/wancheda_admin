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
          <span class="searchTitle">出库类型</span>
          <div class="searchInput">
            <el-select v-model="search.type" placeholder="请选择出库类型">
              <el-option
                v-for="item in outpartTypes"
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
          <span class="searchTitle">出库单号</span>
          <div class="searchInput">
            <el-input v-model="search.workOrderNo" class="input" placeholder="请输入出库单号"></el-input>
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
            <i class="el-icon-date"></i> 待出库
            <el-badge class="mark" :value="this.$store.state.outpartCount" />
          </span>
          <el-row class="clientInfoBox">
            <el-col :span="24">
              <div class="grid-content">
                <el-row :gutter="20">
                  <el-form :model="outpartingForm" ref="outpartingForm" class="outpartingForm" :rules="rules">
                      <el-form-item label="出库类型" :label-width="formLabelWidth" style="width:260px;" prop="outpartType">
                        <el-select v-model="outpartingForm.outpartType" @change="changeType" placeholder="请选择出库类型">
                          <el-option
                            v-for="item in outpartTypes"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                            <span style="float: left">{{ item.value }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <!-- <el-form-item style="width:100px;">
                        <el-button type="primary" icon="loading" @click="loading" style="margin-left:20px;">加载</el-button>
                      </el-form-item> -->
                      <template v-if="loadingOutpartType == '维修领料'">
                        <el-form-item label="维修工单号" :label-width="formLabelWidth" style="width:260px;" prop="repairItemNo">
                          <el-input v-model="outpartingForm.repairItemNo" placeholder="维修工单号"></el-input>
                        </el-form-item>
                      </template>
                      <template v-if="loadingOutpartType == '配件销售'">
                        <el-form-item label="车牌号" :label-width="formLabelWidth" style="width:260px;" prop="carNo">
                          <el-input v-model="outpartingForm.carNo" placeholder="车牌号"></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称" :label-width="formLabelWidth" style="width:260px;" prop="clientName">
                          <el-input v-model="outpartingForm.clientName" placeholder="客户名称"></el-input>
                        </el-form-item>
                      </template>
                      <template v-if="loadingOutpartType == '配件内耗'">
                        <el-form-item label="门店名称" :label-width="formLabelWidth" style="width:260px;" prop="company">
                          <el-select v-model="outpartingForm.company" placeholder="请选择门店名称">
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
                        <el-form-item label="部门名称" :label-width="formLabelWidth" style="width:260px;" prop="department">
                          <el-input v-model="outpartingForm.department" placeholder="部门名称"></el-input>
                        </el-form-item>
                      </template>
                      <el-form-item label="领料人" :label-width="formLabelWidth" style="width:260px;" prop="receiver">
                        <el-select v-model="outpartingForm.receiver" placeholder="请选择领料人">
                          <el-option
                            v-for="item in receivers"
                            :key="item.id"
                            :label="item.fullname"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item style="margin-left:20px;width:300px">
                        <span>总金额:</span>
                        <strong class="fs18" style="margin-right:20px;">￥
                          <span class="total" style="color:rgb(236, 85, 45);">{{Number(outpartsTotal)}}</span>
                        </strong>
                        <span style="margin-right:10px;">元</span>
                        <el-button type="primary" @click="saveProduction('outpartingForm')">结 算</el-button>
                      </el-form-item>
                  </el-form>
                </el-row>

                <el-table 
                  :data="selectTableData" 
                  border 
                  tooltip-effect="dark" 
                  style="width: 100%" 
                  highlight-current-row
                  @current-change="selectCurrentRow" >
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column align="center" prop="code" label="商品编号" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" prop="name" label="商品名称" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" prop="sale" label="销售价" width="80"></el-table-column>
                  <el-table-column align="center" prop="count" label="数量" width="80"></el-table-column>
                  <el-table-column align="center" prop="unitLKVal" label="单位" width="80"></el-table-column>
                  <el-table-column align="center" prop="subtotal" label="金额" width="80"></el-table-column>
                  <el-table-column align="center" prop="repCodeLKVal" label="库位号" width="80"></el-table-column>
                  <el-table-column align="center" prop="produceArea" label="产地" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" prop="carModel" label="适用车型" show-overflow-tooltip></el-table-column>
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
        <span slot="label"><i class="el-icon-circle-check"></i> 已出库({{total}})</span>
        <el-row :gutter="20">
          <el-col :span="24" >
            <el-row class="clientInfoBox">
              <el-col :span="24">
                <div class="grid-content">
                  <el-table :data="productTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" show-summary>
                    <el-table-column type="index" width="70"></el-table-column>
                    <el-table-column align="center" prop="workOrderNo" label="工单编号" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.code" label="商品编号" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.name" label="商品名称" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.sale" label="销售价" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="count" label="数量" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.unitLK.value" label="单位" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.repositoryCodeLK.value" label="库位号"  width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.produceArea" label="产地" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.partId.carModel" label="适用车型" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="outpartTypeVal" label="出库类型" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="date.receiver.username" label="领料人" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column align="center" prop="date.workOrderNo.outTime" sortable label="出库时间" show-overflow-tooltip width="180"></el-table-column>
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

    <!-- 配件出库 -->
    <el-dialog title="配件出库" :visible.sync="showForm" class="outpartForm">
      <el-form :model="outpartForm" ref="outpartForm" :rules="rules">
        <el-form-item label="销售价" :label-width="formLabelWidth" prop="sale" style="width:100%;">
          <el-input v-model="outpartForm.sale" placeholder="销售价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="outpartForm.count" @change="handleChange" :min="1" :max="maxCount"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="restForm('outpartForm')">返 回</el-button>
        <el-button type="primary" @click="submitForm('outpartForm')">确 定</el-button>
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
      loadingOutpartType: '',
      search: {
        company: '',
        type: ''
      },
      productTableData: [],
      productForm: {},
      outpartForm: {},
      outpartingForm: {
        outpartType: '',
        receiver: '',
        company: ''
      },
      selectTableData: [],
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        repairItemNo: [
          { required: true, message: '请输入维修工单号', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        carNo: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请选择名店', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请选择领料人', trigger: 'blur' }
        ],
        outpartType: [
          { required: true, message: '请选择出库类型', trigger: 'blur' }
        ],
      },
      receiver: '',
      outpartType: '',
      unitObj: {},
      pCategory: {},
      repCode: {},
      specification: {},
      outpartTypes: {},
      companys: {},
      showForm: false,
      isLocked: false,
      outpartsTotal: 0.00,
      maxCount: '',
      receivers: {},
      pageNo: 1,
      pageSize: 10,
      total: 0,
      selectPageNo: 1,
      selectPageSize: 10,
      selectTotal: 0,
      formLabelWidth: '100px'
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
      _this.loadcompanys()
    }
    this.loadData(this.pageNo, this.pageSize)
    this.loadOutpartFormData()
    this.loadAccounts()
    getDataFormLUP('unit',function() {_this.unitObj = this})
    getDataFormLUP('part_type',function() {_this.pCategory = this})
    getDataFormLUP('repCode',function() {_this.repCode = this})
    getDataFormLUP('part_specification',function() {_this.specification = this})
    getDataFormLUP('outpart_type',function() {_this.outpartTypes = this})
  },
  /*watch: {
    'outpartingForm.outpartType': 'changeType'
  },*/
  methods: {
    loadData(pageNo, pageSize) {
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = ''
      }
      this.$http.get('/supercar/outPartInfo/extendPage',{
        params: {
          'loading': true,
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        let _this = this
        let tableData = []
        let outpartTypeVals = []
        tableData = response.body.data.page.content
        for(var i=0;i<tableData.length;i++){
          getDataFormLUPById(tableData[i].date.workOrderNo.type, function(){
            outpartTypeVals.push(this.value)
          })
        }
        setTimeout(function(){
          for(var i=0;i<outpartTypeVals.length;i++){
            tableData[i].outpartTypeVal = outpartTypeVals[i]
          }
          _this.productTableData = tableData
        },1000)
        this.total = response.body.data.page.totalElements
      })
    },
    changeType(val){
      let _this = this
      this.$refs['outpartingForm'].resetFields()
      this.outpartingForm.outpartType = val
      getDataFormLUPById(val, function(){
        _this.loadingOutpartType = this.value
      })
    },
    /*loading(){
      let _this = this
      if(this.outpartingForm.outpartType){
        getDataFormLUPById(this.outpartingForm.outpartType, function(){
          _this.loadingOutpartType = this.value
        })
      }
    },*/
    loadOutpartFormData() {
      if(this.$store.state.outpartFormParam){
        let total = 0
        this.selectTableData = this.$store.state.outpartFormParam
        this.selectTotal = this.selectTableData.length
        for(var i=0;i<this.selectTableData.length;i++){
          this.selectTableData[i].subtotal = Number(this.selectTableData[i].sale) * Number(this.selectTableData[i].count)
          total += Number(this.selectTableData[i].subtotal)
        }
        this.outpartsTotal = total
      }
    },
    loadAccounts(){
      this.$http.get('/supercar/user/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.receivers = response.body.data.page.content
      })
    },
    loadcompanys(){
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    goSearch() {
      if(isSuperAdmin(this.userRole)){
        this.searchcompany = this.search.company
      }
      if(this.search.type || this.search.workOrderNo || this.search.company){
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
      this.search.type = ''
      this.search.workOrderNo = ''
      this.search.company = ''
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/outPartInfo/extendPage',{
        params: {
          'search.type_eq': this.search.type,
          'search.workOrderNo_eq': this.search.workOrderNo,
          'search.company_eq': this.searchcompany,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        let _this = this
        let tableData = []
        let outpartTypeVals = []
        tableData = response.body.data.page.content
        for(var i=0;i<tableData.length;i++){
          getDataFormLUPById(tableData[i].date.workOrderNo.type, function(){
            outpartTypeVals.push(this.value)
          })
        }
        setTimeout(function(){
          for(var i=0;i<outpartTypeVals.length;i++){
           tableData[i].outpartTypeVal = outpartTypeVals[i]
          }
          _this.productTableData = tableData
        },1000)
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
    handleChange(value){
      console.log(value)
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
      //alert(JSON.stringify(row))
      this.maxCount = row.count
      this.outpartForm = {
        inventoryId: row.inventoryId,
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
        repCodeLKVal: row.repCodeLKVal,
        subtotal: row.subtotal
      }
      this.outpartForm.index = index
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
        this.outpartsTotal = this.outpartsTotal-row.subtotal
        this.$store.commit('updateOutPartCount', Len - 1)
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
    //  alert(JSON.stringify(val))
    },
    saveProduction(formName) {
      this.loading()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            let _this = this
            let outpartInfos = []
            for(var i=0;i< _this.selectTableData.length;i++){
              let outpartInfoObj = {
                "workOrderNo": "",
                "inventoryId": _this.selectTableData[i].inventoryId,
                "count": _this.selectTableData[i].count,
      		      "sale": _this.selectTableData[i].sale,
                "isDeleted": false
              }
              outpartInfos.push(outpartInfoObj)
            }
            let formObj = {
              "outPart": {
                  "workOrderNo": "", //工单号
                  "type": _this.outpartingForm.outpartType, //出库类型
                  "clientName": _this.$store.state.userInfo.userName,//客户名称
                  "receiver": _this.outpartingForm.receiver,//领料人
                  "repairWorkorderNo": _this.outpartingForm.repairItemNo,//维修工单号 -- 对应维修领料
                  "carNo": _this.outpartingForm.carNo,//车牌号 -- 对应配件销售
                  "departmentLK": _this.outpartingForm.department,//所属部门 -- 对应内部消耗
                  "company": _this.usercompany,//所属公司
                  "outTime": "",
                  "sum": _this.outpartsTotal,
                  "isDeleted": false //未删除
              },
              "outPartInfos": outpartInfos
            }
            if(_this.selectTableData.length>0){
              this.$http.post('/supercar/outPart/newOutPart',formObj).then((response) => {
                if(response.body.success){
                  this.selectTableData.splice(0,this.selectTableData.length)
                  this.outpartsTotal = 0
                  this.loadData(1,this.pageSize)
                  this.$store.commit('updateOutPartCount', 0)
                  this.$message({
                    type: 'success',
                    message: '配件出库成功',
                    duration: 2000,
                    showClose: true
                  })
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
            this.outpartsTotal = this.outpartsTotal - this.selectTableData[this.outpartForm.index].subtotal
            this.selectTableData[this.outpartForm.index].subtotal = Number(this.outpartForm.sale) * Number(this.outpartForm.count)
            this.outpartsTotal = this.outpartsTotal + this.selectTableData[this.outpartForm.index].subtotal
            this.outpartForm.subtotal = Number(this.outpartForm.sale) * Number(this.outpartForm.count)
            this.selectTableData[this.outpartForm.index] = this.outpartForm
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

.outpartingForm .el-form-item {
  width: 20%;
  float: left;
}

</style>
