<template>
    <div></div>
</template>

<script>
export default {
    name: 'info',
    data() {
        return {
            id: ''
        }
    },
    methods: {
        getInfo() {
            this.axios.get(`/apit/${this.id}/info/v2/?_signature=_02B4Z6wo00f01rbbj-gAAIBBr4Vp3V8sLGa2yotAAPLjcd`).then(res => {
                console.log(res)
            })
        }
    },
    created() {
        this.id = 'i' + this.$route.query.id;
        this.getInfo();
        // https://m.toutiao.com/i6840840206191428109/info/v2/?_signature=_02B4Z6wo00f01rbbj-gAAIBBr4Vp3V8sLGa2yotAAPLjcd
    }
}
</script>