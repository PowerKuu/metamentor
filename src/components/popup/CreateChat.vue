<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const openModel = useModel(props, "open")

function close() {
    openModel.value = false
}
</script>

<template>
    <SystemPopup v-model:open="openModel" max-width="50rem">
        <SystemFlex direction="column" class="popup border" gap="1rem">
            <SystemFlex justify="space-between" align="center">
                <SystemFlex direction="column">
                    <SystemH3>Create chat</SystemH3>
                    <SystemPSmall class="weak-text">Choose a chat to create</SystemPSmall>
                </SystemFlex>
                
                <SystemIconButton @click="close" icon="material-symbols:close-rounded"></SystemIconButton>
            </SystemFlex>

            <SystemFlex gap="0.5rem">
                <SystemBoxButton>
                    <SystemFlex align="center" justify="center">
                        <Icon name="material-symbols:chat-add-on" size="2rem"></Icon>
                    </SystemFlex>
                </SystemBoxButton>

                <SystemBoxButton>
                    <SystemFlex align="center" justify="center">
                        <Icon name="material-symbols:chat-add-on" size="2rem"></Icon>
                    </SystemFlex>
                </SystemBoxButton>

                <SystemBoxButton>
                    <SystemFlex align="center" justify="center">
                        <Icon name="material-symbols:chat-add-on" size="2rem"></Icon>
                    </SystemFlex>
                </SystemBoxButton>
            </SystemFlex>
        </SystemFlex>
    </SystemPopup>
</template>

<style scoped lang="scss">
.popup {
    padding: 1rem;
    
    background-color: var(--background);
}
</style>