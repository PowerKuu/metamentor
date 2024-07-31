<script setup lang="ts">
const props = defineProps<{
    open: boolean
    name: string

}>()

const emit = defineEmits<{
    (e: "save"): void
}>()

const openModel = useModel(props, "open")
const nameModel = useModel(props, "name")

const disableSave = computed(() => !nameModel.value)
</script>

<template>
    <SystemPopupStandard maxWidth="37rem" heading="New chat" subheading="Enter a name to create a new chat" v-model:open="openModel">
        <SystemFlex class="model-selector" gap="0.5rem" direction="column">
            <SystemNamed name="Name">
                <SystemInput placeholder="My chat" v-model:value="nameModel"></SystemInput>
            </SystemNamed>
        
            <SystemButton
                class="button"
                :disabled="disableSave"
                @click="() => {
                    if (!disableSave) {
                        openModel = false
                        $emit(`save`)
                    }
                }"
            >New chat</SystemButton>
        </SystemFlex>
    </SystemPopupStandard>
</template>

<style scoped lang="scss">
.model-selector {
    min-width: 23rem;
}

.button {
    align-self: flex-end;
}
</style>