export interface FeatureFlags {
  LLM_ENABLED: boolean
  PIPELINE_ENABLED: boolean
  MOCK_MODE: boolean
}

const defaults: FeatureFlags = {
  LLM_ENABLED: true,
  PIPELINE_ENABLED: true,
  MOCK_MODE: false,
}

let flags: FeatureFlags = { ...defaults }

export function loadFeatureFlags(overrides?: Partial<FeatureFlags>): FeatureFlags {
  const envFlags: Partial<FeatureFlags> = {}

  if (process.env.PROMPTPILOT_MOCK_MODE === 'true') {
    envFlags.MOCK_MODE = true
  }
  if (process.env.PROMPTPILOT_DISABLE_LLM === 'true') {
    envFlags.LLM_ENABLED = false
  }
  if (process.env.PROMPTPILOT_DISABLE_PIPELINE === 'true') {
    envFlags.PIPELINE_ENABLED = false
  }

  flags = { ...defaults, ...envFlags, ...overrides }
  return flags
}

export function getFeatureFlags(): FeatureFlags {
  return { ...flags }
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return flags[feature] === true
}
