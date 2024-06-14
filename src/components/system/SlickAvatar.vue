<script setup lang="ts">
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

type Person = {
    [K in WidgetType]: {
        color: string
        widget: Widget<K>
        disabled?: boolean
    }
}

export type PersonProp = Person | null

const widgetType = Object.keys(widgets) as WidgetType[]
const widgetCache = new Map<string, string>()

const props = defineProps<{
    modelValue: PersonProp
    size: number
    randomBlacklist?: Widget<WidgetType>[]
    color?: string
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: Person): void
}>()

watch(() => props.modelValue, (person) => {
    if (!person) {
        return emit("update:modelValue", getRandomPerson())
    }
}, { immediate: true })


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


function getRandomPerson(): Person {
    const isBlackRace = randomItem([true, false] as const)
    const hasSpecialHair = randomItem([false, false, false, false, false, false, true] as const)
    const hasEarrings = randomItem([false, false, true] as const)
    const hasGlasses = randomItem([false, false, true] as const)
    const hasTop = randomItem([true, true, true, true, false] as const)

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
    
    const person: Person = Object.fromEntries(widgetType.map((widgetType) => {        
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

    person.face.color = skinColor
    person.ears.color = skinColor

    console.log(hasSpecialHair)

    if (!hasSpecialHair) {
        person.eyebrows.color = hairColor
        person.top.color = hairColor
    }

    person.earrings.disabled = !hasEarrings
    person.glasses.disabled = !hasGlasses
    person.top.disabled = !hasTop

    return person
}

async function getPersonSVG(person: Person): Promise<Record<WidgetType, {
    color: string
    svg: string
}>> {
    const personSVG = await Promise.all(widgetType.map(async (widgetType) => {
        const personWidgetType = person[widgetType]

        const getSVG = () => getWidgetSVG(widgetType, personWidgetType.widget)

        const svg = [widgetType, {
            color: personWidgetType.color,
            svg: personWidgetType.disabled ? "" : await getSVG()
        }]

        return svg
    }))

    return Object.fromEntries(personSVG)
}


const svgContent = ref<string | null>(null)
const sizeCSS = computed<string>(() => props.size ? `${props.size}px` : "100px")

const avatarID = crypto.randomUUID()

watchEffect(async () => {
    // Use effect
    sizeCSS.value

    if (!props.modelValue) return null

    const personWithSVG = await getPersonSVG(props.modelValue)
    
    const svgRawList = Object.entries(personWithSVG).map(([widget, personWithSVG]) => {
        const svg = personWithSVG.svg
        const color = personWithSVG.color

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
        <div class="avatar-payload" v-html="svgContent" />
    </div>
</template>

<style scoped lang="scss">
.slick-avatar {
    position: relative;
    overflow: hidden;

    .avatar-payload {
        width: 100%;
        height: 100%;
    }
}
</style>