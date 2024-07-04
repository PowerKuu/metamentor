<script setup lang="ts">

</script>

<template>
    <SystemFlex align="center" justify="center" class="dragbar">
        <Icon name="material-symbols:drag-handle-rounded" color="var(--weak-text)" size="1.4rem"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.dragbar {
    height: 0.8rem;
    background-color: var(--neutral);
    user-select: none;

    width: 100%;
}
</style>