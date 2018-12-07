<template>
  <div id="home">
    <el-row class="topNav">
      <topHeader></topHeader>
    </el-row>
    <el-row>
      <el-col :span="3" class="leftSider">
        <leftSider></leftSider>
      </el-col>
      <el-col :span="21" class="mainWrap">
        <el-row class="breadcrumbWrap">
          <el-col :span="24">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/index' }">
                <i class="icon-home" style="margin-right:5px;color:#20a0ff;"></i> 
                <span style="color:#20a0ff;">系统首页</span>
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <el-row class="content">
          <transition name="router-fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import topHeader from 'components/header/header.vue'
  import leftSider from 'components/leftSider/leftSider.vue'

  export default {
    name: 'home',
    data() {
      return {
        message: 'home页面数据',
      }
    },
    components: {
      topHeader,
      leftSider,
    },
    beforeCreate: function () {
     
    },
    created: function () {
     
    },
    beforeMount: function () {
      
    },
    mounted: function () {
      $(".leftSider").height($(window).height()-50);
      $(".mainWrap").height($(window).height()-50 -16);
      $(".leftSider .el-submenu__title").css({
        "height":"45px",
        "line-height":"45px",
        "font-size":"16px"
      });
      $(".leftSider .el-menu-item-group__title").css({"padding-top":"0px"});
     
      window.onresize = () => {
        return (() => {
          $(".leftSider").height($(window).height()-50);
          $(".mainWrap").height($(window).height()-50 -16);
          $(".leftSider .el-submenu__title").css({
            "height":"45px",
            "line-height":"45px",
            "font-size":"16px"
          });
          $(".leftSider .el-menu-item-group__title").css({"padding-top":"0px"});
        })()
      }
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
    computed: {
     
    },
    methods: {

    },
  }
</script>

<style scoped>
  #home{
    position: relative;
  }
  #home .topNav{
    /* position: absolute;
    top: 0;
    left: 0; */
    width: 100%;
    height: 50px;
    /* z-index: 1; */
  }
  #home .leftSider{
    /* position: absolute;
    top: 50px;
    left: 0; */
    overflow: auto;
  }
  #home .mainWrap{
    /* position: absolute;
    top: 50px;
    right: 0;  */
    padding: 8px 15px;
    overflow: auto;
  }
  #home .mainWrap .breadcrumbWrap{
    height: 32px;
    line-height: 32px;
  }
  #home .mainWrap .breadcrumbWrap .el-breadcrumb{
    height: 32px;
    line-height: 32px;
  }
  #home .mainWrap .breadcrumbWrap .el-breadcrumb__item{ 
    font-size: 16px;
  }
  #home .mainWrap .content{
    position: relative;
  }
</style>
