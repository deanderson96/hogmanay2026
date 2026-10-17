(() => {
  "use strict";
  const d = window.HOGMANAY_DETAILS || {};
  const el = id => document.getElementById(id);
  const put = (id, value) => { if (value && el(id)) el(id).textContent = value; };
  put("start-time", d.startTime);
  put("venue-name", d.venueName);
  put("venue-description", d.venueDescription);
  ["food", "dress", "travel", "stay", "contact-description"].forEach(id => put(id, d[id.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]));
  function safeUrl(value, allowed) {
    try { const u = new URL(value); return allowed.includes(u.protocol) ? u.href : null; } catch { return null; }
  }
  const map = safeUrl(d.mapUrl, ["https:", "http:"]);
  if (map) { el("map-link").href = map; el("map-link").classList.remove("hidden"); }
  if (d.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contactEmail)) {
    el("contact-link").href = "mailto:" + encodeURIComponent(d.contactEmail);
    el("contact-link").classList.remove("hidden");
  }
  const timeline = el("timeline");
  (Array.isArray(d.timeline) ? d.timeline : []).forEach(item => {
    const row = document.createElement("div"); row.className = "timeline-row";
    const time = document.createElement("div"); time.className = "timeline-time"; time.textContent = item.time || "";
    const body = document.createElement("div");
    const title = document.createElement("h4"); title.textContent = item.title || "";
    const desc = document.createElement("p"); desc.textContent = item.description || "";
    body.append(title,desc); row.append(time,body); timeline.append(row);
  });
  const faq = el("faq-list");
  (Array.isArray(d.faqs) ? d.faqs : []).forEach(item => {
    const details = document.createElement("details");
    const summary = document.createElement("summary"); summary.textContent = item.question || "";
    const answer = document.createElement("p"); answer.textContent = item.answer || "";
    details.append(summary, answer); faq.append(details);
  });
  const target = new Date(d.eventDate || "2026-12-31T23:59:59+00:00").getTime();
  function tick() {
    const remaining = Math.max(0, target - Date.now());
    const units = [["days", 86400000], ["hours", 3600000], ["mins", 60000], ["secs", 1000]];
    let left = remaining;
    const container = el("countdown");
    if (!Number.isFinite(target)) { container.textContent = "Countdown coming soon"; return; }
    const fragment = document.createDocumentFragment();
    for (const [name, ms] of units) {
      const val = Math.floor(left / ms); left %= ms;
      const item = document.createElement("div"); item.className = "count-item";
      const number = document.createElement("span"); number.className = "count-number"; number.textContent = String(val).padStart(2,"0");
      const label = document.createElement("span"); label.className = "count-unit"; label.textContent = name;
      item.append(number,label); fragment.append(item);
    }
    container.replaceChildren(fragment);
    if (remaining === 0) container.setAttribute("aria-label", "Happy New Year!");
  }
  tick(); setInterval(tick, 1000);
})();
