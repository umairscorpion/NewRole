import { Entity } from "../entity";

export class ReportSummary extends Entity {
  totalCount: number;
  filled: number;
  unfilled: number;
  noSubRequired: number;
}
