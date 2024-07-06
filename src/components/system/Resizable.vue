<script setup lang="ts">
const props = defineProps<{
    height?: {
        min: number,
        max: number,
        initial: number,
        snapDelete?: boolean
    }
    width?: {
        min: number,
        max: number,
        initial: number,
        snapDelete?: boolean
    }

    disabled?: boolean
    handleSize?: string
}>()

const currentHeight = ref<number>(props.height?.initial ?? 0)
const currentWidth = ref<number>(props.width?.initial ?? 0)

var isResizing = false

let initialX = 0
let initialWidth = 0

let initialY = 0
let initialHeight = 0

let lastDirection: "x" | "y" = "x"

let maxXDelta = 0
let maxYDelta = 0

let snapDeleteThreshold = 50

function resetDrag(mx: number, my: number, direction: "x" | "y") {
    if (direction == "x") {
        initialX = mx
        initialWidth = currentWidth.value
    } else {
        initialY = my
        initialHeight = currentHeight.value
    }

    if (props.width) maxXDelta = Math.abs(initialWidth - props.width.min) * -1
    if (props.height) maxYDelta = Math.abs(initialHeight - props.height.min) * -1


    isResizing = true
    lastDirection = direction
}

function mouseDown(e: MouseEvent, direction: "x" | "y") {
    resetDrag(e.clientX, e.clientY, direction)
    document.documentElement.style.cursor = direction == "y" ? "row-resize" : "col-resize"

    document.querySelectorAll("*").forEach((elem) => {
        (elem as HTMLElement).style.userSelect = "none"
    })
}


function mouseUp(e: MouseEvent) {
    isResizing = false
    document.documentElement.style.cursor = "auto"

    document.querySelectorAll("*").forEach((elem) => {
        (elem as HTMLElement).style.userSelect = ""
    })
}

function mouseMove(e: MouseEvent) {
    if (!isResizing) return
    
    if (lastDirection === "x" && props.width) {
        const xDelta = e.clientX - initialX

        if (isSnapDeleted.value) {
            currentWidth.value = 0

            if (xDelta > snapDeleteThreshold) {
                isSnapDeleted.value = false
                currentWidth.value = props.width.min
                initialHeight = props.width.min

                initialX = e.clientX
            }
            
            return
        }

        const newWidth = initialWidth + xDelta
        currentWidth.value = Math.max(props.width.min, Math.min(newWidth, props.width.max))
    
        if (xDelta < maxXDelta - snapDeleteThreshold) {
            isSnapDeleted.value = true
            currentWidth.value = 0
            initialX = e.clientX
        }
    }

    if (lastDirection === "y" && props.height) {
        const yDelta = e.clientY - initialY

        if (isSnapDeleted.value) {
            currentHeight.value = 0

            if (yDelta > snapDeleteThreshold) {
                isSnapDeleted.value = false
                currentHeight.value = props.height.min
                initialHeight = props.height.min

                initialY = e.clientY
            }
            
            return
        }

        const newHeight = initialHeight + yDelta
        currentHeight.value = Math.max(props.height.min, Math.min(newHeight, props.height.max))
        
        if (yDelta < maxYDelta - snapDeleteThreshold) {
            isSnapDeleted.value = true
            currentHeight.value = 0
            initialY = e.clientY
        }
    }
}

onMounted(() => {
    window.addEventListener("mouseup", mouseUp)
    window.addEventListener("mousemove", mouseMove)
})

const resizableStyle = computed(() => {
    if (props.disabled) {
        return {
            height: "auto",
            width: "100%"
        }
    }

    
    return {
        height: props.height ? currentHeight.value + "px" : "auto",
        width: props.width ? currentWidth.value + "px" : "auto"
    }
})

const handleSizeCSS = computed(() => props.handleSize ? props.handleSize : "1rem")
const isSnapDeleted = ref(false)
</script>

<template>
    <SystemFlex class="resizable" :style="resizableStyle">
        <SystemFlex direction="column" grow="1">
            <SystemFlex v-show="!isSnapDeleted" class="slot" grow="1">
                <slot></slot>
            </SystemFlex>
            <div v-if="!!height && !disabled" class="height-resizer" @mousedown="(e) => mouseDown(e, 'y')"></div>
        </SystemFlex>
        <div v-if="!!width && !disabled" class="width-resizer" @mousedown="(e) => mouseDown(e, 'x')"></div>
    </SystemFlex>
</template>

<style scoped lang="scss">
.height-resizer {
    --handle-size: v-bind(handleSizeCSS);

    position: relative;
    min-width: 100%;
    cursor: row-resize;

    &::after {
        content: "";
        position: absolute;
        width: 100%;

        z-index: 10;

        bottom: calc(-1 * var(--handle-size) / 2);

        min-height: var(--handle-size);

        outline: 1px solid var(--contrast-color);
    }
}


.width-resizer {
    --handle-size: v-bind(handleSizeCSS);

    position: relative;
    min-height: 100%;
    cursor: col-resize;

    &::after {
        content: "";
        position: absolute;
        height: 100%;

        z-index: 10;

        right: calc(-1 * var(--handle-size) / 2);

        min-width: var(--handle-size);

        opacity: 0.1;
    }
}
</style>

<style>
.slot > * {
    width: 100% !important;
    height: 100% !important;
}
</style>