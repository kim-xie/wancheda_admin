<template>
  <div id="clientLevel">
    <el-row class="searchBox" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">级别名称</span>
          <div class="searchInput">
            <el-input v-model="searchArg.clientInfo" class="input" placeholder="级别名称"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">开始时间</span>
          <div class="searchInput">
            <div class="block">
              <el-date-picker v-model="searchArg.startDate" type="datetime" placeholder="选择开始日期时间"></el-date-picker>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span class="searchTitle">结束时间</span>
          <div class="searchInput">
            <div class="block">
              <el-date-picker v-model="searchArg.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="search">搜 索</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <div class="tableTitle">
            <el-button type="primary" icon="plus"  @click="addLevel = true">新增级别</el-button>
            <el-button type="danger" icon="delete"  @click="removeLevel">批量删除</el-button>
          </div>
          <el-table :data="levelTableData" border tooltip-effect="dark" style="width: 100%" :default-sort = "{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"> </el-table-column>
            <el-table-column align="center" prop="gradeName" label="级别名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="serviceDiscount" label="工时折扣" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="productDiscount" label="商品折扣" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="createTime" sortable label="创建时间" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="updateTime" sortable label="更新时间" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
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
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row class="clientInfoBox">
      <el-col :span="24">
        <div class="grid-content">
          <el-card class="box-card" :body-style="{ padding: '10px 20px' }">
            <div slot="header" class="clearfix" >
              <span style="line-height:28px;font-size:16px;">客户级别统计</span>
              <el-button style="float: right;" :plain="true" size="small" @click="showChart" v-text="showText"></el-button>
            </div>
            <div id="levelChart" class="levelChart"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 新增级别 -->
    <el-dialog title="新增客户级别" :visible.sync="addLevel" class="levelForm">
      <el-form :model="levelForm">
        <el-form-item label="级别名称" :label-width="formLabelWidth" prop="gradeName">
          <el-input v-model="levelForm.gradeName" auto-complete="off" placeholder="请输入级别名称"></el-input>
        </el-form-item>
        <el-form-item label="工时折扣" :label-width="formLabelWidth" prop="serviceDiscount">
          <el-select v-model="levelForm.serviceDiscount" placeholder="请选择工时折扣">
            <el-option label="九折" value="9"></el-option>
            <el-option label="八折" value="8"></el-option>
            <el-option label="七折" value="7"></el-option>
            <el-option label="六折" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品折扣" :label-width="formLabelWidth" prop="productDiscount">
          <el-select v-model="levelForm.productDiscount" placeholder="请选择商品折扣">
            <el-option label="九折" value="9"></el-option>
            <el-option label="八折" value="8"></el-option>
            <el-option label="七折" value="7"></el-option>
            <el-option label="六折" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="levelForm.description" type="textarea" :rows="2" placeholder="请输入客户信息备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleLevel">取 消</el-button>
        <el-button type="primary" @click="submitLevel">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
var echarts = require('echarts');
require('echarts/lib/chart/pie');
require('echarts/lib/chart/funnel');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/toolbox');

export default {
  name: 'clientLevel',
  data (){
    return {
      searchArg: {
        clientInfo: '',
        startDate: '',
        endDate: ''
      },
      levelTableData: [{
        gradeName: '',
        serviceDiscount: '',
        productDiscount: '',
        createTime: '',
        updateTime: ''
      }],
      levelForm: {
        gradeName: '',
        serviceDiscount: '',
        productDiscount: '',
        createTime: '',
        updateTime: '',
        description: ''
      },
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      addLevel: false,
      formLabelWidth: '120px',
      showText: '隐 藏',
      legendData: ['普通客户','银牌客户','金牌客户','超级客户'],
      seriesData: [
          {value:120, name:'普通客户'},
          {value:100, name:'银牌客户'},
          {value:980, name:'金牌客户'},
          {value:850, name:'超级客户'},
      ]
    }
  },
  created() {
    this.$http.get('/api/client/level').then((response) => {
      this.levelTableData = response.body.data
      this.total = response.body.data.length
    }, response => {
      // error callback
      alert("level请求回调失败")
    })
  },
  mounted() {
    $(".el-card__header").css("padding","5px 20px")
    this.drawChart('levelChart')
  },
  methods: {
    search() {
      alert(JSON.stringify(this.searchArg))
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleEdit(index, row) {
      this.levelForm = row
      this.addLevel = true
    },
    handleDelete(index, row) {
        alert(index + "--" + row)
    },
    cancleLevel() {
      this.levelForm = ''
      this.addLevel = false
    },
    submitLevel() {
      this.$http.post('/api/client/addLevel', this.levelForm).then((response) => {
        alert(JSON.stringify(response.body.data))
        alert(response.status)
        alert(response.statusText)
        this.cancleLevel()
      }, response => {
        // error callback
        alert("level请求回调失败")
        this.cancleLevel()
      });
    },
    removeLevel() {
      if(this.multipleSelection.length > 1){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
    },
    showChart() {
      var $this = this;
      if(this.showText.indexOf('隐 藏') !== -1){
        $this.showText = '显 示';
        $(".el-card__body").slideUp();
      }else{
        $this.showText = '隐 藏';
        $(".el-card__body").slideDown();
      }
    },
    drawChart(id) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(id));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption({
          title : {
              text: '客户级别统计',
              subtext: '实时更新最新级别',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              x : 'center',
              y : 'bottom',
              data: this.legendData
          },
          toolbox: {
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: true},
                  magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                      funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'descending',
                        gap: 2,
                      }
                    }
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : [{
              name: '客户数量',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data: this.seriesData
            }]
      });
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
.levelChart{height:300px;}
</style>
