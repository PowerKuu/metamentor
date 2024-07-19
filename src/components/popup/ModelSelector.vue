<script setup lang="ts">
import type { Chat, Model } from "@prisma/client"

const props = defineProps<{
    open: boolean
    
    models: Model[]
    selectedModels: string[]
    chat: NormalizePartial<Chat>

    modelSearch: string
    maxSelected: number
}>()

const selectedModels = useModel(props, "selectedModels")
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

const hasSelected = computed(() => selectedModels.value.length > 0)
const hasMaxSelected = computed(() => selectedModels.value.length >= props.maxSelected)

const disableSave = computed(() => !hasSelected.value || !hasChatName.value)


function resetSelected() {
    selectedModels.value = []
}
</script>

<template>
    <SystemPopupStandard maxWidth="37rem" :heading="newChat ? `New chat` : `Edit chat`" subheading="Select one of the models below to create a new chat" v-model:open="openModel">
        <SystemFlex class="browser" gap="0.5rem" direction="column">
            <SystemNamed name="Name">
                <SystemInput placeholder="My chat" v-model:value="chatModel.name"></SystemInput>
            </SystemNamed>

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
                    :selected="selectedModels.includes(model.id)"

                    @toogleSelect="$emit(`toogleSelectModel`, model)"
                    @edit="$emit(`openEditModelPopup`, model)"
                    @delete="$emit(`openDeleteModelPopup`, model)"
                />
            </SystemFlex>

            <SystemFlex justify="space-between" align="center">
                <SystemFlex gap="0.25rem">
                    <SystemPSmall class="text-weak">{{ selectedModels.length }} models selected (max 4)</SystemPSmall>
                    <SystemPSmall @click="resetSelected" v-if="hasSelected" class="link">Reset</SystemPSmall>
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