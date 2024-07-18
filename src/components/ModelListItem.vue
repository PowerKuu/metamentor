<script setup lang="ts">
import type { Model } from '@prisma/client';

defineProps<{
    model: Model
    disabled: boolean
    selected: boolean
}>()

defineEmits<{
    (e: "edit"): void
    (e: "download"): void
    (e: "toogleSelect"): void
    (e: "delete"): void
}>()

const dropdownOpen = ref(false)
</script>

<template>
    <SystemFlex
        :data-disabeld="disabled && !selected"
        :data-selected="selected"
        class="model-card"
        @click="$emit(`toogleSelect`)"
    >
        <SystemSlickAvatar class="avatar" :size="100" :avatarString="model.avatar" color="var(--text)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
        
        <SystemFlex grow="1" align="center" justify="space-between">
            <SystemFlex direction="column" class="card-contents" gap="0.25rem">
                <SystemFlex align="center" justify="space-between">
                    <SystemH4>{{ model.name }}</SystemH4>
                </SystemFlex>

                <SystemPSmall class="text-weak hide-overflow">{{ model.description || "No description" }}</SystemPSmall>
            </SystemFlex>

            <SystemFlex class="card-options">
                <SystemDropdown v-model:open="dropdownOpen">
                    <SystemDropdownDots :open="dropdownOpen"></SystemDropdownDots>

                    <template #content>
                        <SystemFlex direction="column">
                            <SystemDropdownOption
                                icon="material-symbols:edit-rounded"
                                @click="() => {
                                    dropdownOpen = false
                                    $emit(`edit`)
                                }"
                            >
                                Edit
                            </SystemDropdownOption>

                            <SystemDropdownOption 
                                icon="material-symbols:download-rounded" 
                                @click="() => {
                                    dropdownOpen = false
                                    $emit(`download`)
                                }"
                            >
                                Download
                            </SystemDropdownOption>

                            <SystemDropdownOption 
                                :delete="true" 
                                icon="material-symbols:delete-outline-rounded" 
                                @click="() => {
                                    dropdownOpen = false
                                    $emit(`delete`)
                                }"
                            >
                                Delete
                            </SystemDropdownOption>
                        </SystemFlex>
                    </template>
                </SystemDropdown>
                
                <Icon v-if="selected" color="var(--primary)" class="icon-option" name="material-symbols:check-rounded"></Icon>
                <Icon v-else class="icon-option" name="material-symbols:add-rounded"></Icon>
            </SystemFlex>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.model-card {
    cursor: pointer;
    transition: 0.2s;
    
    border-bottom: var(--border-width) solid var(--neutral);

    .icon-option {
        font-size: 1.5rem;

        cursor: pointer;

        transition: 0.2s;

        color: var(--weak-text);

        &:hover {
            color: var(--primary);
        }
    }

    .card-contents {
        padding: 0.5rem;
        height: 6rem;

        max-width: 25rem;
    }

    .card-options {
        padding: 0.5rem;
    }

    &[data-selected="true"] {
        background: var(--neutral);
        border-color: var(--primary)
    }


    &:not([data-selected="true"]) {
        &[data-disabeld="true"] {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    user-select: none;
}
</style>