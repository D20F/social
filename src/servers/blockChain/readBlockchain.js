import tr from './transaction'
import config from './config'
import axios from 'axios'

let baseURL = config.httpEndpoint
const xhr = axios.create({
  baseURL,
  timeout: 10000,
});

const postData = (url, data, needHeader) => {
  let headers = {"Content-Type": "application/json"};
  return new Promise((resolve, reject) => {
      xhr({ url, data, headers, method: 'post' })
          .then(res => {
              resolve(res.data)
          })
          .catch(err => reject(err))
  })
}

function wrapper(tr) {
  return {
    getBalance ({token, accountName, coinId}) {
      return tr.rpc.get_currency_balance(token, accountName, coinId)
    },
    getAccount (accName) {
      return tr.rpc.get_account(accName)
    },
    getKeyAccounts (publicKey) {
      return tr.rpc.history_get_key_accounts(publicKey)
    },
    getTableRows(params) {
      return tr.rpc.get_table_rows({...params})
    },
    getInfo() {
      return tr.rpc.get_info()
    }
  }
}
const pogRpc = (() => {
  const rpc_obj = {}
  Object.keys(tr.pogTrx).map((key, index) => {
    rpc_obj[`node${index}`] = wrapper(tr.pogTrx[key])
  })
  return rpc_obj
})()
export default {
  pogRpc,
  readPog: wrapper(tr.pog),
  readEos: wrapper(tr.eos),
}
// export default {
//   getBalance ({token, accountName, coinId}) {
//     return rpc.get_currency_balance(token, accountName, coinId)
//   },
//   getGosAccount (accName) {
//     return rpc.get_account(accName)
//   },
//   getKeyAccounts (publicKey) {
//     return rpc.history_get_key_accounts(publicKey)
//   },
//   getGOSRecord (data) {
//     let url = '/v1/history/get_actions'
//     return postData(url, data)
//   },
//   getTableRows(params) {
//     return rpc.get_table_rows({...params})
//   }
// }