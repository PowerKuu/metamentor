<script setup lang="ts">
import type { Chat } from '@prisma/client'
import type { PersonProp, Widget  } from '@/components/system/SlickAvatar.vue'

definePageMeta({
    layout: "navigation"
})

const chats = ref<Chat[]>([])

const resizeElem = ref(null)
const { height: resizeHeight } = useElementBounding(resizeElem)
const { height: windowHeight } = useWindowSize()

const resizeHeightOptions = computed(() => {
    console.log(windowHeight.value)
    return {
        min: 200,
        max: Math.max(windowHeight.value / 2, 500),
        initial: Math.max(windowHeight.value / 3, 300)
    }
})

const modelAudio: HTMLAudioElement = new Audio()

const activeAvatar = ref<PersonProp>(null)
let lastMouth: Widget<"mouth"> | null = null


function openMouth() {
    if (!activeAvatar.value) return

    lastMouth = activeAvatar.value.mouth.widget
    activeAvatar.value.mouth.widget = "surprised"

    test().then(() => {
        closeMouth()
    })
}

function closeMouth() {
    if (!activeAvatar.value || !lastMouth) return

    activeAvatar.value.mouth.widget = lastMouth
}

chats.value.push({
    id: "d",
    name: "Chat 1",
    updatedAt: new Date(),
    createdAt: new Date(),
    
    userId: "1",
})

chats.value.push({
    id: "e",
    name: "Chat 2",
    updatedAt: new Date(),
    createdAt: new Date(),
    
    userId: "1"
})


async function test() {
    modelAudio.src = "/test.mp3"

    modelAudio.play()

    return new Promise<void>((resolve) => {
        modelAudio.onended = () => {
            resolve()
        }
    })
}
</script>

<template>
    <SystemFlex grow="1" gap="1rem" class="wrapper">
        <SystemFlex gap="1rem" direction="column" class="sidebar border">
            <SystemFlex gap="0.5rem" direction="column">
                <SystemInput value="" placeholder="Search">
                    <template #icon>
                        <Icon color="var(--weak-text)" name="material-symbols:search-rounded" size="1.25rem"></Icon>
                    </template>
                </SystemInput>

                <SystemFlex gap="0.5rem" direction="column">
                    <ChatListItem v-for="chat in chats" :key="chat.id" :chat="chat" />
                </SystemFlex>
            </SystemFlex>


            <SystemButton class="seperator"justify="space-between" icon="material-symbols:chat-add-on">
                New chat
            </SystemButton>
        </SystemFlex>

        <SystemFlex direction="column" class="border chat" grow="1">
            <SystemFlex grow="1" direction="column">
                <SystemResizable handleSize="2rem" ref="resizeElem" class="model-resize" :height="resizeHeightOptions">
                    <SystemFlex direction="column" align="center" class="model">
                        <SystemSlickAvatar class="avatar":size="resizeHeight" v-model="activeAvatar"></SystemSlickAvatar>

                        <KeepAlive>
                            <AudioVisualizerBar :audio="modelAudio"></AudioVisualizerBar>
                        </KeepAlive>
                    </SystemFlex>
                </SystemResizable>

                <SystemHDragbar class="dragbar"></SystemHDragbar>
            </SystemFlex>


            <SystemFlex>
                <SystemButton @click="openMouth">
                    Test
                </SystemButton>
            </SystemFlex grow="1">
        </SystemFlex>
    </SystemFlex>
</template>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    padding: 0.5rem;

    .seperator {
        margin-top: auto;
    }
}

.wrapper {
    height: 85vh;
    min-height: 30rem;
}


.chat {
    flex: 1;
    height: 100%;

    .model-resize {
        width: 100% !important;
    }

    .dragbar {
        z-index: 5;
    }

    .model {
        .avatar {
            position: absolute;
            z-index: 4;
        }
    }
}
</style>