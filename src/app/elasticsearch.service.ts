import { Injectable, ErrorHandler } from '@angular/core';
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

  getDNSDocuments(_year,_month,_date,_prev_timestamp,_timestamp_s): any {
    return new Promise((resolve, reject) => {
      this.client.search({
        index: "filebeat-6.2.2-".concat(_year+"."+_month+"."+_date),
        type: "doc",
        body: {
          'query':{
            'range':{
              'timestamp_s':{
                "gt": _prev_timestamp,
                "lte": _timestamp_s,
              },
            },
          },
          'size': 10000, //Default is 10
        },
        //filterPath: ['hits.hits._source','hits.total','hits.hits._id']
      }).then( (res) => {
        var dns ={
          "SUM":0,
          "A":0,
          "AAAA":0,
          "NS":0,
          "MX":0,
          "OTHER":0,
        }
        res.hits.hits.forEach(element =>{
          if (element._source.type === "A"){
            dns["A"]++;
          }
          else if(element._source.type === "AAAA"){
            dns["AAAA"]++;
          }
          else if(element._source.type === "NS"){
            dns["NS"]++;
          }
          else if(element._source.type === "MX"){
            dns["MX"]++;
          }
          else{
            dns["OTHER"]++;
          }
        })
        dns["SUM"] = dns["A"]+dns["AAAA"]+dns["NS"]+dns["MX"]+dns["OTHER"]
        resolve(dns);
      }, (err) =>{
        reject(err)
      });
    })
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
        res.hits.hits.forEach(element => {
        var temp = {}
        temp['timestamp_s'] = new Date((element._source.timestamp_s+25200)*1000).toUTCString()
        temp['client'] = element._source.client
        temp['query'] = element._source.query
        temp['_id'] = element._id
        temp['answer'] = element._source.answer
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