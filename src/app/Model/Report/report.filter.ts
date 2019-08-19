import { FormBuilder } from "@angular/forms";
import * as moment from 'moment';

export class ReportFilter {
  reportType: string;
  reportTitle: string;
  fromDate: string;
  toDate: string;
  jobNumber: string;
  absencePosition: number;
  employeeTypeId: number;
  absenceTypeId: number;
  locationId: string;
  districtId: number;
  reasonId: number;
  month: number;
  year: string;
  employeeName: string;
  OrganizationId: string;
  deleteAbsenceReason: string;
  date: string = moment().format('dddd, MM/DD/YYYY');
  District: number;
  userId: string;
  confirmationNumber: string;
  static CreateFilterFormGroup(fb: FormBuilder) {
    return fb.group({
      userId: [''],
      locationId: [''],
      fromDate: [new Date()],
      toDate: [new Date()],
      jobNumber: [''],
      absenceTypeId: [0],
      districtId: [0],
      reasonId: [0],
      employeeName: [''],
      month: [0],
      year: [''],
      OrganizationId: [''],
      deleteAbsenceReason: [''],
      District: [0],
      absencePosition: [0],
      reportTitle: [''],
      confirmationNumber: ['']
    });
  }
  static initial() {
    const filters = new ReportFilter();
    filters.fromDate = moment().format('YYYY-MM-DD');
    filters.toDate = moment().format('YYYY-MM-DD');
    filters.jobNumber = '';
    filters.employeeTypeId = 0;
    filters.absenceTypeId = 0;
    filters.userId = '';
    filters.locationId = '';
    filters.districtId = 0;
    filters.reasonId = 0;
    filters.employeeName = '';
    filters.month = 0;
    filters.year = '';
    filters.OrganizationId = '';
    filters.deleteAbsenceReason = '';
    filters.District = 0;
    filters.absencePosition = 0;
    filters.reportTitle = '';
    filters.confirmationNumber = '';
    return filters;
  }
}
