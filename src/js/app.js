var currentUser=AV.User.current()||{id:'',attributes:{email:''}}
var vm=new Vue({
    el:'#app',
    data:{
        currentUser:{
            id:currentUser.id,
            email:currentUser.attributes.email
        },
        resume: {
            name: '高圆圆',
            gender: '女',
            birthday: '1990年1月',
            jobTitle: '前端工程师',
            phone: '138111111111',
            email: 'example@example.com'
        },
        loginVisible:false,
        signUpVisible:false,
        signUp:{
            email:'',
            password:'',
            responseMessage:''
        },
        login:{
            email:'',
            password:'',
            responseMessage:'',
            verifyEmailBtnVisible:false,
            resetPasswordVisible:false
        },

    },
    methods:{
        onEdit(key,value){
            this.resume[key]=value;
        },
        onClickSave(){
            let currentUser = AV.User.current();
            if (!currentUser) {
                // 未登录
                this.showLogin()
            }else{
                this.saveResume()
            }
        },
        onLogout(){
            AV.User.logOut();
            this.currentUser.id=''
            this.currentUser.email=''
            alert('注销成功');
        },
        onLogin(){
            AV.User.logIn(this.login.email, this.login.password).then((loginedUser)=> {
                this.loginVisible=false;
                this.currentUser.id=loginedUser.id
                this.currentUser.email=loginedUser.attributes.email;
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
                console.log(loginedUser);
                this.signUp.responseMessage='验证邮件已发送，请查看'
            }, (error)=>{
                if(error.code === 125){
                    this.signUp.responseMessage='邮箱格式错误'
                }else if(error.code === 203){
                    this.signUp.responseMessage='该邮箱已被注册'
                }
            });
        },
        showLogin(){
            this.loginVisible=true;
            this.resetStatus()
        },
        saveResume(){
            let {id} = AV.User.current()
            let user = AV.Object.createWithoutData('User', id)
            user.set('resume', this.resume)
            user.save()
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
        },
        resetStatus(){
            this.signUp.email=''
            this.signUp.password=''
            this.signUp.responseMessage=''
            this.login.email=''
            this.login.password=''
            this.login.responseMessage=''
            this.login.verifyEmailBtnVisible=false;
            this.login.resetPasswordVisible=false;
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
        }
    }
})
