#!/usr/bin/env node
'use strict';

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// --- App images (landscape, globe with HTTP arrows - matches app icon.svg) ---
function drawAppImage(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const s = Math.min(width, height);

  // Dark background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1a1a2e');
  bgGrad.addColorStop(1, '#16213e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = s * 0.04;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const cx = width / 2;
  const cy = height * 0.45;
  const r = s * 0.25;

  // Globe circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = s * 0.025;
  ctx.stroke();

  // Horizontal lines
  ctx.lineWidth = s * 0.018;
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.lineWidth = s * 0.014;
  ctx.beginPath(); ctx.moveTo(cx - r * 0.85, cy - r * 0.5); ctx.lineTo(cx + r * 0.85, cy - r * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - r * 0.85, cy + r * 0.5); ctx.lineTo(cx + r * 0.85, cy + r * 0.5); ctx.stroke();

  // Vertical ellipse (meridian)
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.45, r, 0, 0, Math.PI * 2);
  ctx.lineWidth = s * 0.018;
  ctx.stroke();

  // Outgoing arrow top-right
  const ax1 = cx + r * 0.7, ay1 = cy - r * 0.7;
  const ax2 = cx + r * 1.5, ay2 = cy - r * 1.4;
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = s * 0.028;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ax1, ay1); ctx.lineTo(ax2, ay2); ctx.stroke();
  // Arrowhead
  ctx.lineWidth = s * 0.024;
  ctx.beginPath();
  ctx.moveTo(ax2 - s * 0.06, ay2 - s * 0.005);
  ctx.lineTo(ax2 + s * 0.005, ay2 + s * 0.005);
  ctx.lineTo(ax2 - s * 0.005, ay2 + s * 0.065);
  ctx.stroke();

  // Incoming arrow bottom-right
  const bx1 = cx + r * 1.5, by1 = cy + r * 1.4;
  const bx2 = cx + r * 0.7, by2 = cy + r * 0.7;
  ctx.strokeStyle = '#7b2ff7';
  ctx.lineWidth = s * 0.028;
  ctx.beginPath(); ctx.moveTo(bx1, by1); ctx.lineTo(bx2, by2); ctx.stroke();
  // Arrowhead
  ctx.lineWidth = s * 0.024;
  ctx.beginPath();
  ctx.moveTo(bx2 + s * 0.005, by2 + s * 0.06);
  ctx.lineTo(bx2 - s * 0.005, by2 - s * 0.005);
  ctx.lineTo(bx2 + s * 0.065, by2 - s * 0.005);
  ctx.stroke();

  // "HTTP Device" label at bottom
  ctx.font = `800 ${s * 0.065}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HTTP Device', cx, height * 0.88);

  return canvas.toBuffer('image/png');
}

// --- Driver images (square, device panel with buttons - matches driver icon.svg) ---
function drawDriverImage(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cx = s * 0.48;
  const cy = s * 0.45;

  // Device body (angled panel, perspective from right)
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = s * 0.02;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(s * 0.2, s * 0.14);
  ctx.lineTo(s * 0.72, s * 0.1);
  ctx.quadraticCurveTo(s * 0.76, s * 0.1, s * 0.77, s * 0.14);
  ctx.lineTo(s * 0.8, s * 0.78);
  ctx.quadraticCurveTo(s * 0.805, s * 0.83, s * 0.75, s * 0.835);
  ctx.lineTo(s * 0.25, s * 0.87);
  ctx.quadraticCurveTo(s * 0.2, s * 0.875, s * 0.195, s * 0.83);
  ctx.lineTo(s * 0.17, s * 0.18);
  ctx.quadraticCurveTo(s * 0.168, s * 0.14, s * 0.2, s * 0.14);
  ctx.closePath();
  ctx.stroke();

  // Screen area
  ctx.lineWidth = s * 0.013;
  ctx.beginPath();
  ctx.moveTo(s * 0.27, s * 0.2);
  ctx.lineTo(s * 0.68, s * 0.17);
  ctx.quadraticCurveTo(s * 0.7, s * 0.17, s * 0.705, s * 0.19);
  ctx.lineTo(s * 0.72, s * 0.42);
  ctx.quadraticCurveTo(s * 0.722, s * 0.44, s * 0.7, s * 0.445);
  ctx.lineTo(s * 0.29, s * 0.47);
  ctx.quadraticCurveTo(s * 0.27, s * 0.472, s * 0.268, s * 0.45);
  ctx.lineTo(s * 0.255, s * 0.22);
  ctx.quadraticCurveTo(s * 0.253, s * 0.2, s * 0.27, s * 0.2);
  ctx.closePath();
  ctx.stroke();

  // Code brackets on screen  < / >
  ctx.lineWidth = s * 0.016;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // <
  ctx.beginPath();
  ctx.moveTo(s * 0.42, s * 0.28);
  ctx.lineTo(s * 0.38, s * 0.32);
  ctx.lineTo(s * 0.42, s * 0.36);
  ctx.stroke();
  // >
  ctx.beginPath();
  ctx.moveTo(s * 0.56, s * 0.27);
  ctx.lineTo(s * 0.6, s * 0.31);
  ctx.lineTo(s * 0.56, s * 0.35);
  ctx.stroke();
  // /
  ctx.lineWidth = s * 0.012;
  ctx.beginPath();
  ctx.moveTo(s * 0.46, s * 0.37);
  ctx.lineTo(s * 0.52, s * 0.27);
  ctx.stroke();

  // Button row 1 (3 buttons, slight perspective shift)
  ctx.lineWidth = s * 0.013;
  const btnW = s * 0.09, btnH = s * 0.065, btnR = s * 0.015;
  const row1Y = s * 0.53;
  ctx.beginPath(); ctx.roundRect(s * 0.28, row1Y, btnW, btnH, btnR); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(s * 0.41, row1Y - s * 0.01, btnW, btnH, btnR); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(s * 0.54, row1Y - s * 0.02, btnW, btnH, btnR); ctx.stroke();

  // Button row 2
  const row2Y = s * 0.645;
  ctx.beginPath(); ctx.roundRect(s * 0.29, row2Y, btnW, btnH, btnR); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(s * 0.42, row2Y - s * 0.01, btnW, btnH, btnR); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(s * 0.55, row2Y - s * 0.02, btnW, btnH, btnR); ctx.stroke();

  // Power LED
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.79, s * 0.016, 0, Math.PI * 2);
  ctx.lineWidth = s * 0.01;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.79, s * 0.006, 0, Math.PI * 2);
  ctx.fillStyle = '#333333';
  ctx.fill();

  // WiFi arcs above device
  ctx.lineWidth = s * 0.012;
  ctx.beginPath();
  ctx.arc(s * 0.47, s * 0.1, s * 0.04, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = s * 0.009;
  ctx.beginPath();
  ctx.arc(s * 0.47, s * 0.1, s * 0.065, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.globalAlpha = 1;

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
