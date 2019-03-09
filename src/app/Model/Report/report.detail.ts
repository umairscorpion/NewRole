import { Entity } from "../entity";

export class ReportDetail extends Entity {
  absenceId: number;
  employeeName: string;
  absencePosition: number;
  grade: string;
  subject: string;
  reason: string;
  startDate: Date | string;
  endDate: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  districtName: string;
  postedOn: Date | string;
  postedById: string;
  postedByName: string;
  statusId: number;
  statusTitle: string;
  statusDate: Date | string;
  substituteId: string;
  substituteName: string;
  notes: string;
}
