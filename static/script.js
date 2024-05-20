document.addEventListener('DOMContentLoaded', () => {
    const initialPrompt = document.getElementById('initialPrompt');
    const nameInput = document.getElementById('nameInput');
    const typingPrompt = document.getElementById('typingPrompt');
    const typingArea = document.getElementById('typingArea');
    const result = document.getElementById('result');

    if (!nameInput) {
        console.error('nameInput element not found');
        return;
    }

    let startTime;
    let name = '';

    function getTypingPrompt() {
        // Dummy function that returns a static sentence
        return 'The quick brown fox jumps over the lazy dog.';
    }

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && nameInput.value.trim() !== '') {
            event.preventDefault();
            name = nameInput.value.trim();
            console.log(`Name: ${name}`); // Log the name
            nameInput.style.display = 'none';
            initialPrompt.style.display = 'none';
            typingPrompt.style.display = 'block';
            typingPrompt.innerText = getTypingPrompt();
            typingArea.placeholder = typingPrompt.innerText;
            typingArea.readOnly = false;
            typingArea.focus();
            startTime = new Date().getTime();
            console.log(`Test started at: ${new Date(startTime).toLocaleString()}`); // Log the start time
        }
    });

    typingArea.addEventListener('input', () => {
        if (name !== '') {
            const typedText = typingArea.value;
            console.log(`Typed text: ${typedText}`); // Log the typed text
            if (typedText === typingPrompt.innerText) {
                const endTime = new Date().getTime();
                typingArea.disabled = true;
                const timeTaken = (endTime - startTime) / 1000;
                const words = typingPrompt.innerText.split(' ').length;
                const wpm = (words / timeTaken) * 60;
                const bpm = (1 / timeTaken) * 60;
                result.textContent = `You completed the test in ${timeTaken.toFixed(2)} seconds. WPM: ${wpm.toFixed(2)}, BPM: ${bpm.toFixed(2)}.`;
                console.log(`Test completed in: ${timeTaken} seconds`); // Log the completion time
                console.log(`Words per minute: ${wpm.toFixed(2)}`); // Log the words per minute
                console.log(`Breakups per minute: ${bpm.toFixed(2)}`); // Log the breakups per minute
                // Server request
            }
        }
    });
});