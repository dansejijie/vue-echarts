<template>
  <div class="fill-container"></div>
</template>
<script>
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 跨市套利，时间与利润表
 */
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
    const option = {
      xAxis: {
        type: 'time',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };
    let myChart = this.$echarts(this.$el);
    myChart.clear();
    myChart.resize()
    myChart.setOption(option);
    }
  }
}
</script>
<style lang="less" scoped>
</style>