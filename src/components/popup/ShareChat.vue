<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")
</script>

<template>
    <SystemPopupStandard heading="New chat" subheading="Choose one of the options below to create a new chat" v-model:open="openModel">
        <SystemFlex gap="0.5rem">

        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
</style>