<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">业务后台</h3>
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    type="text"
                    auto-complete="off"
                    placeholder="账号"
                >
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter.native="handleLogin"
                >
                    <svg-icon
                        slot="prefix"
                        icon-class="password"
                        class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
                <el-input
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="验证码"
                    style="width: 63%"
                    @keyup.enter.native="handleLogin"
                >
                    <svg-icon
                        slot="prefix"
                        icon-class="validCode"
                        class="el-input__icon input-icon"
                    />
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleLogin"
                    :disabled="loginType"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <!-- <span>Copyright © 2018-2024 ruoyi.vip All Rights Reserved.</span> -->
            <span>京ICP备2024068363号-4 puchayun.com.cn</span>
        </div>

        <!-- 消息公告 -->
        <div class="mask" v-if="dialogVisible">
            <div class="maskBox">
                <h3>通知公告</h3>
                <div
                    class="conText"
                >系统将于2024-12-12 19:00至2024-12-16 8:00进行服务器升级，届时平台将无法登录，期间给您造成的不便敬请谅解！</div>
                <i class="el-icon-circle-close closeBtn" @click="dialogVisible = false"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
    name: "Login",
    data() {
        return {
            codeUrl: "",
            loginForm: {
                username: "admin",
                password: "admin123",
                rememberMe: false,
                code: "",
                uuid: ""
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入您的账号"
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入您的密码"
                    }
                ],
                code: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请输入验证码"
                    }
                ]
            },
            loading: false,
            // 验证码开关
            captchaEnabled: false,
            // 注册开关
            register: false,
            redirect: undefined,

            // 公告开关
            dialogVisible: false,
            // 登录开关
            loginType: false,
        };
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    created() {
        // this.upgrade(); // 升级公告开关
        this.getCode();
        this.getCookie();
    },
    methods: {
        // 公告升级
        upgrade(){
            // 1734001200000 = 2024-12-12 19:00:00
            if(Date.now() == 1734001200000 || Date.now() > 1734001200000){
                // this.dialogVisible = true;
                this.loginType = true;
            }
        },
        getCode() {
            getCodeImg().then(res => {
                this.captchaEnabled =
                    res.captchaEnabled === undefined
                        ? true
                        : res.captchaEnabled;
                if (this.captchaEnabled) {
                    this.codeUrl = "data:image/gif;base64," + res.img;
                    this.loginForm.uuid = res.uuid;
                }
            });
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get("rememberMe");
            this.loginForm = {
                username:
                    username === undefined ? this.loginForm.username : username,
                password:
                    password === undefined
                        ? this.loginForm.password
                        : decrypt(password),
                rememberMe:
                    rememberMe === undefined ? false : Boolean(rememberMe)
            };
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("username", this.loginForm.username, {
                            expires: 30
                        });
                        Cookies.set(
                            "password",
                            encrypt(this.loginForm.password),
                            { expires: 30 }
                        );
                        Cookies.set("rememberMe", this.loginForm.rememberMe, {
                            expires: 30
                        });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove("rememberMe");
                    }
                    this.$store
                        .dispatch("Login", this.loginForm)
                        .then(() => {
                            this.$router
                                .push({ path: this.redirect || "/" })
                                .catch(() => {});
                        })
                        .catch(() => {
                            this.loading = false;
                            if (this.captchaEnabled) {
                                this.getCode();
                            }
                        });
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    //   background-image: url("../assets/images/login-background.jpg");
    background-image: url("../assets/images/login4.jpeg");
    //   background-repeat: no-repeat;
    //   background-size: cover;
    background-size: 100% 100%;
}
.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    margin-left: 50%;
    margin-top: -10%;
    .el-input {
        height: 38px;
        input {
            height: 38px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 38px;
}
// 公告弹窗
.mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .maskBox{
        width: 300px;
        height: 300px;
        background: #ffffff;
        border-radius: 10px;
        padding: 10px 20px;
        margin-top: -20vh;
        position: relative;
        h3{
            color: #000000e5;
            text-align: center;
            line-height: 0;
            font-size: 24px;
        }
        .conText{
            font-size: 16px;
            line-height: 32px;
            text-indent: 2em;
        }
        .ulClass{
            font-size: 16px;
        }
        .closeBtn{
            position: absolute;
            right: 20px;
            top: 20px;
            color: #b7bcc5;
        }
        .closeBtn:hover{
            cursor: pointer;
        }
    }
}
</style>
