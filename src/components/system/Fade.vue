<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const isInitial = ref(true)
const remove = ref(!props.open)

let currentTimeout: NodeJS.Timeout | null = null
const timeout = 200

watch(() => props.open, (value) => {
    isInitial.value = false

    if (!value) {
        currentTimeout = setTimeout(() => {
            if (props.open) return
            remove.value = true
        }, timeout)
    } else {
        if (currentTimeout) clearTimeout(currentTimeout)
        remove.value = false
    }
}, {
    immediate: true
})
</script>

<template>
    <div v-if="!remove" class="fade" :data-show="open" :data-initial="isInitial">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.fade {
    &[data-show="false"][data-initial="true"] {
        display: none;
    }

    &[data-show="false"][data-initial="false"] {
        pointer-events: none; 
        animation: fadeOut 0.2s forwards;
    }

    &[data-show="true"][data-initial="true"] {
        display: flex;
    }

    &[data-show="true"][data-initial="false"] {
        animation: fadeIn 0.2s forwards;
    }
}

@keyframes fadeIn {
    from {
        display: flex;
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
        display: none;
    } 
}
</style>