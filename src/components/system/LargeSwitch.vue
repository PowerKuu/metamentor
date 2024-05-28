<script setup lang="ts">
const props = defineProps<{
    value: boolean

    text1: string
    text2: string

    icon1: string
    icon2: string
}>()

const valueModel = useModel(props, "value")
</script>

<template>
    <SystemFlex>
        <SystemFlex @click="valueModel = true" :data-active="valueModel" class=" left" gap="0.5rem" align="center">
            <SystemP>
                {{ text1 }}
            </SystemP>

            <Icon class="icon" :name="icon1"></Icon>
        </SystemFlex>

        <SystemFlex @click="valueModel = false" :data-active="!valueModel" class=" right" gap="0.5rem" align="center">
            <SystemP>
                {{ text2 }}
            </SystemP>

            <Icon class="icon" :name="icon2"></Icon>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.large-switch {
    padding: 1rem 2rem;

    transition: 0.2s;

    border: var(--border-width) solid var(--neutral);
    border-radius: var(--border-radius);

    .icon {
        font-size: 1.5rem;
        transition: 0.2s;

        color: var(--primary);
    }

    &.left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }   

    &.right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    &[data-active="true"] {
        border-color: var(--primary);
        background: var(--primary);

        p {
            color: var(--background);
        }

        .icon {
            color: var(--background);
        }
    }

    &:hover {
        cursor: pointer;
    }

    .icon {
        font-size: 5rem;
    }
}
</style>