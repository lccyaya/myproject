import ReactEcharts from 'echarts-for-react';
import { useIntl } from 'umi';
import * as echarts from 'echarts';
import React, { useRef, useEffect } from 'react';

const Chart = ({ record = [] }) => {
  const intl = useIntl();
  const ref = useRef();
  let xData = record.map((item) => {
    return item.x;
  });
  let yData = record.map((item) => {
    return item.y;
  });

  const option = {
    grid: [
      {
        top: '60',
        left: '30',
        right: '50',
        bottom: '0%',
        height: '70%',
        containLabel: true,
      },
    ],
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
      lineStyle: {
        color: 'rgba(214, 30, 37, 0.8)',
        type: 'dashed',
      },
      crossStyle: {
        color: 'rgba(214, 30, 37, 0.8)',
        type: 'dashed',
      },
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      position: [10000, 10000],
    },
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          color: '#8b8b8b',
        },
        boundaryGap: false,
        axisPointer: {
          // zlevel: 2,
          label: {
            backgroundColor: '#DA3137',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        splitLine: {
          lineStyle: {
            color: '#EBEBEB',
            type: 'dashed',
          },
        },

        axisLabel: {
          // inside: true,
          formatter: (val) => {
            return val ? val + '%' : '';
          },
          color: '#8b8b8b',
          verticalAlign: 'bottom',
        },
        position: 'left',
        axisPointer: {
          show: false,
        },
        min: 0,
        max: 100,
        interval: 25,
      },
    ],
    series: [
      {
        data: yData,
        type: 'line',
        lineStyle: {
          color: '#DA3137',
          width: 2,
        },
        smooth: false,
        zlevel: 3,
        itemStyle: {
          color: '#DA3137',
        },
        symbolSize: 8,
        label: {
          show: true,
          color: '#8b8b8b',
          formatter: function (item) {
            return item.value + '%';
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(214, 30, 37, 0.8)',
            },
            {
              offset: 1,
              color: 'rgba(214, 30, 37, 0)',
            },
          ]),
        },
        emphasis: {
          disabled: false,
          label: {
            formatter: (option) => {
              const { name, value, dataIndex } = option;
              const { hit_tag } = record[dataIndex] || {};
              return [`{tip|${hit_tag} ${value}%}`, `{default|${value}%}`].join('\n');
            },
            padding: [0, 0, 0, 20],
            rich: {
              tip: {
                color: '#fff',
                padding: [5, 5, 10, 5],
                offset: [10, 10],
                verticalAlign: 'middle',
                width: '100%',
                align: 'right',
                lineHeight: 30,
                backgroundColor: {
                  image:
                    'https://image.football-master.net/avatar/811bcb1d33900fcceb4fd8bd51782534_1656905317215.png',
                },
              },
              default: {
                align: 'center',
                padding: [0, 20, 0, 0],
              },
            },
          },

          // endLabel: {
          //   show: true,
          //   position: [-23, -25],
          //   color: '#fff',
          //   padding: [5, 5, 8, 5],
          //   backgroundColor: {
          //     image:
          //       'https://image.football-master.net/avatar/811bcb1d33900fcceb4fd8bd51782534_1656905317215.png',
          //   },
          //   formatter: (val) => {
          //     const { name, value } = val;
          //     return `${name} ${value}%`;
          //   },
          // },
          itemStyle: {
            color: '#DA3137',
            borderWidth: 2,
            borderColor: '#fff',
          },
        },
      },
    ],
  };
  useEffect(() => {
    const maxVal = Math.max(...yData);
    let selectDataIndex = yData.indexOf(maxVal);
    const echartInstance = ref.current?.getEchartsInstance();
    setTimeout(() => {
      echartInstance.dispatchAction({
        type: 'highlight',
        dataIndex: selectDataIndex,
      });
    }, 500);
    echartInstance.on('downplay', (params) => {
      const { batch = [] } = params;
      selectDataIndex = batch.length ? batch[0].dataIndex : selectDataIndex;
      echartInstance.dispatchAction({
        type: 'highlight',
        dataIndex: selectDataIndex,
      });
    });
    echartInstance.on('globalout', () => {
      echartInstance.dispatchAction({
        type: 'highlight',
        dataIndex: selectDataIndex,
      });
    });
    echartInstance.on('mouseout', () => {
      echartInstance.dispatchAction({
        type: 'highlight',
        dataIndex: selectDataIndex,
      });
    });
    echartInstance.on('highlight', (params) => {
      const { batch = [] } = params;
      if (batch.length) {
        selectDataIndex = batch[0].dataIndex;
        echartInstance.dispatchAction({
          type: 'downplay',
        });
        echartInstance.dispatchAction({
          type: 'highlight',
          dataIndex: selectDataIndex,
        });
      }
    });
  }, []);
  return (
    <>
      {record.length ? (
        <ReactEcharts ref={ref} option={option} lazyUpdate={true} notMerge={true} />
      ) : null}
    </>
  );
};
export default Chart;
