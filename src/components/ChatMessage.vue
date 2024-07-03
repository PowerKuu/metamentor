<script setup lang="ts">
defineProps<{
    sent: boolean
    sentIcon?: string
}>()

const avatar = ref(null)
</script>

<template>
    <SystemFlex class="chat-message" :data-sent="sent" :direction="sent ? `row-reverse` : `row`" align="end" :gap="sent ? `0.25rem` : `0`">
        <SystemSlickAvatar v-if="!sent" :size="60" class="avatar" v-model="avatar" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>
        <SystemUserIcon v-else :url="sentIcon" background="var(--neutral)"></SystemUserIcon>

        <SystemFlex class="message" direction="column" gap="0.5rem">
            <SystemPBold class="text">You</SystemPBold>

            <SystemP class="text">Hello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfjHello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfjHello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfjHello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfjHello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfjHello world wfwwlkfwfwlfwjklwfjwlkwj wlkfjwflkwjflwkfjwlk wjwlkfj</SystemP>
            <SystemPSmall class="time weak-text">12:00</SystemPSmall>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.chat-message {
    .message {
        max-width: 70%;
        padding: 0.5rem;
        
        background-color: var(--neutral);

        border-radius: var(--border-radius);
    }

    &[data-sent="true"] {
        .message {
            border-bottom-right-radius: 0;
        }
    }

    &[data-sent="false"] {
        .message {
            border-bottom-left-radius: 0;
        }
    }
}
</style>