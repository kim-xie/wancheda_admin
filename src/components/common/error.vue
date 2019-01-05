<template>
  <div id="error">
    <section class="mod-page-body">
      <div class="mod-page-main wordwrap clearfix">
        <div class="x-page-container">
          <div class="mod-notfound grid-98">
            <img class="img-notfound" height="320" src="../../assets/img/notfound.gif" width="520">
            <p style="font-size: 24px; line-height: 70px">啊~哦~ 您要查看的页面不存在或已删除！</p>
            <p style="margin-bottom: 30px">请检查您输入的网址是否正确，或者点击链接继续浏览空间</p>
            <p style="font-size: 14px; line-height: 20px">您可以回到 
              <a href="/">网站首页</a> 或到
              <a href="/" target="_blank">帮助中心</a> 
            </p>
          </div>
        </div>
      </div>
    </section>
    <footer class="mod-footer mod-cs-footer">
      <div class="clearfix hidden-box"></div>
      <div class="footer-box">
        <div class="copy-box">©2017&nbsp;www.kimshare.club</div>
      </div>
    </footer>
  </div>
</template>
<script>
  export default {
    name: 'error',
    data() {
      return {
        message: 'error页面数据'
      }
    },
    beforeCreate: function () {
      console.group('beforeCreate 创建前状态=======error.vue========》');
      console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
      console.log("%c%s", "color:red","data   : " + this.$data); //undefined
      console.log("%c%s", "color:red","message: " + this.message)

    },
    created: function () {
      console.group('created 创建完毕状态=======error.vue========》');
      console.log("%c%s", "color:red","el     : " + this.$el); //undefined
      console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
      console.log("%c%s", "color:red","message: " + this.message); //已被初始化

    },
    beforeMount: function () {
        console.group('beforeMount 挂载前状态=======error.vue========》');
        console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
        console.log("%c%s", "color:red","message: " + this.message); //已被初始化
    },
    mounted: function () {
      console.group('mounted 挂载结束状态======error.vue=========》');
      console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
      console.log(this.$el);
      console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
      console.log("%c%s", "color:red","message: " + this.message); //已被初始化

    },
    beforeUpdate: function () {
        console.group('beforeUpdate 更新前状态=======error.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    updated: function () {
        console.group('updated 更新完成状态=======error.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    beforeDestroy: function () {
        console.group('beforeDestroy 销毁前状态=======error.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message);
    },
    destroyed: function () {
        console.group('destroyed 销毁完成状态=======error.vue========》');
        console.log("%c%s", "color:red","el     : " + this.$el);
        console.log(this.$el);
        console.log("%c%s", "color:red","data   : " + this.$data);
        console.log("%c%s", "color:red","message: " + this.message)
    },
    watch: {

    },
    methods: {

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html, body {
    height: 100%;
    width: 100%;
}
.mod-page-body {
    height: auto;
    min-height: 100%;
    zoom: 1;
}
  .clearfix:after {
    content: '\20';
    display: block;
    height: 0;
    clear: both
}

.clearfix {
    zoom:1}

.mod-page-body {
    color: #454545;
    zoom: 1;
}
.mod-page-body .mod-page-main {
    padding-bottom: 85px;
}
.mod-page-body .mod-page-main {
    padding-top: 50px;
}
.wordwrap {
    word-break: break-all;
    word-wrap: break-word;
}
.clearfix {
    zoom: 1;
}
.mod-page-body .mod-page-main .x-page-container {
    padding: 0;
    margin: 0;
    zoom: 1;
    text-align: center;
}
.grid-98 {
    width: 980px;
}
.mod-notfound {
    border-right: #e1e1e1 1px solid;
    border-top: #e1e1e1 1px solid;
    margin-top: 10px;
    background: #fff;
    border-left: #e1e1e1 1px solid;
    border-bottom: #e1e1e1 1px solid;
    height: 585px;
    text-align: center;
    border-radius: 10px;
    margin: auto;
}
a {
    text-decoration: none;
    color: #3fa7cb;
}
.mod-footer {
    padding: 30px 0 15px 0;
    width: 100%;
    height: 40px;
    position: relative;
    margin-top: -85px;
    clear: both;
    zoom: 1;
}
.mod-footer .hidden-box {
    line-height: 0;
    height: 0;
    overflow: hidden;
}
.mod-footer .footer-box {
    text-align: center;
    font-family: Arial,simsun;
    font-size: 12px;
}
.mod-footer .footer-box .copy-box {
    color: #959595;
    line-height: 12px;
    height: 12px;
    overflow: hidden;
}
</style>
