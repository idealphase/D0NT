import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-series-error',
  styleUrls: ['./ngx-echarts-series.scss'],
  template: `
  <nb-card>
  <nb-card-header> 
  <span style="font-size: 30px;">DNS Error Series</span>
  <!--
  <div class="dropdown ghost-dropdown" ngbDropdown>
  <button type="button" class="btn btn-sm" ngbDropdownToggle
        [ngClass]="{ 'btn-success': currentTheme == 'default', 'btn-primary': currentTheme != 'default'}">
  {{ type_data }}
  </button>
  <ul ngbDropdownMenu class="dropdown-menu">
    <li class="dropdown-item" *ngFor="let t of types_data" (click)="type_data = t">{{ t }}</li>
  </ul>
  </div>
  -->
  <div class="dropdown ghost-dropdown" ngbDropdown>
  <button type="button" class="btn btn-sm" ngbDropdownToggle
        [ngClass]="{ 'btn-success': currentTheme == 'default', 'btn-primary': currentTheme != 'default'}">
  {{ type_interval }}
  </button>
  <ul ngbDropdownMenu class="dropdown-menu">
    <li class="dropdown-item" *ngFor="let t of types_interval" (click)="type_interval = t">{{ t }}</li>
  </ul>
  </div>
  </nb-card-header>
  <nb-card-body style="height: 650px;">
    <ngx-echarts-series-error-chart></ngx-echarts-series-error-chart>
  </nb-card-body>
  </nb-card>
  `,
})
export class EchartsSeriesErrorComponent implements OnDestroy {
  type_data = 'Data in 1 h';
  types_data = ['Data in 1 h','Data in 24 h', 'Data in 3 d', 'Data in 7 d', 'Data in 30 d'];
  type_interval = 'Set Interval 5 s';
  types_interval = ['Set Interval 1 s','Set Interval 3 s', 'Set Interval 5 s', 'Set Interval 10 s', 'Set Interval 30 s', 'Set Interval 1 m'];
  currentTheme: string;
  themeSubscription: any;

  constructor(private themeService: NbThemeService) {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}
