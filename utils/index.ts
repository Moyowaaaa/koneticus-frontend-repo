export const clampStepValue = (value: number, LAST_STEP_INDEX: number) =>
  Math.min(Math.max(Number.isNaN(value) ? 0 : value, 0), LAST_STEP_INDEX);
