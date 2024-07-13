<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const email = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

async function sendVerify() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = "Sending email..."

    const response = await serverFunction("requestVerification", email.value)

    if (isServerError(response)) {
        statusMessage.value = "Failed to send email. Please try again."
        statusMessageColor.value = "var(--error)"
        return
    }

    navigateTo({
        "path": "/auth/verify",
        "query": {
            "email": email.value,
            "ref": "/login"
        }
    })
}

function goBack() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = ""

    navigateTo("/")
}
</script>

<template>
    <SystemBox class="box">
        <SystemFlex direction="column">
            <SystemH3>
                Login
            </SystemH3>
            <SystemPSmall class="text-weak">
                Enter your email to login 
                <NuxtLink to="/auth/register" class="text-underline pointer">or register</NuxtLink>.
            </SystemPSmall>
        </SystemFlex>

        <SystemNamed name="Email">
            <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
        </SystemNamed>

        <SystemFlex direction="column" gap="0.25rem">
            <SystemButton @click="sendVerify" icon="material-symbols:arrow-right-alt-rounded">Next</SystemButton>



            <SystemFlex direction="column" gap="0.5rem">
                <SystemP class="text-bold" :style="{
                    color: statusMessageColor,
                    visibility: statusMessage ? 'visible' : 'hidden'
                }">{{ statusMessage || "-" }}</SystemP>

                <SystemPSmall class="text-underline text-weak pointer" @click="goBack">< Go back</SystemPSmall>
            </SystemFlex>
        </SystemFlex>
    </SystemBox>
</template>

<style scoped lang="scss">
.box {
    width: 22rem;
}
</style>