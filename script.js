document.addEventListener('DOMContentLoaded', () => {
    const prompt = document.getElementById('prompt').innerText;
    const typingArea = document.getElementById('typingArea');
    const startBtn = document.getElementById('startBtn');
    const result = document.getElementById('result');

    let startTime;
    let endTime;

    startBtn.addEventListener('click', () => {
        typingArea.value = '';
        result.textContent = '';
        typingArea.disabled = false;
        typingArea.focus();
        startTime = new Date().getTime();
    });

    typingArea.addEventListener('input', () => {
        const typedText = typingArea.value;
        if (typedText === prompt) {
            endTime = new Date().getTime();
            typingArea.disabled = true;
            const timeTaken = (endTime - startTime) / 1000;
            result.textContent = `You completed the test in ${timeTaken} seconds.`;
            // Server request
        }
    });
});