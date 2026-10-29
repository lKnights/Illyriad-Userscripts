// ==UserScript==
// @name         Illyriad Tools Suite (HoRRis Test Version)
// @namespace    IKnights
// @version      0.14.01
// @description  Integrated tools and interface customization for Illyriad.
// @author       IKnights
//
// @match        https://elgea.illyriad.co.uk/*
// @match        http://elgea.illyriad.co.uk/*
//
// @updateURL    https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/HoRRis_Test_Branch/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
// @downloadURL  https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/HoRRis_Test_Branch/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
//
// @grant        none
// @run-at       document-idle
// @license      IKnights Non-Commercial
// ==/UserScript==


(function () {
    "use strict";
    if (window.__IKTOOLS_BOOT_STARTED__) return;
    window.__IKTOOLS_BOOT_STARTED__ = true;

    const SUITE_BASE = "https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/HoRRis_Test_Branch/IKnights-Tools-Suite/";
    const status = window.IKToolsLoadStatus = Object.create(null);

    function resolveSuiteFile(file) {
        const path = typeof file === "string" ? file.trim() : "";
        if (!path || path.startsWith("/") || path.includes("..") ||
            !/^[A-Za-z0-9._/-]+$/.test(path)) {
            throw new Error("Invalid suite module path: " + path);
        }
        const url = new URL(path, SUITE_BASE);
        if (!url.href.startsWith(SUITE_BASE)) throw new Error("Module is outside suite directory.");
        return url.href;
    }

    async function fetchFresh(url, version) {
        const fresh = new URL(url);
        if (version) fresh.searchParams.set("v", String(version));
        fresh.searchParams.set("_ik", String(Date.now()));
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(fresh.href, {cache:"no-store", signal:controller.signal});
            if (!response.ok) throw new Error("HTTP " + response.status + " loading " + url);
            // Keep the timeout active while the response body downloads too.
            return {text:await response.text(), sourceUrl:fresh.href};
        } finally {
            clearTimeout(timeout);
        }
    }

    function validateManifest(manifest) {
        if (!manifest || manifest.manifestVersion !== 1 || !manifest.core || !Array.isArray(manifest.modules)) {
            throw new Error("Unsupported or incomplete suite manifest.");
        }
        resolveSuiteFile(manifest.core.file);
        const seen = new Set(["core"]);
        for (const module of manifest.modules) {
            if (!module || !/^[a-z0-9-]+$/.test(module.id || "") || seen.has(module.id)) {
                throw new Error("Missing, invalid or duplicate module id.");
            }
            resolveSuiteFile(module.file);
            if (module.requires !== undefined && !Array.isArray(module.requires)) {
                throw new Error("Invalid dependencies for " + module.id);
            }
            for (const dependency of module.requires || []) {
                if (!seen.has(dependency)) throw new Error(module.id + " requires an earlier module: " + dependency);
            }
            seen.add(module.id);
        }
    }

    async function loadModule(module, id) {
        status[id] = {state:"loading", file:module.file};
        try {
            const result = await fetchFresh(resolveSuiteFile(module.file), module.version || "0");
            window.eval(result.text + "\n//# sourceURL=" + result.sourceUrl);
            status[id] = {state:"loaded", file:module.file, version:module.version};
        } catch (error) {
            status[id] = {state:"failed", file:module.file, error:String(error)};
            throw error;
        }
    }

    async function bootSuite() {
        try {
            const result = await fetchFresh(SUITE_BASE + "manifest.json");
            const manifest = JSON.parse(result.text);
            validateManifest(manifest);
            await loadModule(manifest.core, "core");
            if (typeof window.IKTools?.init !== "function") throw new Error("Core did not provide IKTools.init.");

            // Preserve manifest order. Dependencies must precede their consumers.
            // A failed optional module must not prevent unrelated tools starting.
            for (const module of manifest.modules) {
                if (module.enabled === false) {
                    status[module.id] = {state:"disabled"};
                    continue;
                }
                const unavailable = (module.requires || []).filter(id => status[id]?.state !== "loaded");
                if (unavailable.length) {
                    status[module.id] = {state:"skipped", dependencies:unavailable};
                    console.warn("IKTools skipped " + module.id + ": unavailable dependencies", unavailable);
                    continue;
                }
                try {
                    await loadModule(module, module.id);
                } catch (error) {
                    console.error("IKTools could not load " + module.id + "; continuing with other modules.", error);
                }
            }
            window.IKTools.init();
            console.log("Illyriad Tools Suite started.", status);
        } catch (error) {
            status.boot = {state:"failed", error:String(error)};
            console.error("Illyriad Tools Suite failed to start:", error);
        }
    }
    bootSuite();
})();
