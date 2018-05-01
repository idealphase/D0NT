import { Component } from '@angular/core';
import { SmartTableComponent } from '../tables/smart-table/smart-table.component';
import { NbThemeService } from '@nebular/theme';
import { ElasticsearchService } from '../../elasticsearch.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  domain: string = '';
  start_id = 0
  themeSubscription: any;
  currentTheme: string;
  constructor(private es: ElasticsearchService,private themeService: NbThemeService){
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }
  onAddLegitimateConfirm(event: any): void {
    if (window.confirm('Are you sure you want to add legitimate domain?')) {
      //event.confirm.resolve();
      console.log("This.domain is",this.domain)
      
      this.es.addLegitimateDomain(this.domain,this.start_id.toString())
      console.log("Added",this.domain)
      this.domain=""
      this.start_id++;
    } else {
      event.confirm.reject();
    }
  }
}
