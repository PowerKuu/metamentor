<script setup lang="ts">
import type { Chat } from "@prisma/client"

defineProps<{
    chat: Chat
}>()
</script>

<template>
    <SystemFlex class="chat-list-item" gap="1rem" align="center" justify="space-between">
        <SystemFlex gap="0.5rem" align="center">
            <SystemP>{{ chat.name }}</SystemP>
            <SystemPSmall>{{ chat.updatedAt }}</SystemPSmall>
        </SystemFlex>

        <Icon name="mdi:dots-vertical"></Icon>
    </SystemFlex>
</template>

<style scoped lang="scss">
.chat-list-item {
    padding: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
}
</style>