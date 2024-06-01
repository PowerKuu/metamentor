<script setup lang="ts">
defineProps<{
    sent: boolean
}>()

const avatar = ref(null)
</script>

<template>
    <SystemFlex class="chat-message" :direction="sent ? `row-reverse` : `row`" align="end">
        <SystemSlickAvatar :size="60" class="avatar" v-model="avatar" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]"></SystemSlickAvatar>

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
        max-width: 50%;
        padding: 0.5rem;
        
        background-color: var(--background);

        border-radius: var(--border-radius);
    }
}
</style>