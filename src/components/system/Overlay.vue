<script setup lang="ts">
const props = defineProps<{
    open: boolean
    zIndex?: number
    background?: string
}>()

const zIndexCSS = computed(() => props.zIndex ? props.zIndex : 50)

const emit = defineEmits<{
    (e: "click"): void
}>()

function click(event: Event) {
    if (event.target !== event.currentTarget) return

    emit(`click`)
}


</script>

<template>
    <SystemFade :open="open">
        <SystemFlex :data-background="background" @click="click" class="overlay" align="center" justify="center">
            <slot></slot>
        </SystemFlex>
    </SystemFade>
</template>

<style scoped lang="scss">
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: rgb(from var(--background) r g b / 90%);

    transform: translateZ(0);
    backface-visibility: hidden;
    z-index: v-bind(zIndexCSS);

    cursor: initial;

    &[data-background="false"] {
        background: none !important;
    }
}
</style>