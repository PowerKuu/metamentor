<script setup lang="ts">

</script>

<template>
    <SystemFlex class="box-button border" align="center" justify="center">
        <slot></slot>
    </SystemFlex>
</template>

<style scoped lang="scss">
.box-button {
    padding: 1rem;
    
    background-color: var(--background);

    cursor: pointer;

    transition: 0.2s;

    height: 20rem;
    width: 20rem;

    border-style: dashed;

    &:hover {
        background-color: var(--neutral);
        border-color: var(--primary);
    }
}
</style>