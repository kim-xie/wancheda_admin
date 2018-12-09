<template>
  <div id="biling">
    <el-card class="box-card" :body-style="{padding:'20px 20px 0px 20px'}">
      <div slot="header" class="clearfix">
        <span style="line-height:28px;font-size:16px;">工单信息</span>
        <el-button style="float: right;" :plain="true" size="small" @click="showCard" v-text="showText"></el-button>
      </div>
      <el-form :model="repairOrderForm" ref="repairOrderForm" :inline="true" :rules="rules" label-width="80px">
        <el-form-item label="维修性质" prop="repairTypeLK">
          <el-select placeholder="请选择维修性质" v-model="repairOrderForm.repairTypeLK" >
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
        <el-form-item label="送修人" prop="sendMan">
          <el-input placeholder="送修人" v-model="repairOrderForm.sendMan"></el-input>
        </el-form-item>
        <el-form-item label="进店油表" prop="carOilmeter">
          <el-select placeholder="请选择进店油表" v-model="repairOrderForm.carOilmeter">
            <el-option 
              v-for="item in oilOptions" 
              :key="item.id" 
              :label="item.value" 
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进店里程" prop="carMileage">
          <el-input placeholder="进店里程" v-model="repairOrderForm.carMileage">
            <template slot="append">km</template>
          </el-input>
        </el-form-item>
        <el-form-item label="交车时间" prop="endTime">
          <el-date-picker v-model="repairOrderForm.endTime" type="datetime" placeholder="交车时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="服务顾问" prop="clerk">
          <el-select v-model="repairOrderForm.clerk" placeholder="请选择服务顾问">
            <el-option
              v-for="item in receivers"
              :key="item.id"
              :label="item.fullname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车主嘱咐" prop="clentRemind">
          <el-input type="textarea" :rows="2" placeholder="请输入车主嘱咐内容" v-model="repairOrderForm.clentRemind"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <h5>客户信息</h5>
            <a>
              <i class="icon icon-plus"></i>
              <el-button type="text" @click="showForm = true">添加客户</el-button>
            </a>
          </div>
          <el-table :data="clientTableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column type="expand">
              <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="证件号">
                    <span>{{ props.row.idcard }}</span>
                  </el-form-item>
                  <el-form-item label="车架号">
                    <span>{{ props.row.carVIN }}</span>
                  </el-form-item>
                  <el-form-item label="发动机号">
                    <span>{{ props.row.engineNo }}</span>
                  </el-form-item>
                  <el-form-item label="保险公司">
                    <span>{{ props.row.insurer }}</span>
                  </el-form-item>
                  <el-form-item label="保险到期时间">
                    <span>{{ props.row.insuranceEndtime }}</span>
                  </el-form-item>
                  <el-form-item label="上牌日期">
                    <span>{{ props.row.registrationDate }}</span>
                  </el-form-item>
                  <el-form-item label="客户邮箱">
                    <span>{{ props.row.email }}</span>
                  </el-form-item>
                  <el-form-item label="客户级别">
                    <span>{{ props.row.levelVal }}</span>
                  </el-form-item>
                  <el-form-item label="客户类型">
                    <span>{{ props.row.typeVal }}</span>
                  </el-form-item>
                  <el-form-item label="客户性别">
                    <span v-if="props.row.sex === true">男</span>
                    <span v-if="props.row.sex === false">女</span>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ props.row.createTime }}</span>
                  </el-form-item>
                  <el-form-item label="更新时间">
                    <span>{{ props.row.updateTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="客户姓名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="mobile" label="客户手机" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carNo" label="车牌号" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carBrandVal" label="汽车品牌" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carModel" label="车型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carColor" label="车身颜色"></el-table-column>
            <el-table-column align="center" prop="levelVal" label="客户级别" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="address" label="客户地址" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button size="small" type="info" :plain="true" @click="showForm = true">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <h5>维修项目</h5>
            <a v-if="clientTableData.length == 1">
              <i class="icon icon-plus"></i>
              <el-button type="text" @click="addRepairItem">添加项目</el-button>
            </a>
          </div>
          <el-table :data="repairItemTableDatas" border tooltip-effect="dark" style="width: 100%" show-summary>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="维修项目" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="sum" label="单价(元)"></el-table-column>
            <el-table-column align="center" prop="discount" label="折扣"></el-table-column>
            <el-table-column align="center" prop="workHour" label="数量"></el-table-column>
            <el-table-column align="center" prop="subtotal" label="小计(元)"></el-table-column>
            <el-table-column align="center" prop="mechanicVal" label="技师" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="description" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button size="small" type="info" :plain="true" @click="editRepairItem(scope.$index, scope.row)">修改</el-button>
                <el-button size="small" type="danger" :plain="true" @click="deleteRepairItem(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <h5>配件清单</h5>
            <a v-if="clientTableData.length == 1">
              <i class="icon icon-plus"></i>
              <el-button type="text" @click="addOutpartItem">维修领料</el-button>
            </a>
          </div>
          <el-table :data="productTableDatas" border tooltip-effect="dark" style="width: 100%" show-summary>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="配件名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="sale" label="单价(元)"></el-table-column>
            <el-table-column align="center" prop="discount" label="折扣"></el-table-column>
            <el-table-column align="center" prop="count" label="数量"></el-table-column>
            <el-table-column align="center" prop="subtotal" label="小计(元)"></el-table-column>
            <el-table-column align="center" prop="receiverVal" label="领料人" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="description" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button size="small" type="info" :plain="true" @click="editOutPart(scope.$index, scope.row)">修改</el-button>
                <el-button size="small" type="danger" :plain="true" @click="deleteOutPart(scope.$index, scope.row)">退料</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="totals">
            <p class="totals-detail">
              <span v-if="ownCoupon == true">
                <el-checkbox v-model="checked" @change="check" style="margin-right:20px;">使用优惠券</el-checkbox>
              </span>
              <span>总金额:</span>
              <!-- <strong class="fs14">￥<span class="total">9.00</span></strong> -->
              <strong class="fs18">￥
                <span class="total" style="color:rgb(236, 85, 45);">
                  {{(Number(outpartsTotal) + Number(repairsTotal) - couponVal).toFixed(2)}}
                </span>
                元
              </strong>
              <el-button type="danger" class="ml5" @click="billing('repairOrderForm')">提交订单</el-button>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加客户 -->
    <el-dialog title="添加客户" :visible.sync="showForm" class="clientForm">
      <el-form :model="clientForm" ref="clientForm" :rules="rules">
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNo">
          <el-input v-model="clientForm.carNo" icon="search" :on-icon-click="goSearch" @blur="goSearch()" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车架号" :label-width="formLabelWidth" prop="carVIN">
          <el-input v-model="clientForm.carVIN" placeholder="请输入车架号"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="clientForm.name"  auto-complete="off" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="客户级别" :label-width="formLabelWidth" prop="level">
          <el-select v-model="clientForm.level" filterable placeholder="请选择客户级别">
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
        <el-form-item label="上牌日期" :label-width="formLabelWidth" prop="registrationDate">
          <el-date-picker
            v-model="clientForm.registrationDate"
            type="datetime"
            placeholder="选择上牌日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
          <el-input v-model="clientForm.description" type="textarea" :rows="2" placeholder="请输入客户信息备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="restForm('clientForm')">取 消</el-button>
        <el-button type="primary" @click="submitClientForm('clientForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择维修项目 -->
    <el-dialog title="选择维修项目" :visible.sync="selectRepairItemForm" size="large" >
      <el-row :gutter="10">
        <el-col :span="4">
          <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="20">
          <el-table :data="repairItemTableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column align="center" prop="code" label="项目代码" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="name" label="项目名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="workHour" label="数量" width="80"></el-table-column>
            <el-table-column align="center" prop="sum" label="金额" width="70"></el-table-column>
            <el-table-column align="center" prop="date.workTypeLK.value" label="工种" width="70"></el-table-column>
            <el-table-column align="center" prop="description" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="80">
              <template scope="scope">
                <el-button size="small" @click="selectRepairItem(scope.$index, scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tablePages" style="text-align:right;margin-top:20px;">
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
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="restForm('repairItemForm')">返 回</el-button>
      </div>
    </el-dialog>

    <!-- 维修项目信息 -->
    <el-dialog title="维修项目信息" :visible.sync="showRepairForm" class="repairItemForm" >
      <el-form :model="repairItemForm" ref="repairItemForm" :rules="rules">
        <el-form-item label="维修单价" :label-width="formLabelWidth" prop="sum" style="width:100%;">
          <el-input v-model="repairItemForm.sum" placeholder="维修单价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="workHour" style="width:100%;">
          <el-input v-model="repairItemForm.workHour" placeholder="请输入维修数量"></el-input>
        </el-form-item>
        <el-form-item label="维修工" :label-width="formLabelWidth" prop="mechanic" style="width:100%;">
          <el-select v-model="repairItemForm.mechanic" placeholder="请选择维修工">
            <el-option
              v-for="item in receivers"
              :key="item.id"
              :label="item.fullname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description" style="width:100%;">
          <el-input v-model="repairItemForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button @click="restForm('repairItemForm')">返 回</el-button>
        <el-button type="primary" @click="repairFormSubmit('repairItemForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 维修领料 -->
    <el-dialog title="维修领料" :visible.sync="showProductForm" class="productForm" size="large" >
      <el-row :gutter="10">
        <!-- <el-col :span="4">
          <el-tree :data="treeData" :props="defaultProps" accordion :highlight-current="true" @node-click="handleNodeClick"></el-tree>
        </el-col> -->
        <el-col :span="24">
          <el-table :data="productTableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column align="center" prop="code" label="配件编号" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="name" label="配件名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="wholeSale" label="批发价" width="80"></el-table-column>
            <el-table-column align="center" prop="sale" label="销售价" width="80"></el-table-column>
            <el-table-column align="center" prop="count" label="库存" width="70"></el-table-column>
            <el-table-column align="center" prop="unitLKVal" label="单位" width="70"></el-table-column>
            <el-table-column align="center" prop="produceArea" label="产地" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carModel" label="适用车型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="repCodeLKVal" label="库位号" width="80"></el-table-column>
            <el-table-column align="center" label="操作" width="80">
              <template scope="scope">
                <el-button size="small" @click="outpart(scope.$index, scope.row)">出库</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tablePages" style="text-align:right;margin-top:20px;">
            <el-pagination
              @size-change="outpartHandleSizeChange"
              @current-change="outpartHandleCurrentChange"
              :current-page="outpartPageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="outpartPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="outpartTotal">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="restForm('productForm')">返 回</el-button>
      </div>
    </el-dialog>

    <!-- 领料信息 -->
    <el-dialog title="领料信息" :visible.sync="showOutpartForm" class="outpartForm" >
      <el-form :model="outpartForm" ref="outpartForm" :rules="rules">
        <el-form-item label="销售价" :label-width="formLabelWidth" prop="sale" style="width:100%;">
          <el-input v-model="outpartForm.sale" placeholder="销售价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件数量" :label-width="formLabelWidth" prop="count" style="width:100%;">
          <el-input-number v-model="outpartForm.count" @change="" :min="1" :max="maxCount"></el-input-number>
        </el-form-item>
        <el-form-item label="领料人" :label-width="formLabelWidth" prop="receiver" style="width:100%;">
          <el-select v-model="outpartForm.receiver" placeholder="请选择服务顾问">
            <el-option
              v-for="item in receivers"
              :key="item.id"
              :label="item.fullname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description" style="width:100%;">
          <el-input v-model="outpartForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button @click="restForm('outpartForm')">返 回</el-button>
        <el-button type="primary" @click="outpartSubmit('outpartForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 客户优惠券列表 -->
    <el-dialog title="客户优惠券列表" :visible.sync="showCouponList" >
      <el-row>
        <el-table 
          :data="clientCouponTableData" 
          highlight-current-row
          border 
          tooltip-effect="dark" 
          style="width:100%">
          <el-table-column align="center" prop="date.couponId.value" label="优惠券名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="num" label="优惠券数量" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template scope="scope">
              <el-button size="small" @click="useCoupon(scope.$index, scope.row)">使用该优惠券</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getDataFormLUP, getDataFormLUPById, checkPrice, dateFormat } from '@/assets/js/utils'
export default {
  name: 'billing',
  data (){
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      searchcompany: '',
      search: {},
      repairsTotal: 0,
      outpartsTotal: 0,
      clientTableData: [],
      repairItemTableData: [],
      repairItemTableDatas: [],
      productTableData: [],
      productTableDatas: [],
      clientCouponTableData: [],
      oilOptions: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      outpartPageNo: 1,
      outpartPageSize: 10,
      outpartTotal: 0,
      workorderStates: {},
      showRepairItemForm: false,
      showProductForm: false,
      selectRepairItemForm: false,
      showOutpartForm: false,
      showRepairForm: false,
      showForm: false,
      isLocked: false,
      showText: '隐 藏',
      receivers: {},
      clientForm: {
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
      },
      repairItemForm: {},
      productForm: {},
      outpartForm: {},
      repairOrderForm: {
        repairTypeLK: '',
        carOilmeter: '',
        clerk: '',
        endTime: ''
      },
      formLabelWidth: '120px',
      clientGrade: {},
      clientType: {},
      carBrands: {},
      workType: {},
      repairType: {},
      pCategory: {},
      unitObj: {},
      outpartType: {},
      specification: {},
      clientDiscountVal: 10,
      maxCount: 1,
      editOutpart: false,
      editRepair: false,
      ownCoupon: false,
      checked: false,
      showCouponList: false,
      repairItemIndex: 0,
      outpartIndex: 0,
      couponVal: 0,
      repairItems: [],
      outpartItems: [],
      rules: {
        carNo: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        sale: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        sum: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        workHour:[
          { required: true, message: '请输入维修数量', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入车主手机号', trigger: 'blur' }
        ],
        clerk: [
          { required: true, message: '请选择服务顾问', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请选择领料人', trigger: 'blur' }
        ],
        repairTypeLK: [
          { required: true, message: '请选择维修性质', trigger: 'blur' }
        ],
        mechanic: [
          { required: true, message: '请选择维修工', trigger: 'blur' }
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
        carModel: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        carOilmeter: [
          { required: true, message: '请选择进店油表', trigger: 'blur' }
        ],
        carMileage: [
          { required: true, message: '请输入进店里程', trigger: 'blur' }
        ],
        workorderState: [
          { required: true, message: '请选择工单状态', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    $(".el-form-item__error").css("top","0")
    $(".el-card__header").css("padding","5px 20px")
    $(".el-card__body").css("text-align","center")
  },
  created() {
    let _this = this
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
      _this.searchcompany = _this.$store.state.userInfo.company
      _this.loadAccounts()
    },1000)
    _this.getTreeData()
    getDataFormLUP('client_level',function() {_this.clientGrade = this})
    getDataFormLUP('client_type',function() {_this.clientType = this})
    getDataFormLUP('car_brand',function() {_this.carBrands = this})
    getDataFormLUP('repair_type',function() {_this.repairType = this})
    getDataFormLUP('work_type',function() {_this.workType = this})
    getDataFormLUP('unit',function() {_this.unitObj = this})
    getDataFormLUP('part_specification',function() {_this.specification = this})
    getDataFormLUP('part_type',function() {_this.pCategory = this})
    getDataFormLUP('carOilmeter',function() {_this.oilOptions = this})
    getDataFormLUP('outpart_type',function() {
      let repairOutpart = this
      for (var i = 0; i < repairOutpart.length; i++) {
        if(repairOutpart[i].code == '0'){
          _this.outpartType = repairOutpart[i]
        }
      }
    })
  },
  methods: {
    loadRepairItemData(pageNo, pageSize) {
      let _this = this
      this.$http.get('/supercar/repairItem/page',{
        params: {
          'search.id_notIn': _this.repairItems.join(""),
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.repairItemTableData = response.body.data.page.content
        this.total = response.body.data.page.totalElements
      })
    },
    loadInventoryData(pageNo, pageSize) {
      if(this.userRole == 'super_admin'){
        this.searchcompany = ''
      } 
      this.$http.get('/supercar/inventory/listInventory',{
        params: {
          'search.id_notIn': this.outpartItems.join(""),
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'page.pn': pageNo,
          'page.size': pageSize
        }
      }).then((response) => {
        this.productTableData = response.body.data.entitys
        var extendInfo = response.body.extendInfo
        this.getInventoryList(this.productTableData,extendInfo)
        this.outpartTotal = this.productTableData.length
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
    loadClientCouponData(clientId) {
      this.$http.get('/supercar/clientCoupon/page',{
        params:{
          'search.clientId_eq': clientId,
          'page.pn': 1,
          'page.size': 100
        }
      }).then((response) => {
        this.clientCouponTableData = response.body.data.page.content
        if(this.clientCouponTableData.length>0){
          this.ownCoupon = true
        }else{
          this.ownCoupon = false
        }
      })
    },
    check(){
      if(this.checked){
        this.showCouponList = true
      }else{
        this.couponVal = 0
      }
    },
    loadAccounts(){
      if(this.userRole == 'super_admin'){
        this.searchcompany = ''
      } 
      this.$http.get('/supercar/user/page',{
        params: {
          'search.company_eq': this.searchcompany,
          'search.isDeleted_eq': false,
          'page.pn': 1,
          'page.size': 1000
        }
      }).then((response) => {
        this.receivers = response.body.data.page.content
      })
    },
    getAccount(accountId,obj){
      let _this = this
      this.$http.get('/supercar/user/page',{
        params: {
          'search.isDeleted_eq': false,
          "search.id_eq":accountId
        }
      }).then((response) => {
        if(obj === 'mechanicVal'){
          _this.repairItemForm.mechanicVal = response.body.data.page.content[0]['fullname']
        }else{
          _this.outpartForm.receiverVal = response.body.data.page.content[0]['fullname']
        }
      })
    },
    goSearch() {
      if(this.clientForm.carNo){
        this.$http.get('/supercar/client/page',{
          params: {
            'search.carNo_eq': this.clientForm.carNo,
            'page.pn': 1,
            'page.size': this.pageSize
          }
        },{emulateJSON:true}).then((response) => {
          let clientData = []
          let _this = this
          clientData = response.body.data.page.content
          for(var i=0;i<clientData.length;i++){
            clientData[i].date = ''
            _this.clientForm = clientData[i]
          }
        }, response => {
          this.$message({
            type: 'error',
            message: '网络连接错误，请重试！',
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
    addRepairItem(){
      this.loadRepairItemData(this.pageNo,this.pageSize)
      this.selectRepairItemForm = true
    },
    addOutpartItem(){
      this.loadInventoryData(this.outpartPageNo, this.outpartPageSize)
      this.showProductForm = true
    },
    resetrepairOrderForm(formName){
      this.$refs[formName].resetFields();
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
    showCard() {
      var $this = this;
      if(this.showText.indexOf('隐 藏') !== -1){
        $this.showText = '显 示';
        $(".el-card__body").slideUp();
      }else{
        $this.showText = '隐 藏';
        $(".el-card__body").slideDown();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadRepairItemData(this.pageNo, this.pageSize)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadRepairItemData(this.pageNo, this.pageSize)
    },
    outpartHandleSizeChange(val) {
      this.outpartPageSize = val
      this.loadInventoryData(this.outpartPageNo, this.outpartPageSize)
    },
    outpartHandleCurrentChange(val) {
      this.outpartPageNo = val
      this.loadInventoryData(this.outpartPageNo, this.outpartPageSize)
    },
    submitClientForm(formName){
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            this.clientTableData = []
            getDataFormLUPById(this.clientForm.carBrand, function(){
              _this.clientForm.carBrandVal = this.value
            })
            getDataFormLUPById(this.clientForm.level, function(){
              _this.clientForm.levelVal = this.value
              _this.clientDiscountVal = this.additional
            })
            getDataFormLUPById(this.clientForm.type, function(){
              _this.clientForm.typeVal = this.value
            })
            _this.repairItemTableDatas = []
            _this.productTableDatas = []
            this.outpartsTotal = 0
            this.repairsTotal = 0
            if(_this.clientForm.id){
              this.loadClientCouponData(_this.clientForm.id)
            }
            setTimeout(function(){
              _this.clientTableData.push(_this.clientForm)
              _this.showForm = false
              _this.isLocked = false
            },500)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    selectRepairItem(index, row){
      //alert(JSON.stringify(row))
      this.editRepair = false
      this.repairItemForm = {
        id: row.id,
        typeLK: row.typeLK,
        code: row.code,
        name: row.name,
        workTypeLK: row.workTypeLK,
        workHour: row.workHour,
        sum: row.sum,
        description: row.description,
        mechanic: ''
      }
      this.showRepairForm = true
    },
    repairFormSubmit(formName){
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            let total = 0
            this.getAccount(_this.repairItemForm.mechanic,'mechanicVal')
            _this.repairItemForm.discount = _this.clientDiscountVal
            if(this.editRepair){
              setTimeout(function(){
                //alert(_this.repairItemIndex)
                _this.repairItemTableDatas[_this.repairItemIndex].sum = _this.repairItemForm.sum
                _this.repairItemTableDatas[_this.repairItemIndex].mechanic = _this.repairItemForm.mechanic
                _this.repairItemTableDatas[_this.repairItemIndex].description = _this.repairItemForm.description
                _this.repairItemTableDatas[_this.repairItemIndex].subtotal = Number(_this.repairItemTableDatas[_this.repairItemIndex].workHour) * Number(_this.repairItemForm.sum) * Number(_this.repairItemTableDatas[_this.repairItemIndex].discount/10)
                total += Number(_this.repairItemTableDatas[_this.repairItemIndex].subtotal)
                _this.repairsTotal = total
                _this.showRepairForm = false
                _this.selectRepairItemForm = false
                _this.isLocked = false
              },500)
            }else{
              //alert(JSON.stringify(_this.repairItemForm))
              setTimeout(function(){
                _this.repairItemTableDatas.push(_this.repairItemForm)
                _this.repairItems.push(_this.repairItemForm.id)
                for(var i=0;i<_this.repairItemTableDatas.length;i++){
                  _this.repairItemTableDatas[i].subtotal = Number(_this.repairItemTableDatas[i].workHour) * Number(_this.repairItemTableDatas[i].sum) * Number(_this.repairItemTableDatas[i].discount/10)
                  total += Number(_this.repairItemTableDatas[i].subtotal)
                }
                _this.repairsTotal = total
                _this.showRepairForm = false
                _this.selectRepairItemForm = false
                _this.isLocked = false
              },500)
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    outpart(index, row) {
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
        repCodeLKVal: row.repCodeLKVal,
        receiver: '',
        discount: ''
      }
      this.editOutpart = false
      this.showOutpartForm = true
    },
    outpartSubmit(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.isLocked){
            this.isLocked = true
            let total = 0
            this.getAccount(this.outpartForm.receiver,'receiverVal')
            _this.outpartForm.discount = _this.clientDiscountVal
            if(this.editOutpart){
              setTimeout(function(){
                _this.productTableDatas[_this.outpartIndex].receiver = _this.outpartForm.receiver
                _this.productTableDatas[_this.outpartIndex].description = _this.outpartForm.description
                _this.productTableDatas[_this.outpartIndex].sale = _this.outpartForm.sale
                _this.productTableDatas[_this.outpartIndex].count = _this.outpartForm.count
                _this.productTableDatas[_this.outpartIndex].subtotal = Number(_this.outpartForm.sale) * Number(_this.outpartForm.count) * (_this.productTableDatas[_this.outpartIndex].discount/10)
                  total += Number(_this.productTableDatas[_this.outpartIndex].subtotal)
                  _this.outpartsTotal = total
                  _this.showOutpartForm = false
                  _this.showProductForm = false
                  _this.isLocked = false
              },500)
            }else{
              setTimeout(function(){
                _this.productTableDatas.push(_this.outpartForm)
                _this.outpartItems.push(_this.outpartForm.id)
                for(var i=0;i<_this.productTableDatas.length;i++){
                  _this.productTableDatas[i].subtotal = Number(_this.productTableDatas[i].sale) * Number(_this.productTableDatas[i].count) * (_this.productTableDatas[i].discount/10)
                  total += Number(_this.productTableDatas[i].subtotal)
                }
                _this.outpartsTotal = total
                //this.$store.commit('updateOutPartFormParam', this.outpartForm)
                _this.showOutpartForm = false
                _this.showProductForm = false
                _this.isLocked = false
              },500)
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    useCoupon(index, row){
      //alert(parseInt(row.date.couponId.value))
      this.couponVal = parseInt(row.date.couponId.value)
      this.showCouponList = false
    },
    restForm(formName) {
      this.showRepairItemForm = false
      this.showProductForm = false
      this.selectRepairItemForm = false
      this.showOutpartForm = false
      this.showRepairForm = false
      this.showForm = false
      this.$refs[formName].resetFields()
    },
    editRepairItem(index, row){
      //alert(JSON.stringify(row))
      this.repairItemIndex = index
      this.editRepair = true
      this.repairItemForm = {
        id: row.id,
        typeLK: row.typeLK,
        code: row.code,
        name: row.name,
        workTypeLK: row.workTypeLK,
        workHour: row.workHour,
        sum: row.sum,
        description: row.description,
        mechanic: row.mechanic,
        mechanicVal: row.mechanicVal,
        discount: row.discount,
        subtotal: row.subtotal
      }
      this.showRepairForm = true
    },
    deleteRepairItem(index, row){
      this.repairItemTableDatas.splice(index,1)
      this.repairsTotal = this.repairsTotal-row.subtotal
    },
    editOutPart(index, row){
      //alert(JSON.stringify(row))
      this.maxCount = row.count
      this.outpartIndex = index
      this.editOutpart = true
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
        repCodeLKVal: row.repCodeLKVal,
        receiver: row.receiver,
        receiverVal: row.receiverVal,
        discount: row.discount,
        subtotal: row.subtotal,
        description: row.description
      }
      this.showOutpartForm = true
    },
    deleteOutPart(index, row){
      this.productTableDatas.splice(index,1)
      this.outpartsTotal = this.outpartsTotal-row.subtotal
    },
    billing(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.repairItemTableDatas.length < 1){
            this.$message({
              type: 'warning',
              message: '请添加维修项目！',
              duration: 2000,
              showClose: true
            })
            return;
          }
          if(this.clientTableData.length < 1){
            this.$message({
              type: 'warning',
              message: '请添加客户信息！',
              duration: 2000,
              showClose: true
            })
            return;
          }
          if(!this.isLocked){
            this.isLocked = true
            let _this = this
            var newRepairItemTable = []
            for(var i=0;i<this.repairItemTableDatas.length;i++){
              let tableDate = {}
              tableDate.workorderId = ""
              tableDate.itemId = _this.repairItemTableDatas[i].id
              tableDate.mechanic = _this.repairItemTableDatas[i].mechanic
              newRepairItemTable.push(tableDate)
            }
            let outpartInfos = []
            for(var i=0;i< _this.productTableDatas.length;i++){
              let outpartInfoObj = {
                "workOrderNo": "",
                "inventoryId": _this.productTableDatas[i].inventoryId,
                "count": _this.productTableDatas[i].count,
                "sale": _this.productTableDatas[i].sale,
                "isDeleted": false
              }
              outpartInfos.push(outpartInfoObj)
            }
            delete this.clientForm.date;
            delete this.clientForm.carBrandVal;
            delete this.clientForm.levelVal;
            delete this.clientForm.insuranceEndtime;
            delete this.clientForm.registrationDate;
            delete this.clientForm.createTime;
            delete this.clientForm.updateTime;
            delete this.clientForm.typeVal;
            this.clientForm.company = this.usercompany
            //alert(dateFormat("yyyy-MM-dd hh:mm:ss",this.repairOrderForm.sendTime))
            var addFormObj = {
              "client": this.clientForm,//!this.clientForm.id?this.clientForm:null,
            	"repairWorkorder": {
            		"workorderState": '维修中',//工单状态
            		"repairTypeLK": this.repairOrderForm.repairTypeLK,//维修性质
            		"sum": Number(this.outpartsTotal) + Number(this.repairsTotal)<=0?'':Number(this.outpartsTotal) + Number(this.repairsTotal),//维修金额
            		"clerk": this.repairOrderForm.clerk,//服务顾问
            		"carMileage": this.repairOrderForm.carMileage,//进店里程
            		"carOilmeter": this.repairOrderForm.carOilmeter,//进店油表
                "sendMan": this.repairOrderForm.sendMan,//送修人
                "endTime": this.repairOrderForm.endTime,//离店时间
            		"clentRemind": this.repairOrderForm.clentRemind,//客户嘱咐
                "company": this.usercompany//公司
            	},
            	"repairWorkorderItems": newRepairItemTable,
            	"outPartComposite": {
            		"outPart": {
            			"type": this.outpartType.id,//出库类型 -- 维修领料
            			"receiver": this.productTableDatas[0] ? this.productTableDatas[0].receiver : '',//领料人
            			"sum": this.outpartsTotal,//总金额
            			"repairWorkorderNo": "", // 对应维修开单
                  "clientName": "", // 对应配件销售
            			"carNo": "", // 对应配件销售
            			"departmentLK": "",// 对应配件内耗
            			"company": this.usercompany,//公司
            			"isDeleted": false
            		},
            		"outPartInfos": outpartInfos
            	}
            }
            this.$http.post('/supercar/repairWorkorder/newRepairWorkorder', addFormObj).then((response) => {
              if(response.body.success){
                //this.$store.commit('updateRepairItemCount', Number(this.$store.state.repairItemCount)+1)
                _this.$alert('订单提交成功，前往查看订单？', '温馨提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'success'
                }).then(() => {
                  _this.$router.replace('/serviceRecord')
                }).catch(() => {
                  window.location.reload()
                  _this.repairOrderForm = null
                  _this.clientTableData = null
                  _this.repairItemTableDatas = null
                  _this.productTableDatas = null  
                })
              }
              this.isLocked = false
            }, response => {
              this.$message({
                type: 'error',
                message: '网络连接失败，请重试！',
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
  width: 196px;
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

.control-label {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  width: 100%;
  text-align: right;
}

.tableTitle {
  display: block
}

.tableTitle h5 {
  display: inline-block;
  line-height: 34px;
  width: 60px;
  float: left;
  margin-right: 8px;
}

.tableTitle a {
  display: inline-block;
  height: 100%;
  line-height: 34px;
  float: left;
  color: #20a0ff;
  cursor: pointer;
}

.tableTitle a:hover {
  text-decoration: none;
}

.tableTitle a i {
  margin-right: 3px;
}

.el-select {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.productForm .el-form-item {
  width: 50%;
  float: left;
}

.clientForm .el-form-item {
  width: 50%;
  float: left;
}

.clientForm h4 {
  margin: 0 0;
}

.el-dialog__body {
  padding: 20px;
}

.totals {
  height: 40px;
  line-height: 40px;
  width: 100%;
}

.totals .totals-detail {
  float: right;
  height: 36px;
  line-height: 36px;
}

.el-input-number {
  width: 100%
}

.btnGroup {
  margin: 5px 0 20px 0;
}

.box-card {
  margin: 20px 0;
}

.el-form.el-form--inline .el-input {
  width: 200px;
}

.el-form.el-form--inline .el-textarea {
  width: 493px;
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
