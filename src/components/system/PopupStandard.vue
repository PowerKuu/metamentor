<script setup lang="ts">
const props = defineProps<{
    heading: string
    subheading?: string

    open: boolean
    maxWidth?: string
    zIndex?: number
}>()

const openModel = useModel(props, "open")

function close() {
    openModel.value = false
}
</script>

<template>
    <SystemPopup v-model:open="openModel" :zIndex="zIndex" :maxWidth="maxWidth ?? `50rem`">
        <SystemFlex direction="column" class="popup border" gap="1rem">
            <SystemFlex justify="space-between" align="center" gap="3rem">
                <SystemFlex direction="column">
                    <SystemH3>{{ heading }}</SystemH3>
                    <SystemPSmall v-if="subheading" class="weak-text">{{ subheading }}</SystemPSmall>
                </SystemFlex>
                
                <Icon @click="close" class="close" name="material-symbols:close-rounded"></Icon>
            </SystemFlex>

            <slot></slot>
        </SystemFlex>
    </SystemPopup>
</template>

<style scoped lang="scss">
.popup {
    padding: 1.5rem;
    background-color: var(--background);
}

.close {
    cursor: pointer;
    color: var(--weak-primary);
    font-size: 1.5rem;

    transition: 0.2s;

    &:hover {
        color: var(--secondary);
    }
}
</style>