<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const options = ref<{
    id: string
    name: string
    description: string
    modelIcon: any

    selected?: boolean
}[]>([
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "2",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "3",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "2",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "3",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "2",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "3",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null
    },
    {
        id: "1",
        name: "My AI Anna",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "2",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null,
    },
    {
        id : "3",
        name: "Anny",
        description: "Anny is a chatbot that can help you with your daily tasks",
        modelIcon: null
    }
])

const maxSelected = 4


const selectedOptions = computed(() => options.value.filter(option => option.selected))
const hasSelected = computed(() => selectedOptions.value.length > 0)
const hasMaxSelected = computed(() => selectedOptions.value.length >= maxSelected)

const openEditChatPopup = ref(false)

function openEditChat() {
    openEditChatPopup.value = true
}

function toggleSelected(option: typeof options.value[0]) {
    if (hasMaxSelected.value && !option.selected) return

    option.selected = !option.selected
}

function resetSelected() {
    options.value.forEach(option => option.selected = false)
}
</script>

<template>
    <PopupEditModel :newModel="true" class="over-popup" v-model:open="openEditChatPopup"></PopupEditModel>

    <SystemPopupStandard maxWidth="37rem" heading="Browse models" subheading="Select one of the models below to create a new chat" v-model:open="openModel">
        <SystemFlex gap="0.5rem" direction="column">
            <SystemFlex gap="0.5rem">
                <SystemInput class="search" value="" placeholder="Search">
                    <template #icon>
                        <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                    </template>
                </SystemInput>
                <SystemButton icon="material-symbols:add-rounded" @click="openEditChat">Add model</SystemButton>
            </SystemFlex>

            <SystemFlex class="cards border" gap="0.5rem" direction="column">
                <SystemFlex 
                    v-for="option of options" 
                    :data-disabeld="hasMaxSelected" 
                    :data-selected="option.selected" 
                    class="border model-card" 
                    @click="toggleSelected(option)"
                >
                    <SystemSlickAvatar class="avatar" :size="100" v-model="option.modelIcon" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
                    
                    <SystemFlex grow="1" align="center" justify="space-between">
                        <SystemFlex direction="column" class="card-contents" gap="0.25rem">
                            <SystemFlex align="center" justify="space-between">
                                <SystemH4>{{ option.name }}</SystemH4>
                            </SystemFlex>
                            <SystemPSmall class="weak-text hide-overflow">{{ option.description }}</SystemPSmall>
                        </SystemFlex>

                        <SystemFlex class="card-options" gap="0.5rem">
                            <Icon class="dots" name="mdi:dots-vertical"></Icon>
                            <Icon v-if="option.selected" color="var(--primary)" class="dots" name="material-symbols:check-rounded"></Icon>
                            <Icon v-else class="dots" name="material-symbols:add-rounded"></Icon>
                        </SystemFlex>
                    </SystemFlex>
                </SystemFlex>
            </SystemFlex>

            <SystemFlex justify="space-between" align="center">
                <SystemFlex gap="0.25rem">
                    <SystemPSmall class="weak-text">{{ options.filter(option => option.selected).length }} models selected (max 4)</SystemPSmall>
                    <SystemPSmall @click="resetSelected" v-if="hasSelected" class="clear">Reset</SystemPSmall>
                </SystemFlex>
                <SystemButton :disabled="!hasSelected">Create chat</SystemButton>
            </SystemFlex>
        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
.cards {
    max-height: 30rem;
    overflow-y: auto;
    padding: 0.5rem;
}

.model-card {
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background: var(--neutral);
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
        border-color: var(--weak-primary);
    }

    &:not([data-selected="true"]) {
        &[data-disabeld="true"] {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    user-select: none;
}

.dots {
    font-size: 1.5rem;

    cursor: pointer;

    transition: 0.2s;

    color: var(--weak-primary);

    &:hover {
        color: var(--primary);
    }
}

.search {
    width: 100%;
}

.over-popup {
    z-index: 1000;
}

.clear {
    cursor: pointer;
    text-decoration: underline;
}
</style>