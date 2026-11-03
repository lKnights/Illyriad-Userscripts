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

    const DEFAULT_PLOT_TEXT_COLOR = "#ffffff";
    const DEFAULT_PLOT_BORDER_COLOR = "rgba(0,0,0,0.6)";
    
    const HEX_COLOR_PATTERN =
        /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
    
    // Empty string means use the default.
    let plotTextColorHex =
        HEX_COLOR_PATTERN.test(saved?.plotTextColor ?? "")
            ? saved.plotTextColor
            : "";
    
    let plotBorderColorHex =
        HEX_COLOR_PATTERN.test(saved?.plotBorderColor ?? "")
            ? saved.plotBorderColor
            : "";
    
    let gradientStartHex =
        HEX_COLOR_PATTERN.test(saved?.gradientStart ?? "")
            ? saved.gradientStart
            : "";
    
    let gradientEndHex =
        HEX_COLOR_PATTERN.test(saved?.gradientEnd ?? "")
            ? saved.gradientEnd
            : "";
    
    // Save all settings together.
    function saveSettings() {
        IKTools.util.saveJSON(key, {
            sovHighlight: enabled,
            plotLabels: plotLabelsEnabled,
            plotTextColor: plotTextColorHex,
            plotBorderColor: plotBorderColorHex,
            gradientStart: gradientStartHex,
            gradientEnd: gradientEndHex
        });
    }
    
    let dialog = null;
    let observer = null;
    
    const levels = { I: 1, II: 2, III: 3, IIII: 4, IV: 4, V: 5 };
    function level(text) {
        const match = text.match(/\b(IIII|IV|III|II|I|V)\b/);
        return match ? levels[match[1]] : 0;
    }
    
    function parseBuildingLevel(titleText) {
        const matchBracketNum = titleText.match(/\[(?:.*?\s+)?(\d+)\]/);
        if (matchBracketNum) return parseInt(matchBracketNum[1], 10);

        const matchParenNum = titleText.match(/\((\d+)\)/);
        if (matchParenNum) return parseInt(matchParenNum[1], 10);

        const matchRoman = titleText.match(/[\[\(]([IVXLCDM]+)[\]\)]/i);
        if (matchRoman) return level(matchRoman[1]);

        return 0;
    }

    function hexToRGBA(hex) {
        let digits = hex.slice(1);
    
        // Expand #RGB into #RRGGBB.
        if (digits.length === 3) {
            digits = [...digits]
                .map(char => char + char)
                .join("");
        }
    
        // Supply full opacity if alpha was omitted.
        if (digits.length === 6) {
            digits += "ff";
        }
    
        // Return [red, green, blue, alpha].
        return [0, 2, 4, 6].map(index =>
            parseInt(digits.slice(index, index + 2), 16)
        );
    }

    function getLevelColor(lvl) {
        // Custom gradient applies only when both colors exist.
        if (gradientStartHex && gradientEndHex) {
            const start = hexToRGBA(gradientStartHex);
            const end = hexToRGBA(gradientEndHex);
    
            // 20 colors, with inclusive endpoints.
            const t = (
                Math.max(1, Math.min(20, lvl)) - 1
            ) / 19;
    
            // Interpolate red, green, blue, and alpha.
            const channels = start.map((value, index) =>
                Math.round(
                    value + (end[index] - value) * t
                )
            );
    
            // Preserve alpha if supplied in either hex code.
            const hasAlpha =
                gradientStartHex.length === 9 ||
                gradientEndHex.length === 9;
    
            return "#" + channels
                .slice(0, hasAlpha ? 4 : 3)
                .map(value =>
                    value.toString(16).padStart(2, "0")
                )
                .join("");
        }
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

    function stylePlotBadge(badge, lvl) {
        badge.style.backgroundColor = getLevelColor(lvl);
        badge.style.color =
            plotTextColorHex || DEFAULT_PLOT_TEXT_COLOR;
        badge.style.padding = "1px 5px";
        badge.style.fontSize = "11px";
        badge.style.fontWeight = "bold";
        badge.style.borderRadius = "3px";
        badge.style.border =
            `1px solid ${plotBorderColorHex || DEFAULT_PLOT_BORDER_COLOR}`;
        badge.style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.4)";
        badge.style.pointerEvents = "none";
    }

    function refreshSov() {
        if (!enabled) {
            document.querySelectorAll("#sovAccordion a.ik-sov-imbalance").forEach(link => {
                link.classList.remove("ik-sov-imbalance");
            });
            return;
        }
        document.querySelectorAll("#sovAccordion h3").forEach(header => {
            const link = header.querySelector("a");
            if (!link) return;
            const spans = link.querySelectorAll("span");
            const claim = spans[0]?.textContent || "";
            const structure = spans[1]?.textContent || "";
            const mismatch = spans.length >= 2 &&
                (/No Structure Present/i.test(structure) ||
                    (level(structure) > 0 && level(structure) < level(claim)));
            link.classList.toggle("ik-sov-imbalance", mismatch);
        });
    }

    function refreshPlotLabels(force = false) {
        const mapImg = document.querySelector('img[usemap="#townMapOutline"]');
        if (!mapImg) {
            removePlotLabels();
            return;
        }

        const mapContainer = document.getElementById("mapZoomMove") || mapImg.parentNode;
        if (!mapContainer) return;

        let container = document.getElementById("ikTownPlotLabelsContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "ikTownPlotLabelsContainer";
            container.style.position = "absolute";
            container.style.left = "0px";
            container.style.top = "0px";
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.pointerEvents = "none";
            // Set z-index to 1 so labels stay under popups, tooltips, and dropdown menus like #citiesMenu
            container.style.zIndex = "1";
            
            if (window.getComputedStyle(mapContainer).position === "static") {
                mapContainer.style.position = "relative";
            }
            mapContainer.appendChild(container);
        }

        const areas = document.querySelectorAll('map[name="townMapOutline"] area');
        if (!force && container.children.length === areas.length) return;

        container.innerHTML = "";

        if (!plotLabelsEnabled) return;

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
            stylePlotBadge(badge, lvl);

            container.appendChild(badge);
        });
    }

    function removePlotLabels() {
        const container = document.getElementById("ikTownPlotLabelsContainer");
        if (container) container.remove();
    }

    function initObserver() {
        if (observer) return;
        observer = new MutationObserver(() => {
            refreshSov();
            if (plotLabelsEnabled) {
                if (document.querySelector('img[usemap="#townMapOutline"]')) {
                    refreshPlotLabels();
                } else {
                    removePlotLabels();
                }
            } else {
                removePlotLabels();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function apply() {
        if (enabled || plotLabelsEnabled) {
            initObserver();
        } else {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
        refreshSov();
        if (plotLabelsEnabled) {
            refreshPlotLabels();
        } else {
            removePlotLabels();
        }
    }

    function init() {
        if (document.getElementById("ikUITweaksStyles")) return true;
        const style = document.createElement("style");
        style.id = "ikUITweaksStyles";
        style.textContent = `
            /* Sovereignty warning highlighting */
            #sovAccordion a.ik-sov-imbalance {
                background-color: var(--ik-theme-warning-highlight, #ff000042) !important;
            }
        
            /* Accordion headers */
            #ikUITweaksAccordion > h3 {
                display: block !important;
                position: relative !important;
                box-sizing: border-box !important;
        
                padding: 10px 12px 10px 34px !important;
                min-height: 38px !important;
                line-height: 18px !important;
        
                font-size: 13px !important;
                cursor: pointer;
                margin: 0 0 3px 0 !important;
            }
        
            /* Hide default accordion icon */
            #ikUITweaksAccordion .ui-accordion-header-icon {
                display: none !important;
            }
        
            /* Collapsed arrow */
            #ikUITweaksAccordion > h3::before {
                content: "";
                position: absolute;
                left: 12px;
                top: 50%;
        
                width: 0;
                height: 0;
        
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 6px solid currentColor;
        
                transform: translateY(-50%);
                pointer-events: none;
            }
        
            /* Expanded arrow */
            #ikUITweaksAccordion > h3.ui-state-active::before {
                transform: translateY(-50%) rotate(90deg);
            }
        
            /* Checkbox labels */
            #ikUITweaksAccordion label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                cursor: pointer;
            }
        
            /* Expanded accordion panel */
            #ikUITweaksAccordion > .ui-accordion-content {
                padding: 12px 12px 12px 34px !important;
            }

            #ikUITweaksAccordion label {
                border-bottom-style: solid !important;
                border-bottom-width: 1px !important;
                padding-top: 10px !important;
                padding-bottom: 10px !important;
                border-bottom-color: inherit !important;
            }

            #ikUITweaksAccordion .ik-plot-color-controls label {
                border-bottom-color: inherit !important;
            }

            #ikUITweaksAccordion .ik-plot-color-controls label span {
                width: 60% !important;
            }
        
            /* Existing zero-value styling */
            body.ik-dark-mode #citiesMenu span.ik-zero-value {
                color: #ff5555 !important;
                font-weight: bold;
            }

            #ikUITweaksAccordion .ik-plot-color-row > input {
                flex: 1;
                min-width: 0;
                box-sizing: border-box;
                padding: 4px 6px;
                font-size: 12px;
            }
            
            /* Validation failure */
            #ikUITweaksAccordion input.ik-color-invalid {
                background-color: #8b2222 !important;
                color: #ffffff !important;
            }
            
            /* Apply button */
            #ikUITweaksAccordion .ik-plot-color-controls > button {
                align-self: flex-start;
                padding: 5px 15px;
                margin-top: 4px;
                cursor: pointer;
            }

            /* Custom Gradient section */
            #ikUITweaksAccordion .ik-plot-gradient-section {
                margin-top: 12px;
                padding-top: 10px;
                border-top: 1px solid rgba(128,128,128,0.35);
            }
            
            /* Gradient Preview section */
            #ikUITweaksAccordion .ik-plot-gradient-preview {
                margin-top: 12px;
                padding-top: 10px;
                border-top: 1px solid rgba(128,128,128,0.35);
            }
            
            /* Section headings */
            #ikUITweaksAccordion .ik-plot-gradient-section h4,
            #ikUITweaksAccordion .ik-plot-gradient-preview h4 {
                margin: 0 0 8px;
                font-size: 12px;
                font-weight: bold;
            }
            
            /* Preview sample boxes */
            #ikUITweaksAccordion .ik-gradient-preview-labels {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
            }
            
        `;
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
            
            const accordion = document.createElement("div");
            accordion.id = "ikUITweaksAccordion";
            content.appendChild(accordion);

            const sovHeader = document.createElement("h3");
            sovHeader.textContent = "Sovereignty Claim Warnings";
            
            const sovPanel = document.createElement("div");
            
            accordion.append(sovHeader, sovPanel);
            
            const label1 = document.createElement("label");
            const checkbox1 = document.createElement("input");
            checkbox1.type = "checkbox";
            checkbox1.checked = enabled;
            checkbox1.addEventListener("change", () => {
                enabled = checkbox1.checked;
                saveSettings();
                apply();
            });
            label1.append(checkbox1, " Highlight sovereignty claims with no structure or a lower structure level");
            sovPanel.appendChild(label1);

            const plotHeader = document.createElement("h3");
            plotHeader.textContent = "Town Building Plot Labels";
            
            const plotPanel = document.createElement("div");
            
            accordion.append(plotHeader, plotPanel);
            
            const label2 = document.createElement("label");
            const checkbox2 = document.createElement("input");
            checkbox2.type = "checkbox";
            checkbox2.checked = plotLabelsEnabled;
            checkbox2.addEventListener("change", () => {
                plotLabelsEnabled = checkbox2.checked;
                saveSettings();
                apply();
            });
            label2.append(checkbox2, " Display level labels on town building plots");
            plotPanel.appendChild(label2);

            /* Plot label color controls */
            const colorControls = document.createElement("div");
            colorControls.className = "ik-plot-color-controls";
            
            // Create a labeled text input.
            function addColorInput(caption, initialValue, parent = colorControls) {
                const row = document.createElement("label");
                row.className = "ik-plot-color-row";
            
                const text = document.createElement("span");
                text.textContent = caption;
            
                const input = document.createElement("input");
                input.type = "text";
                input.value = initialValue;
                input.placeholder = "Default";
                input.autocomplete = "off";
                input.spellcheck = false;
            
                // Only remove the error when the field is cleared.
                // Do not validate while the user is typing.
                input.addEventListener("input", () => {
                    if (input.value.trim() === "") {
                        input.classList.remove("ik-color-invalid");
                    }
                });
            
                row.append(text, input);
                parent.appendChild(row);
            
                return input;
            }
            
            // Create both fields.
            const textColorInput = addColorInput(
                "Text Color",
                plotTextColorHex
            );
            
            const borderColorInput = addColorInput(
                "Border Color",
                plotBorderColorHex
            );

            /* Custom Gradient section */
            const gradientSection = document.createElement("div");
            gradientSection.className = "ik-plot-gradient-section";
            
            const gradientHeading = document.createElement("h4");
            gradientHeading.textContent = "Custom Gradient";
            
            gradientSection.appendChild(gradientHeading);
            
            // Gradient start color
            const gradientStartInput = addColorInput(
                "Start Point",
                gradientStartHex,
                gradientSection
            );
            
            // Gradient end color
            const gradientEndInput = addColorInput(
                "End Point",
                gradientEndHex,
                gradientSection
            );
            
            colorControls.appendChild(gradientSection);
            
            // Create the Apply button.
            const applyColorsButton = document.createElement("button");
            applyColorsButton.type = "button";
            applyColorsButton.textContent = "Apply";
            
            applyColorsButton.addEventListener("click", () => {
            
                // Validate only when Apply is clicked.
                function readColor(input) {
                    const value = input.value.trim();
            
                    const invalid =
                        value !== "" &&
                        !HEX_COLOR_PATTERN.test(value);
            
                    // Highlight invalid nonempty values.
                    input.classList.toggle(
                        "ik-color-invalid",
                        invalid
                    );
            
                    // Empty or invalid means use the default.
                    return invalid ? "" : value;
                }
            
                plotTextColorHex = readColor(textColorInput);
                plotBorderColorHex = readColor(borderColorInput);
                
                gradientStartHex = readColor(gradientStartInput);
                gradientEndHex = readColor(gradientEndInput);
            
                // Persist the settings.
                saveSettings();
                refreshGradientPreview();
            
                // Force existing labels to redraw.
                if (plotLabelsEnabled) {
                    refreshPlotLabels(true);
                }
            });
            
            colorControls.appendChild(applyColorsButton);
            
            /* Gradient preview section */
            const previewSection = document.createElement("div");
            previewSection.className = "ik-plot-gradient-preview";
            
            const previewHeading = document.createElement("h4");
            previewHeading.textContent = "Gradient Preview";
            
            const previewBadges = document.createElement("div");
            previewBadges.className = "ik-gradient-preview-labels";
            
            previewSection.append(previewHeading, previewBadges);
            colorControls.appendChild(previewSection);
            
            // Draw the seven requested level samples.
            function refreshGradientPreview() {
                previewBadges.replaceChildren();
            
                const sampleLevels = [1, 5, 7, 10, 13, 17, 20];
            
                sampleLevels.forEach(lvl => {
                    const badge = document.createElement("span");
                    badge.className = "ik-plot-label";
                    badge.textContent = String(lvl);
            
                    // Use exactly the same styling as map labels.
                    stylePlotBadge(badge, lvl);
            
                    previewBadges.appendChild(badge);
                });
            }
            
            // Initially show the currently applied gradient.
            refreshGradientPreview();
            
            plotPanel.appendChild(colorControls);

            document.body.appendChild(content);

            if (typeof window.jQuery.fn.accordion === "function") {
                window.jQuery(accordion).accordion({
                    header: "> h3",
                    collapsible: true,
                    active: false,
                    heightStyle: "content"
                });
            }
            
            dialog = window.jQuery(content).dialog({title:"UI Tweaks", autoOpen:false,
                width:380, minWidth:280, height:"auto", dialogClass:"flora"});
        }
        dialog.dialog("open");
    }

    IKTools.registerTool({id:"ui-tweaks", name:"UI Tweaks", order:40,
        description:"Optional UI enhancements and warnings", init, open});
    window.__IKTOOLS_UI_TWEAKS_LOADED__ = true;
})();
