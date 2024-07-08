<script setup lang="ts">

const props = withDefaults(defineProps<{
    open: boolean
    preferDown?: boolean
    preferRight?: boolean
}>(), {
    preferDown: true,
    preferRight: true
})

const openModel = useModel(props, "open")

const element = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)

const contentTop = ref()
const contentLeft = ref()

let canUseContentDown = true
let canUseContentUp = true

let canUseContentRight = true
let canUseContentLeft = true


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

    const downOffset = canUseContentDown ? 0 : 
        (contentRect.height + elementRect.height) + contentMargin * 2

  
    const rightOffset = canUseContentRight ? 0 : 
        contentRect.width - elementRect.width

    canUseContentDown = contentRect.bottom + downOffset <= window.innerHeight
    canUseContentUp = contentRect.top - downOffset >= 0

    canUseContentRight = contentRect.right + rightOffset <= window.innerWidth
    canUseContentLeft = contentRect.left - rightOffset >= 0
    
    await updateContentPosition(elementRect, contentRect)
}

async function updateContentPosition(elementRect: DOMRect, contentRect: DOMRect) {
    const downValue = elementRect.bottom + contentMargin
    const upValue = elementRect.top - contentRect.height - contentMargin

    const rightValue = contentLeft.value = elementRect.left
    const leftValue = elementRect.right - contentRect.width

    const downPriorityQueue = [
        props.preferDown,
        canUseContentDown,
        canUseContentUp,
        true
    ]

    const rightPriorityQueue = [
        props.preferRight,
        canUseContentRight,
        canUseContentLeft,
        true
    ]

    for (const wantDown of downPriorityQueue) {
        if (wantDown && canUseContentDown) {
            contentTop.value = downValue
            break
        }

        if (!wantDown && canUseContentUp) {
            contentTop.value = upValue
            break
        }
    }
    

    for (const wantRight of rightPriorityQueue) {
        if (wantRight && canUseContentRight) {
            contentLeft.value = rightValue
            break
        }

        if (!wantRight && canUseContentLeft) {
            contentLeft.value = leftValue
            break
        }
    }


    await asyncNextTick()
}

onMounted(() => {
    window.addEventListener("resize", () => recomputeDropdownPosition())
    window.addEventListener("scroll", () => recomputeDropdownPosition())
    
    watch(contentElement, () => {
        canUseContentDown = true
        canUseContentRight = true
        recomputeDropdownPosition().then(recomputeDropdownPosition)
    })
})
</script>

<template>
    <SystemFlex class="dropdown" :data-open="open" align="center">
        <div class="element" ref="element" @click="toggle">
            <slot></slot>
        </div>

        <SystemOverlay :passthrough="true" :transparent="true" :zIndex="140" v-model:open="openModel" @click="close">
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