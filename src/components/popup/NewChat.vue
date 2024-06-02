<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const options = {
    fromTemplate: {
        name: "From template",
        icon: "mdi:text-box-multiple",
        description: "Choose a model from our templates",
        iconSize: "1.8rem",
        click: () => {}
    },
    importFromFile: {
        name: "Import from file",
        icon: "material-symbols:upload-file-rounded",
        description: "Import a model from a file",
        iconSize: "2rem",
        click: () => {}
    },
    createNew: {
        name: "Create new",
        icon: "material-symbols:add-comment-rounded",
        description: "Create your own chat model",
        iconSize: "2.1rem",
        click: () => openEditChat()
    }
}

const openEditChatPopup = ref(false)

function openEditChat() {
    openEditChatPopup.value = true
}
</script>

<template>
    <PopupEditModel :newModel="true" class="edit" v-model:open="openEditChatPopup"></PopupEditModel>

    <SystemPopupStandard heading="New chat" subheading="Choose one of the options below to create a new chat" v-model:open="openModel">
        <SystemFlex gap="0.5rem">
            <SystemBoxButton v-for="option of options" @click="option.click">
                <SystemFlex align="center" justify="center" direction="column" gap="1rem">
                    <SystemFlex align="center" direction="column" justify="center">
                        <SystemH4>
                            {{ option.name }}
                        </SystemH4>
                        <SystemPSmall class="weak-text">
                            {{ option.description }}
                        </SystemPSmall>
                    </SystemFlex>

                    <Icon color="var(--secondary)" :name="option.icon" :size="option.iconSize"></Icon>
                </SystemFlex>
            </SystemBoxButton>
        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
.edit {
    z-index: 1000;
}
</style>