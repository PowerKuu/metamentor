<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const route = useRoute()

const email = route.query.email as string

const statusMessage = ref("")
const statusMessageColor = ref("")

const emailCode = ref("")

const user = useAuth()

watch(user, () => {
    if (user.value) navigateTo("/chat")
})

if (!email) {
    useRouter().go(-1)
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

    login(response.token)
    navigateTo("/chat")
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
                        • <a target="_blank" class="text-underline" href="https://mail.google.com/">Gmail.com</a>
                    </SystemHighlight>
                </SystemP>
                <SystemP>
                    <SystemHighlight>
                        • <a target="_blank" class="text-underline" href="https://outlook.live.com/">Outlook.com</a>
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

                <SystemPSmall class="text-underline text-weak pointer" @click="$router.go(-1)">< Go back</SystemPSmall>
            </SystemFlex>
        </SystemFlex>
    </SystemBox>
</template>

<style scoped lang="scss">
.box {
    width: 22rem;
}
</style>