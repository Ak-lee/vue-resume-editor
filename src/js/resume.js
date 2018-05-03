
Vue.component('resume',{
    props:['myresume','mode','currentUser'],
    template:`
    <main>
        <div class="welcome">欢迎你  {{currentUser.email}}</div>
            <div class="resume">
                <h1>
                    <editable-span :disabled="mode==='preview'" :value="myresume.name" @edit="onEdit('name',$event)"></editable-span>
                </h1>
                <section>
                    <p class="jobTitle">应聘职位：
                        <editable-span :disabled="mode==='preview'" :value="myresume.jobTitle" @edit="onEdit('jobTitle',$event)"></editable-span>
                    </p>
                    <p class="profile">
                        <editable-span :disabled="mode==='preview'" :value="myresume.birthday" @edit="onEdit('birthday',$event)"></editable-span>
                        |
                        <editable-span :disabled="mode==='preview'" :value="myresume.gender" @edit="onEdit('gender', $event)"></editable-span>
                        |
                        <editable-span :disabled="mode==='preview'" :value="myresume.email" @edit="onEdit('email', $event)"></editable-span>
                        |
                        <editable-span :disabled="mode==='preview'" :value="myresume.phone" @edit="onEdit('phone', $event)"></editable-span>
                    </p>
                </section>
                <section class="skills">
                    <h2>技能</h2>
                    <ul>
                        <li v-for="(item,index) in myresume.skills">
                            <editable-span :disabled="mode==='preview'" :value="item.name" @edit="onEdit('skills['+index+'].name',$event)" class="name" ></editable-span>
                            <div class="description">
                                <editable-span :disabled="mode==='preview'" :value="item.description" @edit="onEdit('skills['+index+'].description',$event)"></editable-span>
                            </div>
                            <span class="remove" v-if="index>=2 && mode==='edit'" @click="removeSkill(index)">X</span>
                        </li>
                        <li class="addSkill" v-if="mode==='edit'">
                            <span @click="addSkill">添加一项技能</span>
                        </li>
                    </ul>
                </section>
                <section class="projects">
                    <h2>项目经历</h2>
                    <ol>
                        <li v-for="(item,index) in myresume.projects">
                            <header>
                                <div class="start">
                                    <h3 class="name">
                                        <editable-span :disabled="mode==='preview'" :value="item.name" @edit="onEdit('projects['+index+'].name',$event)"></editable-span>
                                    </h3>
                                    <div class="link">
                                        <editable-span :disabled="mode==='preview'" :value="item.link" @edit="onEdit('projects['+index+'].link',$event)"></editable-span>
                                    </div>
                                </div>
                                <div class="end">
                                    <div class="keywords">
                                        <editable-span :disabled="mode==='preview'" :value="item.keywords" @edit="onEdit('projects['+index+'].keywords',$event)"></editable-span>
                                    </div>
                                </div>
                            </header>
                            <p class="description">
                                <editable-span :disabled="mode==='preview'" :value="item.description" @edit="onEdit('projects['+index+'].description',$event)"></editable-span>
                            </p>
                            <span class="remove" v-if="index>=1 && mode === 'edit'" @click="removeProject(index)">X</span>
                        </li>
                        <li class="addProject" v-if="mode === 'edit'" @click="addProject">添加一项</li>
                    </ol>
                </section>
            </div>
        </main>
    `,
    methods:{
        onEdit(key,value){
            let reg = /\[(\d+)\]/g
            let result=this.myresume  // result 是引用类型。
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
        addSkill(){
            this.myresume.skills.push({name:'请填写技能名称',description:'请填写技能描述'})
        },
        removeSkill(index){
            this.myresume.skills.splice(index,1)
        },
        removeProject(index){
            this.myresume.projects.splice(index,1)
        },
        addProject(){
            this.myresume.projects.push({name:'请填写项目名称',link:'http://...',keywords:'请添加关键词',description:'请填写项目名称'})
        }
    },
})