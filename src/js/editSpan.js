Vue.component('editableSpan',{
    props:['value'],
    template:`
            <span class="editableSpan">
                <span v-show="!editing">{{value}}</span>
                <input v-focus type="text" v-if="editing" v-bind:value="value" @blur="outFocus" @input="triggerEdit" >
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
        },
        outFocus(){
            this.editing=false;
        }
    }
})