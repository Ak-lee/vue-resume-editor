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
            objectId:''
        },
        previewResume:{},
        currentUser:{
            objectId:'',
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
                {name:'技能名',description:'对技能的描述'},
                {name:'技能名',description:'对技能的描述'}
            ],
            projects:[{name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目描述'}]
        },
        loginVisible:false,
        signUpVisible:false,
        shareVisible:false,
        shareLink:'',
    },
    methods:{
        onEdit(result){
            this.resume=result
        },
        // Login 对话框相关
        showLogin(){
            this.loginVisible=true;
        },
        gotoSignUpDialog(){
            this.loginVisible=false;
            this.signUpVisible=true;
        },
        login(user){
            this.currentUser.objectId=user.objectId;
            this.currentUser.email=user.email;
            this.loginVisible=false;
            this.signUpVisible=false;
        },
        // signUp 对话框相关
        gotoLoginDialog(){
            this.signUpVisible=false;
            this.loginVisible=true;
        },
        // share 对话框相关
        closeShareDialog(){
            this.shareVisible=false;
        },
        showShare(){
            if(this.currentUser.objectId){
                this.shareVisible=!this.shareVisible;
            }else{
                alert('请先登录')
            }

        },
        // aside边栏save按钮相关
        onClickSave(){
            let currentUser = AV.User.current();
            if (!currentUser) {
                // 未登录
                this.showLogin()
            }else{
                this.saveResume()
            }
        },

        // aside边栏打印按钮相关
        print(){
            window.print();
        },
        // main 主内容区相关
        onLogout(){
            AV.User.logOut();
            this.currentUser.objectId=''
            this.currentUser.email=''
            // this.resetResume()
            // alert('注销成功');
        },
        saveResume(){
            let {OjcetId} = AV.User.current()
            let user = AV.Object.createWithoutData('User', objectId)
            user.set('resume', this.resume)
            user.save().then((success)=>{
                alert('保存成功')
            },(error)=>{
                alert('保存失败')
            })
        },
        getResume(user){
            var query = new AV.Query('User');
            return query.get(user.objectId).then((data)=> {
                // 成功获得实例
                if(data.toJSON().resume){
                    return data.toJSON().resume
                }else{
                    return this.resume;
                }
            }, (error)=> {
                // 异常处理
                console.log(error);
                return error;
            });
        },
        // resetResume(){
        //     this.resume={
        //         name: '姓名',
        //             gender: '男or女',
        //         birthday: 'xxxx年xx月',
        //         jobTitle: '应聘XXXX攻城狮',
        //         phone: '13511112222',
        //         email: 'example@example.com',
        //         skills:[
        //         {name:'九阳神功',description:'九阳神功的描述'},
        //         {name:'乾坤大挪移',description:'乾坤大挪移的描述'}
        //     ],
        //         projects:[{name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目描述'}]
        //     }
        // },
        updateResume(resume){
            this.resume=resume;
        }
    },
    watch:{
        'currentUser.objectId':function(newValue,oldValue){
            if(newValue){
                this.getResume(this.currentUser)
                    .then((resume)=>{
                        this.resume=resume
                    },(error)=>{
                        console.log(error);
                    })
                this.shareLink=location.origin+location.pathname+'?user_id='+vm.currentUser.objectId;
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
    vm.previewUser.objectId = search.match(regex)[1]
    vm.getResume(vm.previewUser)
        .then((resume)=>{vm.previewResume=resume},(error)=>{console.log(error)})
    vm.mode='preview'
}

let currentUser=AV.User.current()
if(!!currentUser){
    currentUser=AV.User.current().toJSON()
    vm.currentUser.objectId=currentUser.objectId;
    vm.currentUser.email=currentUser.email;
    vm.shareLink=location.origin+location.pathname+'?user_id='+vm.currentUser.objectId
    vm.getResume(currentUser)
        .then((resume)=>{
            console.log('拿到了resume')
            console.log(resume)
            vm.resume=resume
            console.log('vm.resume')
            console.log(vm.resume)
        },(error)=>{
            console.log(error);
        })
}
console.log('vm.displayResume')
console.log(vm.displayResume);



