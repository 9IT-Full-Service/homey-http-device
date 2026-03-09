#!/usr/bin/env node
'use strict';

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// --- App images (landscape format, dark theme with device illustration) ---
function drawAppImage(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const scale = width / 1000;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1a1a2e');
  bgGrad.addColorStop(1, '#16213e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid pattern
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 30 * scale;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Device body (smart device)
  const devX = width * 0.32, devY = height * 0.15;
  const devW = width * 0.36, devH = height * 0.5;
  const devR = 16 * scale;

  ctx.beginPath();
  ctx.roundRect(devX, devY, devW, devH, devR);
  ctx.fillStyle = '#232946';
  ctx.fill();
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Screen
  const scrX = devX + devW * 0.1, scrY = devY + devH * 0.12;
  const scrW = devW * 0.8, scrH = devH * 0.52;
  ctx.beginPath();
  ctx.roundRect(scrX, scrY, scrW, scrH, 6 * scale);
  ctx.fillStyle = '#0d1b2a';
  ctx.fill();

  // </> on screen
  ctx.font = `bold ${28 * scale}px monospace`;
  ctx.fillStyle = '#00d4ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('</>', scrX + scrW / 2, scrY + scrH / 2);

  // Power LED
  ctx.beginPath();
  ctx.arc(devX + devW / 2, devY + devH * 0.82, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff88';
  ctx.fill();

  // WiFi arcs above device
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
  ctx.lineWidth = 2 * scale;
  for (let i = 0; i < 3; i++) {
    const r = (12 + i * 10) * scale;
    ctx.beginPath();
    ctx.arc(devX + devW / 2, devY - 5 * scale, r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.globalAlpha = 0.7 - i * 0.2;
  }
  ctx.globalAlpha = 1;

  // Arrows (HTTP requests)
  ctx.strokeStyle = '#7b2ff7';
  ctx.lineWidth = 3 * scale;
  // Right arrow
  const arrowRx = devX + devW + 20 * scale;
  const arrowRy = devY + devH * 0.4;
  ctx.beginPath(); ctx.moveTo(arrowRx, arrowRy); ctx.lineTo(arrowRx + 60 * scale, arrowRy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(arrowRx + 50 * scale, arrowRy - 8 * scale); ctx.lineTo(arrowRx + 62 * scale, arrowRy); ctx.lineTo(arrowRx + 50 * scale, arrowRy + 8 * scale); ctx.stroke();

  // Left arrow
  ctx.strokeStyle = '#00d4ff';
  const arrowLx = devX - 20 * scale;
  const arrowLy = devY + devH * 0.4;
  ctx.beginPath(); ctx.moveTo(arrowLx, arrowLy); ctx.lineTo(arrowLx - 60 * scale, arrowLy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(arrowLx - 50 * scale, arrowLy - 8 * scale); ctx.lineTo(arrowLx - 62 * scale, arrowLy); ctx.lineTo(arrowLx - 50 * scale, arrowLy + 8 * scale); ctx.stroke();

  // "HTTP" label at bottom
  const pillW = 200 * scale, pillH = 44 * scale;
  const pillX = (width - pillW) / 2, pillY = height * 0.75;
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
  pillGrad.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
  pillGrad.addColorStop(1, 'rgba(123, 47, 247, 0.15)');
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fillStyle = pillGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.font = `800 ${22 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#00d4ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillText('HTTP', width / 2, pillY + pillH / 2);

  return canvas.toBuffer('image/png');
}

// --- Driver images (square, white background, device icon) ---
function drawDriverImage(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 500;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size * 0.42;

  // Device body
  const devW = size * 0.44, devH = size * 0.42;
  const devX = cx - devW / 2, devY = cy - devH / 2;
  ctx.beginPath();
  ctx.roundRect(devX, devY, devW, devH, 14 * scale);
  ctx.fillStyle = '#f0f4f8';
  ctx.fill();
  ctx.strokeStyle = '#4A90D9';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Screen
  const scrW = devW * 0.76, scrH = devH * 0.48;
  const scrX = cx - scrW / 2, scrY = devY + devH * 0.12;
  ctx.beginPath();
  ctx.roundRect(scrX, scrY, scrW, scrH, 6 * scale);
  ctx.fillStyle = '#e8eef4';
  ctx.fill();

  // </> on screen
  ctx.font = `bold ${24 * scale}px monospace`;
  ctx.fillStyle = '#4A90D9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('</>', cx, scrY + scrH / 2);

  // Power LED
  ctx.beginPath();
  ctx.arc(cx, devY + devH * 0.82, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#34c759';
  ctx.fill();

  // WiFi arcs
  ctx.strokeStyle = '#4A90D9';
  ctx.lineWidth = 2 * scale;
  for (let i = 0; i < 2; i++) {
    const r = (10 + i * 9) * scale;
    ctx.globalAlpha = 0.6 - i * 0.2;
    ctx.beginPath();
    ctx.arc(cx, devY - 6 * scale, r, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Arrows
  ctx.lineWidth = 2.5 * scale;
  // Right
  ctx.strokeStyle = '#4A90D9';
  const rx = devX + devW + 10 * scale, ry = cy;
  ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + 35 * scale, ry); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx + 28 * scale, ry - 6 * scale); ctx.lineTo(rx + 37 * scale, ry); ctx.lineTo(rx + 28 * scale, ry + 6 * scale); ctx.stroke();
  // Left
  const lx = devX - 10 * scale, ly = cy;
  ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - 35 * scale, ly); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lx - 28 * scale, ly - 6 * scale); ctx.lineTo(lx - 37 * scale, ly); ctx.lineTo(lx - 28 * scale, ly + 6 * scale); ctx.stroke();

  // "HTTP" label
  ctx.font = `800 ${20 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = '#4A90D9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HTTP', cx, size * 0.82);

  return canvas.toBuffer('image/png');
}

// Generate all images
const basePath = path.join(__dirname);

const appImages = [
  { name: 'small.png', w: 250, h: 175 },
  { name: 'large.png', w: 500, h: 350 },
  { name: 'xlarge.png', w: 1000, h: 700 },
];

const driverImages = [
  { name: 'small.png', size: 75 },
  { name: 'large.png', size: 500 },
  { name: 'xlarge.png', size: 1000 },
];

for (const img of appImages) {
  const outPath = path.join(basePath, 'assets', 'images', img.name);
  fs.writeFileSync(outPath, drawAppImage(img.w, img.h));
  console.log(`Created ${outPath}`);
}

for (const img of driverImages) {
  const outPath = path.join(basePath, 'drivers', 'http-device', 'assets', 'images', img.name);
  fs.writeFileSync(outPath, drawDriverImage(img.size));
  console.log(`Created ${outPath}`);
}

console.log('Done!');
