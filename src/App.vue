<template>
  <div class="clearfix">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

  import '@/service/mock'
  import { KimAjax, setStore, getStore, getDataFormLUPById } from '@/assets/js/utils'

  export default {
    data() {
      return {
        message: 'APP页面数据',
      }
    },
    beforeCreate: function () {
      let loadingInstance = ''
      console.group('beforeCreate 创建前状态=======App.vue========》');
      console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
      console.log("%c%s", "color:red","data   : " + this.$data); //undefined
      console.log("%c%s", "color:red","message: " + this.message);
      loadingInstance = this.$loading({ 'fullscreen': true,'text': '玩命加载中...','body': true, });
      setTimeout(function(){
        loadingInstance.close();
      },2000)
    },
    created: function () {
      console.group('created 创建完毕状态=======App.vue========》');
      console.log("%c%s", "color:red","el     : " + this.$el); //undefined
      console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
      console.log("%c%s", "color:red","message: " + this.message); //已被初始化
    },
    beforeMount: function () {
      console.group('beforeMount 挂载前状态=======App.vue========》');
      console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
      console.log(this.$el);
      console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
      console.log("%c%s", "color:red","message: " + this.message); //已被初始化
    },
    mounted: function () {
      console.group('mounted 挂载结束状态======App.vue=========》');
      console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
      console.log(this.$el);
      console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
      console.log("%c%s", "color:red","message: " + this.message); //已被初始化
    },
    beforeUpdate: function () {
        console.group('beforeUpdate 更新前状态=======App.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    updated: function () {
        console.group('updated 更新完成状态=======App.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    beforeDestroy: function () {
        console.group('beforeDestroy 销毁前状态=======App.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    destroyed: function () {
        console.group('destroyed 销毁完成状态=======App.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message)
    },
    watch: {

    },
  }

</script>

<style>
  .router-fade-enter-active, .router-fade-leave-active {
  	transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
  	opacity: 0;
  }
</style>
