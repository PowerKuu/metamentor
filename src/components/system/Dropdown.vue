<script setup lang="ts">

const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")
const element = ref<HTMLElement | null>(null)
const { bottom, left } = useElementBounding(element)

function close() {
    openModel.value = false
}

function toggle(event: Event) {
    console.log("toggle")
    event.stopPropagation()

    openModel.value = !openModel.value
}

const margin = 5
</script>

<template>
    <SystemFlex class="dropdown" :data-open="open" align="center">
        <SystemFlex align="center" justify="center" class="element" ref="element" @click="toggle">
            <slot></slot>
        </SystemFlex>

        <SystemOverlay :transparent="true" :zIndex="140" :open="openModel" @click="close">
            <SystemFlex 
                class="dropdown-content" 
                direction="column"
                :style="{
                    top: `${bottom + margin}px`,
                    left: `${left}px`
                }"
            >
                <slot name="content"></slot>
            </SystemFlex>
        </SystemOverlay>
    </SystemFlex>
</template>

<style scoped lang="scss">
.element {
    cursor: pointer;
    user-select: none
}

.dropdown {
    position: relative;
}

.dropdown-content {
    position: absolute;

}
</style>