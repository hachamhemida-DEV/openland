import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const optimizeImage = async (filePath: string, filename: string, destination: string): Promise<string> => {
    try {
        console.log(`[ImageOptimizer] Starting optimization for: ${filename}`);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const optimizedFilename = `opt-${uniqueSuffix}-${filename}`;
        const outputPath = path.join(destination, optimizedFilename);

        // Create a timeout promise
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Optimization timed out')), 10000); // 10s timeout
        });

        // Optimization promise
        const processImage = sharp(filePath)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(outputPath);

        // Race (if sharp hangs, timeout wins)
        await Promise.race([processImage, timeout]);

        console.log(`[ImageOptimizer] Successfully optimized: ${optimizedFilename}`);

        // Delete original file to save space
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkError) {
            console.error('[ImageOptimizer] Failed to delete original file:', unlinkError);
            // Non-critical, continue
        }

        return optimizedFilename;

    } catch (error) {
        console.error('[ImageOptimizer] Optimization failed:', error);
        // If optimization fails, we keep the original file and return its name
        return filename;
    }
};
