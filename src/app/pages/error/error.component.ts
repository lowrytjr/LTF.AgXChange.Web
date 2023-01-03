import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorState } from 'src/app/models/common/errorState.model';
import { AppSettingsService } from 'src/app/services/appSettings/app-settings.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  _errorState: ErrorState;
  _message: string = "An unexpected error occured.";

  /** ============================================================ */
  /** Constructor */
  constructor(private router: Router, private appSettings: AppSettingsService) {
    try {
      // Get the passed in error state
      if (this.router.getCurrentNavigation()?.extras?.state) {
        this._errorState = this.router.getCurrentNavigation()?.extras?.state as ErrorState;
      }
      else {
        this._errorState = new ErrorState("unknown", 500, "An unexpected error occured.");
      }
    }
    catch(err) {
      this._errorState = new ErrorState("unknown", 500, "An unexpected error occured.");
    }

    // Map the error message
    this._message = this.MapErrorMessage();
  }

  /** ============================================================ */
  /** Map error message */
  MapErrorMessage(): string {
    try {
      // Get the mapped error code
      let errorCode = this.appSettings.errorCodes.find((obj) => {
        return obj.code === this._errorState.message;
      });

      // Make sure the errorCode is not null
      if (errorCode != null) {
        return errorCode?.message!;
      }
      else {
        return "An unexpected error occured.";
      }
    }
    catch(err) {
      return "An unknown error occurred"
    }
  }
}

