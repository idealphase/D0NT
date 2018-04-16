import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-series-type',
  styleUrls: ['./ngx-echarts-series.scss'],
  template: `
  <nb-card>
    <nb-card-header> 
    <span style="font-size: 30px;">DNS QType Series</span>
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
      <ngx-echarts-series-type-chart></ngx-echarts-series-type-chart>
    </nb-card-body>
  </nb-card>
  `,
})
export class EchartsSeriesTypeComponent implements OnDestroy {
  type = '24 h';
  types = ['24 h', '3 d', '7 d', '30 d'];
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
