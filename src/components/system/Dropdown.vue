<script setup lang="ts">

const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

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

function updatePosition() {
    if (element.value && openModel.value) {
        const rect = element.value.getBoundingClientRect()

        bottom.value = rect.bottom
        left.value = rect.left
    }
}

onMounted(() => {
    window.addEventListener("resize", () => updatePosition())
    window.addEventListener("scroll", () => updatePosition())

    watch(() => openModel.value, () => updatePosition())
})
</script>

<template>
    <SystemFlex class="dropdown" :data-open="open" align="center">
        <div class="element" ref="element" @click="toggle">
            <slot></slot>
        </div>

        <SystemOverlay :transparent="true" :zIndex="140" v-model:open="openModel" @click="close">
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
    user-select: none;

    display: flex;
    align-items: center;
    justify-content: center;
}

.dropdown {
    position: relative;
}

.dropdown-content {
    position: absolute;

}
</style>