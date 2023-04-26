<template>
  <div class="fill-container">
    <div id="order"></div>
    <div id="profit"></div>
    <div id="loss-num"></div>
  </div>
</template>
<script>
import axios from '../utils/http';
import dayjs from 'dayjs';

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
    drawOption(option, ele) {
      let myChart = this.$echarts(ele);
      myChart.clear();
      myChart.resize();
      myChart.setOption(option);
    },

    drawOrder({ orderList = [], priceList = [] }) {
      const markList = [];
      console.log('orderList', orderList);
      orderList.forEach((order) => {
        const unix = dayjs(order.createdAt).unix() * 1000;
        const itemStyle = {};
        if (order.side === 'buy') {
          itemStyle.color = 'red';
        } else {
          itemStyle.color = 'green';
          itemStyle.opacity = 0.6;
        }
        markList.push({
          value: order.side,
          xAxis: unix,
          yAxis: order.price,
          itemStyle,
          label: { color: '#fff' },
        });
      });

      const option = {
        title: {
          text: '订单',
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
        yAxis: [{ type: 'value', min: 'dataMin', max: 'dataMax', name: 'ETH/WBTC价格' }],
        series: [
          {
            name: '价格',
            data: priceList,
            type: 'line',
            markPoint: {
              data: markList,
            },
          },
        ],
      };
      const ele = document.querySelector('#order');
      this.drawOption(option, ele);
    },

    async drawProfit({ orderList = [] }) {
      let profitLeftList = [];
      let profitRightList = [];
      let left = 0;
      let right = 0;
      orderList.forEach((order) => {
        const unix = dayjs(order.createdAt).unix() * 1000;
        if (order.side === 'buy') {
          left += order.amount;
          right -= order.amount * order.price;
        } else {
          left -= order.amount;
          right += order.amount * order.price;
        }
        const profitLeft = left + right / order.price;
        const profitRight = left * order.price + right;
        profitLeftList.push([unix, Number(profitLeft.toFixed(4))]);
        profitRightList.push([unix, Number(profitRight.toFixed(4))]);
      });

      const option = {
        title: {
          text: '以ETH/BTC计价累计',
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
          name: '日期',
        },
        yAxis: [
          { type: 'value', min: 'dataMin', max: 'dataMax', name: 'ETH' },
          { type: 'value', min: 'dataMin', max: 'dataMax', name: 'WBTC' },
        ],
        series: [
          {
            name: 'ETH利润',
            data: profitLeftList,
            type: 'line',
          },
          {
            name: 'WBTC利润',
            data: profitRightList,
            type: 'line',
            yAxisIndex: 1,
          },
        ],
      };
      const ele = document.querySelector('#profit');
      this.drawOption(option, ele);
    },

    async drawLossOrder({ orderList = [] }) {
      let numList = [];
      let num = 0;
      orderList.forEach((order) => {
        const unix = dayjs(order.createdAt).unix() * 1000;
        if (order.side === 'buy') {
          num++;
        } else {
          num--;
        }
        numList.push([unix, num]);
      });

      const option = {
        title: {
          text: '偏订单数',
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
          name: '日期',
        },
        yAxis: { type: 'value', min: 'dataMin', max: 'dataMax', name: '未对冲订单数' },
        series: [
          {
            name: '未对冲订单数',
            data: numList,
            type: 'line',
          },
        ],
      };
      const ele = document.querySelector('#loss-num');
      console.log('loss', option, ele);
      this.drawOption(option, ele);
    },
    async fetchData() {
      const res = await axios.get('/task/market/order-profit', {
        params: { orderModel: 'GridOrder' },
      });

      this.drawOrder(res.data.data);
      this.drawProfit(res.data.data);
      this.drawLossOrder(res.data.data);
      this.drawLoss(res.data.data);
    },
  },
};
</script>
<style lang="less" scoped>
.fill-container {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  > div {
    flex: 1;
    min-height: 40vh;
    max-height: 70vh;
  }
}
</style>
