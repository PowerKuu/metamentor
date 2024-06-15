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
        
        userId: "1",
    })
}

const openNewChatPopup = ref(false)

const openDeleteModelPopup = ref(false)
const openShareChatPopup = ref(false)
</script>

<template>
    <PopupModelBrowser :newChat="true" v-model:open=openNewChatPopup></PopupModelBrowser>

    <PopupConfirm heading="Leave chat" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to leave this chat?</SystemP>
        <SystemP>You <SystemPBold>cannot join</SystemPBold> this chat again unless invited back.</SystemP>
    </PopupConfirm>

    <PopupShareChat v-model:open="openShareChatPopup"></PopupShareChat>

    <SystemFlex grow="1" gap="0.5rem" class="wrapper">
        <SystemFlex gap="0.5rem" direction="column" class="sidebar border">
            <SystemInput value="" placeholder="Search">
                <template #icon>
                    <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                </template>
            </SystemInput>

            <SystemFlex class="chats border" direction="column">
                <ChatListItem v-for="chat in chats" :key="chat.id" :chat="chat" />
            </SystemFlex>


            <SystemButton @click="openNewChatPopup = true" class="seperator"justify="space-between" icon="material-symbols:chat-add-on">
                New chat
            </SystemButton>
        </SystemFlex>

        <NuxtPage></NuxtPage>
    </SystemFlex>
</template>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    padding: 0.5rem;

    .seperator {
        margin-top: auto;
    }

    .chats {
        flex: 1;

        overflow-y: auto;
    }
}

.wrapper {
    height: 87vh;
    min-height: 30rem;
}
</style>