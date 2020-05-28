import config from './config'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Api, JsonRpc } from 'eosjs';

/**
 * 转帐
 * @param { String } tokenContract 代币合约用户
 * @param { String } from 转帐用户
 * @param { String } to 收款人
 * @param { String } quantity  额度
 * @param { String } memo 备注
 * @param { String[] } privateKeyList 私钥数组
 */

function wrapper(_tokenConfig) {
  // let temp = localStorage.getItem("_tokenConfig", JSON.stringify(_tokenConfig));
  // localStorage.setItem("_tokenConfig", JSON.stringify(_tokenConfig));
  // console.log("xxxxxxx:",temp);
    /**
   * Api
   * JsonRpc
   * RpcError
   */
  const signatureProvider = new JsSignatureProvider([_tokenConfig.defaultPrivateKey]);
  const rpc = new JsonRpc(_tokenConfig.httpEndpoint);

  let api = new Api({ rpc, signatureProvider });
  const newaccount = (params) => {
    const {
      tokenContract = _tokenConfig.defaultToken,
      account, ownerKey = false,
      activeKey = false
    } = params
  
    var transaction = {
      actions: [{
        account: tokenContract,
        name: 'newaccount',
        authorization: [{
          actor: 'pogiocreator',
          permission: 'active',
        }],
        data: {
          creator: 'pogiocreator',
          name: account,
          owner: {
            threshold: 1,
            keys: [{
              key: ownerKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [{
              key: activeKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        }
      }]
    }
  
    return api.transact(transaction, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
  }

  
  const transfer = (params) => {
    const {
      tokenContract = _tokenConfig.defaultToken,
      from,
      to,
      quantity,
      memo,
      privateKeyList
    } = params
  
    const transferSignatureProvider = new JsSignatureProvider(privateKeyList);
    let transferApi = new Api({ rpc, signatureProvider: transferSignatureProvider });
    console.log(from, to, quantity, memo, privateKeyList)
    let action = {
      account: tokenContract,
      name: "transfer",
      authorization: [{
        actor: from,
        permission: 'active',
      }],
      data: {
        from: from,
        to: to,
        quantity: quantity,
        memo: memo,
      }
    }
    
    return transferApi.transact({ actions: [action] }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
  }

  const exchange = (params) => {
    const {
      tokenContract,
      from,
      data,
      privateKeyList
    } = params
  
    const transferSignatureProvider = new JsSignatureProvider(privateKeyList);
    let transferApi = new Api({ rpc, signatureProvider: transferSignatureProvider });
    console.log(data)
    let action = {
      account: tokenContract,
      name: "transfer",
      authorization: [{
        actor: from,
        permission: 'active',
      }],
      data: {
        from: from,
        to: to,
        quantity: quantity,
        memo: memo,
      }
    }
    
    return transferApi.transact({ actions: [action] }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
  }

  return {
    rpc,
    newaccount,
    transfer,
    exchange
  }
}

const pogTrx = (() => {
  const api_obj = {}
  config.nodes.map((node, index) => {
    api_obj[`node${index}`] = wrapper(config.pog(node))
  })
  return api_obj
})()
export default {
  pogTrx,
  pog: pogTrx.node0,
  eos: wrapper(config.eos)
}