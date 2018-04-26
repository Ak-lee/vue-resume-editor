var vm=new Vue({
    el:'#app',
    data:{
        resume: {
            name: '高圆圆',
            gender: '女',
            birthday: '1990年1月',
            jobTitle: '前端工程师',
            phone: '138111111111',
            email: 'example@example.com'
        }
    },
    methods:{
        onEdit(key,value){
            this.resume[key]=value;
        }
    }
})