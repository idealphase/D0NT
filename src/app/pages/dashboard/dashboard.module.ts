import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { TeamComponent } from './team/team.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from './weather/weather.component';
import { SolarComponent } from './solar/solar.component';
import { PlayerComponent } from './rooms/player/player.component';
import { TrafficComponent } from './traffic/traffic.component';
import { TrafficChartComponent } from './traffic/traffic-chart.component';
import { EchartsSeriesTypeComponent } from '../charts/echarts/echarts-series-type.component';
import { EchartsSeriesTypeChartComponent } from '../charts/echarts/echarts-series-type-chart.component';
import { EchartsSeriesErrorComponent } from '../charts/echarts/echarts-series-error.component'
import { EchartsSeriesErrorChartComponent } from '../charts/echarts/echarts-series-error-chart.component';
import { SmartTableComponent } from '../tables/smart-table/smart-table.component';
//import { TablesComponent} from '../tables/tables.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    EchartsSeriesTypeComponent,
    EchartsSeriesTypeChartComponent,
    EchartsSeriesErrorComponent,
    EchartsSeriesErrorChartComponent,
    SmartTableComponent,
  ],
})
export class DashboardModule { }
