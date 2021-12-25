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

  safeGasPrice: any
  proposeGasPrice: any
  fastGasPrice: any
  sub:Subscription;
  constructor(private router: Router, private routerExtensions: RouterExtensions, private gasSettings: GasSettingsService) {
    // Use the component constructor to inject services.
    this.sub= interval(5000).subscribe((x =>{
      this.checkGasPrices();
    }));
  }


  
  ngOnInit(): void {
    this._activatedUrl = '/home';
    this._sideDrawerTransition = new SlideInOnTopTransition();

    this.checkGasPrices();




    // firebase.init({
    //   // Optionally pass in properties for database, authentication and cloud messaging,
    //   // see their respective docs.
    //   showNotifications: true,
    //   showNotificationsWhenInForeground: true
    // }).then(
    //   () => {
    //     console.log("firebase.init done");
    //   },
    //   error => {
    //     console.log(`firebase.init error: ${error}`);
    //   }
    // );


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

  // getUserThreshold(){

  //   if(parseInt(ApplicationSettings.getString("myGasThreshold"))){

  //   }

 
  // }

  onNavItemTap(navItemRoute: string): void {
    console.log('you in onNavItemTap()');
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

  checkGasPrices(){
    Http.getJSON('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=TUCC7XGK52D3F93IKCBUJ357RVQUZ4JR7Z').then(
      (result: any) => {
        console.log(result.result.SafeGasPrice)
        this.safeGasPrice = result.result.SafeGasPrice;
        this.proposeGasPrice = result.result.ProposeGasPrice;
        this.fastGasPrice = result.result.FastGasPrice;
      },
      e => {}
    )
  }

}
