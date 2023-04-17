<template>
  <div class="fill-container">
    <div id="order"></div>
    <div id="profit"></div>
    <div id="loss"></div>
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

    drawOrder({orderList  = [], priceList = []}) {
      const markList = [];
      console.log('orderList', orderList);
      orderList.forEach(order=>{
        const unix = dayjs(order.createdAt).unix() * 1000;
        const ratio = (((order.sellPrice - order.price )/order.price)*100).toFixed(1) + '%';
        const itemStyle = {};
        if(order.side === 'buy') {
          itemStyle.color = 'red';
        } else {
          itemStyle.color = 'green';
          itemStyle.opacity = 0.6;
        }
        if(order.sellOrderId) {
          itemStyle.borderColor = 'yellow';
        }
        markList.push({ value: ratio, xAxis: unix, yAxis: order.price, itemStyle, label: {color: '#fff'} }); 
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
        yAxis: [
          { type: 'value'}, 
        ],
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
      this.drawOption(option, ele)
    },

    async drawProfit({orderList  = []}) {
      const idMap = {};
      orderList.forEach(order=>{
        idMap[order._id] = order;
      });
      let profitList = [];
      let left = 0;
      let right  = 0;
      orderList.filter(order=>order.side === 'buy').forEach(order=>{
        const unix = dayjs(order.createdAt).unix() * 1000;
          if(order.sellOrderId) {
            const sellOrder = idMap[order.sellOrderId];
            left = left + order.amount - sellOrder.amount;
            right = right - order.amount * order.price + sellOrder.amount * sellOrder.price;
            const profit = left  + right / sellOrder.price;
            profitList.push([unix, profit])
          }
      });

      const option = {
        title: {
          text: '已对冲比本位累计',
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
        yAxis: { type: 'value'}, 
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
      this.drawOption(option, ele)
    },
    async drawLoss({orderList  = []}) {
      const idMap = {};
      orderList.forEach(order=>{
        idMap[order._id] = order;
      });
      let lossList = [];
      let left = 0;
      let right  = 0;
      orderList.filter(order=>order.side === 'buy' && !order.sellOrderId).forEach(order=>{
        const unix = dayjs(order.createdAt).unix() * 1000;
        left = left + order.amount;
        right = right - order.amount * order.price;
        const loss = left * order.price + right;
        lossList.push([unix, loss])
      });

      const option = {
        title: {
          text: '未对冲订单',
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
        yAxis: { type: 'value'}, 
        series: [
          {
            name: '利润',
            data: lossList,
            type: 'line',
          },
        ],
      };
      const ele = document.querySelector('#loss');
      console.log('loss', option, ele);
      this.drawOption(option, ele)
    },

    async drawLossOrder({orderList  = []}) {
      let numList = [];
      let num = 0;
      orderList.forEach(order=>{
        const unix = dayjs(order.createdAt).unix() * 1000;
        if(order.side === 'buy') {
          num ++;
        } else {
          num --;
        }
        numList.push([unix, num])
      });

      const option = {
        title: {
          text: '未对冲订单树',
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
        yAxis: { type: 'value'}, 
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
      this.drawOption(option, ele)
    },
    async fetchData() {
      const res = await axios.get('/task/market/order-profit', {params:{ orderModel: 'GreedyOrder'}});

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
  >div {
    flex: 1;
    min-height: 40vh;
    max-height: 70vh;
  }
}
</style>
