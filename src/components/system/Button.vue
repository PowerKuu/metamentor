<script setup lang="ts">
const props = withDefaults(defineProps<{
    background?: string
    color?: string
    border?: string

    borderHover?: string

    icon?: string
    disabled?: boolean
}>(), {
    background: "var(--primary)",
    color: "var(--background)",
    icon: "ic:baseline-keyboard-arrow-right",
})

const borderCSS = computed(() => {
    return `var(--border-width) solid ${props.border || props.background}`
})

const slots = useSlots()

const customHover = computed(() => {
    return !!props.borderHover
})
</script>

<template>
    <SystemFlex
        :style="{
            background: props.background,
            border: borderCSS
        }"

        align="center"  

        class="button"

        gap="0.5rem"

        :data-disabled="props.disabled"
        :data-custom-hover="customHover"
    >
        <SystemP class="text" :style="{
            color: props.color
        }">
            <slot></slot>
        </SystemP>

        <slot name="icon"></slot>
        <Icon v-if="!slots.icon && icon" :name="icon" size="1.4rem" :color="color"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.button {
    border-radius: var(--border-radius);
    padding: 0 1em;
    height: var(--normal-height);

    user-select: none;

    cursor: pointer;

    transition: all 0.2s ease-in-out;

    .text {
        font-weight: 500;
        white-space: nowrap;
    }

    &[data-disabled="true"] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:not([data-disabled="true"]) {
        &[data-custom-hover="false"]:hover {
            opacity: 0.8;
        }

        &[data-custom-hover="true"]:hover {
            border-color: v-bind(borderHover) !important;
        }
    }
}
</style>