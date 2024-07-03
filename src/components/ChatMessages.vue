<script setup lang="ts">
</script>

<template>
    <SystemFlex grow="1" class="messages" direction="column" gap="0.5rem">
        <ChatMessage :sent="false"></ChatMessage>
        <ChatMessage :sent="false"></ChatMessage>

        <ChatMessage :sent="true"></ChatMessage>

        
    </SystemFlex>
</template>

<style scoped lang="scss">
.messages {
    max-height: 100%;
    overflow-y: scroll;
    padding: 0.5rem;
}
</style>