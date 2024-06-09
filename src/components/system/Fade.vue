<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()

const isInitial = ref(true)
watch(() => props.open, () => isInitial.value = false)
</script>

<template>
    <div class="fade" :data-show="open" :data-initial="isInitial">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.fade {
    z-index: 101;

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