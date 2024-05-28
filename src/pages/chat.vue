<script setup lang="ts">
definePageMeta({
    layout: "navigation"
})
</script>

<template>
    <SytemFlex class="sidebar border">
        <SystemP>
            Chat
        </SystemP>
    </SytemFlex>
</template>

<style scoped lang="scss">
.sidebar {
    width: 20rem;
    height: 100%;
    background: var(--background);
    border-right: 1px solid var(--border);
}
</style>