import { AfterViewInit, Component, OnDestroy, Input , OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { MomentModule } from 'ngx-moment';
import { ElasticsearchService } from '../../../elasticsearch.service';

@Component({
  selector: 'ngx-echarts-series-error-chart',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsSeriesErrorChartComponent implements AfterViewInit, OnDestroy , OnChanges {
  @Input() type_interval: string;
  options: any = {};
  themeSubscription: any;
  sumDataList = []
  nxdomainDataList = []
  refusedDataList = []
  servfailDataList = []
  formerrDataList = []
  private numberOfPoint: number;
  private interval: number;
  currentTheme: string;
  currentTime: any;
  currentTime_year: any;
  currentTime_month: any;
  currentTime_date: any;
  prevTime_timestamp_s: any;
  currentTime_timestamp_s: any;
  xAxisData = []
  delay_time = 240

  //color of echart
  sum_color = "#E74C3C"
  nxdomain_color = "#2980B9"
  refused_color = "#388E3C"
  servfail_color = "#F39C12"
  formerr_color = "#FFEE58"
  // ptr_color = "#8BC34A"
  // mx_color = "#F39C12"
  // other_color = "#FFEE58"

  async getError(){
    this.currentTime = new Date();
    this.currentTime_year = this.currentTime.getFullYear();
    this.currentTime_month = ("0"+(this.currentTime.getMonth()+1)).slice(-2);
    this.currentTime_date = ("0"+this.currentTime.getDate()).slice(-2);
    this.prevTime_timestamp_s = this.currentTime_timestamp_s;
    this.currentTime_timestamp_s = Math.round((this.currentTime.getTime()-this.delay_time)/1000);
    console.log("prev time ",this.prevTime_timestamp_s,"current time ",this.currentTime_timestamp_s)
    //console.log(this.currentTime_timestamp_s) // 1524216488
    //console.log(this.currentTime_year,this.currentTime_month,this.currentTime_date,this.currentTime_timestamp_s);
    var isTodayIndexExist = await this.es.checkTodayIndexExist(this.currentTime_year,this.currentTime_month,this.currentTime_date)
    //create today index in case don't have index exist
    if(isTodayIndexExist === false){
      await this.es.createTodayIndex(this.currentTime_year,this.currentTime_month,this.currentTime_date)
      console.log("[+] Created today index , ","filebeat-6.2.2-".concat(this.currentTime_year+"."+this.currentTime_month+"."+this.currentTime_date))
    }
    var tempDNS =  await this.es.getErrorDocuments(this.currentTime_year,this.currentTime_month,this.currentTime_date,this.prevTime_timestamp_s,this.currentTime_timestamp_s);
    console.log(tempDNS)
    if(this.xAxisData.length > this.numberOfPoint){
      this.xAxisData.shift()
    }
    this.xAxisData.push(this.currentTime)

    if(this.sumDataList.length > this.numberOfPoint){
      this.sumDataList.shift()
    }
    this.sumDataList.push(tempDNS["SUM"])

    if(this.nxdomainDataList.length > this.numberOfPoint){
      this.nxdomainDataList.shift()
    }
    this.nxdomainDataList.push(tempDNS["NXDOMAIN"])

    if(this.refusedDataList.length > this.numberOfPoint){
      this.refusedDataList.shift()
    }
    this.refusedDataList.push(tempDNS["REFUSED"])

    if(this.servfailDataList.length > this.numberOfPoint){
      this.servfailDataList.shift()
    }
    this.servfailDataList.push(tempDNS["SERVFAIL"]);

    if(this.formerrDataList.length > this.numberOfPoint){
      this.formerrDataList.shift()
    }
    this.formerrDataList.push(tempDNS["FORMERR"])
  }

  sleep = (time) => new Promise((resolve, reject) => {
    this.cd.detectChanges();
    setTimeout(resolve, time);
  })

  constructor(private es: ElasticsearchService,private themeService: NbThemeService,private cd: ChangeDetectorRef) {
    this.interval = 5000;
    this.numberOfPoint = 60;
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
    this.currentTime_timestamp_s = Math.round((new Date().getTime()-this.delay_time)/1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes){
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
      if (this.type_interval === 'Set Interval 5 s') {
        this.interval = 5000
      } else if(this.type_interval === 'Set Interval 10 s') {
        this.interval = 10000
      } else if(this.type_interval === 'Set Interval 30 s') {
        this.interval = 30000
      } else if(this.type_interval === 'Set Interval 1 m') {
        this.interval = 60000
      } else if(this.type_interval === 'Set Interval 3 m') {
        this.interval = 180000
      } else if(this.type_interval === 'Set Interval 5 m') {
        this.interval = 300000
      }
      console.log('Updated this.interval is ',this.interval)
    }
  }

  drawEchart(){
    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      var lineStyle = {
        normal: {
          width: 1
        }
      };
      var label = {
        normal: {
        },
        emphasis: {
          show: true,
          position: 'top',
        }
      };
      this.options = {
        backgroundColor: echarts.bg,
        color: [this.sum_color,this.nxdomain_color,this.refused_color,this.servfail_color,this.formerr_color],
      
      tooltip: {
          trigger: 'axis',
          backgroundColor: '#333333',
          borderColor: 'rgba(0, 0, 200, 0.2)',
          borderWidth: 1,
          borderRadius: 0,
          padding: 10,
          /*
          formatter: function (params) {
            if (params.length) {
              params.unshift({seriesName: 'time', value: [null, Math.floor(params[0].value[0]) + ' ms'], color: '#5193f2'})
              return echarts.util.map(['Sum', 'A', 'AAAA', 'NS', 'MX', 'Other'], function (seriesName) {
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var style = 'color: ' + param.color;
                  if (param.seriesName === seriesName) {
                    return '<span style="' + style + '">'
                      + param.seriesName
                      + '：</span><span style="'
                      + style + '">' + param.value + '</span>';
                  }
                }
              }).join('<br>');
            }
          },*/
          axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
              type: 'dotted',
              opacity: 0.5
            },
            label: {
              show: true,
              margin: 6,
              backgroundColor: echarts.tooltipBackgroundColor,
              textStyle: {
                color: '#fff'
              }
            },
            link: [{ xAxisIndex: 'all' }],
          },
        },
        
        /*brush is an area-selecting component, with which user can select 
        part of data from a chart to display in detail, 
        or doing calculations with them.*/
        brush: {
          toolbox: ['lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0
        },
        /*A group of utility tools, which includes export, data view, 
        dynamic type switching, data area zooming, and reset.*/
        toolbox: {
          top: "0%",
          feature: {
            magicType: {
              type: ['stack', 'line', 'bar', 'tiled'],
              title: { stack: 'Stack', line: 'Line', bar: 'Bar', tiled: 'Tiled' }
            },
            dataView: { title: 'Raw Data' },
            brush: {
              type: ['lineX', 'lineY', 'keep', 'clear'],
              title: { lineX: 'Horizontal Selection', lineY: 'Vertical Selection', keep: 'Keep Selection', clear: 'Clear Selection' }
            },
            dataZoom: { show: true, title: { zoom: 'Zoom', back: 'Unzoom' } },
            saveAsImage: {
              title: 'Save image',
              name: 'Login_by_Action'
            },
          }
        },
        /*Legend component shows symbol, color and name of 
        different series. You can click legends to toggle displaying series
         in the chart.*/
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [
            {name:'Sum',textStyle:{color:this.sum_color}}, 
            {name:'NXDOMAIN',textStyle:{color:this.nxdomain_color}}, 
            {name:'REFUSED',textStyle:{color:this.refused_color}},
            {name:'SERVFAIL',textStyle:{color:this.servfail_color}},
            {name:'FORMERR',textStyle:{color:this.formerr_color}},
          ],
          center: '0%',
          left: "10%",
          textStyle: {
            fontSize: 16,
            color: '#F1F1F3'
          }
        },
        /*Drawing grid in rectangular coordinate. In a single grid, at most two X 
        and Y axes each is allowed. Line chart, bar chart,
         and scatter chart (bubble chart) can be drawn in grid. */
        grid: [
          { left: 80, right: 50, top: "8%", height: '17%' },
          { left: 80, right: 50, top: "26%", height: '17%' },
          { left: 80, right: 50, top: "44%", height: '17%' },
          { left: 80, right: 50, top: "62%", height: '17%' },
          { left: 80, right: 50, top: "80%", height: '17%' }
        ],

        /*dataZoom component is used for zooming a specific area, which enables 
        user to investigate data in detail, 
        or get an overview of the data, or get rid of outlier points.*/
        /*dataZoom: [{
          type: 'slider',
          start: 0,
          stop: 100,
          top: '95%',
          fillerColor: 'rgba(255,255,255,0.2)',
          textStyle: {
            color: '#fff'
          },
          borderColor: '#777',
          dataBackground: {
            areaStyle: {
              color: '#cccccc'
            },
            lineStyle: {
              opacity: 0.8,
              color: '#8392A5'
            }
          },
          handleStyle: {
            color: '#aaa',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          xAxisIndex: [0, 1, 2, 3, 4, 5]
        }],*/

        /*The x axis in cartesian(rectangular) coordinate. Usually a single grid 
        component can place at most 2 x axis, one on the bottom and another on the top.
        offset can be used to avoid overlap when you need to put more than two x axis. */
        xAxis: [
          {
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData
          },
          {
            gridIndex: 1,
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData
          },
          {
            gridIndex: 2,
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData
          },
          {
            gridIndex: 3,
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData
          },
          {
            name: 'Time',
            nameTextStyle: {
              fontSize: 15,
              color: '#F1F1F3'
            },
            gridIndex: 4,
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#F1F1F3'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.xAxisData,
          }
        ],

        /*The y axis in cartesian(rectangular) coordinate. Usually a single grid
        component can place at most 2 y axis, one on the left and another on 
        the right. offset can be used to avoid overlap when you need to put 
        more than two y axis. */
        yAxis: [
          {
            name: 'Sum',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: this.sum_color
            },
            max: 'dataMax',
            splitNumber: 1,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              showMinLabel: false,
              textStyle: {
                fontSize: 9,
                color: '#F1F1F3'
              }
            },
            splitLine: { show: false }
          },
          {
            name: 'NXDOMAIN',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: this.nxdomain_color
            },
            gridIndex: 1,
            max: 'dataMax',
            splitNumber: 1,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              showMinLabel: false,
              textStyle: {
                fontSize: 9,
                color: '#F1F1F3'
              }
            },
            splitLine: { show: false }
          },
          {
            name: 'REFUSED',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: this.refused_color
            },
            gridIndex: 2,
            max: 'dataMax',
            splitNumber: 1,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              showMinLabel: false,
              textStyle: {
                fontSize: 9,
                color: '#F1F1F3'
              }
            },
            splitLine: { show: false }
          },
          {
            name: 'SERVFAIL',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: this.servfail_color
            },
            gridIndex: 3,
            max: 'dataMax',
            splitNumber: 1,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              showMinLabel: false,
              textStyle: {
                fontSize: 9,
                color: '#F1F1F3'
              }
            },
            splitLine: { show: false }
          },
          {
            name: 'FORMERR',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: this.formerr_color
            },
            gridIndex: 4,
            max: 'dataMax',
            splitNumber: 1,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              showMinLabel: false,
              textStyle: {
                fontSize: 9,
                color: '#F1F1F3'
              }
            },
            splitLine: { show: false }
          },
        ],

        series: [
          {
            name: 'Sum',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.sum_color
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: this.sumDataList,
          },
          {
            name: 'NXDOMAIN',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            xAxisIndex: 1,
            yAxisIndex: 1,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.nxdomain_color
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: this.nxdomainDataList
          },
          {
            name: 'REFUSED',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            xAxisIndex: 2,
            yAxisIndex: 2,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.refused_color
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: this.refusedDataList
          },
          {
            name: 'SERVFAIL',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            xAxisIndex: 3,
            yAxisIndex: 3,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.servfail_color
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: this.servfailDataList
          },
          {
            name: 'FORMERR',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            xAxisIndex: 4,
            yAxisIndex: 4,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: this.formerr_color
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: this.formerrDataList
          },
        ],
      };
    });
  }

  async ngAfterViewInit() {
    while (true){
      this.getError()
      this.drawEchart()
      await this.sleep(this.interval)
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
