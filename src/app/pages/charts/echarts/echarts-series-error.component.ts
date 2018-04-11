import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-series-error',
  styleUrls: ['./ngx-echarts-series.scss'],
  template: `
  <nb-card>
  <nb-card-header> 
  <span style="font-size: 30px;">DNS Error Series</span>
  <div class="dropdown ghost-dropdown" ngbDropdown>
    <button type="button" class="btn btn-sm" ngbDropdownToggle
          [ngClass]="{ 'btn-success': currentTheme == 'default', 'btn-primary': currentTheme != 'default'}">
    {{ type }}
    </button>
    <ul ngbDropdownMenu class="dropdown-menu">
      <li class="dropdown-item" *ngFor="let t of types" (click)="type = t">{{ t }}</li>
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
  type = '24h';
  types = ['24h', '3d', '7d', '30d'];
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
