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

let minXDelta = 0
let minYDelta = 0

let maxXDelta = 0
let maxYDelta = 0


const snapDeleteThreshold = 35

function resetDelta() {
    if (props.width) {
        minXDelta = Math.abs(initialWidth - props.width.min) * -1
        maxXDelta = Math.abs(initialWidth - props.width.max)
    }
    if (props.height) {
        minYDelta = Math.abs(initialHeight - props.height.min) * -1
        maxYDelta = Math.abs(initialHeight - props.height.max)
    }
}

function resetDrag(mx: number, my: number, direction: "x" | "y") {
    if (direction == "x") {
        initialX = mx
        initialWidth = currentWidth.value
    } else {
        initialY = my
        initialHeight = currentHeight.value
    }

    resetDelta()

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

    const yDelta = e.clientY - initialY
    const xDelta = e.clientX - initialX
    
    if (lastDirection === "x" && props.width) {
        if (isSnapDeleted.value) {
            currentWidth.value = 0

            if (xDelta > props.width.min) {
                isSnapDeleted.value = false

                currentWidth.value = props.width.min
                initialHeight = props.width.min
                initialX = e.clientX

                resetDelta()
            }
            
            return
        }

        const newWidth = initialWidth + xDelta
        currentWidth.value = Math.max(props.width.min, Math.min(newWidth, props.width.max))
    
        if (xDelta < minXDelta - snapDeleteThreshold) {
            isSnapDeleted.value = true

            currentWidth.value = 0
            initialWidth = 0
            initialX = e.clientX
        }
    }

    if (lastDirection === "y" && props.height) {
        if (isSnapDeleted.value) {
            currentHeight.value = 0

            if (yDelta > snapDeleteThreshold) {
                isSnapDeleted.value = false
                
                currentHeight.value = props.height.min
                initialHeight = props.height.min
                initialY = e.clientY

                resetDelta()
            }
            
            return
        }

        const newHeight = initialHeight + yDelta
        currentHeight.value = Math.max(props.height.min, Math.min(newHeight, props.height.max))
        
        if (yDelta < minYDelta - snapDeleteThreshold) {
            isSnapDeleted.value = true

            currentHeight.value = 0
            initialHeight = 0
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
const handeSizeCSSName = "--handle-size"

const isSnapDeleted = ref(false)

</script>

<template>
    <SystemFlex class="resizable" :style="resizableStyle">
        <SystemFlex direction="column" grow="1">
            <SystemFlex v-show="!isSnapDeleted" class="slot" grow="1">
                <slot></slot>
            </SystemFlex>
            <div v-if="!!height && !disabled" :style="{
                [handeSizeCSSName]: handleSizeCSS
            }" class="height-resizer" @mousedown="(e) => mouseDown(e, 'y')"></div>
        </SystemFlex>
        
        <div :style="{
            [handeSizeCSSName]: handleSizeCSS
        }" v-if="!!width && !disabled" class="width-resizer" @mousedown="(e) => mouseDown(e, 'x')"></div>
    </SystemFlex>
</template>

<style scoped lang="scss">
.height-resizer {
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