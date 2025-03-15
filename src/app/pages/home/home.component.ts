import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasePageComponent } from 'src/app/components/base-page/base-page.component';
import { UserSession } from 'src/app/models/account/userSession.model';
import { AuthenticateService } from 'src/app/services/authenticate/authenticate.service';

/** ============================================================ */
/** Home Component */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BasePageComponent implements OnInit {
  
  /** ============================================================ */
  /** Constructor */
  constructor(router: Router, authenticateService: AuthenticateService) {
    console.log("HomePage: constructor");
    super(router, authenticateService);
  }

  override ngOnInit(): void {
    console.log("HomePage: ngOnInit");
    super.ngOnInit();
  }

  /** ============================================================ */
  /** ngAfterViewInit */
  ngAfterViewInit() {
    // Load data
    console.log("HomePage: ngAfterViewInit");
  }
}
