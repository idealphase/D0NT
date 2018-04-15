import { Component,OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableService } from '../../../@core/data/smart-table.service';

/* import for test elasticsearch get */
import { ElasticsearchService } from '../../../elasticsearch.service';
import { Observable } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { interval } from 'rxjs/observable/interval';
import { AlertSource, Alert } from '../../dashboard/alert/alert.interface';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class SmartTableComponent implements OnInit {
  private interval: number;
  //alertSources: AlertSource[];
  private static readonly INDEX = 'typosquatting_alert';
  private static readonly TYPE = 'doc';

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit(){
    
    //TimerObservable.create(0,this.interval).subscribe(
    const data = await this.es.getAlertDocuments();
    this.source.load(data)
    /*
    this.es.getAllDocuments(SmartTableComponent.INDEX,SmartTableComponent.TYPE)
    .then(response => {
      response.hits.hits.forEach(phase => {
        this.temp2.timestamp_s = new Date((phase._source.timestamp_s-25200)*1000)
        this.temp2.client = phase._source.client,
        this.temp2.query = phase._source.query,
        this.temp2._id = phase._id
        this.temp.push(this.temp2)
        console.log(this.temp)
      });
      console.log(response);
    }, error => {
      console.error(error);
    })*/
   // )
    
    // const mock_data = [{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"},{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"},{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"}]
    // console.log("typeof data1 is ",typeof data1); //answer is object
    // console.log("mock_data is ",mock_data); //answer is 
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
        filter: false
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

    /* Default Table
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },*/
  };

  constructor(private es: ElasticsearchService) {
    // const data = this.es.getAlertDocuments();
    // console.log("typeof data is ",typeof data);
    // console.log("data is ",data);
    // const data2 = Object.values(data);
    // console.log("data2",data2);
    // const data1 = [{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"},{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"},{timestamp_s:"Sun Apr 15 2018 01:40:43 GMT+0700 (+07)", client: "192.168.75.204", query: "www.googleb.co.th.", _id: "8-b2xmIBoOi15HkBK6bl"}]
    // console.log("typeof data1 is ",typeof data1); //answer is object
    // console.log("data1 is ",data1); //answer is 
    // this.source.load(data1)
    /*this.es.getAllDocuments(SmartTableComponent.INDEX,SmartTableComponent.TYPE)
    .then(response => {
      //can show in smart-table 
      this.alertSources = [response.hits.hits];
      // console.log("fdsakfjdaslkfjdaslk;",typeof this.alertSources);

      console.log(response);
    }, error => {
      console.error(error);
    }).then(() => {
      console.log('Show alert Completed!');
    });*/

    

    this.interval = 5000;
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
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
