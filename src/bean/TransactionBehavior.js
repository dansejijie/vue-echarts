
/**
 * 聪明钱包 对象结构
 * 图表统计： 基于标签、链画像。 对合约的行为作聚合，统计某段时间内的交互次数。
 * 对知名合约如Uniswap等，细分具体某代币，如定义为 Swap Pepe
 * @readonly
 */
const TransactionBehavior = {
  tag: '', // 标签，如冲土狗，高低买卖
  chain: '', // 链
  hash: '', // txhash
  from: '', // 账户地址
  to: '', // 目标地址,
  block: 0, // 区块
  timestamp: 0, // 时间戳
  value: 0, // 消耗金额
  method: '', // 执行方法
  action: '', // 执行方法具化， 可选值
};

export default TransactionBehavior;


