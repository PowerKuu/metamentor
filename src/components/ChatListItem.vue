<script setup lang="ts">
import type { Chat } from "@prisma/client"

defineProps<{
    chat: Chat
    active: boolean

    avatar?: string
}>()

defineEmits<{
    (e: "edit"): void
    (e: "share"): void
    (e: "duplicate"): void
    (e: "leave"): void
}>()

const dropdownOpen = ref(false)

</script>

<template>
    <SystemFlex @click="navigateTo(`/chat/${chat.id}`)" :data-active="active" class="chat-list-item" gap="0.5rem" align="center" justify="space-between">
        <SystemFlex gap="0.5rem" align="center">
            <SystemSlickAvatar :size="62" :unknownAvatar="!avatar" :avatarString="avatar" color="var(--text)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>

            <SystemFlex direction="column">
                <SystemFlex class="top-text" align="center">
                    <SystemP class="name text-nowrap">{{ chat.name }}</SystemP>

                    <SystemPSmall class="text-weak">(</SystemPSmall>
                    <SystemPSmall class="text-weak text-overflow text-nowrap">Håkon kleven</SystemPSmall>
                    <SystemPSmall class="text-weak">)</SystemPSmall>
                </SystemFlex>
                <SystemPSmall class="text-weak text-overflow text-nowrap">{{ dateFromNow(chat.updatedAt) }}</SystemPSmall>
            </SystemFlex>
        </SystemFlex>

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
                        icon="mdi:share" 
                        @click="() => {
                            dropdownOpen = false
                            $emit(`share`)
                        }"
                    >
                        Share
                    </SystemDropdownOption>

                    <SystemDropdownOption 
                        icon="material-symbols:copy-all-rounded"
                        @click="() => {
                            dropdownOpen = false
                            $emit(`duplicate`)
                        }"
                    >
                        Duplicate
                    </SystemDropdownOption>

                    <SystemDropdownOption
                        :delete="true" 
                        icon="material-symbols:delete-outline-rounded" 
                        @click="() => {
                            dropdownOpen = false
                            $emit(`leave`)
                        }"
                    >
                        Leave
                    </SystemDropdownOption>
                </SystemFlex>
            </template>
        </SystemDropdown>
    </SystemFlex>
</template>

<style scoped lang="scss">
.chat-list-item[data-active="true"] {
    border-color: var(--primary);
    background-color: var(--neutral);
}

.chat-list-item {
    padding: 0 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;

    height: 4rem;

    border-bottom: var(--border-width) solid var(--neutral);

    &:hover {
        background-color: var(--neutral)
    }

    .dots {
        font-size: 1.5rem;

        cursor: pointer;

        transition: 0.2s;

        color: var(--primary);

        &:hover {
            color: var(--primary);
        }

        &[data-open="true"] {
            color: var(--primary);
        }
    }

    .top-text {
        max-width: 15rem;

        .name {
            margin-right: 0.25rem;
        }
    }
}
</style>