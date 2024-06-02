<script setup lang="ts">
const props = withDefaults(defineProps<{
    icon: string

    color?: string
    background?: string
    border?: string

    defaultHover?: boolean
}>(), {
    color: "var(--primary)",
    background: "var(--background)",
    border: "var(--neutral)",

    defaultHover: true
})


// Stop collision with the "flex" component
const style = computed(() => {
    return {
        "--icon-color": props.color,
        "--button-border": props.border,
        "--button-background": props.background
    }
})
</script>

<template>
    <SystemFlex class="icon-button" :style="style" :data-default="props.defaultHover">
        <Icon class="icon" color="var(--icon-color)" :name="icon"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.icon-button {    

    max-height: var(--normal-height);
    max-width: var(--normal-height);

    min-height: var(--normal-height);
    min-width: var(--normal-height);

    border: var(--border-width) solid var(--button-border);
    border-radius: var(--border-radius);
    background-color: var(--button-background);

    cursor: pointer;

    transition: 0.2s;

    &[data-default="true"]:hover {
        background-color: var(--icon-color);
        border-color: var(--icon-color);

        .icon {
            color: var(--background) !important;
        }
    }

    &[data-default="false"]:hover {
        opacity: 0.8;
    }

    .icon {
        width: 100%;
        height: 100%;
    }

    padding: calc(var(--normal-height) * 0.2);

    user-select: none;
}
</style>