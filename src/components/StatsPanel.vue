<template>
    <div v-if="isGameOver" class="flex flex-col items-center gap-2">
        <div>{{ (elapsedTime / 1000).toFixed(2) }}s elapsed time</div>
        <div>{{ accuracy }}% accuracy</div>
        <div>{{ cpm }} characters per minute</div>
        <div>{{ wpm }} words per minute</div>
        <button
            class="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            @click="onRestart"
        >
            Restart
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    elapsedTime: number;
    accuracy: number;
    cpm: number;
    wpm: number;
    isGameOver: boolean;
}>();

const emit = defineEmits(["restart"]);

function onRestart() {
    emit("restart");
}
</script>
