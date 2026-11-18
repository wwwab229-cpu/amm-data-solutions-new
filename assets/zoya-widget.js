import { Conversation } from "https://esm.sh/@elevenlabs/client";

(() => {
  const root = document.getElementById("zoya-panel");
  const launcher = document.getElementById("zoya-launcher");
  if (!root || !launcher) return;

  const statusEl = root.querySelector(".zoya-status");
  const transcript = root.querySelector(".zoya-transcript");
  const startBtn = root.querySelector("[data-zoya-start]");
  const endBtn = root.querySelector("[data-zoya-end]");
  const muteBtn = root.querySelector("[data-zoya-mute]");
  const textForm = root.querySelector(".zoya-input-row");
  const textInput = root.querySelector("#zoya-text-input");
  const errorEl = root.querySelector(".zoya-error");
  const bars = Array.from({length: 44}, () => {
    const bar = document.createElement("i");
    bar.className = "zoya-wave-bar";
    root.querySelector(".zoya-visualizer").appendChild(bar);
    return bar;
  });

  let conversation = null;
  let currentState = "idle";
  let rafId = 0;
  let muted = false;
  let sdkReady = true;

  function setState(state, label) {
    currentState = state;
    root.dataset.state = state;
    statusEl.textContent = label || ({
      idle: "Ready when you are",
      connecting: "Connecting to Zoya…",
      listening: "Zoya is listening",
      speaking: "Zoya is speaking",
      error: "Connection needs attention"
    }[state] || "Ready when you are");
    launcher.dataset.active = String(["connecting","listening","speaking"].includes(state));
    startBtn.hidden = state === "connecting" || state === "listening" || state === "speaking";
    endBtn.hidden = !conversation;
    muteBtn.hidden = !conversation;
  }

  function addMessage(text, role) {
    if (!text) return;
    const node = document.createElement("div");
    node.className = "zoya-msg " + (role === "user" ? "user" : "agent");
    node.textContent = String(text);
    transcript.appendChild(node);
    transcript.scrollTop = transcript.scrollHeight;
  }

  function extractMessage(payload) {
    if (typeof payload === "string") return payload;
    if (!payload || typeof payload !== "object") return "";
    const message = payload.message || payload;
    if (typeof message === "string") return message;
    return message.message || message.text || message.transcript || message.user_transcription_event?.user_transcript || message.agent_response_event?.agent_response || "";
  }

  function renderWave() {
    if (!conversation || !["listening","speaking","connecting"].includes(currentState)) {
      bars.forEach(bar => bar.style.transform = "scaleY(.35)");
      rafId = 0;
      return;
    }
    let values = null;
    try {
      values = currentState === "speaking"
        ? conversation.getOutputByteFrequencyData?.()
        : conversation.getInputByteFrequencyData?.();
    } catch (_) {}
    bars.forEach((bar, index) => {
      let energy = 0.08;
      if (values && values.length) {
        const slot = Math.min(values.length - 1, Math.floor((index / bars.length) * values.length));
        energy = Math.max(.06, values[slot] / 255);
      }
      const center = 1 - Math.abs((index / (bars.length - 1)) * 2 - 1);
      const height = .12 + energy * (.35 + center * .95);
      bar.style.transform = "scaleY(" + Math.min(2.8, height * 2.2) + ")";
    });
    rafId = requestAnimationFrame(renderWave);
  }

  function startWave() {
    if (!rafId) rafId = requestAnimationFrame(renderWave);
  }

  function openPanel() {
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
  }

  launcher.addEventListener("click", () => {
    if (root.classList.contains("is-open")) closePanel();
    else openPanel();
  });
  root.querySelector("[data-zoya-close]").addEventListener("click", closePanel);

  async function startConversation() {
    if (conversation || !sdkReady) return;
    errorEl.textContent = "";
    setState("connecting", "Connecting to Zoya…");
    startWave();
    try {
      conversation = await Conversation.startSession({
        agentId: "agent_2401m7agtb35ejrtzwe0wgfz6bvz",
        connectionType: "webrtc",
        onConnect: () => {
          setState("listening", "Zoya is listening");
          startWave();
        },
        onDisconnect: () => {
          conversation = null;
          muted = false;
          muteBtn.textContent = "Mute mic";
          setState("idle", "Conversation ended");
          if (rafId) cancelAnimationFrame(rafId);
          rafId = 0;
        },
        onStatusChange: (statusInfo = {}) => {
          const status = typeof statusInfo === "string" ? statusInfo : statusInfo.status;
          if (status === "connecting") setState("connecting", "Connecting to Zoya…");
          if (status === "connected" && currentState === "connecting") setState("listening", "Zoya is listening");
          if (status === "disconnected" && !conversation) setState("idle", "Ready when you are");
        },
        onModeChange: (modeInfo = {}) => {
          const mode = typeof modeInfo === "string" ? modeInfo : modeInfo.mode;
          const next = mode === "speaking" ? "speaking" : "listening";
          setState(next, next === "speaking" ? "Zoya is speaking" : "Zoya is listening");
          startWave();
        },
        onMessage: (payload) => {
          const text = extractMessage(payload);
          if (!text) return;
          const role = payload?.source === "user" || payload?.role === "user" || payload?.message?.source === "user" ? "user" : "agent";
          addMessage(text, role);
        },
        onError: (error) => {
          errorEl.textContent = error?.message || "Could not connect. Please try again.";
          if (!conversation) setState("error", "Connection needs attention");
        }
      });
      setState("listening", "Zoya is listening");
      startWave();
    } catch (error) {
      conversation = null;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      setState("error", "Connection needs attention");
      errorEl.textContent = error?.message?.includes("Permission")
        ? "Microphone permission is needed to start a voice conversation."
        : "Zoya could not connect right now. Please try again.";
    }
  }

  async function endConversation() {
    if (!conversation) return;
    const active = conversation;
    conversation = null;
    try { await active.endSession(); } catch (_) {}
    muted = false;
    muteBtn.textContent = "Mute mic";
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    setState("idle", "Conversation ended");
  }

  startBtn.addEventListener("click", startConversation);
  endBtn.addEventListener("click", endConversation);
  muteBtn.addEventListener("click", () => {
    if (!conversation) return;
    muted = !muted;
    conversation.setMicMuted(muted);
    muteBtn.textContent = muted ? "Unmute mic" : "Mute mic";
  });

  textInput.addEventListener("input", () => {
    if (conversation) conversation.sendUserActivity();
  });
  textForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = textInput.value.trim();
    if (!value) return;
    if (!conversation) {
      errorEl.textContent = "Start a voice conversation first, then you can also type to Zoya.";
      return;
    }
    conversation.sendUserMessage(value);
    addMessage(value, "user");
    textInput.value = "";
  });

  setState("idle", "Ready when you are");
})();
