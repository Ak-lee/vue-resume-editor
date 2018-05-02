Vue.component('shareDialog',{
    props:['shareLink'],
    template:`
    <div>
        <h3>请把下面的链接发送给面试官</h3>
        <div>
            <textarea readonly>{{shareLink}}</textarea>
        </div>
        <div @click="$emit('close-share-dialog')" class="closeBtn">X</div>
    </div>
    `
})