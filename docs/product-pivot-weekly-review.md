# Opsqora Current Product Model

Opsqora is a Phase 1 frontend-only prototype for validating recurring support-feedback patterns before they become product decisions.

## Current Positioning

Opsqora helps a small product team:

- find recurring feedback patterns in synthetic feedback exports;
- inspect representative evidence snippets;
- mark whether each snippet belongs to the suggested pattern;
- apply visible readiness rules;
- turn a ready pattern into a product brief;
- review mocked quality, disagreement, and cost metrics.

The product surface is intentionally narrow. The main object is the feedback pattern, not the individual message. Feedback snippets exist only as evidence for validating the pattern.

## Current Workflow

1. Mock AI suggests recurring patterns from deterministic synthetic data.
2. A reviewer validates evidence snippets with explicit states.
3. Readiness rules combine evidence threshold, reviewer verdict, and confidence.
4. A ready pattern becomes a product brief with owner, next step, and mocked outcome tracking.
5. Eval rules connect quality and cost metrics to product actions.

## Boundaries

- No backend.
- No auth.
- No persistence.
- No real customer data.
- No production integrations.
- No live model call.
- No autonomous product decision.
- No production write-back workflow.

All data is synthetic and deterministic. Metrics, outcomes, costs, and AI outputs are illustrative.

## Evaluation Focus

The prototype is strongest when it shows judgment around the model:

- pattern precision;
- pattern recall;
- pattern F1;
- evidence precision;
- high-confidence disagreement;
- cost per validated pattern;
- human correction rate;
- clear thresholds and actions.

Opsqora should continue to optimize for a focused AI PM story: product value comes from the workflow around AI suggestions, not from the model alone.
