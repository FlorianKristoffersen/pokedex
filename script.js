// Startpunkt der App 

console.log("✅ Script.js wurde geladen!");


// init() existiert und startet die App
if (typeof init === "function") {
  init();
} else {
  console.error("❌ init() wurde nicht gefunden!");
}