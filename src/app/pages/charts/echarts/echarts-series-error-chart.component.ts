import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-series-error-chart',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsSeriesErrorChartComponent implements AfterViewInit, OnDestroy {
  type = '24h';
  types = ['24h', '3d', '7d', '30d'];
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      var xAxisData = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
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
        color: ['#22CA33', '#5BBBDE', '#E6E600', '#FFA700', '#FF4C4C', '#ADADFF'],
      
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
            {name:'Sum',textStyle:{color:'#22CA33'}}, 
            {name:'NXDOMAIN',textStyle:{color:'#5BBBDE'}}, 
            {name:'REFUSED',textStyle:{color:'#E6E600'}},
            {name:'SERVFAIL',textStyle:{color:'#FFA700'}},
            {name:'FORMERR',textStyle:{color:'#FF4C4C'}},
            {name:'Other',textStyle:{color:'#ADADFF'}}
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
          { left: 80, right: 50, top: "5%", height: '11%' },
          { left: 80, right: 50, top: "20%", height: '11%' },
          { left: 80, right: 50, top: "35%", height: '11%' },
          { left: 80, right: 50, top: "50%", height: '11%' },
          { left: 80, right: 50, top: "65%", height: '11%' },
          { left: 80, right: 50, top: "80%", height: '11%' }
        ],

        /*dataZoom component is used for zooming a specific area, which enables 
        user to investigate data in detail, 
        or get an overview of the data, or get rid of outlier points.*/
        dataZoom: [{
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
        }],

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
            data: xAxisData
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
            data: xAxisData
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
            data: xAxisData
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
            data: xAxisData
          },
          {
            gridIndex: 4,
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: xAxisData
          },
          {
            name: 'Time',
            nameTextStyle: {
              fontSize: 15,
              color: '#F1F1F3'
            },
            gridIndex: 5,
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
            data: xAxisData,
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
              color: '#22CA33'
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
              color: '#56BBDE'
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
              color: '#E6E600'
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
              color: '#FFA700'
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
              color: '#FF4C4C'
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
          {
            name: 'Other',
            nameLocation: 'middle',
            nameGap: 30,
            type: 'value',
            nameTextStyle: {
              fontSize: 12,
              color: '#ADADFF'
            },
            gridIndex: 5,
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
          }
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
                  offset: 0, color: '#22CA33'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [100, 132, 101, 134, 90, 230, 100, 132, 101, 134, 90, 230, 100, 132, 101, 134, 90, 230],
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
                  offset: 0, color: '#5BBBDE'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [220, 182, 191, 234, 290, 330, 220, 182, 191, 234, 290, 330, 220, 182, 191, 234, 290, 330],
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
                  offset: 0, color: '#E6E600'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [150, 232, 201, 154, 190, 330, 150, 232, 201, 154, 190, 330, 150, 232, 201, 154, 190, 330],
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
                  offset: 0, color: '#FFA700'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [320, 332, 301, 334, 390, 330, 320, 332, 301, 334, 390, 330, 320, 332, 301, 334, 390, 330],
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
                  offset: 0, color: '#FF4C4C'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [820, 932, 901, 934, 1290, 1330, 820, 932, 901, 934, 1290, 1330, 820, 932, 901, 934, 1290, 1330],
          },
          {
            name: 'Other',
            type: 'line',
            symbol: 'circle',
            symbolSize: 1,
            label: label,
            lineStyle: lineStyle,
            xAxisIndex: 5,
            yAxisIndex: 5,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: -0.5,
                x2: 0,
                y2: 0.7,
                colorStops: [{
                  offset: 0, color: '#ADADFF'
                }, {
                  offset: 1, color: echarts.bg
                }],
                globalCoord: false,
              },
            },
            data: [820, 932, 901, 934, 1290, 1330, 820, 932, 901, 934, 1290, 1330, 820, 932, 901, 934, 1290, 1330],
          },
        ],


      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
