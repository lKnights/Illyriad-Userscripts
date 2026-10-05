// ==UserScript==
// @name         IKnights Tools Suite
// @namespace    IKnights
// @version      0.13.0
// @description  IKnights' integrated Illyriad tools suite.
// @author       IKnights
//
// @match        https://elgea.illyriad.co.uk/*
// @match        http://elgea.illyriad.co.uk/*
//
// @updateURL    https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/main/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
// @downloadURL  https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/main/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
//
// @grant        none
// @run-at       document-idle
// @license      IKnights Non-Commercial
// ==/UserScript==


(function () {
    "use strict";


    // =========================================================================
    // IKNIGHTS TOOLS SUITE BOOTSTRAP
    //
    // This file should rarely need to change.
    //
    // Core, tools and features are controlled by manifest.json.
    // =========================================================================


    const SUITE_BASE =
        "https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/main/IKnights-Tools-Suite/";


    const MANIFEST_URL =
        SUITE_BASE +
        "manifest.json";


    // =========================================================================
    // URL HELPERS
    // =========================================================================

    function makeFreshUrl(
        url,
        version
    ) {
        const result =
            new URL(
                url
            );


        if (version) {
            result.searchParams.set(
                "v",
                String(
                    version
                )
            );
        }


        /*
         * Prevent a stale GitHub Raw/CDN/browser copy.
         */
        result.searchParams.set(
            "_ik",
            String(
                Date.now()
            )
        );


        return result.href;
    }


    function resolveSuiteFile(
        file
    ) {
        const path =
            String(
                file ||
                ""
            ).trim();


        /*
         * Manifest modules must remain inside the suite directory.
         */
        if (
            !path ||
            path.includes(
                ".."
            ) ||
            !/^[A-Za-z0-9._/-]+$/.test(
                path
            )
        ) {
            throw new Error(
                `Invalid suite module path: ${path}`
            );
        }


        return new URL(
            path,
            SUITE_BASE
        ).href;
    }


    // =========================================================================
    // NETWORK
    // =========================================================================

    async function fetchJson(
        url
    ) {
        const response =
            await fetch(
                makeFreshUrl(
                    url
                ),
                {
                    cache:
                        "no-store"
                }
            );


        if (
            !response.ok
        ) {
            throw new Error(
                `HTTP ${response.status} while loading ${url}`
            );
        }


        return response.json();
    }


    async function fetchModuleCode(
        file,
        version
    ) {
        const url =
            resolveSuiteFile(
                file
            );


        const freshUrl =
            makeFreshUrl(
                url,
                version
            );


        const response =
            await fetch(
                freshUrl,
                {
                    cache:
                        "no-store"
                }
            );


        if (
            !response.ok
        ) {
            throw new Error(
                `HTTP ${response.status} while loading ${file}`
            );
        }


        return {
            code:
                await response.text(),

            sourceUrl:
                freshUrl
        };
    }


    // =========================================================================
    // MODULE EXECUTION
    // =========================================================================

    function executeModule(
        code,
        sourceUrl
    ) {
        /*
         * Give Firefox DevTools a useful filename if an error occurs.
         */
        const executable =
            `${code}\n//# sourceURL=${sourceUrl}`;


        /*
         * Modules are executed in the same page environment used by the
         * existing suite, so they retain access to Illyriad and window.IKTools.
         */
        window.eval(
            executable
        );
    }


    async function loadModule(
        module,
        label
    ) {
        if (
            !module ||
            !module.file
        ) {
            throw new Error(
                `${label} is missing its file path in manifest.json.`
            );
        }


        const result =
            await fetchModuleCode(
                module.file,
                module.version ||
                    "0"
            );


        executeModule(
            result.code,
            result.sourceUrl
        );


        console.log(
            `IKnights Tools loaded ${label} v${module.version || "0"}.`
        );
    }


    // =========================================================================
    // BOOT
    // =========================================================================

    async function bootSuite() {
        try {
            console.log(
                "IKnights Tools Suite checking manifest..."
            );


            const manifest =
                await fetchJson(
                    MANIFEST_URL
                );


            if (
                !manifest ||
                !manifest.core
            ) {
                throw new Error(
                    "Suite manifest does not define a core module."
                );
            }


            /*
             * CORE MUST LOAD FIRST.
             */
            await loadModule(
                manifest.core,
                "Core"
            );


            /*
             * Then load all enabled suite modules in manifest order.
             */
            const modules =
                Array.isArray(
                    manifest.modules
                )
                    ? manifest.modules
                    : [];


            for (
                const module of
                modules
            ) {
                if (
                    module.enabled ===
                    false
                ) {
                    continue;
                }


                await loadModule(
                    module,
                    module.name ||
                        module.id ||
                        module.file
                );
            }


            /*
             * Everything has registered itself.
             * Start the suite.
             */
            if (
                !window.IKTools ||
                typeof window.IKTools.init !==
                    "function"
            ) {
                throw new Error(
                    "IKnights Tools Core loaded, but IKTools.init was not found."
                );
            }


            window.IKTools.init();


            console.log(
                "IKnights Tools Suite started."
            );


        } catch (
            error
        ) {
            console.error(
                "IKnights Tools Suite failed to start:",
                error
            );
        }
    }


    bootSuite();

})();
