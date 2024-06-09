<script setup lang="ts">
const openDropdown = ref(false)

const element = ref<HTMLElement | null>(null)
</script>

<template>

    <SystemFlex @click="openDropdown = !openDropdown" ref="element">
        <slot></slot>
    </SystemFlex>

    <SystemOverlay :open="openDropdown" @click="openDropdown = false"></SystemOverlay>

    <SystemFade :open="openDropdown" class="dropdown">
        <SystemFlex direction="column" class="dropdown-content border">
            <slot name="dropdown"></slot>
        </SystemFlex>
    </SystemFade>

</template>

<style scoped lang="scss">
.dropdown {
    position: absolute;
    z-index: 200;

    .dropdown-content {
        background: var(--background);
        
        margin-top: 1.5rem;
    }
}
</style>