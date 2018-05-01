// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
})
var vm=new Vue({
    el:'#app',
    data:{
        mode:'edit',     // or preview
        previewUser:{
            id:''
        },
        previewResume:{},
        currentUser:{
            id:'',
            email:''
        },
        resume: {
            name: '姓名',
            gender: '男or女',
            birthday: 'xxxx年xx月',
            jobTitle: '应聘XXXX攻城狮',
            phone: '13511112222',
            email: 'example@example.com',
            skills:[
                {name:'九阳神功',description:'九阳神功的描述'},
                {name:'乾坤大挪移',description:'乾坤大挪移的描述'}
            ],
            projects:[{name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目描述'}]
        },
        loginVisible:false,
        signUpVisible:false,
        shareVisible:false,
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
        shareLink:''
    },
    methods:{
        print(){
            window.print();
        },
        onEdit(key,value){
            let reg = /\[(\d+)\]/g
            let result
            if(this.mode==='edit'){
                result=this.resume
            }else{
                result=this.previewResume
            }
            if(reg.test(key)){
                key=key.replace(reg,function(match,number){
                    return '.'+number;
                })
                let keys= key.split('.')
                for(let i=0;i<keys.length;i++){
                    if(i===keys.length-1){
                        result[keys[i]]=value
                    }else{
                        result=result[keys[i]]
                    }
                }
            }else{
                result[key]=value
            }

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
            this.resetResume()
            alert('注销成功');
        },
        onLogin(){
            AV.User.logIn(this.login.email, this.login.password).then((loginedUser)=> {
                this.loginVisible=false;
                this.currentUser.id=loginedUser.id
                this.currentUser.email=loginedUser.attributes.email;
                this.shareLink=location.origin+location.pathname+'?user_id='+vm.currentUser.id
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
                this.currentUser.email=loginedUser.attributes.email;
                this.currentUser.id=loginedUser.id;
                alert('验证邮件已发送，请及时验证')
                this.signUpVisible=false;
                this.shareLink=location.origin+location.pathname+'!user_id='+vm.currentUser.id
            }, (error)=>{
                if(error.code === 125){
                    this.signUp.responseMessage='邮箱格式错误'
                }else if(error.code === 203){
                    this.signUp.responseMessage='该邮箱已被注册'
                }
            });
        },
        addSkill(){
            this.resume.skills.push({name:'请填写技能名称',description:'请填写技能描述'})
        },
        removeSkill(index){
            this.resume.skills.splice(index,1)
        },
        addProject(){
            this.resume.projects.push({name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目名称'})
        },
        removeProject(index){
            this.resume.projects.splice(index,1)
        },
        showLogin(){
            this.loginVisible=true;
            this.resetStatus()
        },
        saveResume(){
            let {id} = AV.User.current()
            let user = AV.Object.createWithoutData('User', id)
            user.set('resume', this.resume)
            user.save().then((success)=>{
                alert('保存成功')
            },(error)=>{
                alert('保存失败')
            })
        },
        getResume(user){
            var query = new AV.Query('User');
            return query.get(user.id).then((user)=> {
                // 成功获得实例
                let resume=user.attributes.resume;
                return resume
            }, (error)=> {
                // 异常处理
                console.log(error);
                return error;
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
        resetResume(){
            this.resume={
                name: '姓名',
                    gender: '男or女',
                birthday: 'xxxx年xx月',
                jobTitle: '应聘XXXX攻城狮',
                phone: '13511112222',
                email: 'example@example.com',
                skills:[
                {name:'九阳神功',description:'九阳神功的描述'},
                {name:'乾坤大挪移',description:'乾坤大挪移的描述'}
            ],
                projects:[{name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目描述'}]
            }
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
    },
    watch:{
        'currentUser.id':function(newValue,oldValue){
            if(newValue){
                this.getResume(this.currentUser)
                    .then((resume)=>{
                        this.resume=resume
                    },(error)=>{
                        console.log(error);
                    })
            }
        }
    },
    computed:{
        displayResume(){
            if(this.mode==='edit'){
                return this.resume;
            }else{
                return this.previewResume;
            }
        }
    }
})


let search = location.search;
let regex = /user_id=([^&]+)/
if(search.match(regex)){
    vm.previewUser.id = search.match(regex)[1]
    vm.getResume(vm.previewUser)
        .then((resume)=>{vm.previewResume=resume},(error)=>{console.log(error)})
    vm.mode='preview'
}

let currentUser=AV.User.current()
if(!!currentUser){
    vm.currentUser.id=currentUser.id;
    vm.currentUser.email=currentUser.attributes.email;
    vm.shareLink=location.origin+location.pathname+'?user_id='+vm.currentUser.id
    vm.getResume(currentUser)
        .then((resume)=>{
            vm.resume=resume
        },(error)=>{
            console.log(error);
        })
}


