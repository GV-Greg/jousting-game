import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recrée __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectPath = path.resolve(__dirname, '..'); // Remonte d'un niveau pour scanner tout le projet
const outputFile = path.join(__dirname, 'structure.txt'); // Enregistre dans `map/`
const excludeDirs = new Set(['node_modules', '.git', '.vscode', 'map']); // Exclut aussi `map/`

function generateStructure(dir, prefix = '') {
    let structure = '';
    const files = fs.readdirSync(dir).filter(file => !excludeDirs.has(file)); // Exclure les dossiers spécifiés

    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';

        structure += `${prefix}${connector}${file}\n`;

        if (fs.statSync(filePath).isDirectory()) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            structure += generateStructure(filePath, newPrefix);
        }
    });

    return structure;
}

const structure = generateStructure(projectPath);
fs.writeFileSync(outputFile, structure);

console.log('📁 Structure du projet enregistrée dans :', outputFile);
