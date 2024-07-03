<script setup lang="ts">

const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const element = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)

const contentTop = ref()
const contentBottom = ref()
const contentRight = ref()
const contentLeft = ref()

let useContentDown = true
let useContentRight = true

function close() {
    openModel.value = false
}

function toggle(event: Event) {
    event.stopPropagation()

    openModel.value = !openModel.value
}

const contentMargin = 5

async function recomputeDropdownPosition() {
    if (!openModel.value || !contentElement.value) return

    useContentDown = true
    useContentRight = true

    await updateDropdownPosition()

    const contentRect = contentElement.value.getBoundingClientRect()

    useContentDown = contentRect.bottom <= window.innerHeight
    useContentRight = contentRect.right <= window.innerWidth
    
    await updateDropdownPosition()
}

async function updateDropdownPosition() {
    if (!openModel.value || !element.value) return

    const elementRect = element.value.getBoundingClientRect()

    if (useContentDown) contentTop.value = elementRect.bottom
    else contentBottom.value = elementRect.top


    if (useContentRight) contentLeft.value = elementRect.right
    else contentRight.value = elementRect.left

    return new Promise((resolve) => {
        nextTick(() => resolve(0))
    })
}


onMounted(() => {
    window.addEventListener("resize", () => recomputeDropdownPosition())
    window.addEventListener("scroll", () => recomputeDropdownPosition())

    watch(() => openModel.value, () => recomputeDropdownPosition())
})
</script>

<template>
    <SystemFlex class="dropdown" :data-open="open" align="center">
        <div class="element" ref="element" @click="toggle">
            <slot></slot>
        </div>

        <SystemOverlay :transparent="true" :zIndex="140" v-model:open="openModel" @click="close">
            <div 
                class="dropdown-content" 
                ref="contentElement"
                :style="{
                    top: `${contentTop + contentMargin}px`,
                    left: `${contentLeft}px`
                }"
            >
                <slot name="content"></slot>
            </div>
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
    display: flex;
    flex-direction: column;
    position: absolute;
}
</style>