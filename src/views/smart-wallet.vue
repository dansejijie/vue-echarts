<template>
  <div class="fill-container"></div>
</template>
<script>
import axios from "../utils/http";
import TransactionBehavior from "../bean/TransactionBehavior";
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 图表统计： 基于标签、链画像。 对合约的行为作聚合，统计某段时间内的交互次数。
 * 对知名合约如Uniswap等，细分具体某代币，如定义为 Swap Pepe
 */
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {

    async init() {
       const chainData = await this.fetchData();
        chainData.forEach(data=>{
          const father = document.querySelector('.fill-container');
          const child = document.createElement('div');
          child.style = `height: 40vh;`
          father.appendChild(child);
          this.createChart(data, child)
        } );
    },

    /**
     * 创建 key
     * @param {TransactionBehavior} transaction
     */
    createTransactionKey(transaction) {
      const toLable = transaction.to;
      return `${toLable}_${transaction.action || transaction.method}`;
    },

    /**
     * @param {TransactionBehavior} transactionList
     * @returns {Array<{name, value}>}
     */
    createOptionChildData(transactionList) {
      // 初始化聚合数据
      /** @type {Map<string, Array<TransactionBehavior>>} */
      const keyArrMap = {};

      transactionList.forEach((transaction) => {
        const key = this.createTransactionKey(transaction);
        if (!keyArrMap[key]) keyArrMap[key] = [];
        keyArrMap[key].push(transaction);
      });

      return Object.keys(keyArrMap).map(key=> {
        return {
          name: key,
          value: keyArrMap[key].length,
        }
      });
    },

    async fetchData() {
      // const res = await axios.get("/contract/smart-wallet/transaction");
      const res = {data: {data: [{chain: 'ARB', tag: 'meme', to: '0x1236543', method: 'SWAP', action: 'SWAP_ARDOGE'},
      {chain: 'ARB', tag: 'meme', to: '0x12362343', method: 'SWAP', action: 'SWAP_DOG'},
      {chain: 'ETH', tag: 'meme', to: '0x12362343', method: 'SWAP', action: 'SWAP_DOG'}]}}
      /** @type {Array<TransactionBehavior>} */
      let transactionList = res.data.data;

      transactionList = transactionList.filter(transaction=>transaction.tag === 'meme')

      const chainSet = new Set();

      transactionList.forEach(transaction=>chainSet.add(transaction.chain));

      return Array.from(chainSet).map(chain=>{
        const children = this.createOptionChildData(transactionList.filter(transaction=>transaction.chain === chain))
        return {
          name: chain,
          value: children.length,
          children,
        }
      })
    },



    /**
     * https://echarts.apache.org/en/option.html#series-treemap.data
     */
    createChart(data, el) {
      console.log('createChart', data);
      let myChart = this.$echarts(el);
      function getLevelOption() {
        return [
          {
            itemStyle: {
              borderWidth: 0,
              gapWidth: 5,
            },
          },
          {
            itemStyle: {
              gapWidth: 1,
            },
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              gapWidth: 1,
              borderColorSaturation: 0.6,
            },
          },
        ];
      }
      myChart.setOption(
         {
          title: {
            text: data.name,
            left: "center",
          },
          series: [
            {
              name: data.name,
              type: "treemap",
              visibleMin: 300,
              label: { show: true },
              itemStyle: { borderColor: "#fff" },
              levels: getLevelOption(),
              data: data.children,
            },
          ],
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.fill-container {
  display: flex;
  flex-direction: column;
  > div {
    height: 40vh;
  }
}
</style>
