<script setup lang="ts">
definePageMeta({
    layout: "static-popup",

})

const email = ref("")

const statusMessage = ref("")
const statusMessageColor = ref("")

const emailSent = ref(false)
const emailCode = ref("")

async function sendVerify() {
    statusMessage.value = "Sending email..."

    setTimeout(() => {
        emailSent.value = true
        statusMessage.value = "Check your email!"
    }, 1000)
}

async function verify() {
    statusMessage.value = "Verifying email..."


}

function goBack() {
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
            <SystemH3>{{ emailSent ? `Verify email` : `Login` }}</SystemH3>
            <SystemPSmall class="text-weak">
                {{ emailSent ? `Enter the code sent to your email` : `This form can also register a new account` }}
            </SystemPSmall>
        </SystemFlex>

        <SystemFlex direction="column" gap="0.5rem" v-if="emailSent">
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


        <SystemNamed name="Email" v-else>
            <SystemInput v-model:value="email" type="email" name="email" label="email" placeholder="example@example.com" />
        </SystemNamed>

        <SystemFlex direction="column" gap="0.25rem">
            <SystemButton v-if="emailSent" @click="verify" icon="material-symbols:arrow-right-alt-rounded">Verify</SystemButton>
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