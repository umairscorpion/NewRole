import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorHandlerService {
  constructor() {
  }
  handleError<T>(error: HttpErrorResponse) {
    return throwError(error.error || 'Server Error');
  }
}
