import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const imageAsset = name => { readFileSync(path.join(root, 'assets', name)); return 'assets/' + name; };
const artwork = readFileSync(path.join(root, 'visuals.js'), 'utf8').replace('/* HERO_ASSETS */ null', () => JSON.stringify({
  portrait: imageAsset('zhaoyun-reference.png'),
  hero: imageAsset('zhaoyun-actions-v1.png'),
  units: imageAsset('chibi-units-v1.png'),
  walk: imageAsset('zhaoyun-walk-v2.png'),
  chapter: imageAsset('chapter1-units-v2.png'),
  attack: imageAsset('zhaoyun-attack-v3.png'),
}));
const html = readFileSync(path.join(root, 'shell.html'), 'utf8')
  .replace('/* GAME_STYLES */', readFileSync(path.join(root, 'styles.css'), 'utf8'))
  .replace('/* GAME_SCRIPT */', () => artwork + '\n' + ['stages.js', 'campaign.js', 'mobile-controls.js', 'game.js'].map(name => readFileSync(path.join(root, name), 'utf8')).join('\n'));
writeFileSync(path.join(root, 'index.html'), html);
console.log('已生成手机版 index.html；角色图片独立缓存，请一并部署 assets/。');
