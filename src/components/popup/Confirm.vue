<script setup lang="ts">
const props = defineProps<{
    heading: string
    subheading: string
    open: boolean
}>()

defineEmits<{
    (e: "confirm"): void
}>()

const openModel = useModel(props, "open")
</script>

<template>
    <SystemPopupStandard :zIndex="120" :heading="heading" :subheading="subheading" v-model:open="openModel">
        <SystemFlex direction="column" gap="1rem">
            <SystemFlex direction="column">
                <slot></slot>
            </SystemFlex>
            <SystemFlex gap="0.5rem" justify="end">
                <SystemButton
                    background="var(--background)" 
                    border="var(--neutral)" 
                    color="var(--text)"

                    icon=""

                    @click="openModel = false"
                >
                    Cancel
                </SystemButton>
                
                <SystemButton
                    background="var(--error)" 
                    @click="() => {
                        $emit(`confirm`) 
                        openModel = false
                    }"

                    icon="material-symbols:delete-outline-rounded"
                >
                    Confirm
                </SystemButton>
            </SystemFlex>
                        
        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
</style>