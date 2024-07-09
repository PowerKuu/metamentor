<script setup lang="ts">

</script>

<template>
    <SystemFlex class="border wrapper" grow="1" direction="column" gap="1rem">
        <slot></slot>
    </SystemFlex>
</template>

<style scoped lang="scss">
.wrapper {
    padding: 2rem 1.5rem;
}
</style>