import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { IDistrict } from '../../../../Model/Manage/district';
import { DistrictService } from '../../../../Service/Manage/district.service';
import { DataContext } from '../../../../Services/dataContext.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'district.component.html',
  styleUrls: ['district.component.scss']
})
export class DistrictsComponent {
  displayedColumns = ['DistrictName', 'DistrictAddress', 'City', 'DistrictZipCode', 'action'];
  District: IDistrict;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  msg: string;

  constructor(
    private router: Router,
    private _districtService: DistrictService,
    private _dataContext: DataContext,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.GetDistricts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  GetDistricts(): void {
    this._districtService.get('district/getDistricts').subscribe((data: any) => {
      this.dataSource.data = data;
    },
      error => this.msg = <any>error);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateDistrict(row: any) {
    row.isActive = !row.isActive;
    this._dataContext.Patch('District/updateDistrict', row).subscribe((data: any) => {
    },
      error => this.msg = <any>error);
  }

  EditDistrict(SelectedRow: any) {
    this.router.navigate(['/manage/district/addDistrict'], { queryParams: { Id: SelectedRow.districtId } });
  }

  ViewDistrictDetail(SelectedRow: any) {
    this._dataContext.getById('district/getDistrictById', SelectedRow.districtId).subscribe((data: any) => {
      this.dialog.open(PopupDialogForDistrictDetail, {
        data,
        height: '500px',
        width: '650px',
      });
    },
      error => <any>error);
  }

  // deleteDistrict(SelectedRow: any) {
  //   var confirmResult = confirm('Are you sure you want to delete ' + SelectedRow.DistrictName + ' District?');
  //   if (confirmResult) {
  //     this._districtService.delete('district/', SelectedRow.districtId).subscribe((data: any) => {
  //       this.GetDistricts();
  //     },
  //       error => this.msg = <any>error);
  //   }
  // }

  deleteDistrict(SelectedRow: any) {
    
    swal.fire({
        title: 'Delete',
        text:
            'Are you sure, you want to delete the selected District?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-success',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        buttonsStyling: false
    }).then(r => {
        if (r.value) {
          this._districtService.delete('district/', SelectedRow.districtId).subscribe((data: any) => {
            this.GetDistricts();
          },
            error => this.msg = <any>error);
        }
    });
}
}



@Component({
  templateUrl: 'viewDistrict.html',
  styleUrls: ['district.component.scss']
})
export class PopupDialogForDistrictDetail {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DistrictsComponent>) { }

  onClose() {
    this.dialogRef.close();
  }
}