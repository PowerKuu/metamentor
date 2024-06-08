<script setup lang="ts">
const openDropdown = ref(false)
</script>

<template>
    <SystemFlex @click="openDropdown = !openDropdown">
        <slot></slot>
    </SystemFlex>
    
    <SystemOverlay v-if="openDropdown" class="overlay" @click="openDropdown = false"></SystemOverlay>

    <SystemFlex v-if="openDropdown" class="dropdown">
        <SystemFlex class="dropdown-content">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.overlay {
    z-index: 120;
}

.dropdown {
    position: absolute;
    z-index: 121;
}
</style>