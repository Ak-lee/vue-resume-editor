Vue.component('editableSpan',{
    props:['value','disabled'],
    template:`
            <span class="editableSpan">
                <span v-show="!editing">{{value}}  </span>
                <input v-focus type="text" v-if="editing" v-bind:value="value" @blur="outFocus" @input="triggerEdit" placeholder="在这里输入内容">
                <button v-if="!disabled" @click="editing=!editing">{{editing?'保存':'编辑'}}</button>
            </span>
        `,
    data(){
        return {
            editing:false,
            data:''
        }
    },
    methods:{
        triggerEdit(e){
            this.$emit('edit',e.target.value)
        },
        outFocus(e){
            if(!e.target.value){
                this.$emit('edit','请在这里输入内容')
            }
            this.editing=false;
        }
    }
})