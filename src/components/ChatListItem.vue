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
        background-color: var(--neutral)
    }

    border-radius: var(--border-radius);

    .dots {
        font-size: 1.5rem;
    }

    .top-text {
        max-width: 15rem;

        .name {
            margin-right: 0.25rem;
        }
    }
}
</style>