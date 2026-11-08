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
        "--ik-theme-city-archersfield-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122861/Soviet_Snowy_Archerfield_off.png")',
        "--ik-theme-city-archersfield-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122974/Soviet_Snowy_Archerfield_on.png")',
        /* 3. Architect's Office ======================================================== */
        "--ik-theme-city-architectsoffice-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122861/Soviet_Snowy_Architect_off.png")',
        "--ik-theme-city-architectsoffice-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122974/Soviet_Snowy_Architect_on.png")',
        /* 4. Arctic Warfare College ==================================================== */

        /* 5. Assassin's Abode ========================================================== */

        /* 6. Barracks ================================================================== */
        "--ik-theme-city-barracks-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122861/Soviet_Snowy_Barracks_off.png")',
        "--ik-theme-city-barracks-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122974/Soviet_Snowy_Barracks_on.png")',
        /* 7. Blacksmith ================================================================ */
        "--ik-theme-city-blacksmith-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122861/Soviet_Snowy_Blacksmith_off.png")',
        "--ik-theme-city-blacksmith-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122984/Soviet_Snowy_Blacksmith_on.png")',
        /* 8. Bookbinder ================================================================ */
        "--ik-theme-city-bookbinder-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122862/Soviet_Snowy_Bookbinder_off.png")',
        "--ik-theme-city-bookbinder-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122985/Soviet_Snowy_Bookbinder_on.png")',
        /* 9. Bowyer ==================================================================== */
        "--ik-theme-city-bowyer-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122863/Soviet_Snowy_Bowyer_off.png")',
        "--ik-theme-city-bowyer-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122988/Soviet_Snowy_Bowyer_on.png")',
        /* 10. Brewery ================================================================== */
        "--ik-theme-city-brewery-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122862/Soviet_Snowy_Brewery_off.png")',
        "--ik-theme-city-brewery-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122995/Soviet_Snowy_Brewery_on.png")',
        /* 11. Carpentry ================================================================ */
        "--ik-theme-city-carpenter-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122862/Soviet_Snowy_Carpentry_Small_off.png")',
        "--ik-theme-city-carpenter-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122996/Soviet_Snowy_Carpentry_Small_on.png")',
        /* 12. Cavalry Parade Ground ==================================================== */
        "--ik-theme-city-cavalryparadeground-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122865/Soviet_Snowy_Cavground_off.png")',
        "--ik-theme-city-cavalryparadeground-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123007/Soviet_Snowy_Cavground_on.png")',
        /* 13. Chain Armourer =========================================================== */

        /* 14. Chancery of Estates ====================================================== */

        /* 15. Consulate ================================================================ */
        "--ik-theme-city-consulate-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122866/Soviet_Snowy_Consulate_off.png")',
        "--ik-theme-city-consulate-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123008/Soviet_Snowy_Consulate_on.png")',
        /* 16. Cottage ================================================================== */

        /* 17. Desert Warfare College =================================================== */

        /* 18. Fletcher ================================================================= */
        "--ik-theme-city-fletcher-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122869/Soviet_Snowy_fletcher_off.png")',
        "--ik-theme-city-fletcher-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123021/Soviet_Snowy_fletcher_on.png")',
        /* 19. Flourmill ================================================================ */
        "--ik-theme-city-flourmill-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122869/Soviet_Snowy_Flourmill_off.png")',
        "--ik-theme-city-flourmill-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123021/Soviet_Snowy_Flourmill_on.png")',
        /* 20. Foreign Office =========================================================== */

        /* 21. Forge ==================================================================== */
        "--ik-theme-city-forge-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122870/Soviet_Snowy_Forge_off.png")',
        "--ik-theme-city-forge-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123208/Soviet_Snowy_Forge_on.png")',
        /* 22. Foundry ================================================================== */
        "--ik-theme-city-foundry-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122869/Soviet_Snowy_Foundry_off.png")',
        "--ik-theme-city-foundry-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123209/Soviet_Snowy_Foundry_on.png")',
        /* 23. Geomancer's Retreat ====================================================== */

        /* 24. Herbalist's Guild ======================================================== */
        "--ik-theme-city-herbalist-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122870/Soviet_Snowy_herbalist_off.png")',
        "--ik-theme-city-herbalist-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123220/Soviet_Snowy_herbalist_on.png")',
        /* 25. Horse Trainer ============================================================ */

        /* 26. Infantry Quarters ======================================================== */
        "--ik-theme-city-infantryquarters-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122874/Soviet_Snowy_infantryquarter_off.png")',
        "--ik-theme-city-infantryquarters-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123221/Soviet_Snowy_infantryquarter_on.png")',
        /* 27. Jungle Warfare College =================================================== */

        /* 28. Kiln ===================================================================== */
        "--ik-theme-city-kiln-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122874/Soviet_Snowy_kiln_off.png")',
        "--ik-theme-city-kiln-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123232/Soviet_Snowy_kiln_on.png")',
        /* 29. Leather Armourer ========================================================= */
        "--ik-theme-city-leathersmith-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122875/Soviet_Snowy_Leatherworker_off.png")',
        "--ik-theme-city-leathersmith-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123232/Soviet_Snowy_Leatherworker_on.png")',
        /* 30. Library ================================================================== */
        "--ik-theme-city-library-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122875/Soviet_Snowy_Library_off.png")',
        "--ik-theme-city-library-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123243/Soviet_Snowy_Library_on.png")',
        /* 31. Mage Tower =============================================================== */
        "--ik-theme-city-magetower-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122875/Soviet_Snowy_Mage_Small_off.png")',
        "--ik-theme-city-magetower-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123255/Soviet_Snowy_Mage_Small_on.png")',
        /* 32. Marketplace ============================================================== */
        "--ik-theme-city-marketplace-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122882/Soviet_Snowy_Marketplace_off.png")',
        "--ik-theme-city-marketplace-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123264/Soviet_Snowy_Marketplace_on.png")',
        /* 33. Merchant's Guild ========================================================= */

        /* 34. Miner's Guild ============================================================ */
        "--ik-theme-city-miner-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122881/Soviet_Snowy_minersguild_off.png")',
        "--ik-theme-city-miner-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123270/Soviet_Snowy_minersguild_on.png")',
        /* 35. Plate Armourer =========================================================== */

        /* 36. Runemaster's Grounding =================================================== */

        /* 37. Saboteur's Sanctuary ===================================================== */

        /* 38. Saddlemaker ============================================================== */
        "--ik-theme-city-saddlemaker-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122882/Soviet_Snowy_Saddlemaker_off.png")',
        "--ik-theme-city-saddlemaker-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123283/Soviet_Snowy_Saddlemaker_on.png")',
        /* 39. Scouts Lookout =========================================================== */

        /* 40. Siege Workshop =========================================================== */

        /* 41. Skinner's Guild ========================================================== */
        "--ik-theme-city-trapper-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122918/Soviet_Snowy_trapper_off.png")',
        "--ik-theme-city-trapper-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123366/Soviet_Snowy_trapper_on.png")',
        /* 42. Spearmaker =============================================================== */
        "--ik-theme-city-spearmaker-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122891/Soviet_Snowy_Spearmaker_off.png")',
        "--ik-theme-city-spearmaker-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123295/Soviet_Snowy_Spearmaker_on.png")',
        /* 43. Spearman's Billet ======================================================== */
        "--ik-theme-city-spearmensbillets-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122882/Soviet_Snowy_Spearbillet_off.png")',
        "--ik-theme-city-spearmensbillets-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123294/Soviet_Snowy_Spearbillet_on.png")',
        /* 44. Spearsmith =============================================================== */
        "--ik-theme-city-spearsmith-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122892/Soviet_Snowy_Spearsmith_off.png")',
        "--ik-theme-city-spearsmith-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123318/Soviet_Snowy_stonemason_on.png")',
        /* 45. Spies Hideout ============================================================ */

        /* 46. Stonemason =============================================================== */
        "--ik-theme-city-stonemason-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122892/Soviet_Snowy_stonemason_off.png")',
        "--ik-theme-city-stonemason-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123331/Soviet_Snowy_Storehouse_on.png")',
        /* 47. Storehouse =============================================================== */
        "--ik-theme-city-storehouse-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122903/Soviet_Snowy_Storehouse_off.png")',
        "--ik-theme-city-storehouse-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123331/Soviet_Snowy_Storehouse_on.png")',
        /* 48. Swordsmith =============================================================== */
        "--ik-theme-city-swordsmith-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122904/Soviet_Snowy_Swordsmith_off.png")',
        "--ik-theme-city-swordsmith-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123342/Soviet_Snowy_Swordsmith_on.png")',
        /* 49. Tannery ================================================================== */
        "--ik-theme-city-tanner-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122904/Soviet_Snowy_tanner_off.png")',
        "--ik-theme-city-tanner-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123343/Soviet_Snowy_tanner_on.png")',
        /* 50. Tavern =================================================================== */
        "--ik-theme-city-taverna-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122904/Soviet_Snowy_tavern_off.png")',
        "--ik-theme-city-taverna-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123355/Soviet_Snowy_tavern_on.png")',
        /* 51. Thieves Den ============================================================== */

        /* 52. Trade Office ============================================================= */
        "--ik-theme-city-tradeoffice-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122907/Soviet_Snowy_Tradeoffice_off.png")',
        "--ik-theme-city-tradeoffice-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123355/Soviet_Snowy_Tradeoffice_on.png")',
        /* 53. Vault ==================================================================== */
        "--ik-theme-city-vault-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122919/Soviet_Snowy_vault_off.png")',
        "--ik-theme-city-vault-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123367/Soviet_Snowy_vault_on.png")',
        /* 54. Warehouse ================================================================ */
        "--ik-theme-city-warehouse-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122931/Soviet_Snowy_Warehouse_off.png")',
        "--ik-theme-city-warehouse-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123391/Soviet_Snowy_Warehouse_on.png")',
        /* 55. Common Ground ============================================================ */
        "--ik-theme-city-commonground-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122882/Soviet_Snowy_Pasture_Small_off.png")',
        "--ik-theme-city-commonground-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123282/Soviet_Snowy_Pasture_Small_on.png")',
        /* 56. Paddock ================================================================== */
        "--ik-theme-city-paddock-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122882/Soviet_Snowy_Paddock_off.png")',
        "--ik-theme-city-paddock-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123271/Soviet_Snowy_Paddock_on.png")',
        /* 57. Castle Wall ============================================================== */
        "--ik-theme-city-wall-top": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122919/Soviet_Snowy_Wall_Bottom_Final_off.png")',
        "--ik-theme-city-wall-bottom": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122919/Soviet_Snowy_Wall_Bottom_Final_off.png")',
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
        
        "--ik-theme-city-castle-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794122864/Soviet_Snowy_Castle_Smaller_off.png")',
        "--ik-theme-city-castle-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1794123006/Soviet_Snowy_Castle_Smaller_on.png")',

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
    body.ik-city-lupercalian-union img[src*="03-bowyer_off.png"] {
        content: var(--ik-theme-city-bowyer-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-bowyer_on.png"] {
        content: var(--ik-theme-city-bowyer-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-fletcher_off.png"] {
        content: var(--ik-theme-city-fletcher-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-fletcher_on.png"] {
        content: var(--ik-theme-city-fletcher-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-foundry_off.png"] {
        content: var(--ik-theme-city-foundry-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-foundry_on.png"] {
        content: var(--ik-theme-city-foundry-on) !important;
    }

    /* 23. Geomancer's Retreat ====================================================== */




    /* 24. Herbalist's Guild ======================================================== */
    body.ik-city-lupercalian-union img[src*="03-herbalist_off.png"] {
        content: var(--ik-theme-city-herbalist-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-herbalist_on.png"] {
        content: var(--ik-theme-city-herbalist-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-kiln_off.png"] {
        content: var(--ik-theme-city-kiln-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-kiln_on.png"] {
        content: var(--ik-theme-city-kiln-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-miner_off.png"] {
        content: var(--ik-theme-city-miner-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-miner_on.png"] {
        content: var(--ik-theme-city-miner-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-trapper_off.png"] {
        content: var(--ik-theme-city-trapper-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-trapper_on.png"] {
        content: var(--ik-theme-city-trapper-on) !important;
    }

    /* 42. Spearmaker =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-spearmaker_off.png"] {
        content: var(--ik-theme-city-spearmaker-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-spearmaker_on.png"] {
        content: var(--ik-theme-city-spearmaker-on) !important;
    }

    /* 43. Spearman's Billet ======================================================== */
    body.ik-city-lupercalian-union img[src*="03-spearmensbillets_off.png"] {
        content: var(--ik-theme-city-spearmensbillets-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-spearmensbillets_on.png"] {
        content: var(--ik-theme-city-spearmensbillets-on) !important;
    }
    
    /* 44. Spearsmith =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-spearsmith_off.png"] {
        content: var(--ik-theme-city-spearsmith-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-spearsmith_on.png"] {
        content: var(--ik-theme-city-spearsmith-on) !important;
    }

    /* 45. Spies Hideout ============================================================ */




    /* 46. Stonemason =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-stonemason_off.png"] {
        content: var(--ik-theme-city-stonemason-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-stonemason_on.png"] {
        content: var(--ik-theme-city-stonemason-on) !important;
    }

    /* 47. Storehouse =============================================================== */
    body.ik-city-lupercalian-union img[src*="03-storehouse_off.png"] {
        content: var(--ik-theme-city-storehouse-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-storehouse_on.png"] {
        content: var(--ik-theme-city-storehouse-on) !important;
    }

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
    body.ik-city-lupercalian-union img[src*="03-tradeoffice_off.png"] {
        content: var(--ik-theme-city-tradeoffice-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-tradeoffice_on.png"] {
        content: var(--ik-theme-city-tradeoffice-on) !important;
    }

    /* 53. Vault ==================================================================== */
    body.ik-city-lupercalian-union img[src*="03-vault_off.png"] {
        content: var(--ik-theme-city-vault-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-vault_on.png"] {
        content: var(--ik-theme-city-vault-on) !important;
    }

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
