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
    let dialog = null;
    let timer = null;
    const levels = { I: 1, II: 2, III: 3, IIII: 4, IV: 4, V: 5 };
    function level(text) {
        const match = text.match(/\b(IIII|IV|III|II|I|V)\b/);
        return match ? levels[match[1]] : 0;
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
    }
    function apply() {
        if (timer !== null) clearInterval(timer);
        timer = enabled ? setInterval(refresh, 1000) : null;
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
        // Class-based decoration keeps native inline colors intact on theme reset.
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
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = enabled;
            checkbox.addEventListener("change", () => {
                enabled = checkbox.checked;
                IKTools.util.saveJSON(key, {sovHighlight: enabled});
                apply();
            });
            label.append(checkbox, " Highlight sovereignty claims with no structure or a lower structure level");
            content.appendChild(label);
            document.body.appendChild(content);
            dialog = window.jQuery(content).dialog({title:"UI Tweaks", autoOpen:false,
                width:380, minWidth:280, height:"auto", dialogClass:"flora"});
        }
        dialog.dialog("open");
    }
    IKTools.registerTool({id:"ui-tweaks", name:"UI Tweaks", order:40,
        description:"Optional sovereignty level warnings", init, open});
    window.__IKTOOLS_UI_TWEAKS_LOADED__ = true;
})();
