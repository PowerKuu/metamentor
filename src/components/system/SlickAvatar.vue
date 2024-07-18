<script setup lang="ts">
import { Buffer } from "buffer"

// Place widgets in this folder(public) and name them as `widgetType/widgetName.svg`
const widgetsPath = "/slick-avatar"

const widgets = {
    face: ["base"],
    eyebrows: ["down", "eyelashesdown", "eyelashesup", "up"],
    
    glasses: ["round", "square"],

    mouth: ["frown", "laughing", "nervous", "pucker", "sad", "smile", "smirk", "surprised"],
    nose: ["curve", "pointed", "round"],
    top: ["beanie", "clean", "danny", "fonze", "funny", "pixie", "punk", "turban", "wave"],
    
    ears: ["attached", "detached"],
    earrings: ["hoop", "stud"],

    eyes: ["ellipse", "eyeshadow", "round", "smiling"],

    clothes: ["collared", "crew", "open"],
} as const

export type WidgetType = keyof typeof widgets
export type Widget<T extends WidgetType> = typeof widgets[T][number]

export type Avatar = {
    [K in WidgetType]: {
        color: string
        widget: Widget<K>
        disabled?: boolean
    }
}

const widgetType = Object.keys(widgets) as WidgetType[]
const widgetCache = new Map<string, string>()

const props = defineProps<{
    avatar?: Avatar
    avatarString?: string
    size: number
    randomBlacklist?: Widget<WidgetType>[]
    color?: string

    unknownAvatar?: boolean
}>()

const emit = defineEmits<{
    (e: "update:avatar", value: Avatar): void
    (e: "update:avatarString", value: string): void
}>()

const unknownRandomAvatar = computed(() => {
    if (!props.unknownAvatar) return
    return getRandomAvatar()
})

const currentAvatar = computed(() => {
    if (props.avatar) return props.avatar
    else if (props.avatarString) return avatarFromString(props.avatarString)
    else return unknownRandomAvatar.value
})

watchEffect(() => {
    if (!props.avatar && !props.avatarString) {
        const avatar = getRandomAvatar()
        emit("update:avatar", avatar)
        emit("update:avatarString", avatarToString(avatar))
    }

    if (props.avatarString && !props.avatar) {
        const avatar = avatarFromString(props.avatarString)

        if (avatar) emit("update:avatar", avatar)
    }

    if (props.avatar && !props.avatarString) {
        emit("update:avatarString", avatarToString(props.avatar))
    }
})


function avatarFromString(str: string): Avatar | null {
    let data: Avatar

    try {
        data = JSON.parse(Buffer.from(str, "base64").toString())
    } catch {
        return null
    }

    return data
}

function avatarToString(avatar: Avatar): string {
    return Buffer.from(JSON.stringify(avatar)).toString("base64")
}

async function getWidgetSVG<T extends WidgetType>(widgetType: T, widget: Widget<T>) {
    const path = `${widgetsPath}/${widgetType}/${widget}.svg?raw`

    if (widgetCache.has(path)) return widgetCache.get(path)

    const response = await fetch(path).catch(() => null)

    if (!response?.ok) throw new Error(`Failed to fetch ${path}`)

    const text = await response.text()

    widgetCache.set(path, text)

    return text
}

function randomItem<T extends ArrayLike<any>>(array: T): T[number] {
    return array[Math.floor(Math.random() * array.length)]
}

function getRandomWidget<T extends WidgetType>(widgetType: T): Widget<T> {
    return randomItem(widgets[widgetType].filter((widget) => !props.randomBlacklist?.includes(widget)))
}


function getRandomAvatar(): Avatar {
    const isBlackRace = randomItem([true, false, false] as const)
    const hasSpecialHair = randomItem([false, false, false, false, false, false, true] as const)
    const hasEarrings = randomItem([false, false, true] as const)
    const hasGlasses = randomItem([false, false, true] as const)
    const hasTop = randomItem([true, true, true, true, true, true, true, false] as const)

    const blackSkinColor = [
        "#D2B48C", // Tan
        "#F5CBA7", // Peach
        "#C68642", // Light Brown
        "#8D5524", // Medium Brown
        "#6B4423", // Dark Brown
        "#4A2511", // Deep Brown
    ]

    const whiteSkinColor = [
        "#FFDFC4", // Light Peach
        "#F0D5B1", // Light Beige
        "#F3C5A8", // Fair
        "#EAC086", // Pale
        "#D1B399", // Medium Beige
        "#C68642"  // Light Brown
    ]

    const blackHairColor = [
        "#D2B48C", // Tan
        "#F5CBA7", // Peach
        "#C68642", // Light Brown
        "#8D5524", // Medium Brown
        "#6B4423", // Dark Brown
        "#4A2511", // Deep Brown
        "#3B2F2F", // Dark Sienna
        "#231F20"  // Almost Black
    ]

    const whiteHairColor = [
        "#FAF0BE", // Lemon Chiffon
        "#D2B48C", // Tan
        "#FFB347", // Apricot
        "#FFD700", // Golden
        "#A52A2A", // Reddish Brown
        "#BC8F8F", // Rosy Brown
        "#DAA520", // Goldenrod
        "#8B4513", // Saddle Brown
        "#8B0000"  // Dark Red
    ]

    function randomColor() {
        return "#" + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")
    }
    
    const avatar: Avatar = Object.fromEntries(widgetType.map((widgetType) => {        
        let color = randomColor()
 
        return [[widgetType], {
            color: color,
            widget: getRandomWidget(widgetType)
        }]
    }))

    let skinColor = isBlackRace ? randomItem(blackSkinColor) : randomItem(whiteSkinColor)
    let hairColor = isBlackRace ? randomItem(blackHairColor) : randomItem(whiteHairColor)

    while (skinColor === hairColor) {
        hairColor = randomColor()
    }

    avatar.face.color = skinColor
    avatar.ears.color = skinColor

    if (!hasSpecialHair) {
        avatar.eyebrows.color = hairColor
        avatar.top.color = hairColor
    }

    avatar.earrings.disabled = !hasEarrings
    avatar.glasses.disabled = !hasGlasses
    avatar.top.disabled = !hasTop
    
    return avatar
}

async function getAvatarSVG(avatar: Avatar): Promise<Record<WidgetType, {
    color: string
    svg: string
}>> {
    const avatarSVG = await Promise.all(widgetType.map(async (widgetType) => {
        const avatarWidgetType = avatar[widgetType]

        const getSVG = () => getWidgetSVG(widgetType, avatarWidgetType.widget)

        const svg = [widgetType, {
            color: avatarWidgetType.color,
            svg: avatarWidgetType.disabled ? "" : await getSVG()
        }]

        return svg
    }))

    return Object.fromEntries(avatarSVG)
}


const svgContent = ref<string | null>(null)
const sizeCSS = computed<string>(() => props.size ? `${props.size}px` : "100px")

const avatarID = Math.random().toString(36)

watchEffect(async () => {
    // Use effect
    sizeCSS.value

    if (!currentAvatar.value) return

    const avatarWithSVG = await getAvatarSVG(currentAvatar.value)
    
    const svgRawList = Object.entries(avatarWithSVG).map(([widget, avatarWithSVG]) => {
        const svg = avatarWithSVG.svg
        const color = avatarWithSVG.color

        const content = svg
            .slice(svg.indexOf(">", svg.indexOf("<svg")) + 1)
            .replace("</svg>", "")
            .replace(/\$fillColor/g, color)
            .replace(/\$color/g, props.color || "black")
            // Replace all `url(#...)` with `url(#...${avatarID})`
            .replace(/url\(#(.*?)\)/g, `url(#$1-${avatarID})`)
            // Replace all `id="..."` with `id="...${avatarID}"`
            .replace(/id="(.*?)"/g, `id="$1-${avatarID}"`)

        return `
            <g id="vue-color-avatar-${avatarID}">
                ${content}
            </g>
        `
    })

    svgContent.value = `
        <svg
            width="${sizeCSS.value}"
            height="${sizeCSS.value}"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMax meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(100, 65)">
                ${svgRawList.join("")}
            </g>
        </svg>
    `
})
</script>

<template>
    <div
        ref="avatarRef"
        class="slick-avatar"
        :style="{
            minWidth: sizeCSS,
            minHeight: sizeCSS,
            maxWidth: sizeCSS,
            maxHeight: sizeCSS
        }"
    >
        <div class="avatar-payload" :data-unknown="unknownAvatar" v-html="svgContent" />
    </div>
</template>

<style scoped lang="scss">
.slick-avatar {
    position: relative;
    overflow: hidden;

    .avatar-payload {
        width: 100%;
        height: 100%;

        &[data-unknown="true"] {
            filter: grayscale(1) brightness(0.5);
        }
    }
}
</style>