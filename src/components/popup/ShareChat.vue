<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const permissionOptions = [
    { label: "Edit", value: "edit", icon: "material-symbols:edit-rounded" },
    { label: "Duplicate", value: "independent", icon: "material-symbols:copy-all-rounded"},
    { label: "Read only", value: "read-only", icon: "material-symbols:visibility-rounded" },
    { label: "Remove", value: "remove", icon: "material-symbols:delete-outline-rounded", delete: true, overideClick: () => {
        openDeleteModelPopup.value = true
    }}
]

const selectedPermission = ref(permissionOptions[0])
const input = ref("")
const hasValidInput = computed(() => {
    return input.value.length > 0 && input.value.includes("@") && input.value.includes(".")
})

const copyIcon = ref("material-symbols:copy-all-rounded")

function copyLink() {
    copyIcon.value = "material-symbols:check-rounded"
    setTimeout(() => {
        copyIcon.value = "material-symbols:copy-all-rounded"
    }, 1000)
}

const openDeleteModelPopup = ref(false)
</script>

<template>
    <PopupConfirm heading="Remove user" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to permanently remove this user?</SystemP>
        <SystemP>This action is <SystemPBold>irreversible</SystemPBold>.</SystemP>
    </PopupConfirm>

    <SystemPopupStandard heading='Share «Chat name»' subheading="Share chat and get live " v-model:open="openModel">
        <SystemFlex class="share" gap="1rem" direction="column">
            <SystemFlex gap="0.5rem">
                <SystemInput grow="1" placeholder="joe@doe.com" v-model:value="input"></SystemInput>
                <SystemButton :disabled="!hasValidInput" icon="material-symbols:send-rounded">Invite</SystemButton>
            </SystemFlex>

            <SystemFlex class="users" direction="column" gap="1rem">
                <SystemFlex v-for="i of 7" gap="1rem" justify="space-between">
                    <SystemFlex gap="1rem">
                        <SystemUserIcon icon="material-symbols:group"></SystemUserIcon>
                        <SystemFlex direction="column" justify="center">
                            <SystemPBold>General</SystemPBold>
                            <SystemPSmall class="weak-text">Everyone invited with the link</SystemPSmall>
                        </SystemFlex>
                    </SystemFlex>

                    <SystemFlex gap="1rem">
                        <SystemSimpleSelector v-model:selected="selectedPermission" :options="permissionOptions" :displayIcon="true"></SystemSimpleSelector>
                    </SystemFlex>
                </SystemFlex>
            </SystemFlex>

            <SystemFlex direction="column" gap="0.5rem"> 
                <SystemPSmall class="weak-text">1 users invited (max 4)</SystemPSmall>

                <SystemFlex justify="space-between">
                    <SystemFlex>
                        <SystemButton
                            background="var(--background)" 
                            border="var(--neutral)" 
                            color="var(--text)"

                            :icon="copyIcon"
                            @click="copyLink"
                        >
                            Copy link
                        </SystemButton>
                    </SystemFlex>

                    <SystemButton>Done</SystemButton>
                </SystemFlex>
            </SystemFlex>

        </SystemFlex>
    </SystemPopupStandard>
</template>

<style scoped lang="scss">
.share {
    width: 30rem;
}

.users {
    border: var(--border-width) solid var(--neutral);
    border-radius: var(--border-radius);
    padding: 0.5rem;

    max-height: 25rem;
    overflow-y: auto;
}
</style>