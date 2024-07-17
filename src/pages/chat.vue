<script setup lang="ts">
import type { Chat, Model } from "@prisma/client"

definePageMeta({
    layout: "navigation"
})

const user = useAuth()

watch(user, () => {
    if (!user.value) navigateTo("/auth/login")
})

const chats = ref<ServerFunctionData<"getChats">>([])
const userModels = ref<ServerFunctionData<"getModels">>([])


async function getChats() {
    if (!user.value) return

    const newChats = await serverFunction("getChats", user.value.token)

    if (isServerError(newChats)) {
        console.error(newChats)
        return
    }

    chats.value = newChats
}

async function getModels() {
    if (!user.value) return

    const newModels = await serverFunction("getModels", user.value.token)

    if (isServerError(newModels)) {
        console.error(newModels)
        return
    }

    userModels.value = newModels
}

const editingChat = ref<Chat | null>(null)
const editingChatSelectedModels = ref<string[]>([])

const newChat = ref(false)


function saveEditChat() {

}

function openEditChat(chat: Chat) {
    newChat.value = false
    openEditChatPopup.value = true
}

function openNewChat() {
    newChat.value = true
    openEditChatPopup.value = true
}

function openShareChat(chat: Chat) {
    openShareChatPopup.value = true
}

function openLeaveChat(chat: Chat) {
    openLeaveModelPopup.value = true
}

const openLeaveModelPopup = ref(false)
const openShareChatPopup = ref(false)
const openEditChatPopup = ref(false)



getChats()
getModels()
</script>

<template>
    <PopupEditChat v-model:selected-models="editingChatSelectedModels" @update:models="getModels" :models="userModels" :newChat="newChat" v-model:open="openEditChatPopup"></PopupEditChat>


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
                        @click="openNewChat" 
                        icon="material-symbols:chat-add-on"
                    >
                    </SystemIconButton>
                </SystemFlex>

                <SystemFlex class="chats" direction="column">
                    <ChatListItem
                        v-for="chat in chats" 
                        :key="chat.id" 
                        :chat="chat.chat"

                        @edit="() => openEditChat(chat.chat)"
                        @share="() => openShareChat(chat.chat)"
                        @leave="() => openLeaveChat(chat.chat)"
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

    width: 20rem;
}

.wrapper {
    padding-top: 5.5rem;
    padding-bottom: 0.5rem;
    min-height: 100vh;
    max-height: 100vh;
}
</style>