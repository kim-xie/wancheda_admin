<template>
  <div id="financial">
    <el-row class="searchBox" :gutter="20" v-if="userRole == 'super_admin'">
      <el-col :span="6">
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
        <div class="grid-content buttonBox">
          <el-button type="primary" icon="search" @click="goSearch">搜 索</el-button>
          <el-button type="primary" icon="close" @click="restSearch">重 置</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="rowWrap" :gutter="20" style="margin:20px auto;">
      <el-col :span="8">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="当日营业额">
              <div class="symbol terques">
                 <i class="icon-calendar"></i>
              </div>
              <div class="value">
                  <h1>￥342</h1>
                  <p>当日营业额</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="当月营业额">
              <div class="symbol red">
                <i class="icon-shopping-cart"></i>
              </div>
              <div class="value">
                <h1>￥140</h1>
                <p>当月营业额</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <section class="panel">
            <a href="javascript:;" title="总营业额">
              <div class="symbol yellow">
                <i class="icon-bar-chart"></i>
              </div>
              <div class="value">
                <h1>￥345</h1>
                <p>总营业额</p>
              </div>
            </a>
          </section>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>

export default {
  name: 'financial',
  data (){
    return {
      userId: '',
      userRole: '',
      usercompany: '',
      search: {
        company: ''
      },
      companys: [],
    }
  },
  created(){
    let _this = this
    _this.getCompanys()
    setTimeout(function(){
      _this.userId = _this.$store.state.userInfo.id
      _this.userRole = _this.$store.state.userInfo.roleName
      _this.usercompany = _this.$store.state.userInfo.company
    },1000)
  },
  methods: {
    getCompanys() {
      this.$http.get('/supercar/company/page?search.isDeleted_eq=false&page.pn=1&page.size=1000').then((response) => {
        this.companys = response.body.data.page.content
      })
    },
    selectChange(code){
      let _this = this
      // this.$http.get('/supercar/financial/getByCode',{params:{code:code}}).then((response) => {
      //   this.lookupTableData = response.body.data.entitys
      //   this.total = response.body.data.entitys.length
      //   if(this.lookupTableData.length === 0){
      //     for(var i=0;i<_this.lookupDfds.length;i++){
      //       if(lookupDefineCode === _this.lookupDfds[i].code){
      //         _this.lookupForm.definitionId = _this.lookupDfds[i].id
      //         break
      //       }
      //     }
      //   }else{
      //     this.lookupForm.definitionId = this.lookupTableData[0].definitionId
      //   }
      // }, response => {
      //
      // })
    },
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
}

.searchBox .searchInput {
  display: inline-block;
  width: 80%;
}

.searchBox .searchInput .block {
  display: inline-block;
  width: 100%;
}

.el-select {
  width: 100%;
}

#financial .terques {
  background: #6ccac9;
}

#financial .red {
  background: #ff6c60;
}

#financial .yellow {
  background: #f8d347;
}

#financial .blue {
  background: #57c8f2;
}

#financial .darkblue {
  background-color: #438eb9
}

#financial .green {
  background-color: #093
}

#financial .symbol {
  width: 40%;
  padding: 25px 15px;
  -webkit-border-radius: 4px 0px 0px 4px;
  border-radius: 4px 0px 0px 4px;
}

#financial .symbol i {
  color: #fff;
  font-size: 50px;
}

#financial .value {
  width: 58%;
  padding-top: 26px;
}

#financial .value {
  float: right;
}

#financial .value h1 {
  font-weight: 300;
}

#financial .value h1, #financial .value p {
  margin: 0;
  padding: 0;
  color: #666666;
}

#financial .symbol, #financial .value {
  display: inline-block;
  text-align: center;
}

#financial .panel {
  border: 1px solid #dddddd;
  margin-bottom: 0px;
}
</style>
