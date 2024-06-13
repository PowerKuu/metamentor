<script setup lang="ts">
interface SelectOption {
    label: string,
    value: string,
    icon?: string
}

const props = defineProps<{
    options: SelectOption[],
    selected: SelectOption
}>()

const selectedModel = useModel(props, "selected")

const dropdownOpen = ref(false)
</script>

<template>
    <SystemDropdown v-model:open="dropdownOpen">
        <SystemFlex class="test" :data-open="dropdownOpen" align="center">
            <SystemP>{{ selectedModel.label }}</SystemP>
            <Icon size="1.5rem" color="var(--secondary)" name="material-symbols:arrow-drop-down-rounded"></Icon>
        </SystemFlex>

        <template #content>
            <SystemDropdownOption v-for="option of options" :icon="option.icon" @click="() => {
                selectedModel = option
                dropdownOpen = false
            }">
                <SystemP>{{ option.label }}</SystemP>
            </SystemDropdownOption>
        </template>
    </SystemDropdown>
</template>

<style scoped lang="scss">
.test {
    border-radius: var(--border-radius);
    transition: 0.2s;

    padding: 0.5rem 1rem;

    &:hover, &[data-open="true"] {
        background-color: var(--neutral);
    }
}
</style>