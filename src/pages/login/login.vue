<template>
  <div id="login" @keydown="show($event)">
    <img id="bgImg" src="../../assets/img/backgroud.png">
    <canvas id="c_n21" style="position: fixed; top: 0px; left: 0px; z-index: -2; opacity: 0.5;"></canvas>
		<div class="cent-box">
			<div class="cent-box-header">
				<h1 class="main-title"></h1>
				<!-- <h2 class="sub-title"></h2> -->
			</div>

			<div class="cont-main clearfix">
				<div class="index-tab">
					<div class="index-slide-nav">
						<!-- <a href="login.html" class="active">登录</a>
						<a href="register.html">注册</a>
						<div class="slide-bar"></div>		 -->
					</div>
				</div>

				<div class="login form">
					<div class="group">
						<div class="group-ipt user">
							<input type="text" name="username" id="username" v-model="username" class="ipt" placeholder="输入登录账号" maxLength="11" autofocus>
						</div>
						<div class="group-ipt password">
							<input type="password" name="password" id="password" v-model="password" class="ipt" placeholder="输入登录密码" maxLength="12">
						</div>
						<!-- <div class="group-ipt verify">
							<input type="text" name="verify" id="verify" class="ipt" placeholder="输入验证码" maxLength="4" required="">
						</div> -->
					</div>
				</div>

				<div class="button">
					<button type="submit" class="login-btn register-btn" id="button" @click="login">登   录</button>
				</div>

				<div class="remember clearfix">
					<label class="remember-me">
						<span class="icon"><span class="zt"></span></span>
						<input type="checkbox" name="remember-me" id="remember-me" v-model="remember_Me" checked="" @click="rememberMe">记住我
					</label>
					<label class="forgot-password">
						<a href="javascript:;">忘记密码？</a>
					</label>
				</div>
			</div>
		</div>

		<div class="footer">
			<p>kim技术分享平台</p>
			<p>Designed By kim &amp; <a href="javascript:;">kimit.cn</a> 2017</p>
		</div>

  </div>
</template>

<script>
  // import 'assets/js/canvas-nest.min'
  import CryptoJS from 'crypto-js/core'
  import MD5 from 'crypto-js/md5'
  import {setStore, getStore, getDataFormLUPById} from '@/assets/js/utils'
  export default {
    name: 'login',
    data() {
      return {
        message: 'login页面数据',
        remember_Me: '',
        username: '',
        password: ''
      }
    },
    beforeCreate: function () {
      console.group('beforeCreate 创建前状态=======login.vue========》');
    },
    created: function () {
      console.group('created 创建完毕状态=======login.vue========》');
      let component = this;
      document.onkeydown = function(){
          component.show();
      }    
    },
    beforeMount: function () {
      console.group('beforeMount 挂载前状态=======login.vue========》');
    },
    mounted: function () {
      console.group('mounted 挂载结束状态======login.vue=========》');
      this.rememberMe()
    },
    beforeUpdate: function () {
      console.group('beforeUpdate 更新前状态=======login.vue========》');
    },
    updated: function () {
      console.group('updated 更新完成状态=======login.vue========》');
    },
    beforeDestroy: function () {
      console.group('beforeDestroy 销毁前状态=======login.vue========》');
    },
    destroyed: function () {
      console.group('destroyed 销毁完成状态=======login.vue========》');
    },
    watch: {

    },
    computed: {

    },
    methods: {
      rememberMe(){
        var remember_Me = $("#remember-me").prop("checked")
        if(remember_Me){
          $(".zt").show();
          $("#remember-me").attr("checked",true)
        }else{
          $(".zt").hide();
          $("#remember-me").attr("checked",false)
        }
      },
      show: function (ev) {
        let _this = this
        if(ev.keyCode == 13){
          _this.login()
        }
      },
      login(){
        var username = this.username
        var password = this.password
        var remember_Me = $("#remember-me").prop("checked")
        //alert(this.password)
        var hashPwd = CryptoJS.MD5(this.password).toString()
        //alert(username + "--" + hashPwd +"--"+remember_Me)
        var params = {username:username,password:hashPwd}
        if(username && hashPwd){
          //请求后端
          this.$http.get('/supercar/user/login',{params:params}).then((response) => {
            if(response.body.success){
              var _this = this
              //如果登录成功则保存登录状态并设置有效期
              if(remember_Me){
                setStore('kim_un', response.body.data.entity.username, 30)
                setStore('kim_id', response.body.data.entity.id, 30)
                setStore('kim_cp', response.body.data.entity.company, 30)
                setStore('kim_rl', response.body.data.entity.role, 30)
              } else {
                setStore('kim_un', response.body.data.entity.username)
                setStore('kim_id', response.body.data.entity.id)
                setStore('kim_cp', response.body.data.entity.company)
                setStore('kim_rl', response.body.data.entity.role)
              }
              this.$store.dispatch("getUserInfo")
              //跳转登录成功页面
              this.$router.replace('/index')
            }else{
              this.$message({
                type: 'error',
                message: response.body.errorMsg,
                duration: 2000,
                showClose: true
              })
            }
          }, (response) => {
            this.$message({
              type: 'error',
              message: '网络连接失败，请重试！',
              duration: 2000,
              showClose: true
            })
          })
        }else{
          this.$message({
            type: 'info',
            message: '请填写完整的登录信息',
            duration: 2000,
            showClose: true
          })
        }
      }
    }
  }
</script>

<style scoped>
  #login{
    position: fixed;
    left: 0;
    top: 0;
    width:100%;
    min-height: 100%;
    background: url('')no-repeat 20% center;
  }
  #login #bgImg{
    position: fixed;
    left: 12%;
    top: 15%;
  }
  input:focus{
  	outline: none;
  }
  canvas{
  	display:block;
  	vertical-align:bottom;
  }
  #box{
  	width: 100%;
  	height: 100%;
  	background-color: #F7FAFC;
  	background-image: url('');
  	background-size: cover;
  	background-position: 50% 50%;
  	background-repeat: no-repeat;
  	position: fixed;
  	top: 0;
  	left: 0;
  	right: 0;
  	bottom: 0;
  	z-index: 1;
  }
  .cent-box{
  	width: 300px;
  	height: 440px;
  	vertical-align: middle;
  	white-space: normal;
  	margin: 0 auto;
  	position: absolute;
  	z-index: 2;
  	left: 72%;
  	top: 50%;
  	margin-left: -150px;
  	margin-top: -220px;
  }
  .register-box{
  	height: 490px;
  	margin-top: -270px;
  }
  .cent-box-header{
  	text-align: center;
  }
  .hide{
  	font: 0/0 a;
  	color: transparent;
  	text-shadow: none;
  	background-color: transparent;
  	border: 0;
  }
  .cent-box-header .main-title{
  	width: 100%;
  	height: 74px;
  	margin: 0 auto;
  	background: url('../../assets/img/logo1.png') no-repeat bottom center;
  	background-size: contain;
  }
  .cent-box-header .sub-title{
  	margin: 30px 0 20px;
  	font-weight: 400;
  	font-size: 18px;
  	line-height: 1;
  }
  .clearfix:before{
  	content: '';
  	display: table;
  }
  .index-tab{
  	text-align: center;
  	font-size: 18px;
  	margin-bottom: 10px;
  }
  .index-tab .index-slide-nav{
  	display: inline-block;
  	position: relative;
  }
  .index-tab .index-slide-nav a{
  	float: left;
  	width: 4em;
  	line-height: 35px;
  	opacity: 0.7;
  	-webkit-transition: opacity .15s,color .15s;
  	transition: opacity .15s,color .15s;
  	color: #555;
  }
  .index-tab .index-slide-nav a:hover{
  	color: #0f88eb;
  	opacity: 1;
  }
  .index-tab .index-slide-nav a.active{
  	opacity: 1;
  	color: #0f88eb;
  }
  .slide-bar{
  	position: absolute;
  	left: 0;
  	bottom: 0;
  	margin: 0 .8em;
  	width: 2.4em;
  	height: 2px;
  	background: #0f88eb;
  }
  .slide-bar1{
  	left: 4em;
  }
  .form{
  	float: none;
  	margin: auto;
  	text-align: left;
  	width: 300px;
  }
  .form .group{
  	padding: 1px 0;
  	border: 1px solid #d5d5d5;
  	border-radius: 3px;
  }
  .form .group .group-ipt{
  	position: relative;
  	margin: 0;
  	overflow: hidden;
  }
  .form .group .group-ipt.active{
  	border-top: 1px solid #0076e3;
  }
  .form .group .group-ipt input{
  	padding: 10px;
  	width: 100%;
  	box-sizing: border-box;
  	border: 0;
  	border-radius: 0;
  	box-shadow: none;
  	background: rgba(255,255,255,0.5);
  	font-family: 'Microsoft Yahei';
  	color: #666;
  	position: relative;
  }
  #password,#verify,#user,#password1{
  	border-top: 1px solid #e8e8e8;
  }
  .imgcode{
  	width: 95px;
  	position: absolute;
  	right: 1px;
  	top: 4px;
  	cursor: pointer;
  	height: 40px;
  }
  .button{
  	margin-top:18px;
  }
  #button{
  	width: 100%;
  	background: #0f88eb;
  	box-shadow: none;
  	border: 0;
  	border-radius: 3px;
  	line-height: 41px;
  	color: #fff;
  	display: block;
  	font-size: 15px;
  	cursor: pointer;
  	font-family: 'Microsoft Yahei';
  }
  #button:hover{
  	background: #80c3f7;
  }
  .remember{
  	margin-top: 10px;
  	line-height: 30px;
  }
  .remember label{
  	display: block;
  }
  .remember-me{
  	font-size: 14px;
  	float: left;
  	position: relative;
  	cursor: pointer;
  }
  .icon{
  	width: 11px;
  	height: 11px;
  	display: block;
  	border: 1px solid #ccc;
  	float: left;
  	margin-top: 9px;
  	margin-right: 5px;
  	cursor: pointer;
  }
  .zt{
  	width: 9px;
  	height: 9px;
  	background: #0f88eb;
  	margin: 0px;
  	display: block;
  }
  #remember-me{
  	position: absolute;
  	left: 0;
  	top: 8px;
  	opacity: 0;
  	cursor: pointer;
  }
  .forgot-password{
  	float: right;
  	font-size: 14px;
  }
  .forgot-password a{
  	color: #555;
  }
  .forgot-password a:hover{
  	text-decoration: underline;
  }
  .footer{
  	position: fixed;
  	width: 100%;
  	height: 60px;
  	bottom: 0;
  	left: 0;
  	text-align: center;
  	color: #999;
  	z-index: 2;
  	padding-bottom: 10px;
  	font-size: 13px;
  }
  .footer a{
  	color: #666;
  	text-decoration: underline;
  }
</style>
