<script setup lang="ts">
defineProps<{
    icon?: string
    delete?: boolean
}>()
</script>

<template>
    <SystemFlex :data-delete="delete" class="dropdown-option" align="center" justify="space-between" gap="1rem">
        <SystemP>
            <slot></slot>
        </SystemP>
        <Icon class="dropdown-option-icon" :name="icon ?? ``"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.dropdown-option {
    background: var(--background);
    
    cursor: pointer;
    transition: 0.2s;

    height: var(--normal-height);
    padding: 0 1rem;

    border: var(--border-width) solid var(--neutral);

    .dropdown-option-icon {
        color: var(--text);
        font-size: 1.5rem;
    }


    &[data-delete="true"] {
        .dropdown-option-icon {
            color: var(--error) !important;
        }

        p {
            color: var(--error);
        }
    }

    &:hover {
        background: var(--neutral);
        border-bottom-color: var(--primary);

        &[data-delete="true"] {
            border-bottom-color: var(--error);
        }
    }

    &:not(:first-child) {
        border-top: none;
    }

    &:first-child {
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
    }
    
    &:last-child {
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }
}
</style>