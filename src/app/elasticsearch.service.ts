import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class ElasticsearchService {
  private client: Client;
  data = [];

  queryalldocs = {
    'query': {
      'match_all': {}
    },
    'size': 10000, // Default is 10
  };

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.client = new Client({
      host: 'http://192.168.75.204:9200', // Elasticsearch server
      log: 'trace'
    });
  }

  getAllDocuments(_index,_type): any {
    return this.client.search({
      index: _index,
      type: _type,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source','hits.total','hits.hits._id']
    });
  }

  deleteAlertDocument(_id): any {
    return this.client.delete({
        index: "typosquatting_alert",
        type: "doc",
        id: _id,
      });  
  }

  getAlertDocuments(): any {
    // console.log("This message log from service")
    return new Promise((resolve, reject) => {
      this.data = [];
      this.client.search({
        index: "typosquatting_alert",
        type: "doc",
        body: this.queryalldocs,
        filterPath: ['hits.hits._source','hits.total','hits.hits._id'],
        //sort: "timestamp_s"  //change to sort in column smart table instead
      }).then( (res) => {
        res.hits.hits.forEach(phase => {
        var temp = {}
        temp['timestamp_s'] = new Date((phase._source.timestamp_s+25200)*1000).toUTCString()
        temp['client'] = phase._source.client
        temp['query'] = phase._source.query
        temp['_id'] = phase._id
        temp['answer'] = phase._source.answer
        //console.log("temp is ",temp);
        this.data.push(temp)
        // console.log("After push this.data is ",this.data);
      });
      // console.log("before resolve this.data is ",this.data);
      resolve(this.data);
      }, (err) => {
        reject(err)
      });
    })
  }
}