<template>
  <div class="fill-container"></div>
</template>
<script>
import axios from '../utils/http';
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 网格交易，时间与利润表
 */
export default {
  data() {
    return {};
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await axios.get('/task/grid');
      const { profitList, balanceList, priceList, markList } = res.data.data;

      // const countProfitList = [[1, 2], [2,2], [3, 3]];
      // const balanceList = [[1, 10], [2, 12], [3, 14]];
      // const orderList = [[1, 0.57], [2, 0.56], [3, 0.58]];
      // const markList = [{value: 0.57, xAxis: 2, yAxis: 0.56}];

      const option = {
        title: {
          text: 'Gird 套利盈利',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: 'time',
        },
        yAxis: [
          { type: 'value'}, 
          { type: 'value'},
          { type: 'value'}
        ],
        series: [
          {
            name: '累计利润',
            data: profitList,
            type: 'line',
          },
          {
            name: '当前余额',
            data: balanceList,
            type: 'line',
          },
          {
            name: '价格',
            data: priceList,
            yAxisIndex: 2,
            type: 'line',
            markPoint: {
              data: markList,
            },
          },
        ],
      };
      console.log('option', option);
      let myChart = this.$echarts(this.$el);
      myChart.clear();
      myChart.resize();
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
</style>
