<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components"


const props = defineProps<{
    open: boolean
    zIndex?: number
    transparent?: boolean

    passthrough?: boolean
}>()

const zIndexCSS = computed(() => props.zIndex ? props.zIndex : 50)

const emit = defineEmits<{
    (e: "click"): void
}>()

const overlay = ref<HTMLElement | null>(null)

function trigger(event: MouseEvent) {
    if (props.passthrough) return emit("click")

    if (!event.target || !overlay.value) return

    if (event.target == overlay.value) {
        emit("click")
    }
}
</script>

<template>
    <Teleport to="body">
        <SystemFade :data-passthrough="passthrough" class="fade" :open="open">
            <div ref="overlay" :data-transparent="transparent" class="overlay">
                <OnClickOutside @trigger="trigger">
                    <div class="content">
                        <slot></slot>
                    </div>
                </OnClickOutside>
            </div>
        </SystemFade>
    </Teleport>
</template>

<style scoped lang="scss">

.fade {
    position: relative;
    z-index: v-bind(zIndexCSS);

    &[data-passthrough="true"] {
        pointer-events: none;

        .content {
            pointer-events: all;
        }
    }

    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;


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
}
</style>