import { formatCrore } from "./aasthi.js";

const W = 1122;
const H = 1402;
const BACKGROUND = "assets/aasthipathralucard.jpg";
const SERIF = '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';
const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

/** Empty frames painted into the background artwork, in its pixel coordinates. */
const PHOTO = { x: 283, y: 492, r: 101 };
const NAME = { x: 420, y: 491, maxW: 520 };
const HERO = { x: 152, y: 684, w: 331, h: 396 };
const AMOUNT = { x: 787, y: 918, maxW: 440 };

const images = new Map();

function loadImage(src) {
  if (!src) return Promise.resolve(null);
  if (!images.has(src)) {
    images.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      }),
    );
  }
  return images.get(src);
}

/** Draws the Aasthi Pathralu card into `canvas` once its artwork has loaded; later calls win over earlier ones. */
export async function renderCertificate(canvas, { name, heroSrc, amount = 0, level = 0, photoImg = null }) {
  const token = (canvas.renderToken = (canvas.renderToken || 0) + 1);
  const [background, heroImg] = await Promise.all([loadImage(BACKGROUND), loadImage(heroSrc)]);
  if (token !== canvas.renderToken) return canvas;
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  if (background) g.drawImage(background, 0, 0, W, H);
  else {
    g.fillStyle = "#2a0d12";
    g.fillRect(0, 0, W, H);
  }
  g.textAlign = "center";
  g.textBaseline = "middle";
  drawTitle(g, level);
  drawPhoto(g, photoImg);
  drawName(g, name);
  drawHero(g, heroImg);
  drawAmount(g, amount);
  return canvas;
}

/** Shares the card via the Web Share API when files are supported, else downloads it. */
export async function shareCertificate(canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return "error";
  const file = new File([blob], "aasthi-pathralu.png", { type: "image/png" });
  const text = `I brought my Aasthi Pathralu back from the palace! 👑 Can you escape? ${location.href.split("#")[0]}`;
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Aasthi Pathralu", text });
      return "shared";
    } catch (err) {
      if (err && err.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}

function drawTitle(g, level) {
  if (level) {
    g.save();
    g.font = `800 25px ${SANS}`;
    g.fillStyle = "#fff6dc";
    g.shadowColor = "rgba(0, 0, 0, 0.8)";
    g.shadowBlur = 8;
    spaced(g, `EARNED AT LEVEL ${level}`, W / 2, 172, 6);
    g.restore();
  }
  goldText(g, "AASTHI", W / 2, 240, 94, 8);
  goldText(g, "PATHRALU", W / 2, 320, 54, 14);
}

function drawPhoto(g, photoImg) {
  const { x, y, r } = PHOTO;
  g.save();
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.clip();
  if (photoImg?.complete && photoImg.naturalWidth) {
    const scale = Math.max((r * 2) / photoImg.naturalWidth, (r * 2) / photoImg.naturalHeight);
    const w = photoImg.naturalWidth * scale;
    const h = photoImg.naturalHeight * scale;
    g.drawImage(photoImg, x - w / 2, y - h / 2, w, h);
  } else {
    g.fillStyle = "rgba(244, 210, 122, 0.28)";
    g.beginPath();
    g.arc(x, y - 22, r * 0.34, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(x, y + r * 0.78, r * 0.62, r * 0.5, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function drawName(g, name) {
  g.save();
  g.textAlign = "left";
  g.font = `800 26px ${SANS}`;
  g.fillStyle = "#f4d27a";
  spaced(g, "DEVANAGARA VARASUDU", NAME.x, NAME.y - 46, 5);
  const label = (name || "YOUR NAME").toUpperCase();
  g.shadowColor = "rgba(0, 0, 0, 0.7)";
  g.shadowBlur = 10;
  g.shadowOffsetY = 3;
  g.fillStyle = name ? "#fff6dc" : "rgba(255, 246, 220, 0.4)";
  const lines = splitName(g, label);
  if (lines.length === 1) g.fillText(label, NAME.x, NAME.y + 26);
  else {
    const size = Math.min(...lines.map((line) => fitFont(g, line, NAME.maxW, 50, SERIF)));
    g.font = `900 ${size}px ${SERIF}`;
    g.fillText(lines[0], NAME.x, NAME.y + 26 - size * 0.55);
    g.fillText(lines[1], NAME.x, NAME.y + 26 + size * 0.55);
  }
  g.restore();
}

/** Keeps short names on one big line; long multi-word names wrap onto two balanced lines. */
function splitName(g, label) {
  if (fitFont(g, label, NAME.maxW, 68, SERIF) >= 48) return [label];
  const words = label.split(" ");
  if (words.length < 2) return [label];
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const widest = Math.max(...lines.map((line) => g.measureText(line).width));
    if (!best || widest < best.widest) best = { lines, widest };
  }
  return best.lines;
}

function drawHero(g, heroImg) {
  if (!heroImg?.naturalWidth) return;
  const { x, y, w: boxW, h: boxH } = HERO;
  const glow = g.createRadialGradient(x + boxW / 2, y + boxH * 0.55, 20, x + boxW / 2, y + boxH * 0.55, boxW * 0.7);
  glow.addColorStop(0, "rgba(255, 196, 92, 0.35)");
  glow.addColorStop(1, "rgba(255, 196, 92, 0)");
  g.fillStyle = glow;
  g.fillRect(x, y, boxW, boxH);
  const crop = opaqueBounds(heroImg);
  const scale = Math.min(boxW / crop.w, boxH / crop.h);
  const w = crop.w * scale;
  const h = crop.h * scale;
  g.save();
  g.shadowColor = "rgba(0, 0, 0, 0.55)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  g.drawImage(heroImg, crop.x, crop.y, crop.w, crop.h, x + (boxW - w) / 2, y + boxH - h, w, h);
  g.restore();
}

const bounds = new WeakMap();

/** The caricature PNGs carry uneven transparent margins; crop to the visible figure so each fills the frame. */
function opaqueBounds(img) {
  if (bounds.has(img)) return bounds.get(img);
  const full = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  let result = full;
  try {
    const c = document.createElement("canvas");
    c.width = full.w;
    c.height = full.h;
    const cg = c.getContext("2d");
    cg.drawImage(img, 0, 0);
    const data = cg.getImageData(0, 0, full.w, full.h).data;
    let minX = full.w, minY = full.h, maxX = -1, maxY = -1;
    for (let py = 0; py < full.h; py++) {
      for (let px = 0; px < full.w; px++) {
        if (data[(py * full.w + px) * 4 + 3] > 16) {
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
    }
    if (maxX >= minX) result = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  } catch {
    /* unreadable pixels: draw the whole image */
  }
  bounds.set(img, result);
  return result;
}

function drawAmount(g, amount) {
  g.save();
  g.fillStyle = "#fff6dc";
  g.font = `900 28px ${SANS}`;
  spaced(g, "YOU TAKE BACK", AMOUNT.x, AMOUNT.y - 64, 5);
  g.font = `900 25px ${SANS}`;
  spaced(g, "WORTH OF AASTHI", AMOUNT.x, AMOUNT.y + 70, 4);
  g.restore();
  const crore = `₹${formatCrore(amount)} CRORE`;
  goldText(g, crore, AMOUNT.x, AMOUNT.y + 4, fitFont(g, crore, AMOUNT.maxW, 70, SERIF));
}

/** Gold-gradient lettering with a dark drop shadow so it reads on the maroon artwork. */
function goldText(g, text, x, y, size, spacing = 0) {
  g.save();
  g.font = `900 ${size}px ${SERIF}`;
  const grad = g.createLinearGradient(0, y - size / 2, 0, y + size / 2);
  grad.addColorStop(0, "#fff3c4");
  grad.addColorStop(0.45, "#f2c14e");
  grad.addColorStop(1, "#b9822a");
  g.shadowColor = "rgba(0, 0, 0, 0.75)";
  g.shadowBlur = 14;
  g.shadowOffsetY = 5;
  g.fillStyle = grad;
  if (spacing) spaced(g, text, x, y, spacing);
  else g.fillText(text, x, y);
  g.restore();
}

/** Letter-spaced text, anchored by the current textAlign (left or center). */
function spaced(g, text, x, y, spacing) {
  const chars = [...text];
  const widths = chars.map((ch) => g.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cx = g.textAlign === "left" ? x : x - total / 2;
  const align = g.textAlign;
  g.textAlign = "left";
  chars.forEach((ch, i) => {
    g.fillText(ch, cx, y);
    cx += widths[i] + spacing;
  });
  g.textAlign = align;
}

function fitFont(g, text, maxW, size, family) {
  let s = size;
  g.font = `900 ${s}px ${family}`;
  while (g.measureText(text).width > maxW && s > 20) {
    s -= 2;
    g.font = `900 ${s}px ${family}`;
  }
  return s;
}