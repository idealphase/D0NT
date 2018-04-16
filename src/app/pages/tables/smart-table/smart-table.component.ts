import { AfterViewInit,Component,OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';

/* import for test elasticsearch get */
import { ElasticsearchService } from '../../../elasticsearch.service';
import { Observable, Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { interval } from 'rxjs/observable/interval';
import { AlertSource, Alert } from '../../dashboard/alert/alert.interface';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  /*styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],*/
  styleUrls: ['../../charts/echarts/ngx-echarts-series.scss'],

})

export class SmartTableComponent implements OnInit , OnDestroy{
  private interval: number;
  type = '5 s';
  types = ['1 s','3 s', '5 s', '10 s', '30 s', '1 m'];
  currentTheme: string;
  themeSubscription: any;
  source: LocalDataSource = new LocalDataSource ;
  timerSubscription: Subscription;

  async getAlert(){
    return await this.es.getAlertDocuments()
  }

  async ngOnInit(){
    // const data = await this.es.getAlertDocuments()
    // this.source.load(data) 
    //this.source.load(await this.getAlert())   
    this.timerSubscription = TimerObservable.create(0,this.interval).subscribe(async (res) =>{
      this.source.load(await this.getAlert());
      if (this.type === '1 s') {
        this.interval = 1000
      } else if(this.type === '3 s') {
        this.interval = 3000
      } else if(this.type === '5 s') {
        this.interval = 5000
      } else if(this.type === '10 s') {
        this.interval = 10000
      } else if(this.type === '30 s') {
        this.interval = 30000
      } else if(this.type === '1 m') {
        this.interval = 60000
      }
    })
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
    // Domain name Typosquatting Table
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

  constructor(private es: ElasticsearchService,private themeService: NbThemeService) {
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
  this.timerSubscription.unsubscribe();
}
  // https://www.djamware.com/post/5a0673c880aca7739224ee21/mean-stack-angular-5-crud-web-application-example
  /*
  books: any;
  constructor(private http: HttpClient ) { }
  ngOnInit() {
    this.http.get('/book').subscribe(data => {
      this.books = data;
    });
  }*/
}
