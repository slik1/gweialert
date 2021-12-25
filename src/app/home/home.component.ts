import { Component, OnDestroy, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings } from '@nativescript/core'
import { Http, HttpResponse } from '@nativescript/core'
import { Subscription, interval } from 'rxjs';

import { GasSettingsService } from '../gas-settings.service';

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  safeGasPrice:any;
  proposeGasPrice:any;
  fastGasPrice:any;

  sub:Subscription;

  //currentThreshold:any;

  constructor(private gasSettings: GasSettingsService) {
    // Use the component constructor to inject providers.

  }

  // checkGasPrices(){
  //   Http.getJSON('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=TUCC7XGK52D3F93IKCBUJ357RVQUZ4JR7Z').then(
  //     (result: any) => {
  //       console.log(result.result.SafeGasPrice)
  //       this.safeGasPrice = result.result.SafeGasPrice;
  //       this.proposeGasPrice = result.result.ProposeGasPrice;
  //       this.fastGasPrice = result.result.FastGasPrice;
  //     },
  //     e => {}
  //   )
  // }

  get currentThreshold() {
    if(parseInt(ApplicationSettings.getString("myGasThreshold"))){
      return parseInt(ApplicationSettings.getString("myGasThreshold"));
    }else{
      return this.gasSettings.currentThreshold.value;
    }
  }

  ngOnInit(): void {
    // Init your component properties here.
    //this.checkGasPrices();
    // //in 10 seconds do something
    // interval(5000).subscribe(x => {
    //   this.checkGasPrices();
    // });



    //See if threshold is saved in "app settings"
    if(parseInt(ApplicationSettings.getString("myGasThreshold"))){
      //this.currentThreshold = parseInt(ApplicationSettings.getString("myGasThreshold"));
      
    }else{
      //this.currentThreshold = this.gasSettings.currentThreshold.value;

    }

    // Http.request({
    //   url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=TUCC7XGK52D3F93IKCBUJ357RVQUZ4JR7Z',
    //   method: 'GET'
    // }).then(
    //   (response: HttpResponse) => {
    //     // Argument (response) is HttpResponse
    //     console.log(`Response Status Code: ${response.statusCode}`)
    //     console.log(`Response Headers: ${response.statusCode}`)
    //     console.log(`Response Content: ${response.content}`)
    //     this.safeGasPrice = response.content;
    //     console.log('my result: ', response.content);
    //   },
    //   e => {}
    // )
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }










  // ngOnDestroy(){
  //   console.log('ngOnDestoy, this.sub.unsubscribe!!!');
  //   this.sub.unsubscribe();
  // }


}





