/** Synthetic two-arm trial generator (exponential survival, uniform accrual, administrative censoring). */
import type { SurvivalObs } from "./km";
import { exponential, mulberry32, rateFromMedian, uniform } from "./prng";

export interface TrialSimInput {
  /** Control-arm median survival (months). */
  controlMedian: number;
  /** True hazard ratio experimental vs control. */
  hr: number;
  nPerArm: number;
  /** Accrual period (months), patients enter uniformly over it. */
  accrual: number;
  /** Additional follow-up after the last patient enters (months). */
  followUp: number;
  seed: number;
}

export interface SimulatedTrial {
  control: SurvivalObs[];
  experimental: SurvivalObs[];
  /** Calendar time of the analysis (accrual + follow-up). */
  analysisTime: number;
}

export function simulateTrial({ controlMedian, hr, nPerArm, accrual, followUp, seed }: TrialSimInput): SimulatedTrial {
  const rng = mulberry32(seed);
  const lambdaC = rateFromMedian(controlMedian);
  const lambdaE = lambdaC * hr;
  const analysisTime = accrual + followUp;
  const arm = (rate: number): SurvivalObs[] =>
    Array.from({ length: nPerArm }, () => {
      const entry = uniform(rng, 0, accrual);
      const t = exponential(rng, rate);
      const potentialFollowUp = analysisTime - entry;
      return t <= potentialFollowUp ? { time: t, event: true } : { time: potentialFollowUp, event: false };
    });
  const control = arm(lambdaC);
  const experimental = arm(lambdaE);
  return { control, experimental, analysisTime };
}
