document.addEventListener('DOMContentLoaded', () => {
    const initialPrompt = document.getElementById('initialPrompt');
    const typingPrompt = document.getElementById('typingPrompt');
    const typingArea = document.getElementById('typingArea');
    const result = document.getElementById('result');

    let startTime;
    let name = '';

    typingArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && name === '') {
            event.preventDefault();
            const typedText = typingArea.value.trim();
            const match = typedText.match(/^Dear (\w+),$/);
            if (match) {
                name = match[1];
                console.log(`Name: ${name}`); // Log the name
                typingArea.value = '';
                initialPrompt.style.display = 'none';
                typingPrompt.style.display = 'block';
                typingArea.focus();
                startTime = new Date().getTime();
                console.log(`Test started at: ${new Date(startTime).toLocaleString()}`); // Log the start time
            } else {
                result.textContent = 'Please start with "Dear [name],".';
            }
        }
    });

    typingArea.addEventListener('input', () => {
        if (name !== '') {
            const typedText = typingArea.value;
            if (typedText === typingPrompt.innerText) {
                const endTime = new Date().getTime();
                typingArea.disabled = true;
                const timeTaken = (endTime - startTime) / 1000;
                result.textContent = `You completed the test in ${timeTaken} seconds.`;
                // Server request
            }
        }
    });
});