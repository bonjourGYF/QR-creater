const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const readmePath = path.join(root, "README.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("index.html contains the static editor and card-mode behavior", () => {
  assert.ok(fs.existsSync(indexPath), "index.html should exist");
  const html = read(indexPath);

  assert.match(html, /mode=card/);
  assert.match(html, /URLSearchParams/);
  assert.match(html, /function\s+escapeHTML/);
  assert.match(html, /至少填写电话或微信/);
  assert.match(html, /file:\/\//);
  assert.match(html, /tel:/);
  assert.match(html, /downloadQrPng/);
  assert.match(html, /printCard/);
  assert.match(html, /copyGeneratedLink/);
  assert.match(html, /QRCode/);
  assert.doesNotMatch(html, /cdn|unpkg|jsdelivr|cdnjs/i);
});

test("index.html includes required visible fields and privacy hint", () => {
  const html = read(indexPath);

  for (const label of ["标题", "车主称呼", "电话号码", "微信号", "车牌号", "提示语"]) {
    assert.match(html, new RegExp(label));
  }

  assert.match(html, /隐私提示/);
  assert.match(html, /身份证/);
  assert.match(html, /512/);
});

test("README documents user-facing usage only", () => {
  assert.ok(fs.existsSync(readmePath), "README.md should exist");
  const readme = read(readmePath);

  assert.match(readme, /在线使用/);
  assert.match(readme, /生成二维码/);
  assert.match(readme, /下载和打印/);
  assert.match(readme, /联系卡片功能/);
  assert.match(readme, /注意事项/);
  assert.match(readme, /https:\/\/bonjourgyf\.github\.io\/QR-creater\//);
  assert.doesNotMatch(readme, /本地测试|GitHub Pages 部署|node --test|python -m http\.server|Deploy from a branch/);
});
