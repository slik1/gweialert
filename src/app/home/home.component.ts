import { Component, OnDestroy, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings } from '@nativescript/core'
import { Http, HttpResponse } from '@nativescript/core'
import { Subscription, interval } from 'rxjs';

import { GasSettingsService } from '../gas-settings.service';
import { LocalNotifications } from '@nativescript/local-notifications';

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  safeGasPrice:any;
  proposeGasPrice:any;
  fastGasPrice:any;

  sub:Subscription;
  sentRecently:boolean;
  
  constructor(private gasSettings: GasSettingsService) {
    // Use the component constructor to inject providers.
    //Every 5 seconds!
    this.sub= interval(5000).subscribe((x =>{
      this.checkGasPrices();

    }));
  }

  startTimer(){
    //Wait 4 Hours before sending another notification!
    setTimeout(() => {
      //do this!
      this.sentRecently = false;
    }, this.milisec);
  }

  //Set wait time to 4 hours
  milisec = this.miliseconds(4,0,0);

  miliseconds(hrs,min,sec){
      return((hrs*60*60+min*60+sec)*1000);
  }

  //Check device storage for alertsEnabled boolean value and assign, if none assign false
  isEnabled = ApplicationSettings.getBoolean("alertsEnabled", false);

  onBusyChanged($event){
    console.log($event);
  }

  checkGasPrices(){
    Http.getJSON('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=TUCC7XGK52D3F93IKCBUJ357RVQUZ4JR7Z').then(
      (result: any) => {
        console.log(result.result.SafeGasPrice)
        this.safeGasPrice = result.result.SafeGasPrice;
        this.proposeGasPrice = result.result.ProposeGasPrice;
        this.fastGasPrice = result.result.FastGasPrice;
        console.log('result.result.SafeGasPrice: ', result.result.SafeGasPrice);
        console.log('this.currentThreshold: ', this.currentThreshold);
        if(result.result.SafeGasPrice <= this.currentThreshold){
          console.log('yup, safeGas is lower than threshold');
          //Threshold met! Activate alert!
          if(this.isEnabled){

            if(!this.sentRecently){
              this.activateAlert();
              this.sentRecently = true;
              this.startTimer();
            }
            
          }
          
        }
      },
      e => {}
    )
  }

  get currentThreshold() {
    if(parseInt(ApplicationSettings.getString("myGasThreshold"))){
      return parseInt(ApplicationSettings.getString("myGasThreshold"));
    }else{
      return 55;
    }
  }

  ngOnInit(): void {
    this.checkGasPrices();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }


  activateAlert(){
    LocalNotifications.schedule([
      {
        id: 1, // generated id if not set
        title: 'Yoooooo!',
        body: `Gas price is or below: ${this.currentThreshold} gwei`,
        ticker: 'The ticker',
        //color: new Color('red'),
        badge: 1,
        forceShowWhenInForeground: true,
        icon: 'res://heart',
        image: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/money-mouth-face.png',
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