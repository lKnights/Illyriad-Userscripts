/*
 * Sovereignty warning adapted from LuperTweaks by HoRRis Lupercal.
 * Copyright (c) 2026 HoRRis Lupercal
 * Licensed under the HoRRis Lupercal Non-Commercial License.
 */
(function () {
    "use strict";
    if (window.__IKTOOLS_UI_TWEAKS_LOADED__) return;
    const IKTools = window.IKTools;
    if (!IKTools?.registerTool) throw new Error("UI Tweaks requires Core.");
    
    const key = "ikUITweaks.settings.v1";
    const legacy = IKTools.util.loadJSON("ikLuperTweaks.settings.v1", {}) || {};
    const saved = IKTools.util.loadJSON(key, null);
    
    let enabled = saved ? saved.sovHighlight === true : legacy.sovHighlight === true;
    let plotLabelsEnabled = saved ? saved.plotLabels === true : false;
    
    let dialog = null;
    let timer = null;
    
    const levels = { I: 1, II: 2, III: 3, IIII: 4, IV: 4, V: 5 };
    function level(text) {
        const match = text.match(/\b(IIII|IV|III|II|I|V)\b/);
        return match ? levels[match[1]] : 0;
    }
    
    function parseBuildingLevel(titleText) {
        const matchNum = titleText.match(/\((\d+)\)/);
        if (matchNum) return parseInt(matchNum[1], 10);
        const matchRoman = titleText.match(/\(([IVXLCDM]+)\)/i);
        if (matchRoman) return level(matchRoman[1]);
        return 0;
    }

    function getLevelColor(lvl) {
        const ratio = Math.max(0, Math.min(20, lvl)) / 20;
        let hue;
        if (ratio <= 0.33) {
            hue = (ratio / 0.33) * 35; // Red to Orange (0 - 35)
        } else if (ratio <= 0.66) {
            hue = 35 + ((ratio - 0.33) / 0.33) * 25; // Orange to Yellow (35 - 60)
        } else {
            hue = 60 + ((ratio - 0.66) / 0.34) * 60; // Yellow to Green (60 - 120)
        }
        return `hsl(${hue}, 90%, 40%)`;
    }

    function refreshPlotLabels() {
        const mapImg = document.querySelector('img[usemap="#townBuildingArea"]');
        if (!mapImg) {
            removePlotLabels();
            return;
        }

        let container = document.getElementById("ikTownPlotLabelsContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "ikTownPlotLabelsContainer";
            container.style.position = "absolute";
            container.style.pointerEvents = "none";
            container.style.zIndex = "100";
            
            if (mapImg.parentNode) {
                if (window.getComputedStyle(mapImg.parentNode).position === "static") {
                    mapImg.parentNode.style.position = "relative";
                }
                mapImg.parentNode.appendChild(container);
            }
        }

        container.style.left = mapImg.offsetLeft + "px";
        container.style.top = mapImg.offsetTop + "px";
        container.style.width = mapImg.width + "px";
        container.style.height = mapImg.height + "px";
        container.innerHTML = "";

        if (!plotLabelsEnabled) return;

        const areas = document.querySelectorAll('map[name="townBuildingArea"] area');
        areas.forEach(area => {
            const title = area.getAttribute("title") || "";
            const coordsStr = area.getAttribute("coords");
            if (!coordsStr) return;

            const lvl = parseBuildingLevel(title);
            const coords = coordsStr.split(',').map(Number);
            if (coords.length < 4) return;

            const [x1, y1, x2, y2] = coords;
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;

            const badge = document.createElement("div");
            badge.className = "ik-plot-label";
            badge.textContent = lvl;
            badge.style.position = "absolute";
            badge.style.left = `${centerX}px`;
            badge.style.top = `${centerY}px`;
            badge.style.transform = "translate(-50%, -50%)";
            badge.style.backgroundColor = getLevelColor(lvl);
            badge.style.color = "#ffffff";
            badge.style.padding = "1px 5px";
            badge.style.fontSize = "11px";
            badge.style.fontWeight = "bold";
            badge.style.borderRadius = "3px";
            badge.style.border = "1px solid rgba(0,0,0,0.6)";
            badge.style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
            badge.style.pointerEvents = "auto";

            container.appendChild(badge);
        });
    }

    function removePlotLabels() {
        const container = document.getElementById("ikTownPlotLabelsContainer");
        if (container) container.remove();
    }

    function refresh() {
        document.querySelectorAll("#sovAccordion h3").forEach(header => {
            const link = header.querySelector("a");
            if (!link) return;
            const spans = link.querySelectorAll("span");
            const claim = spans[0]?.textContent || "";
            const structure = spans[1]?.textContent || "";
            const mismatch = spans.length >= 2 &&
                (/No Structure Present/i.test(structure) ||
                    (level(structure) > 0 && level(structure) < level(claim)));
            link.classList.toggle("ik-sov-imbalance", enabled && mismatch);
        });
        
        if (plotLabelsEnabled) {
            refreshPlotLabels();
        } else {
            removePlotLabels();
        }
    }

    function apply() {
        if (timer !== null) clearInterval(timer);
        timer = (enabled || plotLabelsEnabled) ? setInterval(refresh, 1000) : null;
        refresh();
    }

    function init() {
        if (document.getElementById("ikUITweaksStyles")) return true;
        const style = document.createElement("style");
        style.id = "ikUITweaksStyles";
        style.textContent = `#sovAccordion a.ik-sov-imbalance {
            background-color: var(--ik-theme-warning-highlight, #ff000042) !important;
        }
        body.ik-dark-mode #citiesMenu span.ik-zero-value { color: #ff5555 !important; font-weight: bold; }`;
        document.head.appendChild(style);

        const updateZeros = () => {
            if (!document.body.classList.contains("ik-dark-mode")) return;
            document.querySelectorAll("#citiesMenu .cityMenu span").forEach(span => {
                span.classList.toggle("ik-zero-value", span.textContent.trim() === "0");
            });
        };
        setInterval(updateZeros, 1000);
        apply();
        return true;
    }

    function open() {
        if (!window.jQuery?.fn?.dialog) return;
        if (!dialog) {
            const content = document.createElement("div");
            content.id = "ikUITweaks";
            content.style.display = "flex";
            content.style.flexDirection = "column";
            content.style.gap = "8px";

            const label1 = document.createElement("label");
            const checkbox1 = document.createElement("input");
            checkbox1.type = "checkbox";
            checkbox1.checked = enabled;
            checkbox1.addEventListener("change", () => {
                enabled = checkbox1.checked;
                IKTools.util.saveJSON(key, { sovHighlight: enabled, plotLabels: plotLabelsEnabled });
                apply();
            });
            label1.append(checkbox1, " Highlight sovereignty claims with no structure or a lower structure level");
            content.appendChild(label1);

            const label2 = document.createElement("label");
            const checkbox2 = document.createElement("input");
            checkbox2.type = "checkbox";
            checkbox2.checked = plotLabelsEnabled;
            checkbox2.addEventListener("change", () => {
                plotLabelsEnabled = checkbox2.checked;
                IKTools.util.saveJSON(key, { sovHighlight: enabled, plotLabels: plotLabelsEnabled });
                apply();
            });
            label2.append(checkbox2, " Display level labels on town building plots");
            content.appendChild(label2);

            document.body.appendChild(content);
            dialog = window.jQuery(content).dialog({title:"UI Tweaks", autoOpen:false,
                width:380, minWidth:280, height:"auto", dialogClass:"flora"});
        }
        dialog.dialog("open");
    }

    IKTools.registerTool({id:"ui-tweaks", name:"UI Tweaks", order:40,
        description:"Optional UI enhancements and warnings", init, open});
    window.__IKTOOLS_UI_TWEAKS_LOADED__ = true;
})();
