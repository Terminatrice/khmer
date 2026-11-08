// Prononciation : chaque bouton « écouter » joue un fichier présent dans
// l'app, sans ouvrir de site extérieur. Bug d'origine (08/11/2026) : le bouton
// était un lien vers kheng.info, aucun son ne se jouait dans l'app.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { ouvrirApp } = require("../../../kit-apps/lib/harnais");

let app;
before(async () => { app = await ouvrirApp(__dirname + "/.."); });
after(async () => { if (app) await app.fermer(); });

test("tous les fichiers audio référencés existent et sont des MP3", async () => {
  const r = await app.page.evaluate(async () => {
    const ko = [];
    let n = 0;
    for (const m of EMBED_MOTS) for (const f of (m.audio || [])) {
      n++;
      const rep = await fetch(f);
      const b = new Uint8Array(await rep.arrayBuffer());
      const mp3 = (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) || (b[0] === 0xFF && (b[1] & 0xE0) === 0xE0);
      if (!rep.ok || b.length < 1000 || !mp3) ko.push(`${m.kh} ${f} ${rep.status} ${b.length}`);
    }
    return { n, ko };
  });
  assert.ok(r.n > 100, `seulement ${r.n} fichiers référencés`);
  assert.deepEqual(r.ko, []);
});

test("le Dico n'a plus aucun lien vers un site extérieur pour écouter", async () => {
  await app.page.evaluate(() => go("dico"));
  await app.page.waitForTimeout(300);
  assert.equal(await app.page.locator("a.audio").count(), 0);
  assert.ok(await app.page.locator("button.audio").count() > 0, "aucun bouton écouter");
});

test("cliquer sur écouter charge le fichier du mot, et enchaîne les parties d'un composé", async () => {
  const r = await app.page.evaluate(async () => {
    const simple = EMBED_MOTS.find(m => m.audio && m.audio.length === 1);
    const compose = EMBED_MOTS.find(m => m.audio && m.audio.length > 1);
    jouer(simple.id, null);
    const s1 = LECTEUR.src;
    jouer(compose.id, null);
    const c1 = LECTEUR.src;
    LECTEUR.dispatchEvent(new Event("ended"));
    await new Promise(r => setTimeout(r, 400));
    const c2 = LECTEUR.src;
    return { s1, attenduS: simple.audio[0], c1, c2, attenduC: compose.audio };
  });
  assert.ok(r.s1.endsWith(r.attenduS), r.s1);
  assert.ok(r.c1.endsWith(r.attenduC[0]), r.c1);
  assert.ok(r.c2.endsWith(r.attenduC[1]), r.c2);
  assert.deepEqual(app.erreurs, []);
});
