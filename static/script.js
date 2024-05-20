document.addEventListener('DOMContentLoaded', async () => {
    const initialPrompt = document.getElementById('initialPrompt');
    const nameInput = document.getElementById('nameInput');
    const typingPromptContainer = document.getElementById('typingPromptContainer');
    const typingPrompt = document.getElementById('typingPrompt');
    const typingArea = document.getElementById('typingArea');
    const result = document.getElementById('result');
    const buttonContainer = document.createElement('div');

    let startTime;
    let name = '';
    let promptKey = '';
    let promptText = '';

    buttonContainer.id = 'buttonContainer';
    buttonContainer.style.display = 'none';
    buttonContainer.style.marginTop = '20px';
    document.querySelector('.container').appendChild(buttonContainer);

    const shareBreakupButton = document.createElement('button');
    shareBreakupButton.textContent = 'Share Breakup';
    shareBreakupButton.style.marginRight = '10px';
    buttonContainer.appendChild(shareBreakupButton);

    const shareStatsButton = document.createElement('button');
    shareStatsButton.textContent = 'Share Stats';
    shareStatsButton.style.marginRight = '10px';
    buttonContainer.appendChild(shareStatsButton);

    const takeAnotherTestButton = document.createElement('button');
    takeAnotherTestButton.textContent = 'Take Another Test';
    buttonContainer.appendChild(takeAnotherTestButton);

    const newTestButtonContainer = document.createElement('div');
    newTestButtonContainer.style.display = 'none';
    newTestButtonContainer.style.marginTop = '20px';
    document.querySelector('.container').appendChild(newTestButtonContainer);

    const newTestButton = document.createElement('button');
    newTestButton.textContent = 'Take a New Test';
    newTestButtonContainer.appendChild(newTestButton);

    async function fetchTypingPrompt(key = null) {
        try {
            const response = await fetch(key ? `/prompt/${key}` : '/prompt');
            const data = await response.json();
            promptKey = data.key;
            promptText = data.prompt;
            typingPrompt.innerHTML = promptText.split(' ').map(word => `<span>${word}</span>`).join(' ');
            console.log(`Fetched prompt: ${promptText}`); // Log the fetched prompt
        } catch (error) {
            console.error('Error fetching prompt:', error);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    await fetchTypingPrompt(key);

    if (key) {
        newTestButtonContainer.style.display = 'block';
        newTestButton.addEventListener('click', () => {
            window.location.href = window.location.origin;
        });
    }

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && nameInput.value.trim() !== '') {
            event.preventDefault();
            name = nameInput.value.trim();
            console.log(`Name: ${name}`); // Log the name
            nameInput.style.display = 'none';
            initialPrompt.style.display = 'none';
            typingPromptContainer.style.display = 'block';
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

            const promptWords = promptText.split(' ');
            const typedWords = typedText.trim().split(' ');

            const promptSpans = typingPrompt.querySelectorAll('span');
            let correctCount = 0;

            for (let i = 0; i < promptWords.length; i++) {
                if (i < typedWords.length) {
                    const typedWord = typedWords[i];
                    const promptWord = promptWords[i];
                    const span = promptSpans[i];

                    if (typedWord === promptWord) {
                        span.classList.add('correct');
                        span.classList.remove('incorrect');
                        correctCount++;
                    } else if (typedWord.length >= promptWord.length) {
                        span.classList.add('incorrect');
                        span.classList.remove('correct');
                    } else {
                        span.classList.remove('correct', 'incorrect');
                    }
                } else {
                    promptSpans[i].classList.remove('correct', 'incorrect');
                }
            }

            const lastWordTyped = typedWords[typedWords.length - 1];
            const lastWord = promptWords[typedWords.length - 1];

            if (typedWords.length === promptWords.length && lastWordTyped && lastWordTyped.length >= lastWord.length) {
                const endTime = new Date().getTime();
                typingArea.disabled = true;
                const timeTaken = (endTime - startTime) / 1000;
                const words = promptText.split(' ').length;
                const wpm = (words / timeTaken) * 60;
                const bpm = (1 / timeTaken) * 60;
                const accuracy = (typedWords.filter((word, index) => word === promptWords[index]).length / promptWords.length) * 100;
                result.textContent = `You completed the test in ${timeTaken.toFixed(2)} seconds. WPM: ${wpm.toFixed(2)}, BPM: ${bpm.toFixed(2)}, Accuracy: ${accuracy.toFixed(2)}%.`;
                console.log(`Test completed in: ${timeTaken} seconds`); // Log the completion time
                console.log(`Words per minute: ${wpm.toFixed(2)}`); // Log the words per minute
                console.log(`Breakups per minute: ${bpm.toFixed(2)}`); // Log the breakups per minute
                console.log(`Accuracy: ${accuracy.toFixed(2)}%`); // Log the accuracy
                buttonContainer.style.display = 'block'; // Show the buttons

                shareBreakupButton.addEventListener('click', () => {
                    const breakupMessage = `${promptText}\n\nCheck out this breakup typing test at breakuptypingtest.com?prompt=${promptKey}`;
                    navigator.clipboard.writeText(breakupMessage).then(() => {
                        alert('Breakup message copied to clipboard!');
                    }).catch(err => {
                        console.error('Error copying message:', err);
                    });
                });

                shareStatsButton.addEventListener('click', () => {
                    const statsMessage = `WPM: ${wpm.toFixed(2)}, BPM: ${bpm.toFixed(2)}, Accuracy: ${accuracy.toFixed(2)}%\n\nCheck out this breakup typing test at breakuptypingtest.com?prompt=${promptKey}`;
                    navigator.clipboard.writeText(statsMessage).then(() => {
                        alert('Stats copied to clipboard!');
                    }).catch(err => {
                        console.error('Error copying stats:', err);
                    });
                });

                takeAnotherTestButton.addEventListener('click', () => {
                    window.location.reload();
                });
            }
        }
    });
});