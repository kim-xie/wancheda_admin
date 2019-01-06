<template>
  <div id="leftSider">
    <el-col :span="24">
      <el-menu class="el-menu-vertical" @open="handleOpen" @close="handleClose" :router="router" :unique-opened="openedOne" :default-active="$route.path" >
        <el-menu-item index="/index"><i class="icon-home mr5"></i>系统首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title" style="font-size:16px"><i class="icon-wrench mr5"></i>车间管理</template>
          <el-menu-item-group>
            <el-menu-item index="/billing">维修开单</el-menu-item>
            <el-menu-item index="/serviceRecord">维修记录 
              <el-badge class="mark" :value="this.$store.state.repairItemCount"/>
            </el-menu-item>
            <el-menu-item index="/serviceProject">维修项目</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="icon-user mr5"></i>客户管理</template>
          <el-menu-item-group>
            <el-menu-item index="/client">客户维护</el-menu-item>
            <!-- <el-menu-item index="/client/level">客户级别(无)</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="icon-shopping-cart mr5"></i>配件管理</template>
          <el-menu-item-group>
            <el-menu-item index="/productList">配件维护</el-menu-item>
            <el-menu-item index="/productManager">库存管理</el-menu-item>
            <el-menu-item index="/productAdd">配件入库
              <el-badge class="mark" :value="this.$store.state.inpartCount"/>
            </el-menu-item>
            <el-menu-item index="/productRemove">配件出库
              <el-badge class="mark" :value="this.$store.state.outpartCount"/>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title"><i class="icon-bar-chart mr5"></i>财务管理</template>
          <el-menu-item-group>
            <el-menu-item index="/financial">财务统计</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title"><i class="icon-tasks mr5"></i>数据字典</template>
          <el-menu-item-group>
            <el-menu-item index="/lookupDF">数据字典定义</el-menu-item>
            <el-menu-item index="/lookup">数据字典管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title"><i class="icon-cogs mr5"></i>系统设置</template>
          <el-menu-item-group>
            <el-menu-item index="/account">账号管理</el-menu-item>
            <el-menu-item index="/company">公司管理</el-menu-item>
            <!--  <el-menu-item index="/role/list">角色管理(无)</el-menu-item>
            <el-menu-item index="/log/list">系统日志(无)</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </div>
</template>
<script>
  export default {
    name: 'leftSider',
    data() {
      return {
        defaultActive: this.getCurrentPath(),
        router: true,
        openedOne: true,
        message: 'leftsider页面数据'
      }
    },
    beforeCreate: function () {
     
    },
    created: function () {
     
    },
    beforeMount: function () {
       
    },
    mounted: function () {
      
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
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getCurrentPath(){
        var curPath = window.document.location.href;
        var projectName = curPath.substring(curPath.lastIndexOf('/'));
        return projectName;
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #leftSider{ 
    background: #eef1f6;
    height: 100%;
  }
  #leftSider .mr5{ 
    margin: 0 10px;
  }
  #leftSider .el-submenu .el-menu-item{ 
    text-align: center;
    padding-left: none;
    height:45px;
    line-height:45px;
  }
  .el-menu-item{ 
    height:45px;
    line-height:45px;
    font-size:16px
  }
  .mark {
    background-color: transparent;
    padding:0;
  }
</style>
