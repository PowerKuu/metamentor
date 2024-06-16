<script setup lang="ts">
const props = defineProps<{
    open: boolean

    newChat: boolean
}>()

defineEmits<{
    (e: "save"): void
}>()

const openModel = useModel(props, "open")
const search = ref("")

const options = ref<{
    id: string
    name: string
    description: string
    modelIcon: any

    selected: boolean
    dropdownOpen: boolean
}[]>([
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,

        selected: false,
        dropdownOpen: false
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,

        selected: false,
        dropdownOpen: false
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,

        selected: false,
        dropdownOpen: false
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,

        selected: false,
        dropdownOpen: false
    }
])

const maxSelected = 4


const selectedOptions = computed(() => options.value.filter(option => option.selected))
const hasSelected = computed(() => selectedOptions.value.length > 0)
const hasMaxSelected = computed(() => selectedOptions.value.length >= maxSelected)

const openEditChatPopup = ref(false)
const openDeleteModelPopup = ref(false)

function openEditChat() {
    openEditChatPopup.value = true
}

function filterClickAndToggleSelected(event: Event, option: typeof options.value[0]) {
    if (hasMaxSelected.value && !option.selected) return

    option.selected = !option.selected
}

function resetSelected() {
    options.value.forEach(option => option.selected = false)
}
</script>

<template>
    <PopupEditModel :newModel="true" v-model:open="openEditChatPopup"></PopupEditModel>
    <PopupConfirm heading="Delete model" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to permanently delete this model?</SystemP>
        <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
    </PopupConfirm>

    <SystemPopupStandard maxWidth="37rem" heading="Browse models" subheading="Select one of the models below to create a new chat" v-model:open="openModel">
        <SystemFlex class="browser" gap="0.5rem" direction="column">
            <SystemFlex gap="0.5rem">
                <SystemInput class="search" v-model:value="search" placeholder="Search">
                    <template #icon>
                        <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                    </template>
                </SystemInput>
                <SystemButton icon="material-symbols:add-rounded" @click="openEditChat">Add model</SystemButton>
            </SystemFlex>

            <SystemFlex class="cards border" direction="column">
                <SystemFlex direction="column" class="no-models" v-if="options.length <= 0">
                    <SystemPSmall class="weak-text">No models found {{ search ? `searching "${search}"` : ""}}</SystemPSmall>
                    <SystemPSmall @click="openEditChat" class="link">Create a new model +</SystemPSmall>
                </SystemFlex>

                <SystemFlex
                    v-for="option of options" 
                    :data-disabeld="hasMaxSelected" 
                    :data-selected="option.selected" 
                    class="model-card"
                    @click="(event: Event) => filterClickAndToggleSelected(event, option)"
                >
                    <SystemSlickAvatar class="avatar" :size="100" v-model="option.modelIcon" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
                    
                    <SystemFlex grow="1" align="center" justify="space-between">
                        <SystemFlex direction="column" class="card-contents" gap="0.25rem">
                            <SystemFlex align="center" justify="space-between">
                                <SystemH4>{{ option.name }}</SystemH4>
                            </SystemFlex>
                            <SystemPSmall class="weak-text hide-overflow">{{ option.description }}</SystemPSmall>
                        </SystemFlex>

                        <SystemFlex class="card-options">
                            <SystemDropdown v-model:open="option.dropdownOpen">
                                <Icon :data-open="option.dropdownOpen" class="icon-option dropdown-icon" name="mdi:dots-vertical"></Icon>

                                <template #content>
                                    <SystemFlex direction="column">
                                        <SystemDropdownOption 
                                            icon="material-symbols:edit-rounded" 
                                            @click="option.dropdownOpen = false"
                                        >
                                            Edit
                                        </SystemDropdownOption>

                                        <SystemDropdownOption 
                                            icon="material-symbols:download-rounded" 
                                            @click="option.dropdownOpen = false"
                                        >
                                            Download
                                        </SystemDropdownOption>

                                        <SystemDropdownOption 
                                            :delete="true" 
                                            icon="material-symbols:delete-outline-rounded" 
                                            @click="() => {
                                                openDeleteModelPopup = true
                                                option.dropdownOpen = false
                                            }"
                                        >
                                            Delete
                                        </SystemDropdownOption>
                                    </SystemFlex>
                                </template>
                            </SystemDropdown>
                            
                            <Icon v-if="option.selected" color="var(--secondary)" class="icon-option" name="material-symbols:check-rounded"></Icon>
                            <Icon v-else class="icon-option" name="material-symbols:add-rounded"></Icon>
                        </SystemFlex>
                    </SystemFlex>
                </SystemFlex>
            </SystemFlex>

            <SystemFlex justify="space-between" align="center">
                <SystemFlex gap="0.25rem">
                    <SystemPSmall class="weak-text">{{ options.filter(option => option.selected).length }} models selected (max 4)</SystemPSmall>
                    <SystemPSmall @click="resetSelected" v-if="hasSelected" class="link">Reset</SystemPSmall>
                </SystemFlex>
                <SystemButton 
                    :disabled="!hasSelected"
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
    overflow-y: auto;
    overflow-x: hidden;
}

.no-models {
    padding: 0.5rem;
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

    color: var(--weak-primary);

    &:hover {
        color: var(--secondary);
    }
}

.dropdown-icon[data-open="true"] {
    color: var(--secondary);
}

.search {
    width: 100%;
}

.link {
    cursor: pointer;
    text-decoration: underline;
}
</style>