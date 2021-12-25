import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from 'rxjs/Observable';


interface Threshold {
    value: number;
  }
  

@Injectable({
  providedIn: 'root'
})


export class GasSettingsService {

  constructor() { }

  //Set default threshold
  currentThreshold: Threshold;

  updateThreshold(userSelectedValue:number):void{
    this.currentThreshold = {value: userSelectedValue}
  }


  applyDelta(delta: number): void {
    this.currentThreshold = {value: (this.currentThreshold.value + delta)};
  }

  /** Resets the count to the initial value */
  resetCount(): void {
    this.currentThreshold = {value: 0};
  }


}






