import { Injectable, ErrorHandler } from '@angular/core';
import { Client } from 'elasticsearch';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
//import { resolve } from 'path';
//import { reject } from 'q';

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

  checkTodayIndexExist(_year,_month,_date): any {
    return new Promise((resolve,reject) =>{
      this.client.indices.exists({
        index: "filebeat-6.2.4-".concat(_year+"."+_month+"."+_date),
      }).then( (res) => {
        resolve(res);
      }, (err) =>{
        reject(err.status)
      });
    })
  }

  createTodayIndex(_year,_month,_date): any {
    return new Promise((resolve,reject) =>{
      this.client.indices.create({
      index: "filebeat-6.2.4-".concat(_year+"."+_month+"."+_date),
    }).then((res) =>{
      resolve(res);
    }, (err) =>{
      reject(err)
    })
    })
  }

  getDNSDocuments(_year,_month,_date,_prev_timestamp,_timestamp_s): any {
    return new Promise((resolve, reject) => {
      this.client.search({
        index: "filebeat-6.2.4-".concat(_year+"."+_month+"."+_date),
        type: "doc",
        body: {
          'query':{
            'range':{
              'timestamp_s':{
                "gt": _prev_timestamp,
                "lte": _timestamp_s,
                //"boost": 2  //priority if search in multi column
              }
            }
          },
          'size': 10000, //Default is 10
        },
        //filterPath: ['hits.hits._source','hits.total','hits.hits._id']
      }).then( (res) => {
        var dns_data ={
          "SUM":0,
          "A":0,
          "CNAME":0,
          "AAAA":0,
          "NS":0,
          "PTR":0,
          "MX":0,
          "OTHER":0,
        }
        res.hits.hits.forEach(element =>{
          if (element._source.type === "A"){
            dns_data["A"]++;
          }
          else if(element._source.type === "CNAME"){
            dns_data["CNAME"]++;
          }
          else if(element._source.type === "AAAA"){
            dns_data["AAAA"]++;
          }
          else if(element._source.type === "NS"){
            dns_data["NS"]++;
          }
          else if(element._source.type === "PTR"){
            dns_data["PTR"]++;
          }
          else if(element._source.type === "MX"){
            dns_data["MX"]++;
          }
          else{
            dns_data["OTHER"]++;
          }
        })
        dns_data["SUM"] = dns_data["A"]+dns_data["CNAME"]+dns_data["AAAA"]+dns_data["NS"]+dns_data["PTR"]+dns_data["MX"]+dns_data["OTHER"]
        resolve(dns_data);
      }, (err) =>{
        reject(err)
      });
    })
  }

  getErrorDocuments(_year,_month,_date,_prev_timestamp,_timestamp_s): any {
    return new Promise((resolve, reject) => {
      this.client.search({
        index: "filebeat-6.2.4-".concat(_year+"."+_month+"."+_date),
        type: "doc",
        body: {
          'query':{
            'range':{
              'timestamp_s':{
                "gt": _prev_timestamp,
                "lte": _timestamp_s,
                //"boost": 2  //priority if search in multi column
              }
            }
          },
          'size': 10000, //Default is 10
        },
        //filterPath: ['hits.hits._source','hits.total','hits.hits._id']
      }).then( (res) => {
        var dns_data ={
          "SUM":0,
          "NXDOMAIN":0,
          "REFUSED":0,
          "SERVFAIL":0,
          "FORMERR":0,
        }
        res.hits.hits.forEach(element =>{
          if (element._source.answer === "NXDOMAIN"){
            dns_data["NXDOMAIN"]++;
          }
          else if(element._source.answer === "REFUSED"){
            dns_data["REFUSED"]++;
          }
          else if(element._source.answer === "SERVFAIL"){
            dns_data["SERVFAIL"]++;
          }
          else if(element._source.answer === "FORMERR"){
            dns_data["FORMERR"]++;
          }
        })
        dns_data["SUM"] = dns_data["NXDOMAIN"]+dns_data["REFUSED"]+dns_data["SERVFAIL"]+dns_data["FORMERR"];
        resolve(dns_data);
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