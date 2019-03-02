import { Entity } from "../entity";

export class ReportDetail extends Entity {
  absenceId: number;
  employeeName: string;
  grade: string;
  subject: string;
  reason: string;
  date: Date | string;
  location: string;
  time: Date | string;
  postedOn: Date | string;
  postedById: number;
  postedByName: string;
  statusId: string;
  statusDate: string;
  filledById: number;
  filledByName: string;
}
