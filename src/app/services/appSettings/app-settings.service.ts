import { Injectable } from '@angular/core';
import data from "./appSettings.json";

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  public baseApiUrl!: string;

  /** Constructor */
  constructor() {
    this.baseApiUrl = data.baseApiUrl;
  }
}