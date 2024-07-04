<script setup lang="ts">

const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const element = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)

const contentTop = ref()
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
    if (!openModel.value || !contentElement.value || !element.value) return

    const contentRect = contentElement.value.getBoundingClientRect()
    const elementRect = element.value.getBoundingClientRect()

    const downOffset = useContentDown ? 0 : 
        (contentRect.height + elementRect.height) + contentMargin * 2

  
    const rightOffset = useContentRight ? 0 : 
        contentRect.width - elementRect.width

    useContentDown = contentRect.bottom + downOffset <= window.innerHeight

    useContentRight = contentRect.right + rightOffset <= window.innerWidth
    
    await updateContentPosition(elementRect, contentRect)
}

async function updateContentPosition(elementRect: DOMRect, contentRect: DOMRect) {
    if (useContentDown) contentTop.value = elementRect.bottom + contentMargin
    else contentTop.value = elementRect.top - contentRect.height - contentMargin


    if (useContentRight) contentLeft.value = elementRect.left
    else contentLeft.value = elementRect.right - contentRect.width

    await asyncNextTick()
}


onMounted(() => {
    window.addEventListener("resize", () => recomputeDropdownPosition())
    window.addEventListener("scroll", () => recomputeDropdownPosition())

    watch(() => openModel.value, () => {
        useContentDown = true
        useContentRight = true
        recomputeDropdownPosition().then(recomputeDropdownPosition)
    })
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
                    top: `${contentTop}px`,
                    left: `${contentLeft}px`,
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