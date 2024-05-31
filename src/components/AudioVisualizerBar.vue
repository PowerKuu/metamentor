<script setup lang="ts">
import AudioMotionAnalyzer from "audiomotion-analyzer"

const props = defineProps<{
    audio: HTMLAudioElement
}>()

const visualizer = ref<HTMLElement | null>(null)


onMounted(() => {
    if (!visualizer.value) return

    const audioMotionAnalyzer = new AudioMotionAnalyzer(visualizer.value, {
        source: props.audio,        
        showScaleX: false
    })

    function getCSSVariable(variable: string) {
        return getComputedStyle(document.body).getPropertyValue(variable)
    }

    const colorFrom = getCSSVariable('--weak-primary')
    const colorTo = getCSSVariable('--primary')

    
    audioMotionAnalyzer.registerGradient("gradient", {
        bgColor: '#ffffff',
        colorStops: [       // list your gradient colors in this array (at least one color is required)
        colorFrom,        // colors can be defined in any valid CSS format
            { color: colorFrom, pos: .6 }, // in an object, use `pos` to adjust the offset (0 to 1) of a colorStop
            { color: colorTo, level: .5 }  // use `level` to set the max bar amplitude (0 to 1) to use this color
        ]
    })

    audioMotionAnalyzer.gradient = "gradient"
})
</script>

<template>
    <SystemFlex class="visualizer-wrapper">
        <div ref="visualizer" class="visualizer"></div>
    </SystemFlex>
</template>

<style scoped lang="scss">
.visualizer-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .visualizer {
        position: absolute;
        width: 100%;
        height: 100%;

        bottom: 0;
    }
}
</style>

<style>
.visualizer canvas {
    max-height: 100%;
    min-width: 100%;
}
</style>