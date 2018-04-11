import { Component, Input, OnInit, ChangeDetectorRef, NgZone,OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ElasticsearchService} from '../../../elasticsearch.service';
import { Observable } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { interval } from 'rxjs/observable/interval';


@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  ////<nb-card (click)="on = !on" [ngClass]="{'off': !on}">
  template: `
    <nb-card [ngClass]="{'off': !on}">
      <div class="details">
        <div class="title">{{ title }}</div>
        <div class="status">{{ number }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  form: FormGroup;
  number: number;
  on: boolean;
  //private alive: boolean;
  //private interval: number;

  constructor(private fbuilder: FormBuilder, private es: ElasticsearchService, private cd: ChangeDetectorRef) {
    this.number = Math.floor(Math.random()*100);
    this.on = true;
    /*
    this.form = fbuilder.group({
      index: '',
    });
    this.alive=true;
    this.interval=5000; // set time to check ES server here!*/
  }

  ngOnInit() {
    /*
    TimerObservable.create(0,this.interval).takeWhile(()=>this.alive).subscribe(
    () => {
    this.es.isAvailable().then(() => {
      this.on = true;
    }, error => {
      this.on = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });
    } 
    );

    this.es.isAvailable().then(() => {
      this.on = true;
    }, error => {
      this.on = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });*/
  }

  ngOnDestroy(){
    //this.alive=false;
  }
  
  

  @Input() title: string;
  @Input() type: string;
}
