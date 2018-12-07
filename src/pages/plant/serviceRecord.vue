<template>
  <div id="serviceRecord">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="4" v-if="userRole == 'super_admin'">
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
      <el-col :span="4">
        <div class="grid-content">
          <span class="searchTitle">车牌号</span>
          <div class="searchInput">
            <el-input v-model="search.carNo" class="input" placeholder="请输入车牌号"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <span class="searchTitle">工单号</span>
          <div class="searchInput">
            <el-input v-model="search.workorderNo" class="input" placeholder="请输入工单号"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <span class="searchTitle">维修性质</span>
          <div class="searchInput">
            <el-select v-model="search.repairTypeLK" placeholder="请选择维修性质">
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
      <el-col :span="4">
        <div class="grid-content">
          <span class="searchTitle">客户姓名</span>
          <div class="searchInput">
            <div class="block">
              <el-input v-model="search.clientName" class="input" placeholder="请输入客户姓名"></el-input>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="goSearch">搜 索</el-button>
          <el-button type="primary" icon="close" @click="restSearch">重 置</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-star-off"></i> 
          待结账({{unpayTotal}})<el-badge class="mark" :value="this.$store.state.repairItemCount"/>
          </span>
          <el-table border :data="unpayTableData" highlight-current-row style="width: 100%" :default-sort = "{prop: 'sendTime', order: 'descending'}">
            <el-table-column type="expand" label="操作">
              <template slots-scope="props">
                <el-row>
                  <el-card class="box-card" :body-style="{ padding: '10px 20px' }" >
                    <div slot="header" class="clearfix">
                      <span style="line-height: 28px;font-size:16px;">维修详情</span>
                      <!-- <el-button style="float: right;" type="primary" size="small">导 出</el-button> -->
                    </div>
                    <div class="detailItem">
                      <div class="billingTitle">
                        <p class="billingCompany">
                          <span class="titleLabel">维修门店:</span>
                          <span class="titleVal">{{repairCompany}}</span>
                        </p>
                        <p class="billingOrderNo">
                          <span class="titleLabel">订单号:</span>
                          <span class="titleVal">{{props.row.workorderNo}}</span>
                        </p>
                        <p class="billingDate">
                          <span class="titleLabel">维修日期:</span>
                          <span class="titleVal">{{props.row.sendTime}}</span>
                        </p>
                        <p class="billingConsume">
                          <span class="titleLabel">消费金额:</span>
                          <span class="titleVal">￥{{(props.row.sum).toFixed(2)}}</span>
                        </p>
                        <p class="billingDate">
                          <span class="titleLabel">进店里程:</span>
                          <span class="titleVal">{{props.row.carMileage}} (KM)</span>
                        </p>
                        <p class="billingConsume">
                          <span class="titleLabel">进店油表:</span>
                          <span class="titleVal">{{(props.row.carOilmeter)}}</span>
                        </p>
                      </div>
                      <div class="billingContent">
                        <el-table border :data="repairItemDetails" highlight-current-row style="width: 100%">
                          <el-table-column align="center" property="date.itemId.name" label="服务项目" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="date.itemId.workHour" label="工时数" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="date.itemId.sum" label="金额" show-overflow-tooltip></el-table-column>
                        </el-table>
                      </div>
                      <div class="billingContent">
                        <el-table border :data="outpartDetails" highlight-current-row style="width: 100%">
                          <el-table-column align="center" property="partName" label="配件名称" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="count" label="出库数量" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="sale" label="售价" show-overflow-tooltip></el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </el-card>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" property="workorderNo" label="订单号" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.clientId.carNo" label="车牌号" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" property="date.clientId.carBrand" label="汽车品牌" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" property="date.clientId.carModel" label="车型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.clientId.name" label="客户姓名"></el-table-column>
            <el-table-column align="center" property="date.clientId.mobile" label="客户电话" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.repairTypeLK.value" label="维修性质" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="sendTime" sortable width="180" label="开单时间" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" property="endTime" sortable width="180" label="预交车时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="sum" label="金额(元)" width="90"></el-table-column>
            <el-table-column align="center" property="workorderState" label="状态" width="90" show-overflow-tooltip>
              <template slots-scope="scope">
                <el-tag size="middle" type="warning" v-if="scope.row.workorderState=='维修中'">{{scope.row.workorderState}}</el-tag>
                <el-tag size="middle" type="success" v-if="scope.row.workorderState=='已结账'">{{scope.row.workorderState}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slots-scope="scope">
                <el-button size="small" type="success" v-if="scope.row.workorderState=='维修中'" @click="changeState(scope.$index, scope.row)">结账</el-button>
                <el-button size="small" type="info" @click="loadMore(scope.$index, scope.row)">订单详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tablePages" style="margin-top:10px;text-align:right">
            <el-pagination
              @size-change="unpayHandleSizeChange"
              @current-change="unpayHandleCurrentChange"
              :current-page="unpayPageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="unpayPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="unpayTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 所有维修记录({{total}})</span>
          <el-table border :data="allItemTableData" highlight-current-row style="width: 100%" :default-sort = "{prop: 'sendTime', order: 'descending'}">
            <el-table-column type="expand" label="操作">
              <template slots-scope="props">
                <el-row>
                  <el-card class="box-card" :body-style="{ padding: '10px 20px' }" >
                    <div slot="header" class="clearfix">
                      <span style="line-height: 28px;font-size:16px;">维修详情</span>
                      <!-- <el-button style="float: right;" type="primary" size="small">导 出</el-button> -->
                    </div>
                    <div class="detailItem">
                      <div class="billingTitle">
                        <p class="billingCompany">
                          <span class="titleLabel">维修门店:</span>
                          <span class="titleVal">{{repairCompany}}</span>
                        </p>
                        <p class="billingOrderNo">
                          <span class="titleLabel">订单号:</span>
                          <span class="titleVal">{{props.row.workorderNo}}</span>
                        </p>
                        <p class="billingDate">
                          <span class="titleLabel">维修日期:</span>
                          <span class="titleVal">{{props.row.sendTime}}</span>
                        </p>
                        <p class="billingConsume">
                          <span class="titleLabel">消费金额:</span>
                          <span class="titleVal">￥{{(props.row.sum).toFixed(2)}}</span>
                        </p>
                        <p class="billingDate">
                          <span class="titleLabel">进店里程:</span>
                          <span class="titleVal">{{props.row.carMileage}} (KM)</span>
                        </p>
                        <p class="billingConsume">
                          <span class="titleLabel">进店油表:</span>
                          <span class="titleVal">{{(props.row.carOilmeter)}}</span>
                        </p>
                      </div>
                      <div class="billingContent">
                        <el-table border :data="repairItemDetails" highlight-current-row style="width: 100%">
                          <el-table-column align="center" property="date.itemId.name" label="服务项目" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="date.itemId.workHour" label="工时数" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="date.itemId.sum" label="金额" show-overflow-tooltip></el-table-column>
                        </el-table>
                      </div>
                      <div class="billingContent">
                        <el-table border :data="outpartDetails" highlight-current-row style="width: 100%">
                          <el-table-column align="center" property="partName" label="配件名称" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="count" label="出库数量" show-overflow-tooltip></el-table-column>
                          <el-table-column align="center" property="sale" label="售价" show-overflow-tooltip></el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </el-card>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" property="workorderNo" label="订单号" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.clientId.carNo" label="车牌号" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" property="date.clientId.carBrand" label="汽车品牌" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" property="date.clientId.carModel" label="车型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.clientId.name" label="客户姓名"></el-table-column>
            <el-table-column align="center" property="date.clientId.mobile" label="客户电话" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="date.repairTypeLK.value" label="维修性质" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="sendTime" sortable width="180" label="开单时间" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" property="endTime" sortable width="180" label="预交车时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="sum" label="金额(元)" width="90"></el-table-column>
            <el-table-column align="center" property="workorderState" label="状态" width="90" show-overflow-tooltip>
              <template slots-scope="scope">
                <el-tag size="middle" type="warning" v-if="scope.row.workorderState=='维修中'">{{scope.row.workorderState}}</el-tag>
                <el-tag size="middle" type="success" v-if="scope.row.workorderState=='已结账'">{{scope.row.workorderState}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slots-scope="scope">
                <el-button size="small" type="success" v-if="scope.row.workorderState=='维修中'" @click="changeState(scope.$index, scope.row)">结账</el-button>
                <el-button size="small" type="info" @click="loadMore(scope.$index, scope.row)">订单详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tablePages" style="margin-top:10px;text-align:right">
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
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { getDataFormLUP, getDataFormLUPById } from '@/assets/js/utils'
export default {
  name: 'serviceRecord',
  data (){
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      search: {
        company: '',
        repairTypeLK: ''
      },
      allItemTableData: [],
      unpayTableData: [],
      payedTableData: [],
      repairItemDetails: [],
      outpartDetails: [],
      repairCompany: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      unpayPageNo: 1,
      unpayPageSize: 10,
      unpayTotal: 0,
      companys: {},
      workType: {}
    }
  },
  mounted() {
    $(".el-card__header").css("padding","5px 20px")
  },
  created() {
    let _this = this
    _this.getCompanys()
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
      _this.loadAllData(_this.pageNo,_this.pageSize)
      _this.loadUnpayData(_this.unpayPageNo,_this.unpayPageSize)
    },2000)
    getDataFormLUP('work_type',function() {_this.workType = this})
  },
  methods: {
    loadAllData(pageNo,pageSize) {
      if(this.userRole == 'super_admin'){
        this.usercompany = ''
      } 
      this.$http.get('/supercar/repairWorkorder/page',{
        params:{
          'search.company_eq': this.usercompany,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.allItemTableData = response.body.data.page.content
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
    loadUnpayData(pageNo,pageSize) {
      if(this.userRole == 'super_admin'){
        this.usercompany = ''
      } 
      this.$http.get('/supercar/repairWorkorder/page',{
        params:{
          'search.company_eq': this.usercompany,
          'search.workorderState_eq': '维修中',
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.unpayTableData = response.body.data.page.content
        this.unpayTotal = response.body.data.page.totalElements
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接失败，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    goSearch() {
      if(this.userRole == 'super_admin'){
        this.usercompany = this.search.company
      } 
      if(this.search.workorderNo || this.search.carNo || this.search.repairTypeLK || this.search.clientName || this.search.company){
        this.searchData()
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
      this.search.workorderNo = ''
      this.search.repairTypeLK = ''
      this.search.clientName = ''
      this.search.carNo = ''
      if(this.userRole == 'super_admin'){
        this.search.company = ''
      }
      this.searchData()
    },
    searchData(){
      if(this.userRole == 'super_admin'){
        this.usercompany = this.search.company
      } 
      let clientId = []
      if(this.search.carNo || this.search.clientName){
        this.$http.get('/supercar/client/page',{
          params: {
            'search.carNo_like': this.search.carNo,
            'search.name_like': this.search.clientName,
          }
        }).then((response) => {
          if(response.body.data.page.content){
            for(var i=0; i<response.body.data.page.content.length;i++){
              clientId.push(response.body.data.page.content[i].id)
            }
          }
          var params = {
            'search.company_eq': this.usercompany,
            'search.clientId_in': clientId.length>0 ? clientId.join(',') : '',
            'search.workorderNo_like': this.search.workorderNo,
            'search.repairTypeLK_like': this.search.repairTypeLK,
            'page.pn': 1,
            'page.size': this.pageSize
          }
          if($(".el-tabs__item.is-active").text().indexOf('待结账') != -1){
            params['search.workorderState_eq'] = '维修中'
          }
          this.$http.get('/supercar/repairWorkorder/page',{
            params: params
          }).then((response) => {
            if($(".el-tabs__item.is-active").text().indexOf('待结账') != -1){
             this.unpayTableData = response.body.data.page.content
              this.unpayTotal = response.body.data.page.totalElements
            }else{
              this.allItemTableData = response.body.data.page.content
              this.total = response.body.data.page.totalElements
            }
          }, response => {
            this.$message({
              type: 'error',
              message: '网络连接失败，请重试！',
              duration: 2000,
              showClose: true
            })
          })
        }, response => {
          this.$message({
            type: 'error',
            message: '网络连接失败，请重试！',
            duration: 2000,
            showClose: true
          })
        })
      }else{
        var params = {
          'search.company_eq': this.usercompany,
          'search.workorderNo_like': this.search.workorderNo,
          'search.repairTypeLK_like': this.search.repairTypeLK,
          'page.pn': 1,
          'page.size': this.pageSize
        }
        if($(".el-tabs__item.is-active").text().indexOf('待结账') != -1){
          params['search.workorderState_eq'] = '维修中'
        }
        this.$http.get('/supercar/repairWorkorder/page',{
          params: params
        }).then((response) => {
          if($(".el-tabs__item.is-active").text().indexOf('待结账') != -1){
           this.unpayTableData = response.body.data.page.content
            this.unpayTotal = response.body.data.page.totalElements
          }else{
            this.allItemTableData = response.body.data.page.content
            this.total = response.body.data.page.totalElements
          }
        }, response => {
          this.$message({
            type: 'error',
            message: '网络连接失败，请重试！',
            duration: 2000,
            showClose: true
          })
        })
      }
    },
     getCompanys() {
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    changeState(index, row){
      var editFormObj = {
        "repairWorkorder": {
          "id": row.id,
          "workorderState": '已结账',//工单状态
        }
      }
      this.$http.post('/supercar/repairWorkorder/editRepairWorkOrder', editFormObj).then((response) => {
        if(response.body.success){
          this.$message({
            type: 'success',
            message: '结账成功！',
            duration: 3000,
            showClose: true
          })
          this.loadAllData(this.pageNo, this.pageSize)
          this.loadUnpayData(this.unpayPageNo,this.unpayPageSize)
        }
      }, response => {
        this.$message({
          type: 'error',
          message: '网络连接失败，请重试！',
          duration: 2000,
          showClose: true
        })
      })
    },
    loadMore(index, row){
      //alert(row.workorderNo)
      this.$http.get('/supercar/repairWorkorder/getItemsAndParts',{
        params: {
          'repairWorkOrderNo': row.workorderNo,
        }
      }).then((response) => {
        let _this = this
        this.repairItemDetails = []
        this.outpartDetails = []
        this.repairCompany = ''
        if(response.body.data.items){
          this.repairItemDetails = response.body.data.items
        }
        if(response.body.data.repairWorkorder.company){
          this.repairCompany = response.body.extendInfo.company[response.body.data.repairWorkorder.company].name
        }
        if(response.body.data.outPartComposite != null){
          this.outpartDetails = response.body.data.outPartComposite.outPartInfos
          let outPartInfos = response.body.data.outPartComposite.outPartInfos
          let partExtendInfo = response.body.extendInfo.partId
          for(var i=0;i<outPartInfos.length;i++){
            _this.outpartDetails[i].partName = partExtendInfo[outPartInfos[i].date.inventoryId.partId].name 
          }
        }
        $(".el-tab-pane[style='']").find(".el-table__expand-icon").eq(index).trigger("click") 
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
      this.loadAllData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadAllData(this.pageNo, this.pageSize)
    },
    unpayHandleSizeChange(val) {
      this.unpayPageSize = val
      this.loadUnpayData(this.unpayPageNo, this.unpayPageSize)
    },
    unpayHandleCurrentChange(val) {
      this.unpayPageNo = val
      this.loadUnpayData(this.unpayPageNo, this.unpayPageSize)
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
  width: 60px;
}

.searchBox .searchInput {
  display: inline-block;
  float: left;
  width: 68%;
}

.searchBox .searchInput .block {
  display: inline-block;
}

.detailItem {
  margin-bottom: 20px;
  border: 1px solid #ddd
}

.detailItem .billingTitle {
  background-color: rgb(241, 247, 220);
}

.detailItem .billingTitle p {
  margin: 0;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px dashed #999;
}

.detailItem .billingTitle p .titleLabel {
  margin: 0 6px
}

.detailItem .billingTitle p .titleVal {
  color: rgb(237, 166, 45)
}

.detailItem .billingContent {
  margin-top: 10px;
}

.mark {
  background-color: transparent;
  padding: 0;
}
</style>
