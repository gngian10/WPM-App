<template>
    <div
        class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 ga-6"
    >
        <!-- Prompt visible completo -->
        <div
            class="w-full max-w-3xl text-lg font-mono border p-4 break-words leading-relaxed text-left"
        >
            <span
                v-for="(char, index) in promptArray"
                :key="index"
                :class="getCharClass(index)"
            >
                {{ char }}
            </span>
        </div>

        <!-- Panel al terminar -->
        <div v-if="isGameOver" class="text-center space-y-2">
            <div>{{ (elapsedTime / 1000).toFixed(2) }}s elapsed time</div>
            <div>{{ accuracy }}% accuracy</div>
            <div>{{ charactersPerMinute }} characters per minute</div>
            <div>{{ wordsPerMinute }} words per minute</div>
            <button
                @click="restart"
                class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
                Restart
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getRandomPrompt } from "./composables/useTypingTest";

// Prompt aleatorio inicial
const prompt = ref(getRandomPrompt());

// Estado reactivo
const typedChars = ref<string[]>([]);
const currentIndex = ref(0);
const numberTyped = ref(0);
const startTime = ref(0);
const endTime = ref(0);

// Separar prompt en caracteres
const promptArray = computed(() => prompt.value.split(""));

// Teclado: solo letras visibles
function handleKeyDown(e: KeyboardEvent) {
    if (e.key.length !== 1 || endTime.value > 0) return;

    if (currentIndex.value === 0) {
        startTime.value = Date.now();
    }

    // Agregar el carácter a typedChars
    typedChars.value[currentIndex.value] = e.key;
    numberTyped.value++;
    currentIndex.value++;

    // Si terminó
    if (currentIndex.value === prompt.value.length) {
        endTime.value = Date.now();
    }
}

// Agregar/limpiar listener
onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));

// Clase de cada carácter
function getCharClass(index: number): string {
    if (index < typedChars.value.length) {
        const expected = prompt.value[index];
        const typed = typedChars.value[index];
        return typed === expected ? "text-green-400" : "text-red-400";
    }

    if (index === typedChars.value.length) {
        return "bg-yellow-200 text-black";
    }

    return "text-white";
}

// Métricas
const elapsedTime = computed(() => endTime.value - startTime.value);
const numberOfWords = computed(() => prompt.value.trim().split(" ").length);
const accuracy = computed(() =>
    numberTyped.value === 0
        ? 0
        : Math.round((prompt.value.length / numberTyped.value) * 100)
);
const charactersPerMinute = computed(() =>
    elapsedTime.value === 0
        ? 0
        : Math.round((prompt.value.length / elapsedTime.value) * 60000)
);
const wordsPerMinute = computed(() =>
    elapsedTime.value === 0
        ? 0
        : Math.round((numberOfWords.value / (elapsedTime.value / 1000)) * 60)
);
const isGameOver = computed(() => endTime.value > 0);

// Reiniciar
function restart() {
    prompt.value = getRandomPrompt();
    typedChars.value = [];
    currentIndex.value = 0;
    numberTyped.value = 0;
    startTime.value = 0;
    endTime.value = 0;
}
</script>
