<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const email = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

const emailSent = ref(false)
const emailCode = ref("")

function login() {
    console.log("Login")


    emailSent.value = true
}

function goBack() {
    if (emailSent.value) {
        emailSent.value = false
        return
    }

    navigateTo("/")
}
</script>

<template>
    <SystemFlex direction="column">
        <SystemH3>Login</SystemH3>
        <SystemPSmall class="text-weak">An account will be created if non exisng</SystemPSmall>
    </SystemFlex>

    <SystemFlex direction="column" gap="0.5rem">
        <SystemNamed name="Email" v-if="!emailSent">
            <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
        </SystemNamed>

        <SystemNamed name="Email code" v-if="emailSent">
            <SystemInput v-model:value="emailCode" placeholder="054954" />
        </SystemNamed>
    </SystemFlex>

    <SystemFlex direction="column" gap="0.25rem">
        <SystemButton @click="login" icon="material-symbols:arrow-right-alt-rounded">Next</SystemButton>

        <SystemFlex direction="column" gap="0.5rem">
            <SystemP class="text-bold" :style="{
                color: statusMessageColor,
                visibility: statusMessage ? 'visible' : 'hidden'
            }">{{ statusMessage || "-" }}</SystemP>

            <SystemPSmall class="text-underline text-weak pointer" @click="goBack">< Go back</SystemPSmall>
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">

</style>