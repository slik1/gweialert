import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouterExtensions } from '@nativescript/angular'
import {
  DrawerTransitionBase,
  RadSideDrawer,
  SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer'
import { filter } from 'rxjs/operators'
import { Application } from '@nativescript/core'

// NativeScript 7+
import { firebase } from "@nativescript/firebase";

import { LocalNotifications } from '@nativescript/local-notifications'


@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private _activatedUrl: string
  private _sideDrawerTransition: DrawerTransitionBase

  constructor(private router: Router, private routerExtensions: RouterExtensions) {
    // Use the component constructor to inject services.
  }


  
  ngOnInit(): void {
    this._activatedUrl = '/home';
    this._sideDrawerTransition = new SlideInOnTopTransition();

    LocalNotifications.hasPermission();


    LocalNotifications.schedule([
      {
        id: 1, // generated id if not set
        title: 'The title',
        body: 'Recurs every minute until cancelled',
        ticker: 'The ticker',
        //color: new Color('red'),
        badge: 1,
        groupedMessages: ['The first', 'Second', 'Keep going', 'one more..', 'OK Stop'], //android only
        groupSummary: 'Summary of the grouped messages above', //android only
        ongoing: true, // makes the notification ongoing (Android only)
        icon: 'res://heart',
        image: 'https://cdn-images-1.medium.com/max/1200/1*c3cQvYJrVezv_Az0CoDcbA.jpeg',
        thumbnail: true,
        interval: 'minute',
        channel: 'My Channel', // default: 'Channel'
        //sound: isAndroid ? 'customsound' : 'customsound.wav',
        at: new Date(new Date().getTime() + 10 * 1000) // 10 seconds from now
      }
    ]).then(
      scheduledIds => {
        console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds))
      },
      error => {
        console.log('scheduling error: ' + error)
      }
    )


    firebase.init({
      // Optionally pass in properties for database, authentication and cloud messaging,
      // see their respective docs.
      showNotifications: true,
      showNotificationsWhenInForeground: true
    }).then(
      () => {
        console.log("firebase.init done");
      },
      error => {
        console.log(`firebase.init error: ${error}`);
      }
    );


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
    console.log('you in onNavItemTap()');
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })

    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }
}
