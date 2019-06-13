import { Entity } from "./entity";

export class CalendarEvent extends Entity {
  eventId: number;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  createdOn: Date | string | null;
  createdBy: string;
  modifiedOn: Date | string | null;
  modifiedBy: string;
  isArchived: boolean | null;
  archivedOn: Date | string | null;
  archivedBy: string;
}
