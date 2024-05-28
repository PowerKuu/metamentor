import en from "./locales/en"
//import no from "./locales/no"

export type LocaleDataBlueprint = typeof en

type Locale = {
    codes: string[],
    data: LocaleDataBlueprint
}

type LocaleKey = keyof typeof locales


const locales = {
    "en": {
        data: en,
        codes: ["en"]
    } as Locale,

    "no": {
        data: en,
        codes: ["no", "nb", "nn"]
    } as Locale
}

const defaultLocaleKey: LocaleKey = "en"

export function findLocaleKey(code: string): LocaleKey {
    for (const [key, value] of Object.entries(locales)) {
        if (value.codes.includes(code)) return key as LocaleKey
    }

    return defaultLocaleKey
}


export function useLocale() {
    const lang = useJsonStorage<LocaleKey>("lang", defaultLocaleKey)

    detectLocaleKey().then((key) => {
        const manual = useJsonStorage<boolean>("manualLang", false)
        if (manual.value) return

        lang.value = key
    })

    return computed<LocaleDataBlueprint>(() => locales[lang.value].data)
}

export async function detectLocaleKey() {
    return new Promise<LocaleKey>((resolve) => {
        onMounted(() => {
            const lang = navigator.language.split("-")[0]

            if (!lang) return resolve(defaultLocaleKey)

            resolve(findLocaleKey(lang.toLowerCase()))
        })
    })
}