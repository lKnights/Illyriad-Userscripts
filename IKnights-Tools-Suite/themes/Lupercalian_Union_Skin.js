/*
 * Designed for Illyriad Tools Suite by HoRRis Lupercal.
 *
 * Copyright (c) 2026 HoRRis Lupercal
 * Licensed under the HoRRis Lupercal Non-Commercial License.
 *
 * Integration into IKnights Tools Suite by IKnights contributors.
 */
(function () {
    "use strict";

    if (window.__IKTOOLS_LUPERCALIAN_UNION_SKIN_LOADED__) {
        return;
    }

    if (!window.IKTools?.customizer) {
        throw new Error("Lupercalian Union Skin requires Customizer.");
    }

    window.__IKTOOLS_LUPERCALIAN_UNION_SKIN_LOADED__ = true;

    // ----------------- VVVV -------- ART ASSETS HERE ---------- VVVV ---------------------
    const variables = {
        /* 1. Empty Plot ================================================================ */

        /* 2. Archer's Field ============================================================ */
        "--ik-theme-city-archersfield-off": 'url("https://i.imgur.com/i4tfnQV.png")',
        "--ik-theme-city-archersfield-on": 'url("https://i.imgur.com/i4tfnQV.png")',
        /* 3. Architect's Office ======================================================== */
        "--ik-theme-city-architectsoffice-off": 'url("https://i.imgur.com/7L31ExV.png")',
        "--ik-theme-city-architectsoffice-on": 'url("https://i.imgur.com/7L31ExV.png")',
        /* 4. Arctic Warfare College ==================================================== */

        /* 5. Assassin's Abode ========================================================== */

        /* 6. Barracks ================================================================== */
        "--ik-theme-city-barracks-off": 'url("https://i.imgur.com/wqqMum3.png")',
        "--ik-theme-city-barracks-on": 'url("https://i.imgur.com/wqqMum3.png")',
        /* 7. Blacksmith ================================================================ */
        "--ik-theme-city-blacksmith-off": 'url("https://i.imgur.com/bO2yXXG.png")',
        "--ik-theme-city-blacksmith-on": 'url("https://i.imgur.com/bO2yXXG.png")',
        /* 8. Bookbinder ================================================================ */
        "--ik-theme-city-bookbinder-off": 'url("https://i.imgur.com/LkgWLqV.png")',
        "--ik-theme-city-bookbinder-on": 'url("https://i.imgur.com/LkgWLqV.png")',
        /* 9. Bowyer ==================================================================== */

        /* 10. Brewery ================================================================== */
        "--ik-theme-city-brewery-off": 'url("https://i.imgur.com/QTpQc9q.png")',
        "--ik-theme-city-brewery-on": 'url("https://i.imgur.com/QTpQc9q.png")',
        /* 11. Carpentry ================================================================ */
        "--ik-theme-city-carpenter-off": 'url("https://i.imgur.com/ZnCQM6u.png")',
        "--ik-theme-city-carpenter-on": 'url("https://i.imgur.com/ZnCQM6u.png")',
        /* 12. Cavalry Parade Ground ==================================================== */
        "--ik-theme-city-cavalryparadeground-off": 'url("https://i.imgur.com/hX9hjNV.png")',
        "--ik-theme-city-cavalryparadeground-on": 'url("https://i.imgur.com/hX9hjNV.png")',
        /* 13. Chain Armourer =========================================================== */

        /* 14. Chancery of Estates ====================================================== */

        /* 15. Consulate ================================================================ */
        "--ik-theme-city-consulate-off": 'url("https://i.imgur.com/7lhb1QE.png")',
        "--ik-theme-city-consulate-on": 'url("https://i.imgur.com/z8jkrKn.png")',
        /* 16. Cottage ================================================================== */

        /* 17. Desert Warfare College =================================================== */

        /* 18. Fletcher ================================================================= */

        /* 19. Flourmill ================================================================ */
        "--ik-theme-city-flourmill-off": 'url("https://i.imgur.com/WiQWD3z.png")',
        "--ik-theme-city-flourmill-on": 'url("https://i.imgur.com/WiQWD3z.png")',
        /* 20. Foreign Office =========================================================== */

        /* 21. Forge ==================================================================== */
        "--ik-theme-city-forge-off": 'url("https://i.imgur.com/YlydQof.png")',
        "--ik-theme-city-forge-on": 'url("https://i.imgur.com/YlydQof.png")',
        /* 22. Foundry ================================================================== */

        /* 23. Geomancer's Retreat ====================================================== */

        /* 24. Herbalist's Guild ======================================================== */

        /* 25. Horse Trainer ============================================================ */

        /* 26. Infantry Quarters ======================================================== */
        "--ik-theme-city-infantryquarters-off": 'url("https://i.imgur.com/rxX8vY4.png")',
        "--ik-theme-city-infantryquarters-on": 'url("https://i.imgur.com/rxX8vY4.png")',
        /* 27. Jungle Warfare College =================================================== */

        /* 28. Kiln ===================================================================== */

        /* 29. Leather Armourer ========================================================= */
        "--ik-theme-city-leathersmith-off": 'url("https://i.imgur.com/lnm3VcW.png")',
        "--ik-theme-city-leathersmith-on": 'url("https://i.imgur.com/lnm3VcW.png")',
        /* 30. Library ================================================================== */
        "--ik-theme-city-library-off": 'url("https://i.imgur.com/XQZtDcx.png")',
        "--ik-theme-city-library-on": 'url("https://i.imgur.com/DCDICgU.png")',
        /* 31. Mage Tower =============================================================== */
        "--ik-theme-city-magetower-off": 'url("https://i.imgur.com/MFDf0wI.png")',
        "--ik-theme-city-magetower-on": 'url("https://i.imgur.com/MFDf0wI.png")',
        /* 32. Marketplace ============================================================== */
        "--ik-theme-city-marketplace-off": 'url("https://i.imgur.com/tZ0CfKu.png")',
        "--ik-theme-city-marketplace-on": 'url("https://i.imgur.com/tZ0CfKu.png")',
        /* 33. Merchant's Guild ========================================================= */

        /* 34. Miner's Guild ============================================================ */

        /* 35. Plate Armourer =========================================================== */

        /* 36. Runemaster's Grounding =================================================== */

        /* 37. Saboteur's Sanctuary ===================================================== */

        /* 38. Saddlemaker ============================================================== */
        "--ik-theme-city-saddlemaker-off": 'url("https://i.imgur.com/HjkEBlC.png")',
        "--ik-theme-city-saddlemaker-on": 'url("https://i.imgur.com/HjkEBlC.png")',
        /* 39. Scouts Lookout =========================================================== */

        /* 40. Siege Workshop =========================================================== */

        /* 41. Skinner's Guild ========================================================== */

        /* 42. Spearmaker =============================================================== */

        /* 43. Spearman's Billet ======================================================== */
        "--ik-theme-city-spearmensbillets-off": 'url("https://i.imgur.com/mFe4f6V.png")',
        "--ik-theme-city-spearmensbillets-on": 'url("https://i.imgur.com/mFe4f6V.png")',
        /* 44. Spearsmith =============================================================== */

        /* 45. Spies Hideout ============================================================ */

        /* 46. Stonemason =============================================================== */

        /* 47. Storehouse =============================================================== */

        /* 48. Swordsmith =============================================================== */
        "--ik-theme-city-swordsmith-off": 'url("https://i.imgur.com/KA1mm5q.png")',
        "--ik-theme-city-swordsmith-on": 'url("https://i.imgur.com/KA1mm5q.png")',
        /* 49. Tannery ================================================================== */
        "--ik-theme-city-tanner-off": 'url("https://i.imgur.com/KJNUs7M.png")',
        "--ik-theme-city-tanner-on": 'url("https://i.imgur.com/KJNUs7M.png")',
        /* 50. Tavern =================================================================== */
        "--ik-theme-city-taverna-off": 'url("https://i.imgur.com/myLnMRZ.png")',
        "--ik-theme-city-taverna-on": 'url("https://i.imgur.com/myLnMRZ.png")',
        /* 51. Thieves Den ============================================================== */

        /* 52. Trade Office ============================================================= */

        /* 53. Vault ==================================================================== */

        /* 54. Warehouse ================================================================ */
        "--ik-theme-city-warehouse-off": 'url("https://i.imgur.com/5Aya9sw.png")',
        "--ik-theme-city-warehouse-on": 'url("https://i.imgur.com/5Aya9sw.png")',
        /* 55. Common Ground ============================================================ */
        "--ik-theme-city-commonground-off": 'url("https://i.imgur.com/5vQpFp6.png")',
        "--ik-theme-city-commonground-on": 'url("https://i.imgur.com/5vQpFp6.png")',
        /* 56. Paddock ================================================================== */
        "--ik-theme-city-paddock-off": 'url("https://i.imgur.com/wX3qQII.png")',
        "--ik-theme-city-paddock-on": 'url("https://i.imgur.com/wX3qQII.png")',
        /* 57. Castle Wall ============================================================== */
        "--ik-theme-city-wall-top": 'url("https://i.imgur.com/c22uYZI.png")',
        "--ik-theme-city-wall-bottom": 'url("https://i.imgur.com/Q9JecRZ.png")',
        /* 58. Lumberyard =============================================================== */

        /* 59. Clay Pit ================================================================= */

        /* 60. Iron Mine ================================================================ */

        /* 61. Quarry =================================================================== */

        /* 62. Farmyard ================================================================= */

        /* 63.  ========================================================================= */

        /* 64.  ========================================================================= */
        "--ik-theme-city-map": 'url("https://i.imgur.com/xWmXaI2.jpeg")',
        "--ik-theme-city-road": 'url("https://i.imgur.com/FmKCtP7.png")',
        "--ik-theme-city-trees": 'url("https://i.imgur.com/gTvNWI2.png")',
        
        "--ik-theme-city-castle-off": 'url("https://i.imgur.com/NZkjimR.png")',
        "--ik-theme-city-castle-on": 'url("https://i.imgur.com/NZkjimR.png")',

    };

    function generateVariablesCSS() {
        let cssString = "html.ik-city-lupercalian-union {\n";
        for (const [key, value] of Object.entries(variables)) {
            cssString += `  ${key}: ${value};\n`;
        }
        cssString += "}\n";
        return cssString;
    }

    // 2. CSS Rules mapping image sources to custom theme variables
    const dynamicCityThemeCSS = generateVariablesCSS() + `

    /* 1. Empty Plot ================================================================ */




    /* 2. Archer's Field ============================================================ */
    body.ik-city-lupercalian-union img[src*="03-archersfield_off.png"] {
        content: var(--ik-theme-city-archersfield-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-archersfield_on.png"] {
        content: var(--ik-theme-city-archersfield-on) !important;
    }
    
    /* 3. Architect's Office ======================================================== */
    body.ik-city-lupercalian-union img[src*="03-architectsoffice_off.png"] {
        content: var(--ik-theme-city-architectsoffice-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-architectsoffice_on.png"] {
        content: var(--ik-theme-city-architectsoffice-on) !important;
    }

    /* 4. Arctic Warfare College ==================================================== */




    /* 5. Assassin's Abode ========================================================== */




    /* 6. Barracks ================================================================== */
    body.ik-city-lupercalian-union img[src*="03-barracks_off.png"] {
        content: var(--ik-theme-city-barracks-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-barracks_on.png"] {
        content: var(--ik-theme-city-barracks-on) !important;
    }

    /* 7. Blacksmith ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-blacksmith_off.png"] {
        content: var(--ik-theme-city-blacksmith-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-blacksmith_on.png"] {
        content: var(--ik-theme-city-blacksmith-on) !important;
    }
    
    /* 8. Bookbinder ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-bookbinder_off.png"] {
        content: var(--ik-theme-city-bookbinder-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-bookbinder_on.png"] {
        content: var(--ik-theme-city-bookbinder-on) !important;
    }
    
    /* 9. Bowyer ==================================================================== */




    /* 10. Brewery ================================================================== */
    body.ik-city-lupercalian-union img[src*="03-brewery_off.png"] {
        content: var(--ik-theme-city-brewery-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03- _on.png"] {
        content: var(--ik-theme-city- -on) !important;
    }

    /* 11. Carpentry ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-carpenter_off.png"] {
        content: var(--ik-theme-city-carpenter-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-carpenter_on.png"] {
        content: var(--ik-theme-city-carpenter-on) !important;
    }
    
    /* 12. Cavalry Parade Ground ==================================================== */
    body.ik-city-lupercalian-union img[src*="03-cavalryparadeground_off.png"] {
        content: var(--ik-theme-city-cavalryparadeground-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-cavalryparadeground_on.png"] {
        content: var(--ik-theme-city-cavalryparadeground-on) !important;
    }

    /* 13. Chain Armourer =========================================================== */




    /* 14. Chancery of Estates ====================================================== */




    /* 15. Consulate ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-consulate_off.png"] {
        content: var(--ik-theme-city-consulate-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-consulate_on.png"] {
        content: var(--ik-theme-city-consulate-on) !important;
    }

    /* 16. Cottage ================================================================== */




    /* 17. Desert Warfare College =================================================== */




    /* 18. Fletcher ================================================================= */




    /* 19. Flourmill ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-flourmill_off.png"] {
        content: var(--ik-theme-city-flourmill-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-flourmill_on.png"] {
        content: var(--ik-theme-city-flourmill-on) !important;
    }

    /* 20. Foreign Office =========================================================== */




    /* 21. Forge ==================================================================== */
    body.ik-city-lupercalian-union img[src*="03-forge_off.png"] {
        content: var(--ik-theme-city-forge-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-forge_on.png"] {
        content: var(--ik-theme-city-forge-on) !important;
    }

    /* 22. Foundry ================================================================== */




    /* 23. Geomancer's Retreat ====================================================== */




    /* 24. Herbalist's Guild ======================================================== */




    /* 25. Horse Trainer ============================================================ */




    /* 26. Infantry Quarters ======================================================== */
    body.ik-city-lupercalian-union img[src*="03-infantryquarters_off.png"] {
        content: var(--ik-theme-city-infantryquarters-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-infantryquarters_on.png"] {
        content: var(--ik-theme-city-infantryquarters-on) !important;
    }

    /* 27. Jungle Warfare College =================================================== */




    /* 28. Kiln ===================================================================== */




    /* 29. Leather Armourer ========================================================= */
    body.ik-city-lupercalian-union img[src*="03-leathersmith_off.png"] {
        content: var(--ik-theme-city-leathersmith-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-leathersmith_on.png"] {
        content: var(--ik-theme-city-leathersmith-on) !important;
    }

    /* 30. Library ================================================================== */
    body.ik-city-lupercalian-union img[src*="03-library_off.png"] {
        content: var(--ik-theme-city-library-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-library_on.png"] {
        content: var(--ik-theme-city-library-on) !important;
    }
    
    /* 31. Mage Tower =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-magetower_off.png"] {
        content: var(--ik-theme-city-magetower-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-magetower_on.png"] {
        content: var(--ik-theme-city-magetower-on) !important;
    }
    
    /* 32. Marketplace ============================================================== */
    body.ik-city-lupercalian-union img[src*="03-marketplace_off.png"] {
        content: var(--ik-theme-city-marketplace-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-marketplace_on.png"] {
        content: var(--ik-theme-city-marketplace-on) !important;
    }
    
    /* 33. Merchant's Guild ========================================================= */




    /* 34. Miner's Guild ============================================================ */




    /* 35. Plate Armourer =========================================================== */




    /* 36. Runemaster's Grounding =================================================== */




    /* 37. Saboteur's Sanctuary ===================================================== */




    /* 38. Saddlemaker ============================================================== */
    body.ik-city-lupercalian-union img[src*="03-saddlemaker_off.png"] {
        content: var(--ik-theme-city-saddlemaker-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-saddlemaker_on.png"] {
        content: var(--ik-theme-city-saddlemaker-on) !important;
    }
    
    /* 39. Scouts Lookout =========================================================== */




    /* 40. Siege Workshop =========================================================== */




    /* 41. Skinner's Guild ========================================================== */




    /* 42. Spearmaker =============================================================== */




    /* 43. Spearman's Billet ======================================================== */
    body.ik-city-lupercalian-union img[src*="03-spearmensbillets_off.png"] {
        content: var(--ik-theme-city-spearmensbillets-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-spearmensbillets_on.png"] {
        content: var(--ik-theme-city-spearmensbillets-on) !important;
    }
    
    /* 44. Spearsmith =============================================================== */




    /* 45. Spies Hideout ============================================================ */




    /* 46. Stonemason =============================================================== */




    /* 47. Storehouse =============================================================== */




    /* 48. Swordsmith =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-swordsmith_off.png"] {
        content: var(--ik-theme-city-swordsmith-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-swordsmith_on.png"] {
        content: var(--ik-theme-city-swordsmith-on) !important;
    }

    /* 49. Tannery ================================================================== */
    body.ik-city-lupercalian-union img[src*="03-tanner_off.png"] {
        content: var(--ik-theme-city-tanner-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-tanner_on.png"] {
        content: var(--ik-theme-city-tanner-on) !important;
    }

    /* 50. Tavern =================================================================== */
    body.ik-city-lupercalian-union img[src*="03-taverna_off.png"] {
        content: var(--ik-theme-city-taverna-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-taverna_on.png"] {
        content: var(--ik-theme-city-taverna-on) !important;
    }
    
    /* 51. Thieves Den ============================================================== */




    /* 52. Trade Office ============================================================= */




    /* 53. Vault ==================================================================== */




    /* 54. Warehouse ================================================================ */
    body.ik-city-lupercalian-union img[src*="03-warehouse_off.png"] {
        content: var(--ik-theme-city-warehouse-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-warehouse_on.png"] {
        content: var(--ik-theme-city-warehouse-on) !important;
    }
    
    /* 55. Common Ground ============================================================ */
    body.ik-city-lupercalian-union img[src*="03-commonground_off.png"] {
        content: var(--ik-theme-city-commonground-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-commonground_on.png"] {
        content: var(--ik-theme-city-commonground-on) !important;
    }
    
    /* 56. Paddock ================================================================== */
    body.ik-city-lupercalian-union img[src*="03-paddock_off.png"] {
        content: var(--ik-theme-city-paddock-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-paddock_on.png"] {
        content: var(--ik-theme-city-paddock-on) !important;
    }
    
    /* 57. Castle Wall ============================================================== */
    body.ik-city-lupercalian-union img[src*="03-wall_upper.png"] {
        content: var(--ik-theme-city-wall-top) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-wall_lower.png"] {
        content: var(--ik-theme-city-wall-bottom) !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_upper.png"] {
        background-image: var(--ik-theme-city-wall-top) !important;
        background-size: 1050px !important;
        background-position-y: -1.5% !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_lower.png"] {
        background-image: var(--ik-theme-city-wall-bottom) !important;
        background-size: 1030px !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_lower.png"] fieldset:nth-of-type(2) {
        margin-left: 125px !important;
    }
    
    /* 58. Lumberyard =============================================================== */




    /* 59. Clay Pit ================================================================= */




    /* 60. Iron Mine ================================================================ */




    /* 61. Quarry =================================================================== */




    /* 62. Farmyard ================================================================= */




    /* 63.  ========================================================================= */




    /* 64.  ========================================================================= */


    
    /* ================== MAIN MAP + TREES ===================== */
    body.ik-city-lupercalian-union #townMap img[src*="back.jpg"] {
        content: var(--ik-theme-city-map) !important;
    }
    body.ik-city-lupercalian-union #townMap img[src*="03-roads.png"] {
        content: var(--ik-theme-city-road) !important;
    }
    body.ik-city-lupercalian-union img[src*="lumberwood.png"] {
        content: var(--ik-theme-city-trees) !important;
    }
    
    /* ====================== CASTLE =========================== */
    body.ik-city-lupercalian-union img[src*="03-castle_off.png"] {
        content: var(--ik-theme-city-castle-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-castle_on.png"] {
        content: var(--ik-theme-city-castle-on) !important;
    }

    body.ik-city-lupercalian-union #MainContentDiv img[src*="03-castle_off.png"] {
        width: 169px !important;
        height: 251px !important;
        /* add seperate image with no right margin buffer */
    }

    body.ik-city-lupercalian-union #townMap img[src*="03-castle_off.png"],
    body.ik-city-lupercalian-union #townMap img[src*="03-castle_on.png"] {
        width: 125.5px !important;     /* Adjust width to fit your artwork proportions */
        height: 84.5px !important;    /* Adjust height to fit your artwork proportions */
    }
    
    `;

    function remove() {
        document.documentElement.classList.remove("ik-city-lupercalian-union");
        document.body.classList.remove("ik-city-lupercalian-union");
    }

    // 3. Register the theme with Customizer under category: "city"
    window.IKTools.customizer.registerTheme({
        id: "lupercalian-union-skin",
        name: "Lupercalian Union Skin",
        category: "city",
        author: "HoRRis Lupercal",
        description: "Custom city theme styling buildings and assets for the Lupercalian Union.",
        css: dynamicCityThemeCSS,
        apply() {
            document.documentElement.classList.add("ik-city-lupercalian-union");
            document.body.classList.add("ik-city-lupercalian-union");
        },
        remove
    });

    console.log("IKnights Lupercalian Union Skin module loaded.");
})();
