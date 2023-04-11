<template>
  <div class="fill-container"></div>
</template>
<script>
import axios from '../utils/http';
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 牛熊套利，时间与利润表
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
      const res = await axios.get('/task/cow-bear/profit');
      const { profitList, balanceList, priceList, markList } = res.data.data;
      const option = {
        title: {
          text: 'Cow-Bear 套利盈利',
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
<style lang="less" scoped></style>
