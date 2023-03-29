<template>
  <div class="fill-container"></div>
</template>
<script>
import axios from '../utils/http';
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 跨市套利，时间与利润表
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
      const res = await axios.get('/task/cex-dex');
      const countProfitList = res.data.data;
      console.log('res', res);
      const option = {
        title: {
          text: 'Cex-Dex 套利盈利',
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
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: countProfitList,
            type: 'line',
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
