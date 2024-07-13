<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const route = useRoute()

const email = route.query.email as string
const back = route.query.ref as string

const statusMessage = ref("")
const statusMessageColor = ref("")

const emailCode = ref("")

const token = useCookie("token")

function goBack() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = ""

    if (back) {
        navigateTo(back)
    } else {
        navigateTo("/")
    }
}

if (!email) {
    goBack()
}

async function verify() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = "Verifying email..."

    const response = await serverFunction("verify", email, emailCode.value)

    if (isServerError(response)) {
        statusMessage.value = response == 404 ? "Test" : "Failed to verify email. Please try again."
        statusMessageColor.value = "var(--error)"
        return
    }

    token.value = response.token
}
</script>

<template>
    <SystemBox class="box">
        <SystemFlex direction="column">
            <SystemH3>
                Verify email
            </SystemH3>
            <SystemPSmall class="text-weak">
                Enter the code sent to your email
            </SystemPSmall>
        </SystemFlex>

        <SystemFlex direction="column" gap="0.5rem">
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

        <SystemFlex direction="column" gap="0.25rem">
            <SystemButton @click="verify" icon="material-symbols:arrow-right-alt-rounded">Verify</SystemButton>


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