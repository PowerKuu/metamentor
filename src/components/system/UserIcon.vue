<script setup lang="ts">
defineProps<{
    url?: string
}>()
</script>

<template>
    <SystemFlex align="center" justify="center" gap="0.5rem" class="system-icon border">
        <img class="img" v-if="url" :src="url" alt="">
        <Icon color="var(--primary)" class="icon" v-else name="material-symbols:person"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.system-icon {
    width: 2.75rem;
    height: 2.75rem;

    &:hover {
        cursor: pointer;
    }


    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    
    }

    .icon {
        width: 100%;
        height: 100%;

        background-color: var(--neutral);
    }
}
</style>