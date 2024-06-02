<script setup lang="ts">
const props = defineProps<{
    open: boolean
    newModel: boolean
}>()

const openModel = useModel(props, "open")

const modelIcon = ref(null)
</script>

<template>
    <SystemPopupStandard :heading="newModel ? `New model` : `Edit model`" subheading="Create your own model with the settings below" v-model:open="openModel">
        <SystemFlex class="edit-popup" gap="0.5rem" direction="column">
            <SystemNamed name="Icon">
                <SystemFlex class="border" align="center" justify="center">
                    <SystemSlickAvatar :size="225" v-model="modelIcon" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
                    <SystemIconButton 
                        @click="modelIcon = null" 
                        icon="material-symbols:refresh-rounded"
                        color="var(--background)"
                        background="var(--secondary)"
                        :defaultHover="false"
                    ></SystemIconButton>
                </SystemFlex>
            </SystemNamed>
            
            <SystemNamed name="Name" tooltip="The name of the model">
                <SystemInput value=""></SystemInput>
            </SystemNamed>
            <SystemNamed name="Description (Optional)" tooltip="Describe what the model does and how it acts">
                <SystemTextarea value=""></SystemTextarea>
            </SystemNamed>
            <SystemNamed name="Model" class="model">
                <SystemTextarea value="" class="model-input"></SystemTextarea>
            </SystemNamed>

            <SystemFlex>
                <SystemButton>{{ newModel ? "Create" : "Save" }}</SystemButton>
            </SystemFlex>
        </SystemFlex>
</SystemPopupStandard>
</template>

<style scoped lang="scss">
.edit-popup {
    width: 40rem;
    height: 80vh;

    .model {
        flex: 1;
        .model-input {
            flex: 1;
        }
    }
}
</style>