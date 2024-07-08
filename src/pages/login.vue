<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const email = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

function login() {
    console.log("Login")
}
</script>

<template>
    <SystemFlex direction="column">
        <SystemH3>Login</SystemH3>
    </SystemFlex>

    <SystemFlex direction="column" gap="1rem">
        <SystemNamed name="Email">
            <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
        </SystemNamed>
    </SystemFlex>

    <SystemFlex direction="column" gap="0.25rem">
        <SystemButton @click="login">Next</SystemButton>

        <SystemFlex direction="column" gap="0.5rem">
            <SystemP class="text-bold" :style="{
                color: statusMessageColor,
                visibility: statusMessage ? 'visible' : 'hidden'
            }">{{ statusMessage || "-" }}</SystemP>

            <NuxtLink to="/auth/requestPasswordReset">
                <SystemPSmall class="text-underline pointer">Forgot password?</SystemPSmall>
            </NuxtLink>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">

</style>