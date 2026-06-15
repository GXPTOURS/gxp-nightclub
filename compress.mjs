import sharp from 'sharp';
import { readdirSync, statSync, renameSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const dir = './public/images';
const files = readdirSync(dir).filter(f => ['.jpg','.jpeg','.JPG','.JPEG'].includes(extname(f)));

for (const file of files) {
  const path = join(dir, file);
  const tmp = path + '.tmp';
  const mb = statSync(path).size / 1024 / 1024;
  if (mb < 1.0) { console.log(`skip  ${file} (${mb.toFixed(1)}MB)`); continue; }

  try {
    await sharp(path)
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tmp);

    renameSync(tmp, path);
    const newMb = statSync(path).size / 1024 / 1024;
    console.log(`✓ ${file}  ${mb.toFixed(1)}MB → ${newMb.toFixed(2)}MB`);
  } catch(e) {
    console.log(`✗ ${file}: ${e.message}`);
  }
}
console.log('\nAll done!');
