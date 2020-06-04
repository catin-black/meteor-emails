export function startedDebugLog(textToLog) {
  debugLog("➡️ - " + textToLog, "color: #f1c40f");
}

export function successDebugLog(textToLog) {
  debugLog("✅ - " + textToLog, "color: #2ecc71");
}

export function errorDebugLog(textToLog) {
  debugLog("❌ - " + textToLog, "color: #e74c3c");
}

function debugLog(textToLog, style = "color: #9d9d9d") {
  if (Meteor.isDevelopment) {
    console.log("%c" + textToLog, style);
  }
}
