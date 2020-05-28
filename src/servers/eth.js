import axios from 'axios';;
import Web3 from 'web3'
var Tx = require("ethereumjs-tx").Transaction

var baseURL = 'http://api-cn.etherscan.com/api';
// var baseURL = 'http://www.UETOKEN.IO/exchange/record_trx';

// var HttpProvider = 'http://192.168.1.103:8545'            //测试
// var HttpProvider = 'http://ethapi.GPSTOKEN.IO:8545'   //正式
var HttpProvider = 'http://eth.freeotc.io:8545'   //正式
var web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider));

const xhr = axios.create({
  baseURL,
  timeout: 100000,
});

// post请求,needHeader参数用于判断是否需要认证
const postData = (url, data, needHeader) => {
  let headers = {};
  return new Promise((resolve, reject) => {
    xhr({ url, data, headers, method: 'post' })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => reject(err))
  })
}

// get请求,needHeader参数用于判断是否需要认证
const getData = (params, needHeader) => {
  let headers = {};
  return new Promise((resolve, reject) => {
    xhr({ params, headers })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

const getabi = reqData => {
  const data = {
    module: 'contract',
    action: 'getabi',
    apikey: 'VUDCK19I8D3NNT5Y9UHKIGC12MZ16ZS91C',
    address: reqData.address
  }
  return getData(data);
}

/**
 * ETH代币转账
 * @param {string} fromAddress 自己的地址
 * @param {string} toAddress 对方的地址     0xDcCE5Fec3890be188Fca7427794E8b1B62ba5576
 * @param {string} hexAmount 数额  0x22
 * @param {string} contractAddress 合约地址   0xdac17f958d2ee523a2206206994597c13d831ec7
 * @param {string} privateKey 解密后的私钥
 */
const transfer = (fromAddress, toAddress, hexAmount, contractAddress, privateKey) => {
  return new Promise((resolve, reject) => {
    const toAccount = toAddress.substr(2);
    console.log('toaccount:', toAccount, hexAmount);

    function addPreZero(num) {
      var t = (num + '').length,
        s = '';
      for (var i = 0; i < 64 - t; i++) {
        s += '0';
      }
      return s + num;
    }

    // 先获取当前账号交易的nonce
    web3.eth.getTransactionCount(fromAddress, web3.eth.defaultBlock.pending).then(function (nonce) {
      // 获取交易数据
      var txData = {
        nonce: web3.utils.toHex(nonce++), 
        gasLimit: web3.utils.toHex(99000),
        gasPrice: web3.utils.toHex(20e9),
        to: contractAddress,
        from: fromAddress,
        value: '0x00',
        data: '0x' + 'a9059cbb' + addPreZero(toAccount) + addPreZero(hexAmount.substr(2))
      }
      console.log('txData:', txData);

      var tx = new Tx(txData);
      const pKey = new Buffer(privateKey.substr(2), 'hex');
      tx.sign(pKey);

      var serializedTx = tx.serialize().toString('hex');

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
          resolve(hash);
        } else {
          reject(err);
        }
      });
    }).catch(err => {
      reject(err);
    })
  });
}

export {
  getabi,
  web3,
  transfer
}