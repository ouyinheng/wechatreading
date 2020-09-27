<template>
    <div style="background:black">
        <!-- <readBookInfo></readBookInfo> -->
        <readerBookInfoSimple></readerBookInfoSimple>
    </div>
</template>

<script>
import readBookInfo from '@/components/readerBookInfo'
import readerBookInfoSimple from '@/components/readerBookInfoSimple'
export default {
    name: 'showComponent',
    components: {
        readBookInfo,
        readerBookInfoSimple
    }
}
</script>