<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")
</script>

<template>
    <SystemPopupStandard heading='Share «Chat name»' subheading="" v-model:open="openModel">
        <SystemFlex gap="0.5rem" direction="column">
            <SystemInput grow="1" placeholder="Search for a user" value=""></SystemInput>
            <SystemP>Users with access</SystemP>

            <SystemFlex>
                <SystemUserIcon></SystemUserIcon>
            </SystemFlex>

            <SystemFlex justify="end">
                <SystemButton>Done</SystemButton>
            </SystemFlex>
        </SystemFlex>
    </SystemPopupStandard>
</template>

<style scoped lang="scss">
</style>