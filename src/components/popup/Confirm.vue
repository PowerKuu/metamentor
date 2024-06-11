<script setup lang="ts">
const props = defineProps<{
    subheading: string
    open: boolean
}>()

const openModel = useModel(props, "open")
</script>

<template>
    <SystemPopupStandard :zIndex="120" heading="Confirm" :subheading="subheading" v-model:open="openModel">
        <SystemFlex gap="0.5rem">

        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
</style>