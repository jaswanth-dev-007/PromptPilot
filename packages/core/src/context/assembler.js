"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assembleContext = assembleContext;
const fs_1 = require("@promptpilot/fs");
async function assembleContext(step, artifacts, _maxTokens = 128000) {
    let context = '';
    for (const depId of step.dependencies) {
        const artifact = artifacts.get(depId);
        if (!artifact?.exists)
            continue;
        const content = await (0, fs_1.readTextFile)(artifact.path);
        context += `\n\n---\n## Context: ${depId}\n---\n\n${content}`;
    }
    return context;
}
//# sourceMappingURL=assembler.js.map