<script setup lang="ts">
import type { Model } from "@prisma/client"

const props = defineProps<{
    model: NormalizePartial<Model>

    open: boolean
}>()

const modelModel = useModel(props, "model")

const emit = defineEmits<{
    (e: "save"): void
}>()

const openModel = useModel(props, "open")

const disableSave = computed(() => !modelModel.value.name || !modelModel.value.system)
const newModel = computed(() => !modelModel.value.id)
</script>

<template>
    <SystemPopupStandard v-model:open="openModel" :zIndex="105" :heading="newModel ? `New model` : `Edit model`" subheading="Create your own model with the settings below">
        <SystemFlex class="edit-popup" gap="0.5rem" direction="column">
            <SystemNamed tooltip="Icon to differentiate the model" name="Icon">
                <SystemFlex class="border" align="center" justify="center">
                    <SystemSlickAvatar :size="225" v-model:avatarString="modelModel.avatar" color="var(--text)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
                    <SystemIconButton
                        @click="modelModel.avatar = undefined" 
                        icon="material-symbols:refresh-rounded"
                        color="var(--background)"
                        background="var(--primary)"
                        :defaultHover="false"
                    ></SystemIconButton>
                </SystemFlex>
            </SystemNamed>
            
            <SystemNamed name="Name" tooltip="Name to differentiate the model">
                <SystemInput placeholder="Jhon Doe" v-model:value="modelModel.name"></SystemInput>
            </SystemNamed>

            <SystemNamed name="Description (Optional)" tooltip="Describe what the model does and how it acts">
                <SystemTextarea placeholder="A sample model" v-model:value="modelModel.description"></SystemTextarea>
            </SystemNamed>

            <SystemNamed name="Model" tooltip="Tell the model how it should act" class="model">
                <SystemTextarea placeholder='Answer any question asked with: "I am a sample model"' v-model:value="modelModel.system" class="model-input"></SystemTextarea>
            </SystemNamed>

            <SystemFlex align="center" justify="space-between">
                <SystemIconButton 
                    icon="material-symbols:upload"
                ></SystemIconButton>
                <SystemButton :disabled="disableSave" @click="() => {
                    if (!disableSave) {
                        openModel = false
                        $emit(`save`)
                    }
                }">{{ newModel ? "Create" : "Save" }}</SystemButton>
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