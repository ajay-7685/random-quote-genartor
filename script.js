const quoteText = document.getElementById('quote-text');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const twitterBtn = document.getElementById('twitter-btn');
const speakBtn = document.getElementById('speak-btn');

// Speech synthesis voices
let voices = [];
let currentVoiceIndex = 0;

// Fetch Quote from API
async function getQuote() {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    quoteText.textContent = data.content;
    authorText.textContent = `- ${data.author}`;
}

// Copy Quote to Clipboard
function copyToClipboard() {
    const textToCopy = `${quoteText.textContent} ${authorText.textContent}`;
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Quote copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
}

// Tweet Quote
function tweetQuote() {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    const twitterUrl = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Speak Quote
function speakQuote() {
    const utterance = new SpeechSynthesisUtterance(`${quoteText.textContent} by ${authorText.textContent}`);
    utterance.voice = voices[currentVoiceIndex];
    speechSynthesis.speak(utterance);

    // Toggle between male and female voices
    currentVoiceIndex = (currentVoiceIndex === voices.length - 1) ? 0 : currentVoiceIndex + 1;
}

// Initialize speech synthesis voices
function initializeVoices() {
    voices = speechSynthesis.getVoices();
}

// Event Listeners
newQuoteBtn.addEventListener('click', () => {
    getQuote();
    newQuoteBtn.innerText = 'Loading...';
    newQuoteBtn.disabled = true;
    setTimeout(() => {
        newQuoteBtn.innerText = 'New Quote';
        newQuoteBtn.disabled = false;
    }, 1000); // After a second, re-enable the button
});

copyBtn.addEventListener('click', copyToClipboard);
twitterBtn.addEventListener('click', tweetQuote);
speakBtn.addEventListener('click', speakQuote);

// On Load
getQuote();
speechSynthesis.onvoiceschanged = initializeVoices;
