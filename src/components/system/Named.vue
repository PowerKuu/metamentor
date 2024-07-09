<script setup lang="ts">
defineProps<{
    name: string
    tooltip?: string
}>()
</script>

<template>
    <SystemFlex direction="column" gap="0.25rem">
        <SystemFlex gap="0.25rem" align="end">
            <SystemPSmall class="text-weak">
                {{ name }}
            </SystemPSmall>
            <SystemTooltip v-if="tooltip" :text="tooltip"></SystemTooltip>
        </SystemFlex>

        <slot></slot>
    </SystemFlex>
</template>

<style scoped lang="scss">

</style>