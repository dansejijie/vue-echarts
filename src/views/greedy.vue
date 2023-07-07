<template>
  <div class="fill-container">
    <span>
      <Select v-model="currencyPair" @on-change="onChange">
        <Option value="WBTC_USDT">WBTC_USDT</Option>
        <Option value="WETH_USDT">WETH_USDT</Option>
      </Select>
    </span>
    <div id="order"></div>
    <div id="profit"></div>
    <div id="balance"></div>
    <div id="loss-num"></div>
  </div>
</template>
<script>
import axios from '../utils/http';
import dayjs from 'dayjs';
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 跨市套利，订单与利润表
 */
export default {
  data() {
    return {
      currencyPair: 'WBTC_USDT',
    };
  },
  mounted() {
    this.fetchOrderData();
    this.fetchBalanceData();
  },
  methods: {
    onChange() {
      this.fetchOrderData();
      this.fetchBalanceData();
    },
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
        const ratio = (((order.sellPrice - order.price) / order.price) * 100).toFixed(1) + '%';
        const itemStyle = {};
        if (order.side === 'buy') {
          itemStyle.color = 'red';
        } else {
          itemStyle.color = 'green';
          itemStyle.opacity = 0.6;
        }
        if (order.sellOrderId) {
          itemStyle.borderColor = 'yellow';
        }
        markList.push({
          value: ratio,
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
        yAxis: [{ type: 'value', min: 'dataMin', max: 'dataMax' }],
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
      const idMap = {};
      orderList.forEach((order) => {
        idMap[order._id] = order;
      });
      let profitList = [];
      let left = 0;
      let right = 0;
      orderList
        .filter((order) => order.side === 'buy')
        .forEach((order) => {
          if (order.sellOrderId) {
            const unix = dayjs(order.createdAt).unix() * 1000;
            const sellOrder = idMap[order.sellOrderId];
            left = left + order.amount - sellOrder.amount;
            right = right - order.amount * order.price + sellOrder.amount * sellOrder.price;
            const profit = Number((left + right / sellOrder.price).toFixed(4));
            profitList.push([unix, profit]);
          }
        });

      const option = {
        title: {
          text: '已对冲BTC币本位累计',
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
        yAxis: { type: 'value', min: 'dataMin', max: 'dataMax' },
        series: [
          {
            name: '利润',
            data: profitList,
            type: 'line',
          },
        ],
      };
      const ele = document.querySelector('#profit');
      console.log('profit', option, ele);
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
          text: '未对冲订单数',
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
        yAxis: { type: 'value', min: 'dataMin', max: 'dataMax' },
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

    async drawBalance({ leftBaseValueList, rightBaseValueList }) {
      const currencyPairList = this.currencyPair.split('_');
      const option = {
        title: {
          text: `余额统计`,
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
          { type: 'value', min: 'dataMin', max: 'dataMax', name: currencyPairList[0] },
          { type: 'value', min: 'dataMin', max: 'dataMax', name: currencyPairList[1] },
        ],
        series: [
          {
            name: `以${currencyPairList[0]}计价累计`,
            data: leftBaseValueList,
            type: 'line',
          },
          {
            name: `以${currencyPairList[1]}计价累计`,
            data: rightBaseValueList,
            type: 'line',
            yAxisIndex: 1,
          },
        ],
      };
      const ele = document.querySelector('#balance');
      this.drawOption(option, ele);
    },

    async fetchOrderData() {
      const res = await axios.get('/task/market/order-profit', {
        params: { orderModel: 'GreedyOrder', currencyPair: this.currencyPair },
      });

      this.drawOrder(res.data.data);
      this.drawProfit(res.data.data);
      this.drawLossOrder(res.data.data);
    },

    async fetchBalanceData() {
      const res = await axios.get('/task/market/order-balance', {
        params: { model: 'BalanceValue', task: 'GreedyTask', currencyPair: this.currencyPair },
      });
      this.drawBalance(res.data.data);
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
