<script setup lang="ts">
import type { Chat } from '@prisma/client'

definePageMeta({
    layout: "navigation"
})

const chats = ref<Chat[]>([])

// Mock data
chats.value.push({
    id: "d",
    name: "Chat 1",
    updatedAt: new Date(),
    createdAt: new Date(),
    
    userId: "1",
})

chats.value.push({
    id: "e",
    name: "Chat 2",
    updatedAt: new Date(),
    createdAt: new Date(),
    
    userId: "1"
})

const openNewChatPopup = ref(false)
</script>

<template>
    <PopupNewChat v-model:open=openNewChatPopup></PopupNewChat>

    <SystemFlex grow="1" gap="0.5rem" class="wrapper">
        <SystemFlex gap="1rem" direction="column" class="sidebar border">
            <SystemFlex gap="0.5rem" direction="column">
                <SystemInput value="" placeholder="Search">
                    <template #icon>
                        <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                    </template>
                </SystemInput>

                <SystemFlex gap="0.5rem" direction="column">
                    <ChatListItem v-for="chat in chats" :key="chat.id" :chat="chat" />
                </SystemFlex>
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
}

.wrapper {
    height: 85vh;
    min-height: 30rem;
}
</style>