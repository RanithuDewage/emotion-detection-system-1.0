/**
 * Web Script for AI Emotion Detection System.
 * Connects frontend interface to Flask backend API and animates results.
 */

const emojiMap = {
    'joy': '😄',
    'anger': '😠',
    'disgust': '🤢',
    'fear': '😨',
    'sadness': '😢'
};

function setSample(text) {
    document.getElementById("textToAnalyze").value = text;
    RunSentimentAnalysis();
}

function clearInput() {
    document.getElementById("textToAnalyze").value = "";
    document.getElementById("resultsSection").style.display = "none";
    document.getElementById("system_response").innerHTML = "";
    resetBars();
}

let RunSentimentAnalysis = () => {
    let textInput = document.getElementById("textToAnalyze");
    let textToAnalyze = textInput ? textInput.value : "";
    let loader = document.getElementById("loader");
    let resultsSection = document.getElementById("resultsSection");
    let systemResponse = document.getElementById("system_response");

    if (!textToAnalyze || textToAnalyze.trim() === "") {
        if (loader) loader.style.display = "none";
        if (resultsSection) resultsSection.style.display = "block";
        if (systemResponse) {
            systemResponse.className = "system_response_error";
            systemResponse.innerHTML = "Invalid text! Please try again!";
        }
        document.getElementById("dominantName").innerText = "Invalid Input";
        document.getElementById("dominantEmoji").innerText = "⚠️";
        resetBars();
        return;
    }

    if (loader) loader.style.display = "block";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (loader) loader.style.display = "none";
            if (resultsSection) resultsSection.style.display = "block";

            let rawText = this.responseText;
            if (systemResponse) {
                systemResponse.innerHTML = rawText;
            }

            if (this.status != 200 || rawText.includes("Invalid text")) {
                if (systemResponse) systemResponse.className = "system_response_error";
                document.getElementById("dominantName").innerText = "Invalid Input";
                document.getElementById("dominantEmoji").innerText = "⚠️";
                resetBars();
                return;
            }

            if (systemResponse) systemResponse.className = "";
            parseAndRenderEmotions(rawText);
        }
    };
    xhttp.open("GET", "emotionDetector?textToAnalyze=" + encodeURIComponent(textToAnalyze), true);
    xhttp.send();
};

function resetBars() {
    ['anger', 'disgust', 'fear', 'joy', 'sadness'].forEach(e => {
        let fill = document.getElementById(`fill_${e}`);
        let score = document.getElementById(`score_${e}`);
        if (fill) fill.style.width = "0%";
        if (score) score.innerText = "0.0%";
    });
}

function parseAndRenderEmotions(text) {
    try {
        let anger = extractScore(text, "anger");
        let disgust = extractScore(text, "disgust");
        let fear = extractScore(text, "fear");
        let joy = extractScore(text, "joy");
        let sadness = extractScore(text, "sadness");

        let dominantMatch = text.match(/The dominant emotion is ([a-zA-Z]+)\./);
        let dominantEmotion = dominantMatch ? dominantMatch[1].toLowerCase() : 'joy';

        let emotions = { anger, disgust, fear, joy, sadness };

        for (let [emo, val] of Object.entries(emotions)) {
            let pct = Math.min(100, Math.max(0, (val * 100))).toFixed(1);
            let fill = document.getElementById(`fill_${emo}`);
            let score = document.getElementById(`score_${emo}`);
            if (fill) fill.style.width = pct + "%";
            if (score) score.innerText = `${pct}% (${val.toFixed(4)})`;
        }

        let dominantNameEl = document.getElementById("dominantName");
        let dominantEmojiEl = document.getElementById("dominantEmoji");
        if (dominantNameEl) dominantNameEl.innerText = dominantEmotion;
        if (dominantEmojiEl) dominantEmojiEl.innerText = emojiMap[dominantEmotion] || '✨';
    } catch (err) {
        console.error("Error parsing emotions:", err);
    }
}

function extractScore(text, emotion) {
    let regex = new RegExp(`'${emotion}':\\s*([0-9.]+)`);
    let match = text.match(regex);
    return match ? parseFloat(match[1]) : 0.0;
}
