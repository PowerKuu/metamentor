<script setup lang="ts">

const props = defineProps<{
    placeholder?: string
    value: string | number | undefined
    type?: "text" | "password" | "date" | "email"

    min?: number | string
    max?: number | string

    focus?: boolean

    preventValid?: boolean

    regex?: string

    name?: string
}>()

const emit = defineEmits<{
    (e: "update:value", value: string | number | undefined): void
    (e: "update:focus", value: boolean): void
    
    (e: "focusin"): void
    (e: "focusout"): void
    (e: "input"): void
}>()

const model = useModel(props, "value")
const focusModel = useModel(props, "focus")

const refElement = ref<HTMLInputElement | null>(null)

defineExpose({
    ref: refElement
})

const slots = useSlots()


watch(model, (newModel, oldModel) => {
    if (newModel == "" || newModel == undefined || !props.regex) return

    const numberModel = Number(newModel)
    const numberMin = Number(props.min)
    const numberMax = Number(props.max)
    

    if (!isNaN(numberModel)) {
        if (!isNaN(numberMin) && numberModel < numberMin) {
            model.value = oldModel
        }

        if (!isNaN(numberMax)  && numberModel > numberMax) {
            model.value = oldModel
        }
    }

    const regex = new RegExp(props.regex, "g")

    if (!regex.test(newModel.toString())) {
        model.value = oldModel
    }
})

function clickWrapper() {
    focusModel.value = true

    if (props.type == "date") {
        if (!refElement.value?.showPicker) console.warn("showPicker is not supported")

        refElement.value?.showPicker()
    }
}

function focusin() {
    emit("focusin")
    focusModel.value = true
}

function focusout() {
    emit("focusout")
    focusModel.value = false
}

onMounted(() => {
    watchEffect(() => {
        if (focusModel.value) {
            refElement.value?.focus()
        }
    })
})
</script>

<template>
    <SystemFlex class="input-wrapper" :data-has-value="!!model && preventValid != true" @click="clickWrapper">
        <SystemFlex v-if="slots.icon" class="icon" justify="center" align="center">
            <slot name="icon"></slot>
        </SystemFlex>

        <input 
            class="input"
            ref="refElement"

            @focusin="focusin"
            @focusout="focusout"
            @input="emit(`input`)"

            :data-has-icon="!!slots.icon"

            :name="name"
            :type="(type as any)"
            :min="min"
            :max="max"
            :placeholder="placeholder"
            v-model="model"
        />
    </SystemFlex>
</template> 

<style scoped lang="scss">
.input-wrapper {
    height: var(--normal-height);

    font-size: 1.125rem;
    color: var(--text);
    font-weight: 400;
    border: var(--border-width) solid var(--neutral);
    border-radius: var(--border-radius);
    background: var(--background);

    font-family: inherit;


    transition: 0.2s;

    outline: none;

    cursor: text;

    .input {
        padding: 0.5rem 1rem;

        width: 100%;
        height: 100%;

        border: none;
        background-color: transparent;

        font-family: inherit;
        font-size: inherit;
        color: inherit;
        font-weight: inherit;

        outline: none;

        &[data-has-icon="true"] {
            padding-left: 0.5rem;

            &:focus {
                padding-left: 1rem;
            }
        }

        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
            -webkit-background-clip: text;
            transition: background-color 5000s ease-in-out 0s;
            box-shadow: inset 0 0 20px 20px var(--secondary);
        }
    }

    .icon {
        min-height: 100%;
        max-height: 100%;


        padding-left: 0.5rem;
    }

    &:has(.input:focus) {
        outline: none;
        border-color: var(--primary);

        .icon {
            display: none;
        }
    }

    &[data-has-value="true"] {
        outline: none;

        .icon {
            display: none;
        }

        .input {
            padding-left: 1rem;
        }
    }
}
</style>