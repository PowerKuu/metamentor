<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const open = useModel(props, "open")
</script>

<template>
    <Icon @click="open = !open" name="solar:hamburger-menu-linear" class="hamburger"></Icon>

    <SystemOverlay :zIndex="120" @click="open = false" :open="open">
        <SystemFlex class="hamburger-menu" gap="1.5rem" direction="column">
            <Icon @click="open = !open" color="var(--text)" name="akar-icons:cross" class="cross"></Icon>
            
            <SystemFlex gap="1rem" direction="column" align="start">
                <slot></slot>
            </SystemFlex>
        </SystemFlex>
    </SystemOverlay>
</template>

<style scoped lang="scss">
.hamburger {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
}

.hamburger-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: max(40vw, 500px);
    height: 100%;

    padding: 5rem var(--page-padding);

    background: var(--background);
    backdrop-filter: blur(5px);
}

.cross {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
}
</style>