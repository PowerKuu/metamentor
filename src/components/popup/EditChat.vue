<script setup lang="ts">
import type { Model } from "@prisma/client"


const props = defineProps<{
    open: boolean
    models: Model[],

    editingChat: NormalizedPartial<ChatRoomTopLevel>
    editingModel: NormalizedPartial<Model>
}>()

const editingChatModel = useModel(props, "editingChat")
const editingModelModel = useModel(props, "editingModel")

const openModel = useModel(props, "open")


const modelSearch = ref("")

defineEmits<{
    (e: "saveChat"): void
    (e: "saveModel"): void
    (e: "deleteModel"): void
}>()

function toogleSelectModel(model: Model) {
    if (editingChatModel.value.models?.includes(model)) {
        editingChatModel.value.models = editingChatModel.value.models?.filter(m => m.id !== model.id)
    } else {
        editingChatModel.value.models = [...editingChatModel.value.models ?? [], model]
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
</script>

<template>
<PopupModelSelector
    v-model:open="openModel"
    v-model:chat="editingChatModel"

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
    v-model:model="editingModelModel"
></PopupEditModel>


<PopupConfirm @confirm="$emit(`deleteModel`)" heading="Delete model" subheading="Select one of the buttons below to confirm" v-model:open="deleteModelPopup">
    <SystemP>Are you sure you want to permanently delete this model?</SystemP>
    <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
</PopupConfirm>
</template>

<style scoped lang="scss">

</style>