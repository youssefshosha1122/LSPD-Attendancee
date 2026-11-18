
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

    $("reportDate").value = new Date().toLocaleDateString("en-GB");

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
