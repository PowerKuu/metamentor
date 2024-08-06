<script setup lang="ts">
import type { Model } from "@prisma/client"

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

const isNewModel = computed(() => !editingModel.value.id)

const websocket = ref<WebSocket>()


async function saveChat() {
    if (!user.value || !websocket.value) return

}

async function newChat() {
    if (!user.value || !websocket.value || !editingChat.value.name) return
}

async function leaveChat() {
    if (!user.value || !editingChat.value.id) return
}

async function saveModel() {
    if (!user.value) return
    
}

async function deleteModel() {
    if (!user.value || !editingModel.value.id) return
}

const editChatPopup = ref(false)
const newChatPopup = ref(false)
const leaveChatPopup = ref(false)
const shareChatPopup = ref(false)

async function websocketReady(readyWebsocket: WebSocket) {
    if (!user.value) return

    websocket.value = readyWebsocket
}

onMounted(() => {

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

    <PopupNewChat
        v-model:open="newChatPopup"
        v-model:name="editingChat.name"

        @save="saveChat"
    ></PopupNewChat>


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

                            newChatPopup = true
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