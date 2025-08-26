import { log } from "@/utils/logger";

/* eslint-disable @typescript-eslint/no-explicit-any */
type TransactionContext = {
  args: any[];
  result: any;
  stepIndex: number;
  store: Record<string, any>;
};

type TransactionStep = {
  action: (...args: any[]) => Promise<any> | any;
  rollback?: (ctx: TransactionContext) => Promise<void> | void;
  args?: any[];
};

export async function withTransaction(
  steps: TransactionStep[]
): Promise<Record<string, any>> {
  let stage = 0;
  const store: Record<string, any> = {};

  try {
    for (let i = 0; i < steps.length; i++) {
      const { action, args = [] } = steps[i];
      const result = await action(...args);
      store[`${i}`] = result;
      stage++;
    }
    return store;
  } catch (error) {
    log(`Error at stage ${stage}:`, error);
    for (let i = stage - 1; i >= 0; i--) {
      const { rollback, args = [] } = steps[i];
      if (rollback) {
        try {
          await rollback({ args, result: store[`${i}`], stepIndex: i, store });
        } catch (rbError) {
          log(`Rollback failed at stage ${i}:`, rbError);
        }
      }
    }
    throw error;
  }
}
