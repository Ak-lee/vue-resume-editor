Vue.component('sign-up-dialog',{
    data(){
      return {
          signUp:{
              email:'',
              password:'',
              responseMessage:''
          }
      }
    },
    template:`
    <div class="signUp">
        <form @submit.prevent="onSignUp">
            <div class="title">
                <h2>注册</h2>
                <span @click="gotoLoginDialog">| 登录</span>
            </div>
            <button type="button" class="closeBtn" @click="closeSignUpDialog">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-Close"></use>
                </svg>
            </button>
            <div class="row">
                <label>邮箱</label>
                <input  v-model="signUp.email" type="text">
            </div>
            <div class="row">
                <label>密码</label>
                <input v-model="signUp.password" type="password">
            </div>
            <div class="action">
                <button type="submit">提交</button>
            </div>
            <div class="message">{{signUp.responseMessage}}</div>
        </form> 
    </div>
    `,
    methods:{
        onSignUp(){
            // 新建 AVUser 对象实例
            var user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.email);
            // 设置密码
            user.setPassword(this.signUp.password);
            // 设置邮箱
            user.setEmail(this.signUp.email);
            user.signUp().then((loginedUser)=> {
                let user =loginedUser.toJSON()
                this.$emit('login',user)
                alert('验证邮件已发送，请及时验证')
            }, (error)=>{
                if(error.code === 125){
                    this.signUp.responseMessage='邮箱格式错误'
                }else if(error.code === 203){
                    this.signUp.responseMessage='该邮箱已被注册'
                }
            });
        },
        gotoLoginDialog(){
            this.$emit('goto-login-dialog')
        },
        closeSignUpDialog(){
            this.$emit('close-sign-up-dialog')
        },
    }
})