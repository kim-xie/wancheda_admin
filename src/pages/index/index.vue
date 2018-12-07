<template>
  <div id="index">

    <el-row class="rowWrap">
      <el-col :span="24">
        <div class="grid-content">
          <el-alert :title="tipTitle" type="success" show-icon></el-alert>
        </div>
      </el-col>
    </el-row>

    <el-row class="rowWrap" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="客户总数">
              <div class="symbol terques">
                 <i class="icon-user"></i>
              </div>
              <div class="value">
                  <h1>342</h1>
                  <p>客户总数</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="库存总数">
              <div class="symbol red">
                <i class="icon-tags"></i>
              </div>
              <div class="value">
                <h1>140</h1>
                <p>库存总数</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="订单总数">
              <div class="symbol yellow">
                <i class="icon-shopping-cart"></i>
              </div>
              <div class="value">
                <h1>345</h1>
                <p>订单总数</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="交易总额">
              <div class="symbol blue">
                <i class="icon-bar-chart"></i>
              </div>
              <div class="value">
                <h1>￥3450</h1>
                <p>交易总额</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
    </el-row>

    <el-row class="rowWrap infoBox">
      <el-col :span="24">
        <div class="grid-content index-path">
          <div class="path-item">
            <div>
              <a ui-sref="reception-edit" href="javascript:;">
                <button class="gradient-button">
                  <span>开单</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
              <!-- <p>今日开单<span class="m-c">0</span></p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('reception-list',{},'3')">
                <button class="gradient-button">
                  <span>报价</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
              <!-- <p>
                服务中<span class="m-c">1</span>
              </p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('pick-await',{},'139')">
                <button class="gradient-button">
                  <span>领料</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
             <!--  <p>
               待领料<span class="m-c">0</span>
             </p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('reception-list',{state:2}, '3')">
                <button class="gradient-button">
                  <span>结账</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
              <!-- <p>
                待结账<span class="m-c">0</span>
                <br>
              </p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('reception-list', {state:1}, '3')">
                <button class="gradient-button">
                  <span>已提车</span>
                </button>
              </a>
            </div>
            <div>
              <!-- <p>
                今日提车<span class="m-c">0</span>
                <br>
              </p> -->
            </div>
          </div>
          <div class="path-item">
            <div class="path-arr02"></div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('purchase.await',{},'133')">
                <button class="gradient-button">
                  <span>采购</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
              <!-- <p>
                待采购<span class="m-c">0</span>
              </p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('in-await',{}, '136')">
                <button class="gradient-button">
                  <span>入库</span>
                </button>
              </a>
            </div>
            <div class="path-arr"></div>
            <div>
              <!-- <p>
                待入库<span class="m-c">0</span>
              </p> -->
            </div>
          </div>
          <div class="path-item">
            <div>
              <a @click="goState('inventory-summary',{}, '131')">
                <button class="gradient-button">
                  <span>仓库</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row class="rowWrap">
      <el-col :span="24">
        <div class="grid-content" id="chartWrap" :style="{width:'100%'}">
          <div id="indexChart" :style="{width:'100%',height:'320px',border:'1px solid #ddd',padding:'10px'}"></div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  var echarts = require('echarts');
  // 引入柱状图
  require('echarts/lib/chart/bar');
  // 引入折线图
  require('echarts/lib/chart/line');
  require('echarts/lib/chart/lines');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/toolbox');

  export default {
    name: 'index',
    data() {
      return {
        message: 'index页面数据',
        tipTitle: '欢迎使用 '+this.$store.state.appName+' ('+this.$store.state.version+') ,您的上次登录时间是：'+ this.$store.state.lastLoginTime +' 登录IP为：' + this.$store.state.lastLoginIp +' 登录次数：' +this.$store.state.loginTimes ,
        chartTitle: '月订单交易记录',
        chartSubTitle: '实时获取客户订单交易记录',
        chartLegendData: ["所有订单","待付款","已付款","代发货"],
        chartXAxisData: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
        //chartSeries: '[]'
      }
    },

    beforeCreate: function () {
     
    },
    created: function () {
      
    },
    beforeMount: function () {
       
    },
    mounted: function () {
      this.drawChart('indexChart');
    },
    beforeUpdate: function () {
     
    },
    updated: function () {

    },
    beforeDestroy: function () {
     
    },
    destroyed: function () {
       
    },
    watch: {

    },
    methods: {
      drawChart(id) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById(id));
        $(window).resize(myChart.resize);
		    window.onresize = myChart.resize;
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption({
          title: {
            text: this.chartTitle,
            subtext: this.chartSubTitle
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.chartLegendData
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.chartXAxisData
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '所有订单',
              type: 'bar',
              data: [120, 49, 70, 232, 256, 767, 1356, 1622, 326, 200,164, 133],
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              }
            },
            {
              name: '待付款',
              type: 'bar',
              data: [26, 59, 30, 84, 27, 77, 176, 1182, 487, 188, 60, 23],
              markPoint: {
                data: [
                  {name: '年最高', value: 1182, xAxis: 7, yAxis: 1182, symbolSize:18},
                  {name: '年最低', value: 23, xAxis: 11, yAxis: 3}
                ]
              }
            },
            {
              name: '已付款',
              type: 'bar',
              data: [26, 59, 60, 264, 287, 77, 176, 122, 247, 148, 60, 23],
              markPoint: {
                data: [
                  {name: '年最高', value: 172, xAxis: 7, yAxis: 172, symbolSize:18},
                  {name: '年最低', value: 23, xAxis: 11, yAxis: 3}
                ]
              }
            },
            {
              name: '代发货',
              type: 'bar',
              data: [26, 59, 80, 24, 87, 70, 175, 1072, 48, 18, 69, 63],
              markPoint: {
                data: [
                  {name: '年最高', value: 1072, xAxis: 7, yAxis: 1072, symbolSize:18},
                  {name: '年最低', value: 22, xAxis: 11, yAxis: 3}
                ]
              }
            }
          ]
        });
      }
    },

  }
</script>

<style scoped>
  #index .terques { background: #6ccac9;}
  #index .red { background: #ff6c60;}
  #index .yellow { background: #f8d347;}
  #index .blue { background: #57c8f2;}
  #index .darkblue{ background-color:#438eb9}
  #index .green{ background-color:#093}
  #index .symbol { width: 40%;padding: 25px 15px; -webkit-border-radius: 4px 0px 0px 4px;border-radius: 4px 0px 0px 4px;}
  #index .symbol i { color: #fff;font-size: 50px;}
  #index .value { width: 58%;padding-top: 21px;}
  #index .value { float: right;}
  #index .value h1 { font-weight: 300;}
  #index .value h1, #index .value p { margin: 0;padding: 0;color: #666666;}
  #index .symbol, #index .value { display: inline-block;text-align: center;}
  #index .panel{ border:1px solid #dddddd; margin-bottom:0px;}

  #index .rowWrap{margin: 15px 0}
  #index .rowWrap:first-child{margin-top: 10px}
  #index .rowWrap.infoBox{border:1px solid #ddd;padding:10px}
  #index .breadcrumbWrap .el-breadcrumb__item{ font-size: 16px;}

  button, select {
  	background: none;
  	border: none;
  }
  .gradient-button span {
  	width: 108px;
  	height: 38px;
  	border-radius: 54px;
  	display: inline-block;
  	background: #fff;
  }
  .gradient-button {
  	margin-top: 15px;
  	margin-right: 20px;
  	width: 110px;
  	height: 40px;
  	line-height: 40px;
  	border-radius: 55px;
  	padding: 1px;
  	overflow: hidden;
  	background: -webkit-linear-gradient(left, #8863ff, #098dff);
  	background: -o-linear-gradient(left, #8863ff, #098dff);
  	background: linear-gradient(to right, #8863ff, #098dff);
  }
  #index .index-path {
  	overflow:hidden
  }
  #index .index-path .path-item {
  	position:relative;
  	width:22%;
  	float:left
  }
  #index .index-path .path-item .path-arr {
  	position:absolute;
  	top:19px;
  	left:70px;
  	right:5px;
  	height:2px;
  	background:#d6e8fe
  }
  #index .index-path .path-item .path-arr:after {
  	content:'';
  	position:absolute;
  	right:2px;
  	top:-7px;
  	transform:rotate(-45deg);
  	width:16px;
  	height:16px;
  	border-right:3px solid #d6e8fe;
  	border-bottom:3px solid #d6e8fe
  }
  #index .index-path .path-item p {
  	margin-top:6px
  }
  #index .index-path .path-item p span:first-child {
  	margin:0 5px
  }
  #index .index-path .path-item .m-c {
  	color:#1e00d6
  }
  #index .index-path .path-item:nth-of-type(5) {
  	width:80px
  }
  #index .index-path .path-item:nth-of-type(6) {
  	width:100%;
  	height:100px
  }
  #index .index-path .path-item:nth-of-type(6) .path-arr02 {
  	position:absolute;
  	left:44%;
  	margin-left:35px;
  	top:5px;
  	bottom:0;
  	width:2px;
  	background:rgba(20,124,250,0.2)
  }
  #index .index-path .path-item:nth-of-type(6) .path-arr02:after {
  	content:'';
  	position:absolute;
  	right:-7px;
  	top:0;
  	transform:rotate(-135deg);
  	width:16px;
  	height:16px;
  	border-right:3px solid rgba(20,124,250,0.2);
  	border-bottom:3px solid rgba(20,124,250,0.2)
  }
  #index .index-path .gradient-button {
  	width:70px;
  	margin:0
  }
  #index .index-path .gradient-button span {
  	width:68px
  }
  #index .index-graph {
  	float:left;
  	width:60%;
  	height:360px;
  	border:1px solid #ebebeb;
  	box-shadow:0 1px 3px rgba(0,0,0,0.1);
  	border-radius:4px;
  	overflow:hidden
  }
  #index .index-graph header {
  	height:60px
  }
  #index .index-graph header .right {
  	float:right;
  	margin:20px 0 10px 0;
  	font-size:12px;
  	line-height:25px
  }
  #index .index-graph header .right .gradient-button {
  	margin-right:20px;
  	margin-top:0;
  	width:50px;
  	height:25px;
  	line-height:25px;
  	border-radius:12px
  }
  #index .index-graph header .right .gradient-button span {
  	width:48px;
  	height:23px;
  	border-radius:12px
  }
  #index .current {
  	background:-webkit-linear-gradient(left, #ff7000, #ff5200)
  }
  #index .current span {
  	background:none;
  	color:#fff
  }
  #index #business-summary {
  	height:330px
  }
</style>
