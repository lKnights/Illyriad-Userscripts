// Run with Node.js: node IKnights-Tools-Suite/tests/merge.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
function environment(seed = {}) {
    const storage = new Map(Object.entries(seed));
    const nodes = new Map();
    const intervals = new Map();
    let nextTimer = 1;
    const element = () => {
        const classes = new Set();
        return {textContent:'', style:{}, children:[],
            classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),
                toggle(c,on) { if(on) classes.add(c); else classes.delete(c); }},
            appendChild(node) { this.children.push(node); if(node.id) nodes.set(node.id,node); return node; },
            remove() { nodes.delete(this.id); }, querySelector:()=>null, querySelectorAll:()=>[],
            addEventListener(){}};
    };
    const document = {head:element(),body:element(),documentElement:element(),
        querySelector:selector=>selector.startsWith('#') ? nodes.get(selector.slice(1)) || null : null,
        querySelectorAll:()=>[],getElementById:id=>nodes.get(id)||null,createElement:element};
    const context = vm.createContext({document, URL, AbortController,
        console:{log(){},warn(){},error(){}}, location:{hash:'',pathname:'/'},
        localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))},
        setInterval:fn=>{const id=nextTimer++;intervals.set(id,fn);return id;},clearInterval:id=>intervals.delete(id),
        setTimeout,clearTimeout,
        MutationObserver:class {observe(){} disconnect(){}},
        navigator:{clipboard:{writeText:async()=>{}}}});
    context.window = context;
    context.eval = code => vm.runInContext(code, context);
    return {context, storage, document, nodes, intervals, element};
}
const run = (env,file,expose='') => {
    let code = read(file);
    if(expose) code = code.replace(/\}\)\(\);\s*$/, expose+'\n})();');
    vm.runInContext(code,env.context,{filename:file});
};
test('all manifest sources parse and modules register against the real Core', () => {
    const e = environment();
    run(e,manifest.core.file);
    for(const module of manifest.modules) run(e,module.file);
    for(const id of ['quartermaster','customizer','catalogue','ui-tweaks']) assert.ok(e.context.IKTools.tools[id],id);
    assert.ok(e.context.IKTools.sidebarTabs.notes);
    assert.equal(e.context.IKTools.customizer.getSettings().interfaceTheme,'native');
    assert.equal(e.context.IKTools.customizer.getSettings().cityTheme,'native');
    assert.equal(e.document.body.classList.contains('ik-dark-mode'),false);
    for(const category of ['item','gear','unit']) assert.ok(e.context.LuperCatData[category].length > 0);
});
test('Luper Dark migrates legacy preference, resets completely, and never selects a city theme', () => {
    const e=environment({'ikLuperTweaks.settings.v1':JSON.stringify({darkMode:true})});
    run(e,manifest.core.file);run(e,'features/Customizer.js');run(e,'themes/LuperDark.js');
    assert.equal(e.context.IKTools.customizer.getSettings().interfaceTheme,'luper-dark');
    assert.equal(e.context.IKTools.customizer.getSettings().cityTheme,'native');
    assert.ok(e.document.body.classList.contains('ik-dark-mode'));
    assert.match(e.nodes.get('ikCustomizerStyles').textContent,/--ik-theme-button-short-off/);
    e.context.IKTools.customizer.apply();
    e.context.IKTools.customizer.reset();
    assert.equal(e.document.body.classList.contains('ik-dark-mode'),false);
    assert.equal(e.document.documentElement.classList.contains('ik-dark-mode'),false);
    assert.equal(e.nodes.has('ikCustomizerStyles'),false);
});
test('an existing native Customizer choice takes priority over legacy dark mode', () => {
    const e=environment({'ikLuperTweaks.settings.v1':'{"darkMode":true}',
        'ikCustomizer.settings.v1':'{"enabled":true,"interfaceTheme":"native","cityTheme":"native"}'});
    run(e,manifest.core.file);run(e,'features/Customizer.js');run(e,'themes/LuperDark.js');
    assert.equal(e.context.IKTools.customizer.getSettings().interfaceTheme,'native');
    assert.equal(e.document.body.classList.contains('ik-dark-mode'),false);
});
test('Notes imports HoRRis town/global notes without overwriting newer notes; markup is escaped', () => {
    const e=environment({'ikNotes_7':'old town note','ikNotes_global':'old global note'});
    e.context.Illyriad={Town:{CurrentTownID:7}};
    run(e,manifest.core.file);
    run(e,'features/Notes.js','window.notesTest={loadNote,saveNote,renderClickableText,setGlobal:v=>notesGlobalMode=v};');
    const n=e.context.notesTest;
    assert.equal(n.loadNote(),'old town note');n.saveNote('new town note');
    assert.equal(n.loadNote(),'new town note');
    assert.equal(e.storage.get('ikNotes_7'),'old town note');
    n.setGlobal(true);assert.equal(n.loadNote(),'old global note');
    assert.doesNotMatch(n.renderClickableText('<script>alert(1)</script>'),/<script>/);
});
test('Quartermaster allocations respect inventory caps and capacity', () => {
    const e=environment();run(e,manifest.core.file);
    run(e,'tools/Quartermaster.js','window.allocationTest=allocateWeighted;');
    for(let capacity=0;capacity<=250;capacity++) {
        const entries=[{name:'wood',weight:3,cap:17},{name:'clay',weight:2,cap:130},{name:'iron',weight:1,cap:50}];
        const allocation=e.context.allocationTest(capacity,entries);
        assert.equal(Object.values(allocation).reduce((a,b)=>a+b,0),Math.min(capacity,197));
        for(const entry of entries) assert.ok(allocation[entry.name]>=0 && allocation[entry.name]<=entry.cap);
    }
});
test('sovereignty IV and IIII parse correctly; disabling removes warnings', () => {
    const e=environment({'ikUITweaks.settings.v1':'{"sovHighlight":true}'});
    run(e,manifest.core.file);
    run(e,'features/UITweaks.js','window.tweakTest={level,refresh,disable:()=>enabled=false};');
    assert.equal(e.context.tweakTest.level('Level IV'),4);
    assert.equal(e.context.tweakTest.level('Level IIII'),4);
    const link=e.element();link.querySelectorAll=()=>[{textContent:'Level IV'},{textContent:'Level III'}];
    e.document.querySelectorAll=()=>[{querySelector:()=>link}];
    e.context.tweakTest.refresh();assert.ok(link.classList.contains('ik-sov-imbalance'));
    e.context.tweakTest.disable();e.context.tweakTest.refresh();assert.equal(link.classList.contains('ik-sov-imbalance'),false);
});
async function boot(options={}) {
    const e=environment();let started=0;const loaded=[];
    const m=structuredClone(manifest);if(options.mutate) options.mutate(m);
    e.context.fetch=async url=>{
        const file=new URL(url).pathname.split('/IKnights-Tools-Suite/')[1];
        if(file==='manifest.json') return {ok:true,text:async()=>JSON.stringify(m)};
        loaded.push(file);
        if(file===options.fail) return {ok:false,status:503};
        return {ok:true,text:async()=>file===m.core.file ? 'window.IKTools={init(){window.started();}}' :
            (file===options.throwFile ? 'throw new Error("bad module")' : '')};
    };
    e.context.started=()=>started++;
    run(e,'IKnights-Tools-Suite.user.js');
    for(let i=0;i<30;i++) await new Promise(resolve=>setImmediate(resolve));
    return {e,loaded,started};
}
test('loader isolates network/evaluation failures and skips dependent modules',async()=>{
    for(const failure of [{fail:'data/CatalogueData.js'},{throwFile:'data/CatalogueData.js'}]) {
        const {e,loaded,started}=await boot(failure);
        assert.equal(started,1);
        assert.equal(e.context.IKToolsLoadStatus['catalogue-data'].state,'failed');
        assert.equal(e.context.IKToolsLoadStatus.catalogue.state,'skipped');
        assert.ok(loaded.includes('features/Notes.js'));assert.ok(loaded.includes('themes/LuperDark.js'));
    }
});
test('loader rejects escaping paths and dependency errors before any module executes',async()=>{
    for(const mutate of [m=>m.modules[0].file='//evil.example/code.js',m=>m.modules[0].file='/root.js',
        m=>m.modules[0].file='../outside.js',m=>m.modules[0].requires=['missing'],
        m=>m.modules[1].id=m.modules[0].id]) {
        const result=await boot({mutate});assert.equal(result.started,0);assert.equal(result.loaded.length,0);
    }
});
test('core failure stops boot; disabled dependencies skip consumers',async()=>{
    const failed=await boot({fail:manifest.core.file});assert.equal(failed.started,0);
    const disabled=await boot({mutate:m=>m.modules.find(x=>x.id==='customizer').enabled=false});
    assert.equal(disabled.started,1);assert.equal(disabled.e.context.IKToolsLoadStatus['luper-dark'].state,'skipped');
});
