<script setup lang="ts">
    import type { Chat } from '@prisma/client'
import type { PersonProp, Widget  } from '@/components/system/SlickAvatar.vue'

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

// Mock data
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
    <SystemFlex direction="column" class="border chat" grow="1">
        <SystemFlex direction="column">
            <SystemResizable handleSize="2rem" ref="resizeElem" class="model-resize" :height="resizeHeightOptions">
                <SystemFlex direction="column" align="center" class="model">
                    <SystemSlickAvatar class="avatar" color="var(--secondary)" :randomBlacklist="[`surprised`, `fonze`]" :size="resizeHeight" v-model="activeAvatar"></SystemSlickAvatar>

                    <KeepAlive>
                        <AudioVisualizerBar :audio="modelAudio"></AudioVisualizerBar>
                    </KeepAlive>
                </SystemFlex>
            </SystemResizable>

            <SystemHDragbar class="dragbar"></SystemHDragbar>
        </SystemFlex>

        <Chat @send="openMouth"></Chat>
    </SystemFlex>
</template>

<style scoped lang="scss">
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