<script setup lang="ts">
const props = defineProps<{
    url?: string
    icon?: string
    background?: string
}>()

const backgroundCSS = computed(() => props.background ?? `var(--neutral)`)
</script>

<template>
    <SystemFlex :style="{
        borderColor: backgroundCSS
    }" align="center" justify="center" gap="0.5rem" class="system-icon border">
        <img v-if="url" class="img" :src="url" alt="">
        <Icon v-else :style="{
            backgroundColor: backgroundCSS
        }" color="var(--primary)" class="icon" :name="icon ?? `material-symbols:person`"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.system-icon {
    width: 2.75rem;
    height: 2.75rem;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .icon {
        width: 100%;
        height: 100%;

        padding: 0.25rem;
    }
}
</style>