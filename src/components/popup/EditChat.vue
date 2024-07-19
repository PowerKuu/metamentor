<script setup lang="ts">
import type { Chat, Model } from "@prisma/client"

const props = defineProps<{
    open: boolean
    models: Model[],

    editingChat: {
        chat: NormalizedPartial<Chat>
        selectedModels: string[]
    }
    editingModel: NormalizedPartial<Model>
}>()

const editingChatModel = useModel(props, "editingChat")
const editingModelModel = useModel(props, "editingModel")


const modelSearch = ref("")

defineEmits<{
    (e: "saveChat"): void
    (e: "saveModel"): void
    (e: "deleteModel"): void

    (e: "openLeaveChat"): void
}>()

function toogleSelectModel(model: Model) {
    if (editingChatModel.value.selectedModels.includes(model.id)) {
        editingChatModel.value.selectedModels = editingChatModel.value.selectedModels.filter(id => id !== model.id)
    } else {
        editingChatModel.value.selectedModels.push(model.id)
    }
}

function openEditModelPopup(model?: Model) {
    if (!model) {
        editingModelModel.value = {}
    } else {
        editingModelModel.value = normalizePartial(model)
    }

    editModelPopup.value = true
}

function openDeleteModelPopup(model: Model) {
    editingModelModel.value = normalizePartial(model)
    deleteModelPopup.value = true
}

const editModelPopup = ref(false)
const deleteModelPopup = ref(false)

const modelBrowserPopup = ref(false)
</script>

<template>
<PopupModelSelector
    v-model:open="modelBrowserPopup"
    v-model:chat="editingChat.chat"

    v-model:selectedModels="editingChat.selectedModels"
    :models="models"
    :modelSearch="modelSearch"

    :maxSelected="5"

    @openCreateModelPopup="openEditModelPopup"
    @openDeleteModelPopup="openDeleteModelPopup"
    @toogleSelectModel="toogleSelectModel"

    @save="$emit(`saveChat`)"
></PopupModelSelector>

<PopupEditModel
    v-model:open="editModelPopup"
    v-model:model="editingModel"
></PopupEditModel>


<PopupConfirm @confirm="$emit(`deleteModel`)" heading="Delete model" subheading="Select one of the buttons below to confirm" v-model:open="deleteModelPopup">
    <SystemP>Are you sure you want to permanently delete this model?</SystemP>
    <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
</PopupConfirm>
</template>

<style scoped lang="scss">

</style>