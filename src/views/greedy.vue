<template>
  <div class="fill-container">
    <span>
      <Select v-model="currencyPair" @on-change="onChange">
        <Option value="WBTC_USDT">WBTC_USDT</Option>
        <Option value="WETH_USDT">WETH_USDT</Option>
        <Option value="ARB_WETH">ARB_WETH</Option>
        <Option value="GMX_WETH">GMX_WETH</Option>
      </Select>
    </span>
    <div id="order"></div>
    <div id="profit"></div>
    <div id="balance"></div>
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
      priceList: [],
    };
  },
  mounted() {
    this.onChange();
  },
  methods: {
    async onChange() {
      this.priceList = await this.fetchPriceData();
      this.fetchOrderData();
      this.fetchBalanceData();
    },
    drawOption(option, ele) {
      let myChart = this.$echarts(ele);
      myChart.clear();
      myChart.resize();
      myChart.setOption(option);
    },

    drawOrder({ orderList = [] }) {
      const markList = [];
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
            data: this.priceList,
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

    drawProfit({ profitList = [] }) {
      const currencyPairList = this.currencyPair.split('_');
      const option = {
        title: {
          text: `以${currencyPairList[0]}计价累计利润`,
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
            name: '利润',
            data: profitList,
            type: 'line',
          },
        ],
      };
      const ele = document.querySelector('#profit');
      this.drawOption(option, ele);
    },

    async drawBalance({ leftBaseValueList, rightBaseValueList }) {
      const currencyPairList = this.currencyPair.split('_');
      const option = {
        title: {
          text: `以${currencyPairList[1]}计价累计余额`,
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
        yAxis: [{ type: 'value', min: 'dataMin', max: 'dataMax', name: currencyPairList[1] }],
        series: [
          {
            // 对Greedy来说，right 数量多，left 数量少，统计受价格影响小很多
            name: `余额`,
            data: rightBaseValueList,
            type: 'line',
            yAxisIndex: 0,
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
    },

    async fetchBalanceData() {
      const res = await axios.get('/task/market/order-balance', {
        params: { model: 'BalanceValue', task: 'GreedyTask', currencyPair: this.currencyPair },
      });
      this.drawBalance(res.data.data);
    },

    async fetchPriceData() {
      const res = await axios.get('/task/market/order-price', {
        params: { model: 'GreedyPrice', currencyPair: this.currencyPair },
      });
      return res.data.data.priceList;
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
