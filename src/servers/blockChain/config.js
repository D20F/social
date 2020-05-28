const nodes = [
  'http://node0.poggy.one:8888',
  'http://node1.poggy.one:8888',
  'http://node2.poggy.one:8888',
  'http://node3.poggy.one:8888',
  'http://node4.poggy.one:8888',
]
const pog = (node = 'http://node4.poggy.one:8888') => {
  var baseNODE
  if (process.env.NODE_ENV === 'development') {
      baseNODE = 'http://120.24.76.199:8888';//测试
  } else {
      // baseNODE = node;//正式服务器
      baseNODE = 'http://120.24.76.199:8888';
  }

  return {
    chainId: '584bb5250e2823e920156ae1e14425f636a0920780384f95f99e617fc49acf55', // 32 byte (64 char) hex string
    httpEndpoint: baseNODE,
    expireInSeconds: 60,
    defaultPrivateKey: '5K4KFWyDayi8JQAhEZuJ9ajVqQfUqErz6XnUi7qXVQN7sTyNh6F',
    defaultToken: 'pog.token'
  }
}
// const config = {
//   keyProvider:["5J2GxxF4xCfAZjP9R26jwnVY8rp8FYqXRE1fJPq5KDMSxa5NRuW","5K3LFVo36rAYBuAGC1UQmrZtrtvLkuWVYQ6TyhzwBgB2DpHo4zB"],
//   chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
//   httpEndpoint: 'http://192.168.1.141:8888',
//   expireInSeconds: 60
// }
let eos = {};
if (process.env.NODE_ENV === 'development') {
  eos = {
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
    httpEndpoint: 'http://39.108.12.45:8888', // https://nodes.get-scatter.com:443
    expireInSeconds: 60,
    defaultPrivateKey: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
    defaultToken: 'bac.token'
  }
}else{
  eos = {
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
    httpEndpoint: 'https://api.eossweden.org',
    expireInSeconds: 60,
    defaultPrivateKey: '5K4KFWyDayi8JQAhEZuJ9ajVqQfUqErz6XnUi7qXVQN7sTyNh6F',
    defaultToken: 'eosio.token'
  }
}
export default {
  pog,
  eos,
  nodes
}
