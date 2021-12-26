import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, Switch, ApplicationSettings } from '@nativescript/core'
import { Slider } from '@nativescript/core'

import { LocalNotifications } from '@nativescript/local-notifications'
import { Subscription } from 'rxjs'
import { GasSettingsService } from '../gas-settings.service'
//import * as appSettings from "@nativescript/core/application-settings";


// import { 
//   Application, 
//   ApplicationSettings,
//   Trace,
//   Http,
//   Connectivity,
//   ObservableArray, 
//   GridLayout, 
//   KeyedTemplate, 
//   View,
//   Dialogs,
//   Utils
// } from '@nativescript/core';



@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {


  gasThreshold:any;
  sub:Subscription;
  isEnabled:boolean;

  constructor(private gasSettings:GasSettingsService) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    //See if threshold is saved in "app settings"
    if(parseInt(ApplicationSettings.getString("myGasThreshold"))){
      this.gasThreshold = parseInt(ApplicationSettings.getString("myGasThreshold"));

    }else{
      this.gasThreshold = 55;
    }
    console.log("yooooo getString: ", ApplicationSettings.getString("myGasThreshold", "nada"));
    this.isEnabled = ApplicationSettings.getBoolean("alertsEnabled", false);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  onSliderValueChange(args) {
    const slider = args.object as Slider
    console.log('slider: ', slider);
    console.log(`Slider new value ${args.value}`)

    this.gasThreshold = Math.round(args.value);

    //Save in "app settings", is like localStorage?
    ApplicationSettings.setString("myGasThreshold", this.gasThreshold.toString());
    //Save value to state
    this.gasSettings.updateThreshold(this.gasThreshold);
  }

  onCheckedChange(args: EventData) {
    const sw = args.object as Switch
    const isChecked = sw.checked // boolean
    console.log('isChecked: ', isChecked);
    this.isEnabled = isChecked;
    ApplicationSettings.setBoolean("alertsEnabled", isChecked);
    
    if(isChecked){
      //ask user to allow notifications (iOS)

    }

  }




  // saveThreshold(){
  //   LocalNotifications.hasPermission();


    

  //   LocalNotifications.hasPermission().then((granted) => {
  //     console.log('Permission granted? ' + granted);
  //   });
  // }



  activateAlert(){
    LocalNotifications.schedule([
      {
        id: 1, // generated id if not set
        title: 'Yoooooo!',
        body: `Gas price is: ${this.gasThreshold}`,
        ticker: 'The ticker',
        //color: new Color('red'),
        badge: 1,
        forceShowWhenInForeground: true,
        //groupedMessages: ['The first', 'Second', 'Keep going', 'one more..', 'OK Stop'], //android only
        //groupSummary: 'Summary of the grouped messages above', //android only
        //ongoing: true, // makes the notification ongoing (Android only)
        icon: 'res://heart',
        image: 'https://cdn-images-1.medium.com/max/1200/1*c3cQvYJrVezv_Az0CoDcbA.jpeg',
        thumbnail: true,
        //interval: 'minute',
        channel: 'My Channel', // default: 'Channel'
        //sound: isAndroid ? 'customsound' : 'customsound.wav',
        at: new Date(new Date().getTime() + 5 * 1000) // 5 seconds from now
      }
    ]).then(
      scheduledIds => {
        console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds))
      },
      error => {
        console.log('scheduling error: ' + error)
      }
    )
  }









  
}

