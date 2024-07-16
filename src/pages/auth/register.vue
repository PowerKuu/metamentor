<script setup lang="ts">
definePageMeta({
    layout: "static-popup"
})

const email = ref("")
const username = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

const user = useAuth()

watch(user, () => {
    if (user.value) navigateTo("/chat")
})


async function sendVerify() {
    statusMessageColor.value = "var(--text)"
    statusMessage.value = "Sending email..."

    const response = await serverFunction("requestVerification", email.value, {
        username: username.value
    })

    if (isServerError(response)) {
        statusMessageColor.value = "var(--error)"

        if (response == 409) {
            statusMessage.value = "Email already in use. Please try again."
            return
        }

        statusMessage.value = "Failed to send email. Please try again."
        return
    }

    navigateTo({
        "path": "/auth/verify",
        "query": {
            "email": email.value,
            "ref": "/auth/register"
        }
    })
}
</script>

<template>
    <SystemBox class="box">
        <SystemFlex direction="column">
            <SystemH3>
                Register
            </SystemH3>
            <SystemPSmall class="text-weak">
                Enter your email and username to register. 
                <NuxtLink to="/auth/login" class="text-underline pointer">or login</NuxtLink>.
            </SystemPSmall>
        </SystemFlex>

        <SystemFlex direction="column" gap="0.5rem">
            <SystemNamed name="Email">
                <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
            </SystemNamed>

            <SystemNamed name="Username">
                <SystemInput v-model:value="username" name="username" label="username" placeholder="Joe" />
            </SystemNamed>
        </SystemFlex>

        <SystemFlex direction="column" gap="0.25rem">
            <SystemButton @click="sendVerify" icon="material-symbols:arrow-right-alt-rounded">Next</SystemButton>



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