Vue.component('editableSpan',{
    props:['value'],
    template:`
            <span class="editableSpan">
                <span v-show="!editing">{{value}}</span>
                <input type="text" v-show="editing" v-bind:value="value" @input="triggerEdit" >
                <button @click="editing=!editing">{{editing?'保存':'编辑'}}</button>
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
        }
    }
})