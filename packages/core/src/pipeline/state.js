"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectState = detectState;
const fs_1 = require("@promptpilot/fs");
const path_1 = require("path");
async function detectState(manifest, outputDir) {
    const steps = new Map();
    const artifacts = new Map();
    const completed = [];
    for (const step of manifest.pipeline) {
        steps.set(step.id, step);
        const artifactPath = (0, path_1.join)(outputDir, step.output);
        const mtime = await (0, fs_1.getFileMtime)(artifactPath);
        if (mtime) {
            artifacts.set(step.id, {
                path: artifactPath,
                exists: true,
                lastModified: mtime,
                stale: false,
            });
            completed.push(step.id);
        }
        else {
            artifacts.set(step.id, {
                path: artifactPath,
                exists: false,
                lastModified: null,
                stale: false,
            });
        }
    }
    const stale = detectStaleArtifacts(steps, artifacts, completed);
    const next = findNextStep(steps, completed);
    const pending = manifest.pipeline.filter(s => !completed.includes(s.id)).map(s => s.id);
    const parallelGroups = computeParallelGroups(manifest.pipeline, completed);
    return { steps, artifacts, completed, pending, stale, next, parallelGroups };
}
function detectStaleArtifacts(steps, artifacts, completed) {
    const stale = [];
    for (const stepId of completed) {
        const step = steps.get(stepId);
        for (const depId of step.dependencies) {
            const depArtifact = artifacts.get(depId);
            const currentArtifact = artifacts.get(stepId);
            if (depArtifact?.lastModified &&
                currentArtifact?.lastModified &&
                depArtifact.lastModified > currentArtifact.lastModified) {
                const a = artifacts.get(stepId);
                a.stale = true;
                a.staleReason = `Upstream artifact "${depId}" modified after this artifact was generated.`;
                stale.push(stepId);
                break;
            }
        }
    }
    return stale;
}
function findNextStep(steps, completed) {
    for (const [, step] of steps) {
        if (completed.includes(step.id))
            continue;
        if (step.dependencies.every(depId => completed.includes(depId)))
            return step;
    }
    return null;
}
function computeParallelGroups(pipeline, completed) {
    const pending = pipeline.filter(s => !completed.includes(s.id));
    const ready = pending.filter(s => s.dependencies.every(depId => completed.includes(depId)));
    const groups = [];
    const remaining = new Set(ready);
    while (remaining.size > 0) {
        const group = [];
        for (const step of remaining) {
            if (step.parallelSafe) {
                group.push(step);
                remaining.delete(step);
            }
        }
        if (group.length === 0) {
            const first = remaining.values().next().value;
            group.push(first);
            remaining.delete(first);
        }
        groups.push(group);
    }
    return groups;
}
//# sourceMappingURL=state.js.map