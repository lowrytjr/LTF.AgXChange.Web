import { Injectable } from '@angular/core';
import { ErrorCode } from 'src/app/models/common/errorCode.model';
import data from "./appSettings.json";

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  public baseApiUrl: string;
  public emailValidationPattern: string;
  public passwordValidationPattern: string;
  public errorCodes: Array<ErrorCode>;

  /** Constructor */
  constructor() {
    this.baseApiUrl = data.baseApiUrl;
    this.emailValidationPattern = data.email_validation_pattern;
    this.passwordValidationPattern = data.password_validation_pattern;
    this.errorCodes = data.error_codes;
  }
}