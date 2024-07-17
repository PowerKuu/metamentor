<script setup lang="ts">
import type { Model } from "@prisma/client"

const props = defineProps<{
    open: boolean
    models: Model[]
    selectedModels: string[]
    newChat: boolean
}>()

const user = useAuth()

const selectedModels = useModel(props, "selectedModels")
const openModelDropdown = ref<string | null>(null)

const emit = defineEmits<{
    (e: "save"): void
    (e: "update:models"): void
}>()

const openModel = useModel(props, "open")
const search = ref("")

const chatName = ref("")
const hasChatName = computed(() => !!chatName.value)
const maxSelected = 4

const hasSelected = computed(() => selectedModels.value.length > 0)
const hasMaxSelected = computed(() => selectedModels.value.length >= maxSelected)

const openEditModelPopup = ref(false)
const openDeleteModelPopup = ref(false)

const editingModel = ref<Partial<Model>>({})
const newModel = ref(true)

function openEditModel() {
    newModel.value = false
    openEditModelPopup.value = true
}

function openNewModel() {
    newModel.value = true
    openEditModelPopup.value = true
}

function openDeleteModel() {
    openDeleteModelPopup.value = true
}

async function saveEditModel() {
    openEditModelPopup.value = false

    if (!user.value) return

    await serverFunction("editModel", user.value.token, editingModel.value)

    emit("update:models")
}




function toogleSelect(model: Model) {
    const isSelected = selectedModels.value.includes(model.id)

    if (hasMaxSelected.value && !isSelected) return

    if (isSelected) {
        selectedModels.value = selectedModels.value.filter(id => id !== model.id)
    } else {
        selectedModels.value.push(model.id)
    }
}

function resetSelected() {
    selectedModels.value = []
}
</script>

<template>
    <PopupEditModel :newModel="newModel" v-model:model="editingModel" @save="saveEditModel" v-model:open="openEditModelPopup"></PopupEditModel>

    <PopupConfirm heading="Delete model" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to permanently delete this model?</SystemP>
        <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
    </PopupConfirm>

    <SystemPopupStandard maxWidth="37rem" :heading="newChat ? `New chat` : `Edit chat`" subheading="Select one of the models below to create a new chat" v-model:open="openModel">
        <SystemFlex class="browser" gap="0.5rem" direction="column">
            <SystemNamed name="Name">
                <SystemInput placeholder="My chat" v-model:value="chatName"></SystemInput>
            </SystemNamed>

            <SystemNamed name="Models">
                <SystemFlex gap="0.5rem">
                    <SystemInput class="search" v-model:value="search" placeholder="Search">
                        <template #icon>
                            <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                        </template>
                    </SystemInput>
                    <SystemButton icon="material-symbols:add-rounded" @click="openNewModel">New model</SystemButton>
                </SystemFlex>
            </SystemNamed>

            <SystemFlex class="cards border" direction="column">
                <SystemFlex direction="column" class="no-models" v-if="models.length <= 0">
                    <SystemPSmall class="text-weak">No models found {{ search ? `searching "${search}"` : ""}}</SystemPSmall>
                </SystemFlex>

                <SystemFlex
                    v-for="option of models" 
                    :data-disabeld="hasMaxSelected" 
                    :data-selected="selectedModels.includes(option.id)"
                    class="model-card"
                    @click="toogleSelect(option)"
                >
                    <SystemSlickAvatar class="avatar" :size="100" :avatarString="option.avatar" color="var(--text)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
                    
                    <SystemFlex grow="1" align="center" justify="space-between">
                        <SystemFlex direction="column" class="card-contents" gap="0.25rem">
                            <SystemFlex align="center" justify="space-between">
                                <SystemH4>{{ option.name }}</SystemH4>
                            </SystemFlex>
                            <SystemPSmall class="text-weak hide-overflow">{{ option.description }}</SystemPSmall>
                        </SystemFlex>

                        <SystemFlex class="card-options">
                            <SystemDropdown :open="openModelDropdown == option.id" @update:open="(value) => { openModelDropdown = value ? option.id : null }">
                                <SystemDropdownDots :open="openModelDropdown == option.id"></SystemDropdownDots>

                                <template #content>
                                    <SystemFlex direction="column">
                                        <SystemDropdownOption
                                            icon="material-symbols:edit-rounded" 
                                            @click="() => {
                                                openEditModel()
                                                openModelDropdown = null
                                            }"
                                        >
                                            Edit
                                        </SystemDropdownOption>

                                        <SystemDropdownOption 
                                            icon="material-symbols:download-rounded" 
                                            @click="openModelDropdown = null"
                                        >
                                            Download
                                        </SystemDropdownOption>

                                        <SystemDropdownOption 
                                            :delete="true" 
                                            icon="material-symbols:delete-outline-rounded" 
                                            @click="() => {
                                                openDeleteModel()
                                                openModelDropdown = null
                                            }"
                                        >
                                            Delete
                                        </SystemDropdownOption>
                                    </SystemFlex>
                                </template>
                            </SystemDropdown>
                            
                            <Icon v-if="selectedModels.includes(option.id)" color="var(--primary)" class="icon-option" name="material-symbols:check-rounded"></Icon>
                            <Icon v-else class="icon-option" name="material-symbols:add-rounded"></Icon>
                        </SystemFlex>
                    </SystemFlex>
                </SystemFlex>
            </SystemFlex>

            <SystemFlex justify="space-between" align="center">
                <SystemFlex gap="0.25rem">
                    <SystemPSmall class="text-weak">{{ selectedModels.length }} models selected (max 4)</SystemPSmall>
                    <SystemPSmall @click="resetSelected" v-if="hasSelected" class="link">Reset</SystemPSmall>
                </SystemFlex>
                <SystemButton 
                    :disabled="!hasSelected || !hasChatName"
                    @click="() => {
                        openModel = false
                        $emit(`save`)
                    }"
                >{{ newChat ? "Create chat" : "Save chat" }}</SystemButton>
            </SystemFlex>
        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
.cards {
    max-height: 30rem;
    min-height: 10rem;
    overflow-y: auto;
    overflow-x: hidden;
}

.no-models {
    padding: 1rem;
}

.browser {
    width: 30rem;
}

.model-card {
    cursor: pointer;
    transition: 0.2s;
    
    border-bottom: var(--border-width) solid var(--neutral);

    &:last-child {
        border: 0;
    }

    .card-contents {
        padding: 0.5rem;
        height: 6rem;

        max-width: 25rem;
    }

    .card-options {
        padding: 0.5rem;
    }

    &[data-selected="true"] {
        background: var(--neutral);
        border-color: var(--primary)
    }

    &:not([data-selected="true"]) {
        &[data-disabeld="true"] {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    user-select: none;
}

.icon-option {
    font-size: 1.5rem;

    cursor: pointer;

    transition: 0.2s;

    color: var(--weak-text);

    &:hover {
        color: var(--primary);
    }
}

.search {
    width: 100%;
}

.link {
    cursor: pointer;
    text-decoration: underline;
}
</style>