// Optional real-browser smoke test: npm install, then npm run test:browser.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
    const browser=await chromium.launch({channel:'chrome',headless:true});
    try {
        const page=await browser.newPage();
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        // A local fixture with game-like elements. No requests reach Illyriad.
        await page.route('**/*',route=>route.request().resourceType()==='document'
            ? route.fulfill({contentType:'text/html',body:'<html><head></head><body style="color:rgb(1, 2, 3)"><p id="sample">Native text</p><iframe class="cke_wysiwyg_frame" srcdoc="<html><head></head><body>Editor</body></html>"></iframe><input id="ikCatSearch"><select id="ikCatTypeSelect"></select><div id="ikCatGrid"></div><span id="ikCatCount"></span><span id="ikCatStatus"></span></body></html>'})
            : route.abort());
        await page.goto('https://fixture.invalid/');
        const before=await page.locator('#sample').evaluate(el=>getComputedStyle(el).color);
        await page.evaluate(()=>localStorage.setItem('ikCustomizer.settings.v1',JSON.stringify({enabled:true,interfaceTheme:'luper-dark',cityTheme:'native'})));
        for(const file of ['core/IKTools-Core.js','features/Customizer.js','themes/LuperDark.js','data/CatalogueData.js']) {
            await page.addScriptTag({content:fs.readFileSync(path.join(root,file),'utf8')});
        }
        assert.notEqual(await page.locator('#sample').evaluate(el=>getComputedStyle(el).color),before);
        assert.equal(await page.frames()[1].locator('#ikDarkPanelStyle').count(),1);
        await page.evaluate(()=>IKTools.customizer.reset());
        assert.equal(await page.locator('#sample').evaluate(el=>getComputedStyle(el).color),before);
        assert.equal(await page.frames()[1].locator('#ikDarkPanelStyle').count(),0);
        assert.equal(await page.locator('html.ik-dark-mode, body.ik-dark-mode').count(),0);
        let cat=fs.readFileSync(path.join(root,'tools/Catalogue.js'),'utf8');
        cat=cat.replace(/\}\)\(\);\s*$/,'window.catTest={renderCatalogueGrid,injectCatalogueStyles,setTab:t=>currentTab=t};})();');
        await page.addScriptTag({content:cat});
        await page.evaluate(()=>{document.body.id='ikCatalogue';catTest.injectCatalogueStyles();catTest.setTab('item');catTest.renderCatalogueGrid();});
        const total=await page.locator('.ikcat-card').count();assert.ok(total>50);
        await page.locator('#ikCatSearch').fill('Wood');
        await page.evaluate(()=>catTest.renderCatalogueGrid());
        assert.ok(await page.locator('.ikcat-card').count()<total);
        assert.ok(await page.locator('.ikcat-card').count()>0);
        await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied');}}}));
        await page.locator('.ikcat-card').first().click();
        assert.match(await page.locator('#ikCatStatus').textContent(),/Selected:/);
        assert.deepEqual(errors,[]);
        console.log('Browser smoke passed: theme CSS, native reset, editor cleanup, catalogue search and clipboard-denied fallback. External artwork and live game dialogs were not exercised.');
    } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
