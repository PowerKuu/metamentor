<script setup lang="ts">
import type { Chat, Model, UserOnChat } from "@prisma/client"

definePageMeta({
    layout: "navigation"
})

const user = useAuth()
const route = useRoute()

const openChatId = computed(() => route.params.chat as string | undefined)

watch(user, () => {
    if (!user.value) navigateTo("/auth/login")
})

const chatSearch = ref("")

const chats = ref<(UserOnChat & {
    chat: Chat
})[]>([])

const models = ref<Model[]>([])



const editingChat = ref<{
    chat: NormalizedPartial<Chat>
    selectedModels: string[]
}>({
    chat: {},
    selectedModels: []
})

const editingModel = ref<NormalizedPartial<Model>>({})


async function saveChat() {
    if (!user.value) return

    const newChat = await serverFunction("editChat", user.value.token, editingChat.value.chat, editingChat.value.selectedModels)

    if (isServerError(newChat)) {
        console.error(newChat)
        return
    }
}

async function leaveChat() {
    if (!user.value || !editingChat.value.chat.id) return

    const leftChat = await serverFunction("leaveChat", user.value.token, editingChat.value.chat.id)

    if (isServerError(leftChat)) {
        console.error(leftChat)
        return
    }
}

async function saveModel() {
    if (!user.value) return

    const newModel = await serverFunction("editModel", user.value.token, editingModel.value)

    if (isServerError(newModel)) {
        console.error(newModel)
        return
    }
}

async function deleteModel() {
    if (!user.value || !editingModel.value.id) return

    const deletedModel = await serverFunction("deleteModel", user.value.token, editingModel.value.id)

    if (isServerError(deletedModel)) {
        console.error(deletedModel)
        return
    }
}

const editChatPopup = ref(false)
const leaveChatPopup = ref(false)
const shareChatPopup = ref(false)
</script>

<template>
    <PopupEditChat
        v-model:open="editChatPopup"
        :models="models"

        :editingChat="editingChat"
        :editingModel="editingModel"
    ></PopupEditChat>


    <PopupConfirm @confirm="leaveChat" v-model:open="leaveChatPopup" heading="Leave chat" subheading="Select one of the buttons below to confirm">
        <SystemP>Are you sure you want to leave this chat?</SystemP>
        <SystemP>You <SystemPBold>cannot join</SystemPBold> this chat again unless invited back.</SystemP>
    </PopupConfirm>

    <SystemFlex grow="1" class="wrapper">
        <SystemFlex grow="1" class="border">
            <SystemFlex direction="column" class="sidebar">
                <SystemFlex class="buttons" gap="0.25rem">
                    <SystemInput class="search" v-model:value="chatSearch" placeholder="Search">
                        <template #icon>
                            <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                        </template>
                    </SystemInput>

                    <SystemIconButton
                        background="var(--primary)"
                        border="var(--primary)"
                        color="var(--background)"
                        :default-hover="false"
                        @click="() => {
                            editingChat = {
                                chat: {},
                                selectedModels: []
                            }

                            editChatPopup = true
                        }" 
                        icon="material-symbols:chat-add-on"
                    >
                    </SystemIconButton>
                </SystemFlex>

                <SystemFlex class="chats" direction="column">
                    <ChatListItem
                        v-for="chat in chats"
                        :key="chat.id"
                        :chat="chat.chat"
                        :active="chat.chatId == openChatId"

                        avatar=""


                        @edit="() => {
                            editingChat = {
                                chat: normalizePartial(chat.chat),
                                selectedModels: []
                            }

                            editChatPopup = true
                        }"
                        @leave="() => {
                            editingChat = {
                                chat: normalizePartial(chat.chat),
                                selectedModels: []
                            }

                            leaveChatPopup = true
                        }"

                        @share="() => {}"
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