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
  //Ten Day
  filledPreviousMinusOne: number;
  filledPreviousMinusTwo: number;
  filledPreviousMinusThree: number;
  filledPreviousMinusFour: number;
  filledPreviousMinusFive: number;
  filledPreviousMinusSix: number;
  filledPreviousMinusSeven: number;
  filledPreviousMinusEight: number;
  filledPreviousMinusNine: number;
  filledPreviousMinusTen: number;

  unfilledPreviousMinusOne: number;
  unfilledPreviousMinusTwo: number;
  unfilledPreviousMinusThree: number;
  unfilledPreviousMinusFour: number;
  unfilledPreviousMinusFive: number;
  unfilledPreviousMinusSix: number;
  unfilledPreviousMinusSeven: number;
  unfilledPreviousMinusEight: number;
  unfilledPreviousMinusNine: number;
  unfilledPreviousMinusTen: number;
}