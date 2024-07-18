<script setup lang="ts">
import type { Chat } from '@prisma/client'
import type { Widget, Avatar  } from '@/components/system/SlickAvatar.vue'

const resizeElem = ref(null)

const { height: resizeHeight } = useElementBounding(resizeElem)
const { height: windowHeight } = useWindowSize()

const resizeHeightOptions = computed(() => {
    return {
        min: 125,
        max: Math.max(windowHeight.value / 2, 500),
        initial: Math.max(windowHeight.value / 4, 200)
    }
})

let modelAudio: HTMLAudioElement | null = null

const activeAvatar = ref<Avatar>()
let lastMouth: Widget<"mouth"> | null = null


function openMouth() {
    if (!activeAvatar.value) return

    test().then(() => {
        closeMouth()
    })

    if (activeAvatar.value.mouth.widget === "surprised") return

    lastMouth = activeAvatar.value.mouth.widget
    activeAvatar.value.mouth.widget = "surprised"
}

function closeMouth() {
    if (!activeAvatar.value || !lastMouth) return

    activeAvatar.value.mouth.widget = lastMouth
}

// Mock data
async function test() {
    if (!modelAudio) return

    modelAudio.src = "/test.mp3"

    modelAudio.play()

    return new Promise<void>((resolve) => {
        if (!modelAudio) return

        modelAudio.onended = () => {
            resolve()
        }
    })
}

onMounted(() => {
    modelAudio = new Audio()
})
</script>

<template>
    <SystemFlex direction="column" class="chat-dashboard" grow="1">
        <SystemFlex direction="column">
            <ClientOnly>
                <SystemResizable v-if="true" handleSize="2rem" ref="resizeElem" class="model-resize" :height="resizeHeightOptions">
                    <SystemFlex direction="column" align="center" class="model">
                        <SystemSlickAvatar class="avatar" color="var(--text)" :randomBlacklist="[`surprised`, `fonze`]" :size="resizeHeight" v-model:avatar="activeAvatar"></SystemSlickAvatar>

                        <KeepAlive>
                            <ClientOnly>
                                <AudioVisualizerBar v-if="modelAudio" :audio="modelAudio"></AudioVisualizerBar>
                            </ClientOnly>
                        </KeepAlive>
                    </SystemFlex>
                </SystemResizable>
            </ClientOnly>

            <SystemHDragbar class="dragbar"></SystemHDragbar>
        </SystemFlex>

        <ChatMessages></ChatMessages>

        <ChatInputBar @send="openMouth"></ChatInputBar>
    </SystemFlex>
</template>

<style scoped lang="scss">
.chat-dashboard {
    height: 100%;
    max-height: 100%;

    .model-resize {
        width: 100% !important;
        background-color: var(--background);
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