<template>
  <div id="header">
  	<div class="navbar navbar-default">
  	  <div class="container-fluid">
  	    <div class="navbar-header">
  	      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        		<span class="sr-only">Toggle navigation</span>
        		<span class="icon-bar"></span>
        		<span class="icon-bar"></span>
        		<span class="icon-bar"></span>
  	      </button>
  	      <router-link to="/index">
            <a class="navbar-brand" style="margin:0;padding:0;margin-top:-6px;">
              <img alt="万车达" src="../../assets/img/logo.png"/>
            </a>
          </router-link>
  	    </div>
  	    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
  	      <ul class="nav navbar-nav navbar-right">
        		<li><a href="javascript:;" id="time"></a></li>
        		<li class="dropdown">
        		  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i class="icon-user mr5"></i> {{this.$store.state.userInfo.userName}} <span class="caret"></span>
              </a>
        		  <ul class="dropdown-menu">
        		    <li><a href="javascript:;">系统设置</a></li>
        		    <li><a href="javascript:;">账号管理</a></li>
        		    <li role="separator" class="divider"></li>
        		    <li @click="logout"><a href="javascript:;"><i class="icon-off mr5"></i>退出</a></li>
        		  </ul>
        		</li>
  	      </ul>
  	    </div>
  	  </div>
  	</div>
  </div>
</template>
<script>
  import {setStore, getStore, removeStore} from '@/assets/js/utils'
  export default {
    name: 'navheader',
    data() {
      return {
        message: 'header页面数据',
        isLogouting: false
      }
    },
    beforeCreate: function () {
      
    },
    created: function () {
      var _this = this;
      setInterval(function(){
        $('#time').css("font-size","14px").html(_this.currentTime);
      },1000);
    },
    beforeMount: function () {
        
    },
    mounted: function () {

    },
    beforeUpdate: function () {
       
    },
    updated: function () {
      this.$store.state.loading = false
    },
    beforeDestroy: function () {

    },
    destroyed: function () {

    },
    watch: {

    },
    methods: {
      currentTime: function(){
  	    var d = new Date();
  	    var year = d.getFullYear();
  	    var month = d.getMonth() + 1;
  	    var date = d.getDate();
  	    var hour = d.getHours();
  	    var min = d.getMinutes();
  	    var sec = d.getSeconds();
  	    return "当前时间: "+year+"/"+month+"/"+date +"  "+this.formatTime(hour)+":"+this.formatTime(min)+":"+this.formatTime(sec);
      },
      formatTime: function(time){
    		if(time < 10){
    		    time = '0' + time;
    		}else{
    		    time = time;
    		}
    		return time;
      },
      logout() {
        //删除cookie并跳到登录页
        this.isLogouting = true;
        var params = {company: getStore('kim_cp'),username: getStore('kim_un')}
        //请求后端
        this.$http.get('/supercar/user/loginout',{params:params}).then((response) => {
          if(response.body.success){
            //成功后删除cookie
            removeStore('kim_un')
            removeStore('kim_id')
            removeStore('kim_cp')
            removeStore('kim_rl')
            this.$store.commit('updateUserInfo', null)
            //重置loding状态
            this.isLogouting = false
            //跳转到登录页
            this.$router.replace('/login')
          }else{
            this.$message({
              type: 'error',
              message: response.body.errorMsg,
              duration: 2000,
              showClose: true
            })
          }
        }, (response) => {
          //Error
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  margin-bottom: 0;
  background: #eef1f6;
}

.navbar-brand {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 24px;
  color: #1340e8;
}

.mr5 {
  margin-right: 5px;
}
</style>
