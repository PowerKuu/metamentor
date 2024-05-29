<script setup lang="ts">
import type { Chat } from '@prisma/client'

definePageMeta({
    layout: "navigation"
})

const chats = ref<Chat[]>([])

chats.value.push({
    id: "d",
    name: "Chat 1",
    updatedAt: new Date(),
    createdAt: new Date(),
    
    userId: "1",
    modelId: "d"
})
</script>

<template>
    <SystemFlex class="wrapper">
        <SytemFlex class="sidebar border">
            <ChatListItem v-for="chat in chats" :key="chat.id" :chat="chat" />
        </SytemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    padding: 0.5rem;
}

.wrapper {
    height: 80vh;
    min-height: 30rem;
    flex: 1;
}
</style>