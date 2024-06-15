<script setup lang="ts">

const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

// Fix this ref
const element = ref<HTMLElement | null>(null)

const bottom = ref(0)
const left = ref(0)

function close() {
    openModel.value = false
}

function toggle(event: Event) {
    event.stopPropagation()

    openModel.value = !openModel.value
}

const margin = 5

// Add debounce and only on openModels
onMounted(() => {
    window.addEventListener("resize", () => {
        if (openModel.value) {
            console.log("resize", element.value)

            const rect = element.value?.getBoundingClientRect()

            if (rect) {
                bottom.value = rect.bottom
                left.value = rect.left
            }
        }
    })
})
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