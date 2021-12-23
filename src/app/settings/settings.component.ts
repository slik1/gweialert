import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, Switch, ApplicationSettings } from '@nativescript/core'
import { Slider } from '@nativescript/core'
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

  isEnabled:boolean;

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    this.gasThreshold = parseInt(ApplicationSettings.getString("myGasThreshold", "90"));
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
    ApplicationSettings.setString("myGasThreshold", this.gasThreshold.toString());
  }

  onCheckedChange(args: EventData) {
    const sw = args.object as Switch
    const isChecked = sw.checked // boolean
    console.log('isChecked: ', isChecked);
    this.isEnabled = isChecked;
    ApplicationSettings.setBoolean("alertsEnabled", isChecked);
  }
}

