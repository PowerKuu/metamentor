<script setup lang="ts">
const input = ref("")

const hasInput = computed(() => !!input.value)

const emit = defineEmits<{
    (e: "send", value: string): void
}>()

const openDeleteModelPopup = ref(false)
</script>

<template>
    <PopupConfirm heading="Reset chat" subheading="Select one of the buttons below to confirm" v-model:open="openDeleteModelPopup">
        <SystemP>Are you sure you want to reset this chat?</SystemP>
        <SystemP>Everyone's chat history will be <SystemPBold>permently deleted</SystemPBold>.</SystemP>
    </PopupConfirm>

    <SystemFlex grow="1" class="chat-wrapper" direction="column">
        <SystemFlex class="chat" justify="end" grow="1">
            <SystemFlex class="reset-button-wrapper" justify="end">

            </SystemFlex>
            
            <SystemFlex direction="column" grow="1" gap="0.5rem">
                <SystemFlex class="messages" grow="1" direction="column" gap="0.5rem">
                    <ChatMessage :sent="true"></ChatMessage>
                    <ChatMessage :sent="false"></ChatMessage>
                </SystemFlex>

                <SystemFlex gap="0.5rem" class="chat-input" :data-has-input="hasInput">
                    <SystemInput class="input" v-model:value="input" placeholder="Type a message">
                        <template #icon>
                            <Icon color="var(--weak-text)" name="material-symbols:edit-rounded" size="1.25rem"></Icon>
                        </template>
                    </SystemInput>

                    <SystemIconButton 
                        :background="hasInput ? `var(--primary)` : undefined"
                        :border="hasInput ? `var(--primary)` : undefined"
                        :color="hasInput ? `var(--background)` : undefined"
                        :default-hover="false"
                        icon="material-symbols:send"
                        :disabled="!hasInput"

                        @click="() => { if (hasInput) emit(`send`, input) }"
                    >
                    </SystemIconButton>

                    <SystemIconButton icon="material-symbols:mic-rounded"></SystemIconButton>

                    <SystemIconButton
                        class="reset-button"
                        icon="material-symbols:refresh-rounded"

                        @click="() => openDeleteModelPopup = true"
                    ></SystemIconButton>
                </SystemFlex>
            </SystemFlex>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.chat-wrapper {
    overflow-y: auto;
}

.chat {
    .reset-button-wrapper {
        position: absolute;
        padding: 0.5rem;

        .reset-button {
            top: 0.5rem;
            right: 0;
            position: sticky;

            z-index: 4;
        }
    }

    .messages {
        padding: 0.5rem;
    }

    .chat-input {
        width: inherit;
        position: sticky;
        bottom: 0;
        padding: 0.5rem;
        width: 100%;

        background-color: var(--background);

        /* Fix small gap */
        outline: solid 1px var(--background);

        .input {
            width: 100%;
        }

        z-index: 2;
    }
}
</style>