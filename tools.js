
// LSPD Time Converter
const convertBtn = document.getElementById("convertTimeBtn");

if (convertBtn) {
    convertBtn.addEventListener("click", function () {
        const input = document.getElementById("standardTime").value.trim();
        const output = document.getElementById("lspdTime");

        const match = input.match(/^(\d+):(\d{1,2})$/);

        if (!match || Number(match[2]) > 59) {
            output.textContent = "Invalid Time";
            return;
        }

        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const convertedMinutes = Math.round(minutes * 100 / 60);

        output.textContent = `${hours}:${String(convertedMinutes).padStart(2, "0")}`;
    });
}


// LSPD Table Calculator
const calculateBtn = document.getElementById("calculateTableBtn");

if (calculateBtn) {
    calculateBtn.addEventListener("click", function () {
        const tableInput = document.getElementById("currentTable").value;
        const hoursInput = document.getElementById("playHours").value;
        const minutesInput = document.getElementById("playMinutes").value;

        const convertedOutput = document.getElementById("convertedPlayTime");
        const newTableOutput = document.getElementById("newTableNumber");

        const currentTable = Number(tableInput);
        const hours = Number(hoursInput);
        const minutes = Number(minutesInput);

        if (
            tableInput === "" ||
            hoursInput === "" ||
            minutesInput === "" ||
            !Number.isFinite(currentTable) ||
            !Number.isFinite(hours) ||
            !Number.isFinite(minutes) ||
            hours < 0 ||
            minutes < 0 ||
            minutes > 59
        ) {
            convertedOutput.textContent = "Invalid Input";
            newTableOutput.textContent = "Invalid Input";
            return;
        }

        const convertedTime = hours + (minutes / 60);
        const newTable = currentTable - convertedTime;

        convertedOutput.textContent = convertedTime.toFixed(2);
        newTableOutput.textContent = newTable.toFixed(2);
    });
}
// LSPD Background Music
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

if (music && musicToggle) {
    musicToggle.addEventListener("click", function () {
        if (music.paused) {
            music.play().then(() => {
                musicToggle.textContent = "⏸ MUSIC ON";
            }).catch(() => {
                musicToggle.textContent = "▶ MUSIC OFF";
            });
        } else {
            music.pause();
            musicToggle.textContent = "▶ MUSIC OFF";
        }
    });
}