"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptEngine = void 0;
const shared_1 = require("@promptpilot/shared");
class PromptEngine {
    config;
    constructor(config) {
        this.config = config;
    }
    compile(template, context, contextWindow) {
        const userPrompt = this.resolveVariables(template.userPromptTemplate, context);
        const upstreamContent = this.formatUpstreamArtifacts(context.upstreamArtifacts);
        let fullUserPrompt = `${template.systemPrompt}\n\n---\n\n## Context\n\n`;
        if (context.masterContext) {
            fullUserPrompt += `### Master Context\n${context.masterContext}\n\n`;
        }
        if (context.projectDescription) {
            fullUserPrompt += `### Project Description\n${context.projectDescription}\n\n`;
        }
        if (context.technologyStack?.length) {
            fullUserPrompt += `### Technology Stack\n${context.technologyStack.join(', ')}\n\n`;
        }
        if (context.constraints?.length) {
            fullUserPrompt += `### Constraints\n${context.constraints.map(c => `- ${c}`).join('\n')}\n\n`;
        }
        if (upstreamContent) {
            fullUserPrompt += `### Upstream Artifacts\n${upstreamContent}\n\n`;
        }
        fullUserPrompt += `---\n\n## Instructions\n\n${userPrompt}`;
        const tokens = (0, shared_1.countTokens)(fullUserPrompt);
        const withinLimits = tokens <= contextWindow * 0.9;
        return {
            systemPrompt: template.systemPrompt,
            userPrompt: fullUserPrompt,
            estimatedTokens: tokens,
            contextWindow,
            withinLimits,
        };
    }
    resolveVariables(template, context) {
        return template
            .replace(/\{MASTER_CONTEXT\}/g, context.masterContext || '')
            .replace(/\{PROJECT_DESCRIPTION\}/g, context.projectDescription || '')
            .replace(/\{TECH_STACK\}/g, context.technologyStack?.join(', ') || '')
            .replace(/\{CONSTRAINTS\}/g, context.constraints?.join(', ') || '')
            .replace(/\{USER_INPUT\}/g, context.userInput || '');
    }
    formatUpstreamArtifacts(artifacts) {
        if (!artifacts.size)
            return '';
        let result = '';
        for (const [stepId, content] of artifacts) {
            const truncated = content.length > 8000 ? content.slice(0, 8000) + '\n\n... (truncated)' : content;
            result += `\n#### ${stepId}\n${truncated}\n`;
        }
        return result;
    }
    validateTemplate(template) {
        const errors = [];
        if (!template.systemPrompt)
            errors.push('System prompt is required');
        if (!template.userPromptTemplate)
            errors.push('User prompt template is required');
        if (!template.id)
            errors.push('Template ID is required');
        if (!template.title)
            errors.push('Template title is required');
        const declaredVars = template.variables || [];
        const usedVars = template.userPromptTemplate.match(/\{(\w+)\}/g)?.map(v => v.slice(1, -1)) || [];
        const missing = usedVars.filter(v => !declaredVars.includes(v));
        const unused = declaredVars.filter(v => !usedVars.includes(v));
        if (missing.length)
            errors.push(`Missing variable declarations: ${missing.join(', ')}`);
        if (unused.length)
            errors.push(`Unused variable declarations: ${unused.join(', ')}`);
        return { valid: errors.length === 0, errors };
    }
    estimateTokens(text) {
        return (0, shared_1.countTokens)(text);
    }
}
exports.PromptEngine = PromptEngine;
//# sourceMappingURL=promptEngine.js.map