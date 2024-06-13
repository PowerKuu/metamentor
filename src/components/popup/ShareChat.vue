<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

const permissionOptions = [
    { label: "Edit", value: "edit", icon: "material-symbols:edit-rounded" },
    { label: "Read only", value: "read-only", icon: "material-symbols:visibility-rounded" },
]

const selectedPermission = ref(permissionOptions[0])
</script>

<template>
    <SystemPopupStandard heading='Share «Chat name»' subheading="Share chat and get live " v-model:open="openModel">
        <SystemFlex class="share" gap="2rem" direction="column">
            <SystemFlex direction="column" gap="1rem">
                <SystemFlex gap="0.5rem">
                    <SystemInput grow="1" placeholder="Search for a user" value=""></SystemInput>
                    <SystemButton>Invite</SystemButton>
                </SystemFlex>

                <SystemFlex v-for="i of 1" gap="1rem" justify="space-between">
                    <SystemFlex gap="1rem">
                        <SystemUserIcon icon="material-symbols:group"></SystemUserIcon>
                        <SystemFlex direction="column" justify="center">
                            <SystemPBold>General</SystemPBold>
                            <SystemPSmall class="weak-text">Everyone invited with the link</SystemPSmall>
                        </SystemFlex>
                    </SystemFlex>

                    <SystemFlex gap="1rem">
                        <SystemSimpleSelector v-model:selected="selectedPermission" :options="permissionOptions"></SystemSimpleSelector>
                    </SystemFlex>
                </SystemFlex>
            </SystemFlex>


            <SystemFlex justify="space-between">
                <SystemFlex>
                    <SystemButton
                        background="var(--background)" 
                        border="var(--neutral)" 
                        color="var(--text)"

                        icon="material-symbols:content-copy"
                    >
                        Copy link
                    </SystemButton>
                </SystemFlex>

                <SystemButton>Done</SystemButton>
            </SystemFlex>
        </SystemFlex>
    </SystemPopupStandard>
</template>

<style scoped lang="scss">
.share {
    width: 28rem;
}
</style>