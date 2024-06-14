<script setup lang="ts">
interface SelectOption {
    label: string,
    value: string,
    icon?: string,
    delete?: boolean
    overideClick?: (option: SelectOption) => void
}

const props = defineProps<{
    options: SelectOption[],
    selected: SelectOption,
    displayIcon?: boolean
}>()

const selectedModel = useModel(props, "selected")

const dropdownOpen = ref(false)
</script>

<template>
    <SystemDropdown v-model:open="dropdownOpen">
        <SystemFlex class="dropdown-content" :data-open="dropdownOpen" align="center" gap="0.5rem">
            <SystemP>{{ selectedModel.label }}</SystemP>
            <Icon 
                size="1.5rem" 
                color="var(--secondary)" 
                :name="displayIcon && selectedModel.icon ? selectedModel.icon : `material-symbols:arrow-drop-down-rounded`">
            </Icon>
        </SystemFlex>

        <template #content>
            <SystemDropdownOption v-for="option of options" :delete="option.delete" :icon="option.icon" @click="() => {
                dropdownOpen = false
                if (option.overideClick) return option.overideClick(option)
                selectedModel = option
            }">
                {{ option.label }}
            </SystemDropdownOption>
        </template>
    </SystemDropdown>
</template>

<style scoped lang="scss">
.dropdown-content {
    border-radius: var(--border-radius);
    transition: 0.2s;

    padding: 0.5rem 1rem;

    background-color: var(--neutral);
    border: var(--border-width) solid var(--neutral);

    &:hover, &[data-open="true"] {
        border: var(--border-width) solid var(--weak-primary);
    }
}
</style>