import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class ElasticsearchService {
  private client: Client;

  queryalldocs = {
    'query': {
      'match_all': {}
    },
    'size': 10000, // From our DNS log, There're 6 million record per day
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

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello JavaSampleApproach!'
    });
  }

  getAllDocuments(_index, _type): any {
    return this.client.search({
      index: _index,
      type: _type,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source','hits.total']
    });
  }

  getAllDocumentsWithScroll(_index, _type, _size): any {
    return this.client.search({
      index: _index,
      type: _type,
      // Set to 1 minute because we are calling right back
      scroll: '1m',
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
      body: {
        'size': _size,
        'query': {
          'match_all': {}
        },
        'sort': [
          { '_uid': { 'order': 'asc' } }
        ]
      }
    });
  }

  getNextPage(scroll_id): any {
    return this.client.scroll({
      scrollId: scroll_id,
      scroll: '1m',
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id']
    });
  }

}