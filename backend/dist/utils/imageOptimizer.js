"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const optimizeImage = async (filePath, filename, destination) => {
    try {
        console.log(`[ImageOptimizer] Starting optimization for: ${filename}`);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const optimizedFilename = `opt-${uniqueSuffix}-${filename}`;
        const outputPath = path_1.default.join(destination, optimizedFilename);
        // Create a timeout promise
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Optimization timed out')), 10000); // 10s timeout
        });
        // Optimization promise
        const processImage = (0, sharp_1.default)(filePath)
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
            fs_1.default.unlinkSync(filePath);
        }
        catch (unlinkError) {
            console.error('[ImageOptimizer] Failed to delete original file:', unlinkError);
            // Non-critical, continue
        }
        return optimizedFilename;
    }
    catch (error) {
        console.error('[ImageOptimizer] Optimization failed:', error);
        // If optimization fails, we keep the original file and return its name
        return filename;
    }
};
exports.optimizeImage = optimizeImage;
