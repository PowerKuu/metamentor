<script setup lang="ts">
defineProps<{
    text: string
}>()
</script>

<template>
    <div class="container">
        <Icon size="1rem" class="icon" color="var(--background)" name="material-symbols:info-i-rounded" />

        <div class="tooltip-container">
            <SystemPSmall class="tooltip">
                {{ text }}
            </SystemPSmall>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tooltip-container {
    position: absolute;
    display: flex;
        
    opacity: 0;

    align-items: flex-end;

    justify-content: center;

    transform: translateY(-50%);
    bottom: 0.5rem;

    transition: 0.2s;

    z-index: 150;

    p {
        white-space: nowrap;
        width: 100%;
    }
}

.tooltip-container *, .tooltip-container {
    pointer-events: none; 
}

.container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tooltip {
    color: white;
    border: var(--primary) solid 1px;
    background-color: var(--primary);
    padding: 0.3rem 0.7rem;
    border-radius: 5px;
    z-index: 150;
}

.tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: var(--primary) transparent transparent transparent;

    transform: translateX(-50%);
}

.icon {
    position: relative;
    cursor: pointer;

    background-color: var(--weak-text);
    padding: 0.1rem;

    border-radius: 50%;
}

.icon:hover {
    background-color: var(--primary);
}

.icon:hover + .tooltip-container  {
    opacity: 1;
}
</style>