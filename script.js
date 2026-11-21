
const $ = (id) => document.getElementById(id);

// Live Clock
function updateClock() {
    const now = new Date();

    $("liveClock").textContent = now.toLocaleTimeString("en-US", {
        hour12: true
    });
}

updateClock();
setInterval(updateClock, 1000);


// Clean Discord Text
function cleanText(text) {
    return text
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")
        .trim();
}


// Get Value After a Label
function getValue(lines, label) {
    const index = lines.findIndex(line =>
        line.startsWith(label)
    );

    if (index === -1) return "";

    // Value may be on the same line
    const sameLine = lines[index]
        .slice(label.length)
        .replace(/^[:\s]+/, "")
        .trim();

    if (sameLine) return sameLine;

    // Or on the next line
    return lines[index + 1] || "";
}


// Extract Employee Name
function extractEmployeeName(value) {
    return value.replace(/^@\[[^\]]+\]\s*/, "").trim();
}


// Set Status
function setStatus(message, type = "") {
    const status = $("messageStatus");

    status.className = "message-status " + type;
    status.innerHTML = `
        <span class="status-dot"></span>
        ${message}
    `;
}


// Extract Attendance Data

function extractAttendance() {
    const rawText = $("discordMessage").value.trim();

    if (!rawText) {
        setStatus("PLEASE PASTE A DISCORD MESSAGE", "error");
        return;
    }

    // Clean Discord formatting and numbering
    const lines = rawText
        .split(/\r?\n/)
        .map(line => line
            .replace(/\*\*/g, "")
            .replace(/__/g, "")
            .replace(/`/g, "")
            .trim()
            .replace(/^\d+\.\s*/, "")
        )
        .filter(line => line.length > 0);

    // Extract value after each label
    

function getValue(label) {
    const normalize = (text) => text
        .replace(/\*\*/g, "")
        .replace(/[`]/g, "")
        .replace(/\s+/g, " ")
        .replace(/[：]/g, ":")
        .replace(/[أإآ]/g, "ا")
        .trim();

    const target = normalize(label);

    const index = lines.findIndex(line =>
        normalize(line).startsWith(target)
    );

    if (index === -1) return "";

    const currentLine = normalize(lines[index]);
    const sameLineValue = currentLine
        .slice(target.length)
        .replace(/^[:\s]+/, "")
        .trim();

    return sameLineValue || normalize(lines[index + 1] || "");
}



    const employee = getValue("اسم الموظف:");
    const rank = getValue("الرتبة الحالية:");
    const login = getValue("سجل دخول:");
    const logout = getValue("سجل خروج:");
    const duration = getValue("مجموع وقت المباشرة:");


    // Extract image URL if available
    const imageMatch = rawText.match(
        /https?:\/\/[^\s<>"]+\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s<>"]*)?/i
    );

    // Fill the form
    $("employeeName").value = employee.replace(/^@\[[^\]]+\]\s*/, "");
    $("rank").value = rank;
    $("loginTime").value = login;
    $("logoutTime").value = logout;
    $("workDuration").value = duration;
    
    $("dailyTotal").value = "0";
$("weeklyTotal").value = "0";
$("monthlyTotal").value = "0";

    $("statusImage").value = imageMatch ? imageMatch[0] : "";

    // Detect if attendance crossed midnight
function timeToMinutes(time) {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

const today = new Date();
const tomorrow = new Date(today);

tomorrow.setDate(tomorrow.getDate() + 1);

const loginMinutes = timeToMinutes(login);
const logoutMinutes = timeToMinutes(logout);

const firstDate = today.toLocaleDateString("en-GB");
const secondDate = tomorrow.toLocaleDateString("en-GB");

if (
    loginMinutes !== null &&
    logoutMinutes !== null &&
    logoutMinutes < loginMinutes
) {
    $("reportDate").value = `${firstDate} + ${secondDate}`;
} else {
    $("reportDate").value = firstDate;
}

    if (!login || !logout || !duration) {
        setStatus("SOME ATTENDANCE DATA IS MISSING", "error");
        return;
    }

    setStatus("ATTENDANCE RECORD EXTRACTED SUCCESSFULLY", "success");
}



// Copy Report

async function copyReport() {

    const report = `
**\`\`تسجيل الدخول :\`\`**
${$("loginTime").value}

**\`\`تسجيل الخروج :\`\`**
${$("logoutTime").value}

**\`\`رابط تسجيل الدخول والخروج\`\`**
${$("messageLink").value}

**\`\`مجموع وقت الدوام :\`\`**
${$("workDuration").value}

**\`\`صورة الحالة إن وجد :\`\`**
${$("statusImage").value}

\`تاريخ اليوم : \`${$("reportDate").value}
`.trim();

    try {
        await navigator.clipboard.writeText(report);
        setStatus("REPORT COPIED SUCCESSFULLY", "success");
    } catch (error) {
        setStatus("COPY FAILED - CHECK BROWSER PERMISSIONS", "error");
    }
}



// Clear Form
function clearForm() {

    const ids = [
        "discordMessage",
        "employeeName",
        "rank",
        "loginTime",
        "logoutTime",
        "workDuration",
        "dailyTotal",
        "weeklyTotal",
        "monthlyTotal",
        "statusImage",
        "reportDate",
        "messageLink"
    ];

    ids.forEach(id => {
        $(id).value = "";
    });

    setStatus("WAITING FOR INPUT...");
}


// Button Events
$("extractBtn").addEventListener("click", extractAttendance);

$("copyBtn").addEventListener("click", copyReport);

$("clearBtn").addEventListener("click", clearForm);


// LSPD Time Converter
document.getElementById("convertTimeBtn").addEventListener("click", function () {

    const input = document.getElementById("standardTime").value.trim();
    const output = document.getElementById("lspdTime");

    const match = input.match(/^(\d+):(\d{1,2})$/);

    if (!match) {
        output.value = "Invalid Time";
        return;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (minutes > 59) {
        output.value = "Invalid Time";
        return;
    }

    const convertedMinutes = Math.round(minutes * 100 / 60);

    output.value = `${hours}:${String(convertedMinutes).padStart(2, "0")}`;
});

// LSPD Table Calculator
document.getElementById("calculateTableBtn").addEventListener("click", function () {

    const currentTable = Number(document.getElementById("currentTable").value);
    const hours = Number(document.getElementById("playHours").value);
    const minutes = Number(document.getElementById("playMinutes").value);

    const convertedOutput = document.getElementById("convertedPlayTime");
    const newTableOutput = document.getElementById("newTableNumber");

    if (
        document.getElementById("currentTable").value === "" ||
        document.getElementById("playHours").value === "" ||
        document.getElementById("playMinutes").value === "" ||
        !Number.isFinite(currentTable) ||
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