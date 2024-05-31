<script setup lang="ts">
import type { Chat } from "@prisma/client"

defineProps<{
    chat: Chat
}>()

const icon = ref(null)
</script>

<template>
    <SystemFlex class="chat-list-item border" gap="2rem" align="center" justify="space-between">
        <SystemFlex gap="0.5rem" align="center">
            <SystemSlickAvatar :size="60" v-model="icon"></SystemSlickAvatar>

            <SystemFlex direction="column">
                <SystemP>{{ chat.name }}</SystemP>
                <SystemPSmall class="date text-overflow">{{ dateFromNow(chat.updatedAt) }}</SystemPSmall>
            </SystemFlex>
        </SystemFlex>

        <Icon class="dots" color="var(--secondary)" name="mdi:dots-vertical"></Icon>
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
        background-color: var(--weak-primary)
    }

    border-radius: var(--border-radius);

    .date {
        color: var(--weak-text);
    }

    .dots {
        font-size: 1.5rem;
    }
}
</style>