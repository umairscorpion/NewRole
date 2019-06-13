import { Entity } from "./entity";
import { AbsenceSummary } from "./absence.summary";
import { TopTenTeachers } from "./TopTenTeachers";
import { AbsenceBySubject } from "./AbsenceBySubject";
import { AbsenceByGradeLevel } from "./AbsenceByGradeLevel";
import { TopFourAbsenceReasons } from "./TopFourAbsenceReasons";
export class DashboardSummary extends Entity {
    
    absenceBySubject: AbsenceBySubject[];
    absenceByGradeLevel: AbsenceByGradeLevel[];
    topTenTeachers: TopTenTeachers[];
    absenceSummary: AbsenceSummary[];
    topFourAbsenceReasons: TopFourAbsenceReasons[];
}