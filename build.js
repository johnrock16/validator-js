import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['./src/main.js'], // Your main entry file
    bundle: true,                  // Bundle all dependencies
    platform: 'neutral',           // Make the script universal
    format: 'esm',                 // Output as ES Module
    outdir: 'dist',                // Output directory
    target: ['esnext'],            // Target modern JavaScript
}).then(() => {
    console.log('Build completed successfully.');
}).catch(() => process.exit(1));
