// ==UserScript==
// @name         Simple Craftnite Hack - Sigma_Trees Performance Edition
// @match        *://craftnite.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. THE GUI
    const menu = document.createElement('div');
    menu.style = "position:fixed;top:150px;left:15px;background:rgba(0,0,0,0.7);color:#0f0;padding:10px;border:1px solid #0f0;font-family:monospace;z-index:9999;pointer-events:none;min-width:150px;";
    menu.innerHTML = `
        <b style="color:white">Sigma_Trees hacks</b><br>
        <b style="color:white">HACK BINDS</b><br>
        [F] Fly: <span id="s-fly">OFF</span><br>
        [V] Speed: <span id="s-speed">OFF</span><br>
        [I] Inf Ammo: <span id="s-ammo">OFF</span><br>
        [G] ESP: <span id="s-esp">OFF</span><br>
        [N] No Fog/Boost: <span id="s-fog">OFF</span><br>
        <hr style="border-color:#0f0">
        <div style="font-size:11px;color:cyan">FPS: <span id="s-fps">0</span></div>
        <hr style="border-color:#0f0">
        <span style="font-size:10px;color:#aaa">Space: Up / Shift: Down</span><br>
        <span style="font-size:10px;color:#0f0">Crosshair: Active</span>
    `;
    document.body.appendChild(menu);

    // 2. THE CROSSHAIR
    const crosshair = document.createElement('div');
    crosshair.style = "position:fixed;top:50%;left:50%;width:4px;height:4px;background:lime;margin:-2px 0 0 -2px;border-radius:50%;z-index:10000;pointer-events:none;box-shadow:0 0 2px black;";
    document.body.appendChild(crosshair);

    let hacks = { fly: false, speed: false, ammo: false, esp: false, fog: false, hitboxes: [] };

    // 3. FPS TRACKER LOGIC
    let lastTime = performance.now();
    let frameCount = 0;
    function getFPS() {
        let now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
            document.getElementById('s-fps').innerText = frameCount;
            frameCount = 0;
            lastTime = now;
        }
        requestAnimationFrame(getFPS);
    }
    requestAnimationFrame(getFPS);

    // 4. KEYBIND LISTENER
    window.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === "INPUT" || document.activeElement.id === "chat") return;
        const key = e.key.toLowerCase();

        if (key === 'f') {
            hacks.fly = !hacks.fly;
            if (typeof G !== 'undefined') G.CONFIG.a143 = hacks.fly;
            updateUI('fly');
        }
        if (key === 'v') {
            hacks.speed = !hacks.speed;
            updateUI('speed');
        }
        if (key === 'i') {
            hacks.ammo = !hacks.ammo;
            if (typeof GAME !== 'undefined' && GAME.a865) {
                if (hacks.ammo) {
                    window._oldAmmoFunc = GAME.a865.player.updatea809Total;
                    GAME.a865.player.updatea809Total = function(){};
                } else if (window._oldAmmoFunc) {
                    GAME.a865.player.updatea809Total = window._oldAmmoFunc;
                }
            }
            updateUI('ammo');
        }
        if (key === 'g') {
            hacks.esp = !hacks.esp;
            if (!hacks.esp) clearESP();
            updateUI('esp');
        }
        if (key === 'n') {
            hacks.fog = !hacks.fog;
            if (typeof GAME !== 'undefined' && GAME.a865.scene) {
                if (hacks.fog) {
                    // NO FOG + FPS BOOST
                    window._oldFog = GAME.a865.scene.fog.far;
                    GAME.a865.scene.fog.far = 1000000;
                    // Disable shadows for performance boost
                    if(GAME.a865.renderer) GAME.a865.renderer.shadowMap.enabled = false;
                } else {
                    GAME.a865.scene.fog.far = window._oldFog || 500;
                    if(GAME.a865.renderer) GAME.a865.renderer.shadowMap.enabled = true;
                }
            }
            updateUI('fog');
        }
    });

    function updateUI(id) {
        const el = document.getElementById('s-' + id);
        if (el) {
            el.innerText = hacks[id] ? 'ON' : 'OFF';
            el.style.color = hacks[id] ? 'cyan' : '#0f0';
        }
    }

    function clearESP() {
        hacks.hitboxes.forEach(h => { if (h.parent) h.parent.remove(h); });
        hacks.hitboxes = [];
        if (typeof G !== 'undefined' && G.othera822ers) {
            G.othera822ers.forEach(p => { if(p) delete p.hitbox; });
        }
    }

    // 5. MAIN LOOP
    setInterval(() => {
        if (typeof GAME === 'undefined' || !GAME.a865 || typeof G === 'undefined' || !window.THREE) return;

        if (hacks.speed && G.Keybinds.moveForward.a730) GAME.a865.player.vZ = 2.5;

        if (hacks.fly) {
            if (G.Keybinds.jump.a730) GAME.a865.player.position.y += 0.5;
            if (G.Keybinds.crouch.a730) GAME.a865.player.position.y -= 0.5;
        }

        if (hacks.esp) {
            G.othera822ers.forEach(p => {
                try {
                    if (p && p.a240 && !p.hitbox) {
                        const geo = new window.THREE.BoxGeometry(1, 1, 1);
                        const mat = new window.THREE.MeshBasicMaterial({color: "pink", depthTest: false, transparent: true, opacity: 0.6});
                        const box = new window.THREE.Mesh(geo, mat);
                        box.scale.set(3, 10, 3);
                        box.renderOrder = 10000;
                        p.a240.add(box);
                        p.hitbox = box;
                        hacks.hitboxes.push(box);
                    }
                } catch(e) {}
            });
        }
    }, 50);

})();
