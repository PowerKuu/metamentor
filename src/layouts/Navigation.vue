<script setup lang="ts">
const locale = useLocale()

const dropdownOpen = ref(false)


function login() {
    dropdownOpen.value = false
    navigateTo("/auth/login")
}

function logout() {
    dropdownOpen.value = false
    navigateTo("/logout")
}

function settings() {
    dropdownOpen.value = false
    navigateTo("/settings")
}
</script>

<template>
    <SystemTopNav>
        <template #left>
            <NuxtLink href="/">
                <SystemFlex gap="0.5rem" align="center">
                    <SystemP class="name">
                        {{ locale.name }}
                    </SystemP>

                    <Icon color="var(--primary)" name="streamline:artificial-intelligence-spark-solid" size="1.5rem"></Icon>
                </SystemFlex>
            </NuxtLink>
        </template>

        <template #right>
            <SystemFlex align="center" gap="1.5rem">
                <NuxtLink href="/contact">
                    <SystemP>
                        Contact
                    </SystemP>
                </NuxtLink>

                <NuxtLink href="/contact">
                    <SystemP>
                        About
                    </SystemP>
                </NuxtLink>

                <NuxtLink href="/plans">
                    <SystemP>
                        Plans
                    </SystemP>
                </NuxtLink>

                <NuxtLink href="/chat">
                    <SystemP>
                        Chat
                    </SystemP>
                </NuxtLink>
                
                <SystemFlex align="center" gap="0.5rem">
                    <NuxtLink v-if="false" href="/chat">
                        <SystemButton gap="0.5rem" icon="material-symbols:chat-paste-go">
                            Chat
                        </SystemButton>
                    </NuxtLink>
                    <SystemDropdown :preferRight="false" v-model:open="dropdownOpen">
                        <SystemUserIcon></SystemUserIcon>

                        <template #content>
                            <SystemFlex direction="column">
                                <SystemDropdownOption 
                                    icon="material-symbols:settings-rounded" 
                                    @click="settings"
                                >
                                    Settings
                                </SystemDropdownOption>
                                <SystemDropdownOption 
                                    icon="material-symbols:login-rounded" 
                                    @click="login"
                                >
                                    Login
                                </SystemDropdownOption>
                                <SystemDropdownOption 
                                    icon="material-symbols:logout-rounded"
                                    :delete="true"
                                    @click="logout"
                                >
                                    Logout
                                </SystemDropdownOption>
                            </SystemFlex>
                        </template>
                    </SystemDropdown>
                </SystemFlex>
            </SystemFlex>
        </template>
    </SystemTopNav>

    <SystemFlex class="wrapper">
        <slot></slot>
    </SystemFlex>
</template>

<style scoped lang="scss">
.wrapper {
    padding: 0 var(--page-padding);
    padding-bottom: 0;
}

.name {
    font-weight: 600;
    color: var(--primary);
}
</style>