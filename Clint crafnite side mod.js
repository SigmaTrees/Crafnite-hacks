// ==UserScript==
// @name         Craftnite.io Compact Performance Client
// @version      1.2
// @description  Small UI, Anti-Stutter, and FPS Boost
// @author       Adaptive Collaborator
// @match        *://craftnite.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. SMALL FPS SHOWER ---
    const fpsDiv = document.createElement('div');
    fpsDiv.style = "position:fixed; top:5px; left:5px; color:#0f0; font-family:monospace; font-size:14px; z-index:9999; background:rgba(0,0,0,0.5); padding:3px; border-radius:3px; pointer-events:none;";
    document.body.appendChild(fpsDiv);

    let lastTime = performance.now();
    let frameCount = 0;
    function updateFPS() {
        let now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
            fpsDiv.innerText = `FPS: ${frameCount}`;
            frameCount = 0;
            lastTime = now;
        }
        requestAnimationFrame(updateFPS);
    }
    updateFPS();

    // --- 2. COMPACT MENU ---
    const menu = document.createElement('div');
    menu.style = "position:fixed; bottom:10px; right:10px; z-index:9999; display:flex; flex-direction:column; gap:4px; background:rgba(0,0,0,0.8); padding:6px; border-radius:5px; width: 120px;";
    document.body.appendChild(menu);

    // --- 3. STUTTER FIX & FPS BOOST (The Logic) ---
    const boostStyles = document.createElement('style');
    boostStyles.innerHTML = `
        /* Disable heavy effects that cause stuttering */
        * {
            text-shadow: none !important;
            box-shadow: none !important;
            animation: none !important;
            transition: none !important;
        }
        /* Force GPU to focus on the game canvas */
        canvas {
            image-rendering: optimizeSpeed !important;
            image-rendering: -moz-crisp-edges !important;
            image-rendering: pixelated !important;
            will-change: transform !important;
        }
    `;

    let isBoosted = false;
    const boostBtn = document.createElement('button');
    boostBtn.innerText = "FPS BOOST: OFF";
    boostBtn.style = "padding:4px; cursor:pointer; background:#555; color:white; border:none; border-radius:3px; font-size:10px; font-weight:bold;";

    boostBtn.onclick = () => {
        isBoosted = !isBoosted;
        if (isBoosted) {
            document.head.appendChild(boostStyles);
            boostBtn.innerText = "FPS BOOST: ON";
            boostBtn.style.background = "#2ea44f";
        } else {
            if (document.head.contains(boostStyles)) document.head.removeChild(boostStyles);
            boostBtn.innerText = "FPS BOOST: OFF";
            boostBtn.style.background = "#555";
        }
    };
    menu.appendChild(boostBtn);

    // --- 4. MINI SERVER CHANGER ---
    const regionContainer = document.createElement('div');
    regionContainer.style = "display:flex; gap:2px;";
    menu.appendChild(regionContainer);

    ['EU', 'US', 'ASIA'].forEach(region => {
        const btn = document.createElement('button');
        btn.innerText = region;
        btn.style = "flex:1; padding:3px; cursor:pointer; background:#333; color:#ccc; border:1px solid #444; border-radius:2px; font-size:9px;";
        btn.onclick = () => {
            window.location.href = `https://craftnite.io{region.toLowerCase()}`;
        };
        regionContainer.appendChild(btn);
    });

})();