import { FormBuilder } from "@angular/forms";
import * as moment from 'moment';

export class ReportFilter {
  reportType: string;
  reportTitle: string;
  fromDate: string;
  toDate: string;
  jobNumber: string;
  employeeTypeId: number;
  absenceTypeId: number;
  locationId: number;
  districtId: number;
  reasonId: number;
  employeeName: string;
  static CreateFilterFormGroup(fb: FormBuilder) {
    return fb.group({
      fromDate: [moment(new Date()).format('YYYY-MM-DD')],
      toDate: [moment(new Date()).format('YYYY-MM-DD')],
      jobNumber: [''],
      employeeTypeId: [0],
      absenceTypeId: [0],
      locationId: [0],
      districtId: [0],
      reasonId: [0],
      employeeName: [''],
    });
  }
  static initial() {
    const filters = new ReportFilter();
    filters.fromDate = moment(new Date()).format('YYYY-MM-DD');
    filters.toDate = moment(new Date()).format('YYYY-MM-DD');
    filters.jobNumber = '';
    filters.employeeTypeId = 0;
    filters.absenceTypeId = 0;
    filters.locationId = 0;
    filters.districtId = 0;
    filters.reasonId = 0;
    filters.employeeName = '';
    return filters;
  }
}
