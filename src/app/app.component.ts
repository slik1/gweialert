import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouterExtensions } from '@nativescript/angular'
import {
  DrawerTransitionBase,
  RadSideDrawer,
  SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer'
import { filter } from 'rxjs/operators'
import { Application, ApplicationSettings, Http } from '@nativescript/core'

// NativeScript 7+
//import { firebase } from "@nativescript/firebase";

import { LocalNotifications } from '@nativescript/local-notifications'
import { interval, Subscription } from 'rxjs'
import { GasSettingsService } from './gas-settings.service'

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private _activatedUrl: string
  private _sideDrawerTransition: DrawerTransitionBase

  // safeGasPrice: any
  // proposeGasPrice: any
  // fastGasPrice: any
  sub:Subscription;
  constructor(private router: Router, private routerExtensions: RouterExtensions, private gasSettings: GasSettingsService) {
    // Use the component constructor to inject services.
    // this.sub= interval(5000).subscribe((x =>{
    //   this.checkGasPrices();
    // }));
  }


  
  ngOnInit(): void {
    this._activatedUrl = '/home';
    this._sideDrawerTransition = new SlideInOnTopTransition();

    //this.checkGasPrices();






    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => (this._activatedUrl = event.urlAfterRedirects))


  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition
  }

  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url
  }


  onNavItemTap(navItemRoute: string): void {
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })

    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }

  
  clearAll(){
    LocalNotifications.cancelAll();
  }



}
