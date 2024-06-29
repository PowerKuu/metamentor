<script setup lang="ts">
const props = defineProps<{
    url?: string
    icon?: string
    background?: string
}>()

const backgroundCSS = computed(() => props.background ?? `var(--neutral)`)
</script>

<template>
    <SystemFlex align="center" justify="center" gap="0.5rem" class="system-icon border">
        <img class="img" v-if="url" :src="url" alt="">
        <Icon color="var(--primary)" class="icon" v-else :name="icon ?? `material-symbols:person`"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.system-icon {
    width: 2.75rem;
    height: 2.75rem;

    border-color: v-bind(backgroundCSS);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .icon {
        width: 100%;
        height: 100%;

        background-color: v-bind(backgroundCSS);
        padding: 0.25rem;
    }
}
</style>