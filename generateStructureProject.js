import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Récupération du chemin du fichier actuel et du dossier contenant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition du chemin du projet
const projectPath = path.resolve(__dirname);
const mapDir = path.join(projectPath, 'map');
if (!fs.existsSync(mapDir)) {
    fs.mkdirSync(mapDir, { recursive: true });
    console.log(`Dossier 'map' créé avec succès à l'emplacement: ${mapDir}`);
}

// Définition du fichier de sortie
const outputFile = path.join(mapDir, 'structure.txt');

// Dossiers à exclure
const excludeDirs = new Set(['node_modules', '.git', '.vscode', 'public', 'map', 'dist', 'dist-ssr', 'coverage', 'build']);

/**
 * Génère une représentation textuelle de la structure du projet
 * @param {string} dir - Le dossier à explorer
 * @param {string} prefix - Préfixe pour l'indentation (utilisé dans la récursion)
 * @returns {string} - Représentation textuelle de la structure
 */
function generateStructure(dir, prefix = '') {
    let structure = '';

    try {
        // Récupérer tous les fichiers du dossier et filtrer ceux à exclure
        const files = fs.readdirSync(dir)
            .filter(file => !excludeDirs.has(file))
            .sort((a, b) => {
                // Trier les dossiers avant les fichiers
                const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
                const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
                if (aIsDir && !bIsDir) return -1;
                if (!aIsDir && bIsDir) return 1;
                return a.localeCompare(b);
            });

        // Parcourir chaque fichier pour créer la structure
        files.forEach((file, index) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const isLast = index === files.length - 1;
            const connector = isLast ? '└── ' : '├── ';

            structure += `${prefix}${connector}${file}\n`;

            // Si c'est un dossier, explorer récursivement
            if (stats.isDirectory()) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                structure += generateStructure(filePath, newPrefix);
            }
        });
    } catch (error) {
        console.error(`Erreur lors de l'exploration du dossier ${dir}:`, error.message);
    }

    return structure;
}

try {
    // Générer la structure
    console.log('Génération de la structure du projet...');
    const structure = generateStructure(projectPath);

    // Écrire la structure dans le fichier
    fs.writeFileSync(outputFile, structure, 'utf8');
    console.log(`📁 Structure du projet enregistrée dans: ${outputFile}`);
} catch (error) {
    console.error('Erreur lors de la génération de la structure:', error.message);
}
