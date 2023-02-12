import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  /** ============================================================ */
  /** Show or hide the full screen loader */
  showLoader(show: boolean = true): void {
    const loader = document.getElementById('fullScreenLoader');

    if (loader != null) {
      loader.style.display = show ? "flex" : "none";
    }
  }
}

