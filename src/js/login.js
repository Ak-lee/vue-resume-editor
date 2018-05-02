Vue.component('loginDialog',{
    data(){
        return{
            login:{
                email:'',
                password:'',
                responseMessage:'',
                verifyEmailBtnVisible:false,
                resetPasswordVisible:false
            }
        }
    },
    template:`
    <div class="login">
        <form @submit.prevent="onLogin">
            <div class="title">
                <h2>登录</h2>
                <span @click="$emit('goto-sign-up-dialog')">| 注册</span>
            </div>
            <button class="closeBtn" type="button" @click="$emit('close-login-dialog')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-Close"></use>
                </svg>
            </button>
            <div class="row">
                <label>邮箱</label>
                <input type="text" v-model="login.email">
            </div>
            <div class="row">
                <label>密码</label>
                <input type="password" v-model="login.password">
            </div>
            <div class="action">
                <button type="submit">提交</button>
                <button class="resetPassword" v-if="login.resetPasswordVisible" @click="resetPassword" type="button">忘记密码?</button>
            </div>
            <div class="message" v-html="login.responseMessage"></div>
            <button class="sendEmailBtn" type="button" v-if="login.verifyEmailBtnVisible" @click="verifyEmail">发送邮件</button>
        </form>
    </div>
    `,
    methods:{
        onLogin(){
            AV.User.logIn(this.login.email, this.login.password).then((loginedUser)=> {
                let user = loginedUser.toJSON()
                this.$emit('login',user)
            }, (error)=> {
                if(error.code===216){
                    this.login.responseMessage='你的邮箱还未验证，请检查邮件'
                    this.login.verifyEmailBtnVisible=true
                }else if(error.code===211){
                    this.login.responseMessage='该用户未注册'
                }else if(error.code===210){
                    this.login.responseMessage='密码错误'
                    this.login.resetPasswordVisible=true;
                }
            });
        },
        resetPassword(){
            AV.User.requestPasswordReset(this.login.email).then((success)=> {
                this.login.responseMessage='已发送重置密码邮件'
            }, (error)=> {
                if(error.code===1){
                    this.login.responseMessage='操作频繁，请稍后重试'
                }
                console.log(error);
            });
        },
        verifyEmail(){
            AV.User.requestEmailVerify(this.login.email).then((result)=>{
                this.login.responseMessage='邮件已发送，请查看'
                this.login.verifyEmailBtnVisible=false;
            }, (error)=> {
                if(error.code===1){
                    this.login.responseMessage='操作频繁，请稍后重试'
                }
            });
        }
    }
})