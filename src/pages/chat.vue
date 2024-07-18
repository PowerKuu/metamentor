<script setup lang="ts">
import type { Chat, Model } from "@prisma/client"
import type { NormalizePartial } from "~/utils/utils";

definePageMeta({
    layout: "navigation"
})

const user = useAuth()
const route = useRoute()

const openChatId = computed(() => route.params.chat as string | undefined)

watch(user, () => {
    if (!user.value) navigateTo("/auth/login")
})

const chatsQuary = ref<ServerFunctionData<"getChats">>([])
const modelsQuary = ref<ServerFunctionData<"getModels">>([])

async function getChats() {
    if (!user.value) return

    const chats = await serverFunction("getChats", user.value.token, chatSearch.value)

    if (isServerError(chats)) {
        console.error(chats)
        return
    }

    chatsQuary.value = chats
}

async function getModels() {
    if (!user.value) return

    const models = await serverFunction("getModels", user.value.token, modelSearch.value)

    if (isServerError(models)) {
        console.error(models)
        return
    }

    modelsQuary.value = models
}


watch(user, () => {
    if (user.value) {
        getChats()
        getModels()
    }
})

const chatSearch = ref("")
const modelSearch = ref("")

watch(modelSearch, () => getModels())
watch(chatSearch, () => getChats())

const editingChat = ref<{    
    chat: NormalizePartial<Chat>
    selectedModels: string[]
}>({
    chat: {},
    selectedModels: []
})

const editingModel = ref<NormalizePartial<Model>>({})



async function saveChat() {
    if (!user.value) return

    const newChat = await serverFunction("editChat", user.value.token, editingChat.value.chat, editingChat.value.selectedModels)

    if (isServerError(newChat)) {
        console.error(newChat)
        return
    }

    await getChats()
}

async function leaveChat() {
    if (!user.value || !editingChat.value.chat.id) return

    const leftChat = await serverFunction("leaveChat", user.value.token, editingChat.value.chat.id)

    if (isServerError(leftChat)) {
        console.error(leftChat)
        return
    }

    await getChats()
}

async function saveModel() {
    if (!user.value) return

    const newModel = await serverFunction("editModel", user.value.token, editingModel.value)

    if (isServerError(newModel)) {
        console.error(newModel)
        return
    }

    getModels()
}

async function deleteModel() {
    if (!user.value || !editingModel.value.id) return

    const deletedModel = await serverFunction("deleteModel", user.value.token, editingModel.value.id)

    if (isServerError(deletedModel)) {
        console.error(deletedModel)
        return
    }

    getModels()

    // Update avatar in the chat
    getChats()
}

function toogleSelectModel(model: Model) {
    if (editingChat.value.selectedModels.includes(model.id)) {
        editingChat.value.selectedModels = editingChat.value.selectedModels.filter((id) => id != model.id)
    } else {
        editingChat.value.selectedModels.push(model.id)
    }
}




function openEditChatPopup(chat?: Chat, selectedModels?: string[]) {
    modelSearch.value = ""

    if (!chat || !selectedModels) {
        editingChat.value = {
            chat: {},
            selectedModels: selectedModels || []
        }
    } else {
        editingChat.value = {
            chat: chat,
            selectedModels: selectedModels
        }
    }

    editChatPopup.value = true
}

function openLeaveChatPopup(chat: Chat) {
    editingChat.value.chat = chat
    leaveChatPopup.value = true
}

function openShareChat(chat: Chat) {
    editingChat.value.chat = chat
    shareChatPopup.value = true
}


function openEditModelPopup(model?: Model) {
    if (!model) {
        editingModel.value = {}
    } else {
        editingModel.value = normalizePartial(model)
    }

    editModelPopup.value = true
}

function openDeleteModelPopup(model: Model) {
    editingModel.value = normalizePartial(model)
    deleteModelPopup.value = true
}



const editModelPopup = ref(false)
const deleteModelPopup = ref(false)



const shareChatPopup = ref(false)
const editChatPopup = ref(false)
const leaveChatPopup = ref(false)
</script>

<template>
    <PopupEditChat
        v-model:open="editChatPopup"
        v-model:modelSearch="modelSearch"

        v-model:chat="editingChat.chat"

        v-model:selectedModels="editingChat.selectedModels"
        :models="modelsQuary"

        :maxSelected="5"

        @save="saveChat"

        @toogleSelectModel="toogleSelectModel"

        @openDeleteModelPopup="openDeleteModelPopup"
        @openEditModelPopup="openEditModelPopup"
        @openCreateModelPopup="openEditModelPopup"
    ></PopupEditChat>

    <PopupEditModel
        v-model:open="editModelPopup"
        v-model:model="editingModel"

        @save="saveModel"
    ></PopupEditModel>


    <PopupConfirm heading="Delete model" subheading="Select one of the buttons below to confirm" @confirm="deleteModel" v-model:open="deleteModelPopup">
        <SystemP>Are you sure you want to permanently delete this model?</SystemP>
        <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
    </PopupConfirm>

    <PopupConfirm @confirm="leaveChat" heading="Leave chat" subheading="Select one of the buttons below to confirm" v-model:open="leaveChatPopup">
        <SystemP>Are you sure you want to leave this chat?</SystemP>
        <SystemP>You <SystemPBold>cannot join</SystemPBold> this chat again unless invited back.</SystemP>
    </PopupConfirm>

    <PopupShareChat v-model:open="shareChatPopup"></PopupShareChat>

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
                        @click="openEditChatPopup" 
                        icon="material-symbols:chat-add-on"
                    >
                    </SystemIconButton>
                </SystemFlex>

                <SystemFlex class="chats" direction="column">
                    <ChatListItem
                        v-for="chat in chatsQuary"
                        :key="chat.id"
                        :chat="chat.chat"
                        :active="chat.chatId == openChatId"

                        :avatar="chat.chat.models[0]?.avatar"

                        @edit="() => openEditChatPopup(chat.chat, chat.chat.models.map((model) => model.id))"
                        @share="() => openShareChat(chat.chat)"
                        @leave="() => openLeaveChatPopup(chat.chat)"
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