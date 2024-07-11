<script setup lang="ts">
definePageMeta({
    layout: "static-popup",

})

const email = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

const emailSent = ref(false)
const emailCode = ref("")

const register = ref(false)
const username = ref("")

let token = ""

async function sendVerify() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = "Sending email..."

    const response = await serverFunction("requestLogin", email.value)

    if (isServerError(response)) {
        statusMessage.value = "Failed to send email. Please try again."
        statusMessageColor.value = "var(--error)"
        return
    }

    emailSent.value = true
    statusMessage.value = "Check your email!"
}

async function verify() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = "Verifying email..."

    const response = await serverFunction("verifyLogin", email.value, emailCode.value)

    if (isServerError(response)) {
        statusMessage.value = "Failed to verify email. Please try again."
        statusMessageColor.value = "var(--error)"
        return
    }

    token = response.token

    if (!response.registered) {
        statusMessage.value = ""

        emailSent.value = false
        register.value = true
        statusMessage.value = "Email verified! Register a username."
        return
    }
}

function done() {

}

function goBack() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = ""

    if (emailSent.value) {
        emailSent.value = false
        return
    }

    navigateTo("/")
}
</script>

<template>
    <SystemBox class="box">
        <SystemFlex direction="column">
            <SystemH3>
                {{ emailSent ? `Verify email` : register ? `Register` : `Login` }}
            </SystemH3>
            <SystemPSmall class="text-weak">
                {{ emailSent ? `Enter the code sent to your email` : register ? `Register a new account` : `This form can also register a new account` }}
            </SystemPSmall>
        </SystemFlex>

        <SystemFlex v-if="emailSent" direction="column" gap="0.5rem">
            <SystemNamed name="Email code">
                <SystemInput v-model:value="emailCode" placeholder="054954" />
            </SystemNamed>

            <SystemFlex direction="column" gap="0.25rem">
                <SystemP>
                    <SystemHighlight>
                        • <NuxtLink target="_blank" class="text-underline" href="https://mail.google.com/">Gmail.com</NuxtLink>
                    </SystemHighlight>
                </SystemP>
                <SystemP>
                    <SystemHighlight>
                        • <NuxtLink target="_blank" class="text-underline" href="https://outlook.live.com/">Outlook.com</NuxtLink>
                    </SystemHighlight>
                </SystemP>
            </SystemFlex>
        </SystemFlex>

        <SystemFlex v-else-if="register" direction="column" gap="0.5rem">
            <SystemNamed name="Username">
                <SystemInput v-model:value="username" placeholder="Joe87" />
            </SystemNamed>
        </SystemFlex>


        <SystemNamed v-else name="Email">
            <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
        </SystemNamed>

        <SystemFlex direction="column" gap="0.25rem">
            <SystemButton v-if="emailSent" @click="verify" icon="material-symbols:arrow-right-alt-rounded">Verify</SystemButton>
            <SystemButton v-else-if="register" @click="sendVerify" icon="material-symbols:arrow-right-alt-rounded">Register</SystemButton>
            <SystemButton v-else @click="sendVerify" icon="material-symbols:arrow-right-alt-rounded">Next</SystemButton>



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