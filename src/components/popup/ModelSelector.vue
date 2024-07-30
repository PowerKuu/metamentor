<script setup lang="ts">
import type { Chat, Model } from "@prisma/client"
import type { ChatRoomTopLevel } from "@/server/websocket/functions"

const props = defineProps<{
    open: boolean
    
    models: Model[]
    chat: NormalizedPartial<ChatRoomTopLevel>

    modelSearch: string
    maxSelected: number
}>()

const chatModel = useModel(props, "chat")
const modelSearchModel = useModel(props, "modelSearch")

const newChat = computed(() => !chatModel.value.id)

const emit = defineEmits<{
    (e: "save"): void

    (e: "toogleSelectModel", model: Model): void
    (e: "openDeleteModelPopup", model: Model): void
    (e: "openEditModelPopup", newModel: Model): void
    (e: "openCreateModelPopup"): void
}>()

const openModel = useModel(props, "open")

const hasChatName = computed(() => !!chatModel.value.name)

const hasSelected = computed(() => {
    if (chatModel.value.models) return chatModel.value.models.length > 0
    return false
})

const hasMaxSelected = computed(() => {
    if (chatModel.value.models) return chatModel.value.models.length >= props.maxSelected
    return true
})

const disableSave = computed(() => (!hasSelected.value && !newChat.value) || !hasChatName.value)


function resetSelected() {
    chatModel.value.models = []
}
</script>

<template>
    <SystemPopupStandard maxWidth="37rem" :heading="newChat ? `New chat` : `Edit chat`" :subheading="newChat ? `Enter a name to create a new chat` : `Edit chat`" v-model:open="openModel">
        <SystemFlex class="model-selector" gap="0.5rem" direction="column">
            <SystemNamed name="Name">
                <SystemInput placeholder="My chat" v-model:value="chatModel.name"></SystemInput>
            </SystemNamed>
        
            <SystemFlex v-if="!newChat" class="browser" gap="0.5rem" direction="column">                
                <SystemNamed name="Models">
                    <SystemFlex gap="0.5rem">
                        <SystemInput class="search" v-model:value="modelSearchModel" placeholder="Search">
                            <template #icon>
                                <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                            </template>
                        </SystemInput>
                        <SystemButton icon="material-symbols:add-rounded" @click="$emit(`openCreateModelPopup`)">New model</SystemButton>
                    </SystemFlex>
                </SystemNamed>

                <SystemFlex class="cards border" direction="column">
                    <SystemFlex direction="column" class="no-models" v-if="models.length <= 0">
                        <SystemPSmall class="text-weak">No models found {{ modelSearchModel ? `searching "${modelSearchModel}"` : ""}}</SystemPSmall>
                    </SystemFlex>

                    <ModelListItem
                        v-for="model in models"
                        :key="model.id"
                        :model="model"
                        :disabled="hasMaxSelected"
                        :selected="chatModel.models?.includes(model) || false"

                        @toogleSelect="$emit(`toogleSelectModel`, model)"
                        @edit="$emit(`openEditModelPopup`, model)"
                        @delete="$emit(`openDeleteModelPopup`, model)"
                    />
                </SystemFlex>
            </SystemFlex>

            <SystemFlex justify="space-between" align="center">
                    <SystemFlex gap="0.25rem">
                        <template v-if="!newChat">
                            <SystemPSmall class="text-weak">{{ chatModel.models?.length || 0 }} models selected (max 4)</SystemPSmall>
                            <SystemPSmall @click="resetSelected" v-if="hasSelected" class="link">Reset</SystemPSmall>
                        </template>
                    </SystemFlex>
                    
                    <SystemButton
                        :disabled="disableSave"
                        @click="() => {
                            if (!disableSave) {
                                openModel = false
                                $emit(`save`)
                            }
                        }"
                    >{{ newChat ? "Create chat" : "Save chat" }}</SystemButton>
                </SystemFlex>
        </SystemFlex>
    </SystemPopupStandard>
</template>

<style scoped lang="scss">
.cards {
    max-height: 30rem;
    min-height: 6rem;
    overflow-y: auto;
    overflow-x: hidden;
}

.model-selector {
    min-width: 23rem;
}

.no-models {
    padding: 1rem;
}

.browser {
    width: 30rem;
}

.search {
    width: 100%;
}

.link {
    cursor: pointer;
    text-decoration: underline;
}
</style>