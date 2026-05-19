const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'frontend/src');

const replacements = [
  // Text colors
  { regex: /\btext-white(?!\/)\b/g, replacement: 'text-foreground' },
  { regex: /\btext-white\/(10|20|30|40|50|60|70|80|90|55|45|35)\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-\[\#080808\]\b/g, replacement: 'text-background' },
  { regex: /\btext-\[\#0a0a0a\]\b/g, replacement: 'text-background' },

  // Background colors
  { regex: /\bbg-white(?!\/)\b/g, replacement: 'bg-foreground' },
  { regex: /\bbg-white\/(5|10|15|20)\b/g, replacement: 'bg-muted' },
  { regex: /\bbg-white\/(30|40|50)\b/g, replacement: 'bg-muted-foreground/30' },
  { regex: /\bbg-\[\#0a0a0a\]\b/g, replacement: 'bg-background' },
  { regex: /\bbg-\[\#080808\]\b/g, replacement: 'bg-background' },
  { regex: /\bbg-\[\#111111\]\b/g, replacement: 'bg-card' },
  { regex: /\bbg-\[\#111111\]\/80\b/g, replacement: 'bg-card/80' },
  { regex: /\bbg-white\/\[0\.0[1-9]\]\b/g, replacement: 'bg-muted' },

  // Border colors
  { regex: /\bborder-white(?!\/)\b/g, replacement: 'border-border' },
  { regex: /\bborder-white\/(10|15|20)\b/g, replacement: 'border-border' },
  { regex: /\bborder-white\/\[0\.[0-9]+\]\b/g, replacement: 'border-border' },

  // Others
  { regex: /\bfill-white\b/g, replacement: 'fill-foreground' }
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (fullPath.includes('site-header.tsx') || fullPath.includes('theme-toggle.tsx') || fullPath.includes('layout.tsx')) {
        continue; // Skip already migrated files
      }
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walkDir(directory);
console.log("Refactoring complete.");
