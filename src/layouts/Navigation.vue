<script setup lang="ts">
const locale = useLocale()
</script>

<template>
    <SystemTopNav>
        <template #left>
            <NuxtLink href="/sign">
                <SystemFlex gap="0.5rem" align="center">
                    <SystemP>
                        {{ locale.name }}
                    </SystemP>
                    -
                    <SystemPSmall>
                        SGS Marketing
                    </SystemPSmall>
                </SystemFlex>
            </NuxtLink>
        </template>

        <template #right>
            <SystemFlex align="center" gap="1rem">
                <SystemUserIcon></SystemUserIcon>
            </SystemFlex>
        </template>
    </SystemTopNav>

    <SystemFlex class="wrapper">
        <slot></slot>
    </SystemFlex>
</template>

<style scoped lang="scss">
.wrapper {
    padding: 7rem var(--page-padding);
}
</style>