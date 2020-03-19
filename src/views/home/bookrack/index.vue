<template>
    <v-app class="bookrack">
        bookrack
    </v-app>
</template>

<script>
import parseSearch from '@/utils/search.js'
export default {
    name: 'bookrack',
    data() {
        return {
        }
    },
    created() {
        this.axios.get('/api/search.php?q=诡秘之主').then(res => {
            console.log(parseSearch.parseHtml(res.data))
        })
    }
}
</script>

<style lang="scss" scoped>
</style>