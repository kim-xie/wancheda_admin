<template>
  <div id="clientList">
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
          <span class="searchTitle">车牌号</span>
          <div class="searchInput">
            <el-input v-model="search.carNo" class="input" placeholder="车牌号"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">客户姓名</span>
          <div class="searchInput">
            <el-input v-model="search.name" class="input" placeholder="客户姓名"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-if="userRole != 'super_admin'">
        <div class="grid-content">
          <span class="searchTitle">客户手机</span>
          <div class="searchInput">
            <el-input v-model="search.mobile" class="input" placeholder="客户手机"></el-input>
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
            <el-button type="primary" icon="plus" @click="addClient('clientForm')">新增客户</el-button>
            <el-button type="danger" icon="delete" @click="removeClient">批量删除</el-button>
            <el-button type="primary" icon="edit" @click="clientCoupon">客户优惠券</el-button>
          </div>
          <el-table :data="clientTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column type="expand">
              <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="证件号:">
                    <span>{{ props.row.idcard }}</span>
                  </el-form-item>
                  <el-form-item label="车架号:">
                    <span>{{ props.row.carVIN }}</span>
                  </el-form-item>
                  <el-form-item label="发动机号:">
                    <span>{{ props.row.engineNo }}</span>
                  </el-form-item>
                  <el-form-item label="保险公司:">
                    <span>{{ props.row.insurer }}</span>
                  </el-form-item>
                  <el-form-item label="保险到期时间:">
                    <span>{{ props.row.insuranceEndtime }}</span>
                  </el-form-item>
                  <el-form-item label="上牌日期:">
                    <span>{{ props.row.registrationDate }}</span>
                  </el-form-item>
                  <el-form-item label="客户邮箱:">
                    <span>{{ props.row.email }}</span>
                  </el-form-item>
                  <el-form-item label="客户性别:">
                    <span v-if="props.row.sex == true">男</span>
                    <span v-if="props.row.sex == false">女</span>
                  </el-form-item>
                  <el-form-item label="客户级别:">
                    <span>{{ props.row.date.level.value }}</span>
                  </el-form-item>
                  <el-form-item label="客户类型:">
                    <span>{{ props.row.date.type.value }}</span>
                  </el-form-item>
                  <el-form-item label="更新时间:">
                    <span>{{ props.row.updateTime }}</span>
                  </el-form-item>
                  <el-form-item label="备注:">
                    <span>{{ props.row.description }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" type="selection" width="55"> </el-table-column>
            <el-table-column align="center" prop="name" label="客户姓名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="mobile" label="客户手机" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="carNo" label="车牌号" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="date.carBrand.value" label="汽车品牌" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="carModel" label="车型" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="carColor" label="车身颜色" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="date.level.value" label="客户级别" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="address" label="客户地址" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="createTime" sortable width="180" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="150">
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
        </div>
      </el-col>
    </el-row>

    <!-- 新增客户 -->
    <el-dialog title="新增客户" :visible.sync="showForm" class="clientForm">
      <el-form :model="clientForm" ref="clientForm" :rules="rules">
        <el-form-item label="客户姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="clientForm.name" auto-complete="off" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="客户级别" :label-width="formLabelWidth" prop="level">
          <el-select v-model="clientForm.level" placeholder="请选择客户级别">
            <el-option
              v-for="item in clientGrade"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" :label-width="formLabelWidth" prop="idcard">
          <el-input v-model="clientForm.idcard" placeholder="请输入客户证件号码"></el-input>
        </el-form-item>
        <el-form-item label="客户手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="clientForm.mobile" placeholder="请输入客户手机"></el-input>
        </el-form-item>
        <el-form-item label="客户邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="clientForm.email" placeholder="请输入客户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="clientForm.address" placeholder="请输入客户地址"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" :label-width="formLabelWidth" prop="sex">
          <el-radio-group v-model="clientForm.sex">
            <el-radio class="radio" :label="true">男</el-radio>
            <el-radio class="radio" :label="false">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户类型" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="clientForm.type">
            <el-radio
            v-for="item in clientType"
            :key="item.id"
            :label="item.id"
            :value="item.value"
            class="radio" >{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNo">
          <el-input v-model="clientForm.carNo" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车架号" :label-width="formLabelWidth" prop="carVIN">
          <el-input v-model="clientForm.carVIN" placeholder="请输入车架号"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌" :label-width="formLabelWidth" prop="carBrand">
          <el-select v-model="clientForm.carBrand" placeholder="请选择汽车品牌">
            <el-option
              v-for="item in carBrands"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车车型" :label-width="formLabelWidth" prop="carModel">
          <el-input v-model="clientForm.carModel" placeholder="请输入汽车车型"></el-input>
        </el-form-item>
        <el-form-item label="发动机号" :label-width="formLabelWidth" prop="engineNo">
          <el-input v-model="clientForm.engineNo" placeholder="请输入发动机号"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色" :label-width="formLabelWidth" prop="carColor">
          <el-input v-model="clientForm.carColor" placeholder="请输入车身颜色"></el-input>
        </el-form-item>
        <el-form-item label="上牌日期" :label-width="formLabelWidth" prop="registrationDate">
          <el-date-picker
            v-model="clientForm.registrationDate"
            type="datetime"
            placeholder="选择上牌日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保险公司" :label-width="formLabelWidth" prop="insurer">
          <el-input v-model="clientForm.insurer" placeholder="请输入保险公司"></el-input>
        </el-form-item>
        <el-form-item label="保险到期日期" :label-width="formLabelWidth" prop="insuranceEndtime">
          <el-date-picker
            v-model="clientForm.insuranceEndtime"
            type="datetime"
            placeholder="选择保险到期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
          <el-input v-model="clientForm.description" type="textarea" :rows="2" placeholder="请输入客户信息备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="restForm('clientForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('clientForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 客户优惠券 -->
    <el-dialog title="客户优惠券" :visible.sync="showClientCouponForm" class="clientCouponForm">
      <el-form :model="clientCouponForm" ref="clientCouponForm" :rules="rules">
        <el-form-item label="优惠券名称" :label-width="formLabelWidth" prop="couponId" style="width:100%;">
          <el-select v-model="clientCouponForm.couponId" placeholder="请选择优惠券">
            <el-option
              v-for="item in coupons"
              :key="item.id"
              :label="item.value"
              :value="item.id">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券数量" :label-width="formLabelWidth" prop="num" style="width:100%;">
          <el-input-number v-model="clientCouponForm.num" @change="handleChange" :min="1" :max="10" style="width:100%;"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="restForm('clientCouponForm')">取 消</el-button>
        <el-button type="primary" @click="submitCouponForm('clientCouponForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 客户优惠券列表 -->
    <el-dialog title="客户优惠券列表" :visible.sync="showClientCouponListForm">
      <el-row style="margin-bottom:20px;">
        <el-button type="primary" icon="plus" @click="addClientCoupon()">新增</el-button>
      </el-row>
      <el-row>
        <el-table :data="clientCouponTableData" border tooltip-effect="dark" style="width:100%">
          <el-table-column align="center" prop="date.couponId.value" label="优惠券名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="num" label="优惠券数量" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template scope="scope">
              <!-- <el-button size="small" @click="editItem(scope.$index, scope.row)">编辑</el-button> -->
              <el-button size="small" type="danger" @click="removeItem(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tablePages" style="text-align:right;margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="pageNo1"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDataFormLUP, getStore, isSuperAdmin } from '@/assets/js/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'clientList',
  data (){
    return {
      usercompany: '',
      searchCompany: '',
      search: {
        company: ''
      },
      clientTableData: [],
      clientForm: {
        level: '',
        carBrand: '',
        registrationDate: '',
        insuranceEndtime: ''
      },
      clientCouponForm: {
        couponId: '',
        num: 1,
      },
      clientCouponTableData: [],
      rules: {
        name: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' }
        ],
        carNo: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '客户手机不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择客户级别', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择客户类型', trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '请选择汽车品牌', trigger: 'blur' }
        ],
        couponId: [
          { required: true, message: '请选择优惠券', trigger: 'blur' }
        ]
        /*registrationDate: [
         { required: true, message: '上牌日期不能为空', trigger: 'blur' }
        ],
        insuranceEndtime: [
         { required: true, message: '保险到期时间不能为空', trigger: 'blur' }
        ]*/
      },
      clientGrade: {},
      clientType: {},
      carBrands: {},
      companys: {},
      coupons: {},
      edit: false,
      isLocked: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      pageNo1: 1,
      pageSize1: 10,
      total1: 0,
      multipleSelection: [],
      showForm: false,
      showClientCouponForm: false,
      showClientCouponListForm: false,
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
    getDataFormLUP('client_level',function() {_this.clientGrade = this})
    getDataFormLUP('client_type',function() {_this.clientType = this})
    getDataFormLUP('car_brand',function() {_this.carBrands = this})
    getDataFormLUP('clientCoupon',function() {_this.coupons = this})
  },
  methods: {
    // 加载列表数据
    loadData(pageNo,pageSize) {
      if(isSuperAdmin(this.userRole)){
        this.searchCompany = this.search.company
      }
      this.$http.get('/supercar/client/page',{
        params:{
          'loading': true,
          'search.company_eq': this.searchCompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.clientTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      })
    },
    // 加载优惠券列表
    loadClientCouponData(clientId,pageNo,pageSize) {
      this.$http.get('/supercar/clientCoupon/page',{
        params:{
          'loading': true,
          'search.clientId_eq': clientId,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        if(response.body.success){
          this.clientCouponTableData = response.body.data.page.content
          this.total1 = response.body.data.page.totalElements
        }
      })
    },
    goSearch() {
      if(isSuperAdmin(this.userRole)){
        this.searchCompany = this.search.company
      }
      if(this.search.carNo || this.search.name || this.search.mobile || this.search.company){
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
      this.search.carNo = ''
      this.search.name = ''
      this.search.mobile = ''
      if(isSuperAdmin(this.userRole)){
        this.searchCompany = ''
      }
      this.serachData()
    },
    serachData(){
      this.$http.get('/supercar/client/page',{
        params: {
          'loading': true,
          'search.carNo_like': this.search.carNo,
          'search.name_like': this.search.name,
          'search.mobile_like': this.search.mobile,
          'search.company_eq': this.searchCompany,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': this.pageSize
        }
      }).then((response) => {
        this.clientTableData = response.body.data.page.content
        this.total = this.clientTableData.length
      }, response => {
        this.$message({
          type: 'error',
          message: '网络请求错误，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    // 公司列表
    getCompanys() {
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    handleChange(value) {
      console.log(value);
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadData(this.pageNo, this.pageSize)
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.loadClientCouponData(this.multipleSelection[0].id, this.pageNo1, this.pageSize1)
    },
    handleCurrentChange1(val) {
      this.pageNo1 = val
      this.loadClientCouponData(this.multipleSelection[0].id, this.pageNo1, this.pageSize1)
    },
    handleEdit(index, row) {
      this.clientForm = {
        id: row.id,
        name: row.name,
        sex: row.sex,
        type: row.type,
        level: row.level,
        mobile: row.mobile,
        address: row.address,
        carNo: row.carNo,
        carVIN: row.carVIN,
        carBrand: row.carBrand,
        carModel: row.carModel,
        engineNo: row.engineNo,
        carColor: row.carColor,
        registrationDate: row.registrationDate==null ? '':row.registrationDate,
        insuranceEndtime: row.insuranceEndtime==null ? '':row.insuranceEndtime,
        description: row.description
      }
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
        this.$http.delete('/supercar/client/removeById',{params:{id:row.id}}).then((response) => {
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
            message: '网络请求错误，请重试！',
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
    addClient(formName) {
      this.clientForm = {
        name: '',
        sex: '',
        type: '',
        level: '',
        mobile: '',
        address: '',
        carNo: '',
        carVIN: '',
        carBrand: '',
        carModel: '',
        engineNo: '',
        carColor: '',
        registrationDate: '',
        insuranceEndtime: '',
        description: ''
      }
      this.showForm = true
    },
    clientCoupon() {
      if(this.multipleSelection.length == 1){
        this.showClientCouponListForm = true
        this.clientCouponForm.clientId = this.multipleSelection[0].id
        this.loadClientCouponData(this.multipleSelection[0].id, this.pageNo1, this.pageSize1)
      }else{
        this.$message({
          type: 'info',
          message: '该操作需要选择一条记录！',
          duration: 2000,
          showClose: true
        })
      }
    },
    addClientCoupon(){
      this.clientCouponForm.num = 1
      this.clientCouponForm.couponId = ""
      this.showClientCouponForm = true
    },
    editItem(index, row){
      delete row.date
      this.clientCouponForm = row
      this.showClientCouponForm = true
    },
    removeItem(index, row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 第一种传参方式传string类型参数
        delete row.date
        this.$http.post('/supercar/clientCoupon/reduceCoupon',row,{emulateJSON:true}).then((response) => {
          this.$message({
              type: 'success',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
          })
          this.loadClientCouponData(this.multipleSelection[0].id, this.pageNo1, this.pageSize1)
        }, response => {
          this.$message({
            type: 'error',
            message: '网络请求错误，请重试！',
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
    restForm(formName) {
      this.$refs[formName].resetFields()
      this.showForm = false
      this.showClientCouponForm = false
      this.edit = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            let _this = this
            this.isLocked = true
            var url = ''
            if(this.edit){
              url = '/supercar/client/edit'
            }else{
              url = '/supercar/client/new'
            }
            this.clientForm.company = this.usercompany
            //alert(JSON.stringify(_this.clientForm))
            if(this.clientForm.insuranceEndtime == "" || this.clientForm.insuranceEndtime == null){
              delete this.clientForm.insuranceEndtime 
            }else{
              this.clientForm.insuranceEndtime  = this.clientForm.insuranceEndtime.toString()
            }
            if(this.clientForm.registrationDate == "" || this.clientForm.registrationDate == null){
              delete this.clientForm.registrationDate 
            }else{
              this.clientForm.registrationDate  = this.clientForm.registrationDate.toString()
            }
            //alert(JSON.stringify(_this.clientForm.insuranceEndtime))
            this.$http.post(url,this.clientForm,{emulateJSON:true}).then((response) => {
              if(response.body.success){
                this.$message({
                  type: 'success',
                  message: response.body.errorMsg,
                  duration: 2000,
                  showClose: true
                })
                this.restForm(formName)
                this.loadData(1, this.pageSize)
              }else{
                this.$message({
                  type: 'warning',
                  message: response.body.errorMsg,
                  duration: 2000,
                  showClose: true
                })
              }
              this.isLocked = false
            }, response => {
              this.$message({
                type: 'error',
                message: '网络请求错误，请重试！',
                duration: 2000,
                showClose: true
              })
              this.isLocked = false
            })
          }
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    submitCouponForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            var url = '/supercar/clientCoupon/addCoupon'
            this.$http.post(url, this.clientCouponForm,{emulateJSON:true}).then((response) => {
              if(response.body.success){
                this.$message({
                  type: 'success',
                  message: response.body.errorMsg,
                  duration: 2000,
                  showClose: true
                })
                this.restForm(formName)
                this.loadClientCouponData(this.multipleSelection[0].id, this.pageNo1, this.pageSize1)
              }else{
                this.$message({
                  type: 'warning',
                  message: response.body.errorMsg,
                  duration: 2000,
                  showClose: true
                })
              }
              //this.loadData(1, this.pageSize)
              this.isLocked = false
            }, response => {
              this.$message({
                type: 'error',
                message: '网络请求错误，请重试！',
                duration: 2000,
                showClose: true
              })
              this.isLocked = false
            })
          }
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
    removeClient() {
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
          this.$http.delete('/supercar/client/removeByIds',{params:{ids:ids.toString()}}).then((response) => {
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
              message: '网络请求错误，请重试！',
              duration: 2000,
              showClose: true
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您已取消删除'
          })
        })
      }else{
        this.$message({
          type: 'warning',
          message: '抱歉!此操作只适用于批量数据!',
          duration: 2000,
          showClose: true
        })
      }
    },
    handleSelectionChange(val) {
      //alert(JSON.stringify(val.length))
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
