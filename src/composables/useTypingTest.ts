// src/composables/useTypingTest.ts

export const prompts = [
    "This is just a sample to practice typing.",
    "Another prompt for improving typing",
];

export function getRandomPrompt(): string {
    return prompts[Math.floor(Math.random() * prompts.length)];
}
