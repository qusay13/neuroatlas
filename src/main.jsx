import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Global Error Handler for debugging user's browser
window.addEventListener("error", (e) => {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "0";
  div.style.zIndex = "9999";
  div.style.background = "red";
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.direction = "ltr";
  div.textContent = `Error: ${e.message} at ${e.filename}:${e.lineno}`;
  document.body.appendChild(div);
});

window.addEventListener("unhandledrejection", (e) => {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "50px";
  div.style.left = "0";
  div.style.zIndex = "9999";
  div.style.background = "orange";
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.direction = "ltr";
  div.textContent = `Promise Error: ${e.reason}`;
  document.body.appendChild(div);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
