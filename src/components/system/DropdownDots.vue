<script setup lang="ts">
defineProps<{
    open: boolean
}>()
</script>

<template>
    <Icon :data-open="open" class="dropdown-icon" name="mdi:dots-vertical"></Icon>
</template>

<style scoped lang="scss">
.dropdown-icon {
    font-size: 1.5rem;

    cursor: pointer;

    transition: 0.2s;

    color: var(--weak-text);

    &:hover, &[data-open="true"] {
        color: var(--text);
    }
}

</style>