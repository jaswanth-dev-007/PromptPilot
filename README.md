# PromptPilot

AI-assisted software planning pipeline. A sequence of curated prompts that generate a complete product specification from a single context document.

## Structure

```
PromptPilot/
├── docs/                          # Prompt templates (your input)
│   ├── 00_Master_Context.md       # Define product vision & constraints
│   ├── 01_PRD_Prompt.md           # Generate Product Requirements Document
│   ├── 02_SRS_Prompt.md           # Generate Software Requirements Specification
│   ├── 03_System_Architecture_Prompt.md  # Design system architecture
│   ├── 04_Database_Schema_Prompt.md      # Design database schema
│   ├── 05_API_Specification_Prompt.md    # Design API specification
│   ├── 06_User_Flow_Prompt.md            # Map user flows
│   ├── 07_UI_Wireframes_Prompt.md        # Design UI wireframes
│   └── 08_Feature_Roadmap_Prompt.md      # Create feature roadmap
│
├── docs-output/                   # Generated artifacts (your output)
│   ├── PRD.md
│   ├── SRS.md
│   ├── Architecture.md
│   ├── Database.md
│   ├── API.md
│   ├── UserFlow.md
│   ├── Wireframes.md
│   └── Roadmap.md
│
└── README.md
```

## Workflow

Run these prompts sequentially with your AI assistant. Each prompt references the outputs of previous steps.

### Step 0: Master Context

1. Open `docs/00_Master_Context.md`
2. Replace `{PRODUCT_NAME}`, `{ONE_LINE_DESCRIPTION}`, `{TARGET_AUDIENCE}`, `{PLATFORM}`, and `{INDUSTRY_DOMAIN}` with your project details
3. Feed the prompt to your AI assistant
4. Save the output as a reference — it's the foundation for everything that follows

### Step 1: PRD

- Feed `docs/01_PRD_Prompt.md` + your Master Context output → save to `docs-output/PRD.md`

### Step 2: SRS

- Feed `docs/02_SRS_Prompt.md` + PRD + Master Context → save to `docs-output/SRS.md`

### Step 3: Architecture

- Feed `docs/03_System_Architecture_Prompt.md` + SRS + PRD + Master Context → save to `docs-output/Architecture.md`

### Step 4: Database Schema

- Feed `docs/04_Database_Schema_Prompt.md` + SRS + PRD + Architecture → save to `docs-output/Database.md`

### Step 5: API Specification

- Feed `docs/05_API_Specification_Prompt.md` + SRS + PRD + Architecture → save to `docs-output/API.md`

### Step 6: User Flows

- Feed `docs/06_User_Flow_Prompt.md` + PRD + SRS + Master Context → save to `docs-output/UserFlow.md`

### Step 7: UI Wireframes

- Feed `docs/07_UI_Wireframes_Prompt.md` + PRD + UserFlow + Master Context → save to `docs-output/Wireframes.md`

### Step 8: Feature Roadmap

- Feed `docs/08_Feature_Roadmap_Prompt.md` + PRD + SRS + Architecture → save to `docs-output/Roadmap.md`

## Tips

- Each prompt is self-contained and includes explicit instructions for the AI
- Later prompts reference earlier outputs — follow the order for best traceability
- The `{placeholder}` variables in `docs/00_Master_Context.md` are the only inputs you need to provide
