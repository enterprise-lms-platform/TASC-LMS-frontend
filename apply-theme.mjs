// Fix icon buttons that got boxShadow instead of clean borderless style
import fs from 'fs';
import path from 'path';

const dir = 'src/pages/superadmin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix IconButtons that got boxShadow (from the border replacement)
  // Pattern 1: IconButton with boxShadow only (no hover)
  content = content.replace(
    /IconButton size="small" sx=\{\{ boxShadow: '0 1px 3px rgba\(0,0,0,0\.04\), 0 1px 2px rgba\(0,0,0,0\.02\)' \}\}/g,
    `IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}`
  );

  // Pattern 2: IconButton with boxShadow + hover
  content = content.replace(
    /IconButton size="small" sx=\{\{ boxShadow: '0 1px 3px rgba\(0,0,0,0\.04\), 0 1px 2px rgba\(0,0,0,0\.02\)', '&:hover': \{ color: '([^']+)' \} \}\}/g,
    `IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: '$1', bgcolor: 'rgba(0,0,0,0.04)' } }}`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed buttons: ${file}`);
  }
}

console.log('Done!');
