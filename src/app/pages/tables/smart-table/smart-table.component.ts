import { AfterViewInit,Component,OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';

/* import for test elasticsearch get */
import { ElasticsearchService } from '../../../elasticsearch.service';
import { Observable, Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { interval } from 'rxjs/observable/interval';
import { AlertSource, Alert } from '../../dashboard/alert/alert.interface';
import { NbThemeService } from '@nebular/theme';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['../../charts/echarts/ngx-echarts-series.scss'],

})

export class SmartTableComponent implements OnInit , OnDestroy{
  private interval: number;
  type = 'Set Interval 5 s';
  types = ['Set Interval 1 s','Set Interval 3 s', 'Set Interval 5 s', 'Set Interval 10 s', 'Set Interval 30 s', 'Set Interval 1 m'];
  currentTheme: string;
  themeSubscription: any;
  source: LocalDataSource = new LocalDataSource ;

  async getAlert(){
    return await this.es.getAlertDocuments()
  }

  sleep = (time) => new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })

  async ngOnInit(){
    while (true) {
      this.source.load(await this.getAlert());
      if (this.type === 'Set Interval 1 s') {
        this.interval = 1000
      } else if(this.type === 'Set Interval 3 s') {
        this.interval = 3000
      } else if(this.type === 'Set Interval 5 s') {
        this.interval = 5000
      } else if(this.type === 'Set Interval 10 s') {
        this.interval = 10000
      } else if(this.type === 'Set Interval 30 s') {
        this.interval = 30000
      } else if(this.type === 'Set Interval 1 m') {
        this.interval = 60000
      }
      //console.log(`interval: ${this.interval}`);
      await this.sleep(this.interval);
    }
  }

  settings = {
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
    },
    hideSubHeader: true,
    columns: {
      timestamp_s: {
        title: 'Timestamp',
        type: 'string',
        editable: false,
        filter: false,
        sort: true,
        sortDirection: 'desc',
      },
      client: {
        title: 'Client',
        type: 'string',
        editable: false,
        filter: false
      },
      query: {
        title: 'Query',
        type: 'string',
        editable: false,
        filter: false
      },
      answer: {
        title: 'Answer',
        type: 'string',
        editable: false,
        filter: false       
      },
    },
  };

  constructor(private es: ElasticsearchService,private themeService: NbThemeService,private cd: ChangeDetectorRef) {
    this.interval = 5000;
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  onDeleteConfirm(event): void {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
        this.es.deleteAlertDocument(event.data._id)
      } else {
        event.confirm.reject();
      }
  }

  ngOnDestroy(){
    this.themeSubscription.unsubscribe();
  }
}
