<script setup lang="ts">
import type { Model } from "@prisma/client"
import type { ChatRoomTopLevel, NewTemporaryModel } from "@/server/websocket/functions"

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

const chats = ref<Map<string, ChatRoomTopLevel>>(new Map())
const chatValues = computed(() => Array.from(chats.value.values()))

const editingChat = ref<NormalizedPartial<ChatRoomTopLevel>>({})
const editingModel = ref<NormalizedPartial<Model>>({})

const isNewChat = computed(() => !editingChat.value.id)
const isNewModel = computed(() => !editingModel.value.id)

const websocket = ref<WebSocket>()


async function saveChat() {
    if (!user.value || !websocket.value) return

    await webscoketFunction(websocket.value, "editChat", user.value.token, editingChat.value, editingChat.value.models?.map(model => model.id) || [])
}

async function leaveChat() {
    if (!user.value || !editingChat.value.id) return

    const leftChat = await serverFunction("leaveChat", user.value.token, editingChat.value.id)

    if (isServerError(leftChat)) {
        console.error(leftChat)
        return
    }
}

async function saveModel() {
    if (!user.value) return

    if (isNewModel.value && isNewChat.value) {
        const { name, description, system, avatar } = editingModel.value

        if (!name || !system || !avatar) return

        newTemporaryModels.value.push({ name, description, system, avatar })

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

async function websocketReady(readyWebsocket: WebSocket) {
    if (!user.value) return

    websocket.value = readyWebsocket

    await webscoketListener(readyWebsocket, "editChatTopLevel", (newChats) => {
        for (const chat of newChats) {
            chats.value.set(chat.id, chat)
        }
    })

    await webscoketFunction(readyWebsocket, "subscribeAllChatRoomsTopLevel", user.value.token)
}

onMounted(() => {
    const websocket = new WebSocket("ws://localhost:3000/api/websocket/websocket")
    websocket.onopen = () => {
        const checkUser = () => { if (user.value) websocketReady(websocket) }

        watch(user, () => checkUser(), { once: true })
        checkUser()
    }

    websocket.onerror = (error) => {
        console.error(error)
    }
})
</script>

<template>
    <PopupEditChat
        v-model:open="editChatPopup"
        :models="editingChat.models || []"

        v-model:editingChat="editingChat"
        v-model:editingModel="editingModel"

        @saveChat="saveChat"
        @saveModel="saveModel"

        @deleteModel="deleteModel"
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
                            editingChat = {}

                            editChatPopup = true
                        }" 
                        icon="material-symbols:chat-add-on"
                    >
                    </SystemIconButton>
                </SystemFlex>

                <SystemFlex class="chats" direction="column">
                    <ChatListItem
                        v-for="chat in chatValues"

                        :key="chat.id"
                        :chat="chat"
                        :active="chat.id == openChatId"

                        :avatar="chat.models[0]?.avatar"

                        @edit="() => {
                            editingChat = normalizePartial({...chat})

                            editChatPopup = true
                        }"
                        
                        @leave="() => {
                            editingChat = normalizePartial({...chat})

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