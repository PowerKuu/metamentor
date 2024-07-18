<script setup lang="ts">
import AudioMotionAnalyzer from "audiomotion-analyzer"

const props = defineProps<{
    audio: HTMLAudioElement
}>()

const visualizer = ref<HTMLElement | null>(null)


let audioMotionAnalyzer: AudioMotionAnalyzer | null = null

onMounted(() => {
    if (!visualizer.value) return

    audioMotionAnalyzer = new AudioMotionAnalyzer(visualizer.value, {
        mode: 2,
        //lumiBars: true,
        source: props.audio,
        showScaleX: false,
        showPeaks: false,
        alphaBars: true,
        barSpace: 0.1,

        minDecibels: -120,
        maxDecibels: -35,

        "ansiBands": false,
        "bgAlpha": 0.7,
        "channelLayout": "single",
        "colorMode": "bar-level",
        "fadePeaks": false,
        "fftSize": 8192,
        "fillAlpha": 0.25,
        "frequencyScale": "log",
        "gravity": 3.8,
        "ledBars": false,
        "linearAmplitude": true,
        "linearBoost": 1.6,
        "lineWidth": 1.5,
        "loRes": false,
        "lumiBars": false,
        "maxFPS": 0,
        "maxFreq": 16000,
        "minFreq": 30,
        "mirror": 0,
        "noteLabels": false,
        "overlay": false,
        "peakFadeTime": 750,
        "peakHoldTime": 500,
        "peakLine": false,
        "radial": false,
        "radialInvert": false,
        "radius": 0.3,
        "reflexAlpha": 1,
        "reflexBright": 1,
        "reflexFit": true,
        "reflexRatio": 0.5,
        "roundBars": true,
        "showBgColor": true,
        "showFPS": false,
        "showScaleY": false,
        "smoothing": 0.7,
        "spinSpeed": 0,
        "splitGradient": false,
        "trueLeds": true,
        "useCanvas": true,
        "volume": 1,
        "weightingFilter": "D"
    })

    function getCSSVariable(variable: string) {
        return getComputedStyle(document.body).getPropertyValue(variable)
    }

    const color = getCSSVariable('--primary')
    const backgroundColor = getCSSVariable('--background')

    
    audioMotionAnalyzer.registerGradient("gradient", {
        bgColor: backgroundColor,
        colorStops: [
            { color: color, level: .0 },  // use `level` to set the max bar amplitude (0 to 1) to use this color
        ]
    })

    audioMotionAnalyzer.gradient = "gradient"
})

onUnmounted(() => {
    if (audioMotionAnalyzer) {
        audioMotionAnalyzer.destroy()
    }
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