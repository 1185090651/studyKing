<template>
  <div class="login_con">
    <!-- 头部 -->
    <header>
      <div class="head">
        <!-- logo -->
        <div class="logo">
          <img src="http://www.xuexi365.com/images/chaoxing/logo.png" alt />
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <input type="text" class="fidtext" />
          <input type="hidden" />
          <div class="search_logo"></div>
        </div>
        <!-- 导航栏 -->
        <div class="nav">
          <div
            v-for="(item,index) in navItems"
            :key="item"
            :class="`nav_item ${index===0?'active':''}`"
          >{{item}}</div>
        </div>
      </div>
    </header>
    <!-- 主体区域 -->
    <main>
      <div class="login">
        <div class="login_box" v-show="isShowLogin">
          <div class="target" @click="isShowLogin=!isShowLogin"></div>
          <div class="login_head">
            <span>用户登录</span>
          </div>
          <el-form :model="loginForm" :rules="FormRules" ref="loginFormRef" class="loginRuleForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha" class="captcha">
              <el-input v-model="loginForm.captcha" placeholder="验证码" style="width:35%"></el-input>
              <div
                v-html="captchaImg"
                class="captcha_box"
                @click="changeCaptcha"
                style="cursor:pointer;"
              ></div>
              <span
                style="font-size:12px;color:#bebebe;margin-left:11px;cursor:pointer;"
                @click="changeCaptcha"
              >看不清</span>
            </el-form-item>
            <div class="form_bottom">
              <span class="bottom_item" @click="isShowRegister=true">免费注册</span>
              <span class="bottom_item" @click="isShowForgetPwd=true">忘记登录密码？</span>
            </div>
            <el-form-item>
              <el-button type="primary" style="width:100%;" @click="loginHandler">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="qrcode" v-show="!isShowLogin">
          <div class="target_qrcode" @click="isShowLogin=!isShowLogin"></div>
          <div class="login_head">
            <span>用户登录</span>
          </div>
          <div class="qr_code_box">
            <img src="http://www.xuexi365.com/images/chaoxing/erwei.jpg" alt />
            <span style="margin-top:30px;">微信扫码下载超星客户端</span>
          </div>
        </div>
      </div>
    </main>
    <!-- 底部 -->
    <footer>
      <div style="margin:0 auto;">
        <div style="margin:0 auto;">
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802021885"
            style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"
          >
            <img src="http://www.xuexi365.com/images/common/icp.png" style="float:left;" />
            <p
              style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;"
            >京公网安备 11010802021885号</p>
          </a>
          <p class="p_bottom">
            Copyright © 超星
            <span>客服电话：010—51665380</span>
            <a
              href="http://video.chaoxing.com/home_1/home.html"
              target="_blank"
              style="color:white"
            >网络视听许可证0110438号</a>
            <a
              href="http://www.miitbeian.gov.cn"
              target="_blank"
              style="color:white"
            >京ICP备:10040544号</a>
            <span>京ICP证:070744号</span>
          </p>
        </div>
      </div>
    </footer>
    <el-dialog title="用户注册" :visible.sync="isShowRegister" width="30%" @close="resetForm">
      <el-form :model="registerForm" :rules="FormRules" ref="registerFormRef">
        <el-form-item prop="mobile">
          <el-input v-model="registerForm.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="registerHandler" style="width:100%;">注 册</el-button>
      </span>
    </el-dialog>
    <el-dialog title="找回密码" :visible.sync="isShowForgetPwd" width="30%">
      <span>未开发</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isShowForgetPwd = false">取 消</el-button>
    <el-button type="primary" @click="isShowForgetPwd = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCaptcha, login, register } from "@/network/api.js";
export default {
  data() {
    // 自定义手机号验证方式
    const checkPhone = (rule, value, callback) => {
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确的手机号"));
      }
    };
    return {
      navItems: ["首页", "读书", "讲座", "课程", "关于我们"],
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      captchaImg: "",
      isShowLogin: true,
      isShowForgetPwd: false,
      isShowRegister: false,
      registerForm: {
        mobile: "",
        name: "",
        username: "",
        password: "",
        role: "teacher"
      },
      FormRules: {
        // 验证手机号是否合法
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度应为3-15个字符",
            trigger: "blur"
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度应为6-15个字符",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: true,
      active: 0
    };
  },
  methods: {
    // 请求验证码
    async changeCaptcha() {
      let { data } = await getCaptcha();
      this.captchaImg = data;
    },
    // 登录
    loginHandler() {
      // 拿到表单验证的结果
      this.$refs.loginFormRef.validate(async valid => {
        // 验证不成功 跳出程序
        if (!valid) return;
        // 同步得到后台数据
        let res = await login(this.loginForm);
        if (res.meta.code !== 200) {
          this.loginForm.password = "";
          this.loginForm.captcha = "";
          this.changeCaptcha();
          return this.$message.error(res.meta.msg);
        }
        // 将登录成功之后的 token, 保存到客户端的 sessionStorage 中
        // 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem("token", res.data.token);
        // 将用户数据存到vuex中
        console.log(res.data);
        this.$store.commit("saveProfile", res.data);
        // 通知登录成功
        this.$notify({
          dangerouslyUseHTMLString: true,
          message: `<div style="font-size:18px;">${res.data.user.name}ㅤ欢迎登录</div>`,
          type: "success",
          offset: 100,
          position: "top-left"
        });
        // 通过编程式导航调转到后台主页，路由地址是home
        this.$router.push("/home");
      });
    },
    // 注册
    registerHandler() {
      this.$refs.registerFormRef.validate(async vaild => {
        if (!vaild) return;
        let res = await register(this.registerForm);
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.isShowRegister = false;
      });
    },
    resetForm() {
      this.$refs.registerFormRef.resetFields();
    },
    next() {
      this.active++;
    }
  },
  created() {
    this.changeCaptcha();
  }
};
</script>

<style lang="scss">
.login_con {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url("http://www.xuexi365.com/images/chaoxing/bd_bj.jpg") no-repeat;
  background-size: cover;
  header {
    padding: 30px 0 20px 0;
    height: 90px;
    background: url("http://www.xuexi365.com/images/chaoxing/header_bj.png");
    .head {
      width: 1200px;
      height: 40px;
      margin: 0 auto;
      display: flex;
      position: relative;
      .search {
        background: #d7d7d7;
        width: 197px;
        height: 40px;
        border-radius: 4px;
        margin-left: 62px;
        .fidtext {
          float: left;
          height: 20px;
          width: 154px;
          border: 0 none;
          background: none;
          margin: 10px 0 0 10px;
        }
        .search_logo {
          background: url("http://www.xuexi365.com/images/chaoxing/cxsm_ico.png")
            no-repeat;
          width: 17px;
          height: 17px;
          border: 0 none;
          float: left;
          margin: 12px 0 0 6px;
          cursor: pointer;
        }
      }
      .nav {
        display: flex;
        line-height: 45px;
        font-size: 18px;
        position: absolute;
        right: 0;
        width: 400px;
        justify-content: space-around;
        .nav_item {
          cursor: pointer;
        }
        .nav_item:hover {
          color: #0be;
        }
        .active {
          color: #0be;
        }
      }
    }
  }
  footer {
    font-size: 12px;
    background: #16151c;
    text-align: center;
    line-height: 24px;
    color: #efeff4;
    padding: 15px 0;
    height: 74px;
    display: flex;
    flex-direction: column;
    a {
      text-decoration: none;
    }
    .p_bottom {
      width: 750px;
      display: flex;
      margin-top: -10px;
      justify-content: space-around;
    }
  }
  main {
    flex: 1;
    position: relative;
    .login {
      padding: 40px 20px 20px 20px;
      width: 266px;
      height: 343px;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      right: 218px;
      top: 110px;
      border-radius: 5px;
      .login_head {
        font-size: 16px;
        color: #fff;
      }
      .login_box {
        width: 100%;
        height: 100%;
        .target {
          position: absolute;
          right: 0;
          top: 0;
          background: url("http://www.xuexi365.com/images/chaoxing/qrcode.png")
            no-repeat 0 -60px;
          width: 59px;
          height: 59px;
          cursor: pointer;
        }

        .loginRuleForm {
          padding-top: 15px;
          .captcha .el-form-item__content {
            display: flex;
          }
          .captcha_box {
            margin-left: 6px;
            border-radius: 4px;
            width: 80px;
            height: 40px;
            background-color: #fff;
            position: relative;
          }
          .form_bottom {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #fff;
            margin-bottom: 10px;
            cursor: pointer;
            .bottom_item:hover {
              color: #0be;
            }
          }
        }
      }
      .qrcode {
        .target_qrcode {
          position: absolute;
          right: 0;
          top: 0;
          background: url("http://www.xuexi365.com/images/chaoxing/qrcode.png")
            no-repeat;
          width: 59px;
          height: 59px;
          cursor: pointer;
        }
        .qr_code_box {
          padding: 33px;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #fff;
        }
      }
    }
  }
}
</style>