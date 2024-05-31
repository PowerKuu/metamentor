<script setup lang="ts">
const props = defineProps<{
    height?: {
        min: number,
        max: number,
        initial: number,
    }
    width?: {
        min: number,
        max: number,
        initial: number,
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

function mouseDown(e: MouseEvent, direction: "x" | "y") {
    if (direction == "x") {
        initialX = e.clientX
        initialWidth = currentWidth.value
    } else {
        initialY = e.clientY
        initialHeight = currentHeight.value
    }

    isResizing = true
    lastDirection = direction
}


function mouseUp(e: MouseEvent) {
    isResizing = false
}

function mouseMove(e: MouseEvent) {
    if (!isResizing) return

    if (lastDirection === "x" && props.width) {
        const xDelta = e.clientX - initialX

        const newWidth = initialWidth + xDelta
        currentWidth.value = Math.max(props.width.min, Math.min(newWidth, props.width.max))
    }

    if (lastDirection === "y" && props.height) {
        const yDelta = e.clientY - initialY

        const newHeight = initialHeight + yDelta
        currentHeight.value = Math.max(props.height.min, Math.min(newHeight, props.height.max))
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
</script>

<template>
    <SystemFlex class="resizable" :style="resizableStyle">
        <SystemFlex direction="column" grow="1">
            <SystemFlex class="slot" grow="1">
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