const fs = require('fs');
const manifest = './dist/asset-manifest.json';
const serverjs = './dist/umi.server.js';

function getUmiAssets() {
  const json = JSON.parse(fs.readFileSync(manifest).toString('utf8'));
  const assets = ['/umi.css', '/umi.js'];
  return assets.map(r => [r, json[r]]);
}

function run() {
  const assets = getUmiAssets();
  let content = fs.readFileSync(serverjs).toString('utf8');
  assets.forEach(([k, v]) => {
    const lastSlashIndex = v.lastIndexOf('/');
    const name = lastSlashIndex >= 0 ? v.slice(lastSlashIndex) : v;
    content = content.replace(k, name);
  });
  fs.writeFileSync(serverjs, content);
}

run();
