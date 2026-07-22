"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadManifest = loadManifest;
const fs_1 = require("@promptpilot/fs");
const shared_1 = require("@promptpilot/shared");
async function loadManifest(projectDir) {
    const manifestPath = `${projectDir}/promptpilot.json`;
    try {
        return await (0, fs_1.readJsonFile)(manifestPath);
    }
    catch (error) {
        throw new shared_1.FileSystemError(`Failed to load pipeline manifest: ${manifestPath}`, manifestPath, 'Run `promptpilot init` to create a project scaffold.', error);
    }
}
//# sourceMappingURL=loader.js.map