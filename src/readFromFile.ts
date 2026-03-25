export {};

const assetPath = "src/assets/msg.txt";
const file = Bun.file(assetPath);
const content = await file.text();

for (const [index, line] of content.split(/\r?\n/).entries()) {
  if (line.length === 0) {
    continue;
  }

  console.log(`${index + 1}. ${line}`);
}
