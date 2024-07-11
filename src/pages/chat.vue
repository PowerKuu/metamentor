<script setup lang="ts">
import type { Chat } from '@prisma/client'

definePageMeta({
    layout: "navigation"
})

const chats = ref<Chat[]>([])

// Mock data
for (let i = 0; i < 20; i++) {
    chats.value.push({
        id: i.toString(),
        name: `Chat ${i}`,
        updatedAt: new Date(),
        createdAt: new Date(),
        copyOfId: null
    })
}

function openEditChat(chat: Chat) {
    openEditChatPopup.value = true
}

function openShareChat(chat: Chat) {
    openShareChatPopup.value = true
}

function openLeaveChat(chat: Chat) {
    openLeaveModelPopup.value = true
}

const openNewChatPopup = ref(false)

const openLeaveModelPopup = ref(false)
const openShareChatPopup = ref(false)
const openEditChatPopup = ref(false)
</script>

<template>
    <PopupModelBrowser :newChat="true" v-model:open="openNewChatPopup"></PopupModelBrowser>
    <PopupModelBrowser :newChat="false" v-model:open="openEditChatPopup"></PopupModelBrowser>


    <PopupConfirm heading="Leave chat" subheading="Select one of the buttons below to confirm" v-model:open="openLeaveModelPopup">
        <SystemP>Are you sure you want to leave this chat?</SystemP>
        <SystemP>You <SystemPBold>cannot join</SystemPBold> this chat again unless invited back.</SystemP>
    </PopupConfirm>

    <PopupShareChat v-model:open="openShareChatPopup"></PopupShareChat>

    <SystemFlex grow="1" class="wrapper">
        <SystemFlex grow="1" class="border">
            <SystemFlex direction="column" class="sidebar">
                <SystemFlex class="buttons" gap="0.25rem">
                    <SystemInput class="search" value="" placeholder="Search">
                        <template #icon>
                            <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                        </template>
                    </SystemInput>

                    <SystemIconButton
                        background="var(--primary)"
                        border="var(--primary)"
                        color="var(--background)"
                        :default-hover="false"
                        @click="openNewChatPopup = true" 
                        icon="material-symbols:chat-add-on"
                    >
                    </SystemIconButton>
                </SystemFlex>

                <SystemFlex class="chats" direction="column">
                    <ChatListItem 
                        v-for="chat in chats" 
                        :key="chat.id" 
                        :chat="chat"

                        @edit="() => openEditChat(chat)"
                        @share="() => openShareChat(chat)"
                        @leave="() => openLeaveChat(chat)"
                    />
                </SystemFlex>

            </SystemFlex>

            <NuxtPage></NuxtPage>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    border-right: var(--border-width) solid var(--neutral);
    .chats {
        flex: 1;

        overflow-y: auto;
    }

    .buttons {
        padding: 0.5rem;
        border-bottom: var(--border-width) solid var(--neutral);
        .search {
            flex: 1;
        }
    }
}

.wrapper {
    padding-top: 5.5rem;
    padding-bottom: 0.5rem;
    min-height: 100vh;
    max-height: 100vh;
}
</style>