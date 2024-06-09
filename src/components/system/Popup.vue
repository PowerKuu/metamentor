<script setup lang="ts">
const props = defineProps<{
    open: boolean

    maxWidth?: string
    disable?: boolean
}>()

const openModel = useModel(props, "open")

const maxWidthCSS = computed(() => props.maxWidth ? props.maxWidth : "1000px")

function close() {
    if (props.disable) return
    openModel.value = false
}
</script>

<template>
    <SystemOverlay :open="openModel" :zIndex="100" @click="close">
        <SystemFlex class="popup" align="center" justify="center">
            <slot></slot>
        </SystemFlex>
    </SystemOverlay>
</template>

<style scoped lang="scss">
.wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.popup {
    z-index: 101;

    width: 90vw;
    max-width: v-bind(maxWidthCSS);
}

@media screen and (max-width: 600px) {
    .popup {
        min-width: 100%;
    }
}
</style>