const searchBtn = document.getElementById("searchBtn");
const wordInput = document.getElementById("wordInput");
const result = document.getElementById("result");

searchBtn.addEventListener("click", searchWord);

wordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = wordInput.value.trim();

    if (word === "") {
        alert("Please enter a word");
        return;
    }

    result.innerHTML = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            displayResult(data[0]);
        })
        .catch(() => {
            result.innerHTML = `<p style="color:red;">Word not found. Please try another word.</p>`;
        });
}

function displayResult(data) {
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0];

    const phonetic = data.phonetics.find(p => p.text) || {};
    const audio = data.phonetics.find(p => p.audio) || {};

    result.innerHTML = `
        <div class="word">${data.word}</div>
        <div class="phonetic">${phonetic.text || ""}</div>

        <div class="meaning">
            <strong>Part of Speech:</strong> ${meaning.partOfSpeech}<br>
            <strong>Meaning:</strong> ${definition.definition}
        </div>

        <div class="example">
            <strong>Example:</strong> ${definition.example || "Example not available"}
        </div>

        ${audio.audio ? `<audio controls src="${audio.audio}"></audio>` : ""}
    `;
}
