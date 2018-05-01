Vue.component('share-dialog',{
    props:['shareLink'],
    template:`
    <div>
        <h3>请把下面的链接发送给面试官</h3>
        <div>
            <textarea readonly>{{shareLink}}</textarea>
        </div>
        <div @click="closeShareDialog" class="closeBtn">X</div>
    </div>
    `,
    methods:{
        closeShareDialog(){
            this.$emit('close-share-dialog')
        }
    }
})