<template>
    <div>
        <img class="img" :src="notFound" alt="not found"/>
    </div>
</template>

<script>
import notFound from '@/static/svg/undraw_Taken_if77.svg';
export default {
    name: 'notFound',
    data() {
        return {
            notFound: notFound
        }
    },
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.img {
    width: 100%;    
}
</style>