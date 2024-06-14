<script setup lang="ts">
import type { Chat } from "@prisma/client"

defineProps<{
    chat: Chat
}>()

const icon = ref(null)
const dropdownOpen = ref(false)

const openDeleteModelPopup = ref(false)
const openShareChatPopup = ref(false)
</script>

<template>
    <PopupConfirm heading="Leave chat" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to leave this chat?</SystemP>
        <SystemP>You <SystemPBold>cannot join</SystemPBold> this chat again unless invited back.</SystemP>
    </PopupConfirm>

    <PopupShareChat v-model:open="openShareChatPopup"></PopupShareChat>
    

    <SystemFlex class="chat-list-item border" gap="2rem" align="center" justify="space-between">
        <SystemFlex gap="0.5rem" align="center">
            <SystemSlickAvatar :size="60" v-model="icon" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>

            <SystemFlex direction="column">
                <SystemFlex class="top-text" align="center">
                    <SystemP class="name text-nowrap">{{ chat.name }}</SystemP>

                    <SystemPSmall class="weak-text">(</SystemPSmall>
                    <SystemPSmall class="weak-text text-overflow text-nowrap">Håkon kleven</SystemPSmall>
                    <SystemPSmall class="weak-text">)</SystemPSmall>
                </SystemFlex>
                <SystemPSmall class="weak-text text-overflow text-nowrap">{{ dateFromNow(chat.updatedAt) }}</SystemPSmall>
            </SystemFlex>
        </SystemFlex>

        <SystemDropdown v-model:open="dropdownOpen">
            <Icon :data-open="dropdownOpen" class="dots" name="mdi:dots-vertical"></Icon>

            <template #content>
                <SystemFlex direction="column">
                    <SystemDropdownOption 
                        icon="material-symbols:edit-rounded" 
                        @click="dropdownOpen = false"
                    >
                        Edit
                    </SystemDropdownOption>

                    <SystemDropdownOption 
                        icon="mdi:share" 
                        @click="() => {
                            dropdownOpen = false
                            openShareChatPopup = true
                        }"
                    >
                        Share
                    </SystemDropdownOption>

                    <SystemDropdownOption 
                        icon="material-symbols:copy-all-rounded"
                        @click="dropdownOpen = false"
                    >
                        Duplicate
                    </SystemDropdownOption>

                    <SystemDropdownOption
                        :delete="true" 
                        icon="material-symbols:delete-outline-rounded" 
                        @click="() => {
                            dropdownOpen = false
                            openDeleteModelPopup = true
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
.chat-list-item {
    padding: 0 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    width: 20rem;

    height: 4rem;

    &:hover {
        background-color: var(--neutral)
    }

    border-radius: var(--border-radius);

    .dots {
        font-size: 1.5rem;

        cursor: pointer;

        transition: 0.2s;

        color: var(--weak-primary);

        &:hover {
            color: var(--secondary);
        }

        &[data-open="true"] {
            color: var(--secondary);
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