import { Entity } from "./entity";

export class UserAvailability extends Entity {
  availabilityId: number;
  userId: string;
  availabilityStatusId: number | null;
  availabilityContentBackgroundColor: string;
  availabilityIconCss: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isAllDayOut: boolean;
  isRepeat: boolean;
  repeatType: string;
  repeatValue: number | null;
  repeatOnWeekDays: string;
  isEndsNever: boolean;
  endsOnAfterNumberOfOccurrance: number | null;
  endsOnUntilDate: string;
  notes: string;
  createdOn: Date | string | null;
  createdBy: string;
  modifiedOn: Date | string | null;
  modifiedBy: string;
  isArchived: boolean | null;
  archivedOn: Date | string | null;
  archivedBy: string;
}