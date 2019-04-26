import { Entity } from "./entity";

export class AbsenceSummary extends Entity {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  personalLeave: number;
  illnessSelf: number;
  other: number;
  pd: number;
  totalCount: number;
  filled: number;
  unfilled: number;
  noSubRequired: number;
  totalPrevious: number;
  filledPrevious: number;
  unfilledPrevious: number;
  noSubRequiredPrevious: number;
}