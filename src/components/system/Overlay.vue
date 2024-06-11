<script setup lang="ts">
const props = defineProps<{
    open: boolean
    zIndex?: number
    transparent?: boolean
}>()

const zIndexCSS = computed(() => props.zIndex ? props.zIndex : 50)

const emit = defineEmits<{
    (e: "click"): void
}>()

function click(event: Event) {
    if (event.target !== event.currentTarget) return

    emit("click")
}
</script>

<template>
    <Teleport to="body">
        <SystemFade class="fade" :open="open">
            <SystemFlex :data-transparent="transparent" @click="click" class="overlay" align="center" justify="center">
                <slot></slot>
            </SystemFlex>
        </SystemFade>
    </Teleport>
</template>

<style scoped lang="scss">
.overlay {
    position: fixed;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: rgb(from var(--background) r g b / 90%);

    transform: translateZ(0);
    backface-visibility: hidden;

    cursor: initial;

    &[data-transparent="true"] {
        background: none !important;
    }
}

.fade {
    position: relative;
    z-index: v-bind(zIndexCSS);
}
</style>