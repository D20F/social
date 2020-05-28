import config from './config'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Api, JsonRpc } from 'eosjs';

 function wrapper(_tokenConfig){

    const rpc = new JsonRpc(_tokenConfig.httpEndpoint);

    /**
     * 注册/接收
     * @param { String } contract 合约 
     * @param { String } name 注册：sign  接收：get
     * @param { String } from 自己的account
     * @param { String[] } privateKeyList 私钥数组
     */
    const register = (params) => {

      const {contract,name,from,privateKeyList} = params

      const transferSignatureProvider = new JsSignatureProvider(privateKeyList);
      let transferApi = new Api({ rpc, signatureProvider: transferSignatureProvider });

      let action = {
          account: contract,
          name: name,
          authorization: [{
            actor: from,
            permission: 'active',
          }],
          data: {
              account_name:from
          }
      }

      return transferApi.transact({ actions: [action] }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })

    };

    /**
     * 发送消息
     * @param { String } contract 合约 注册：sign  接收：get
     * @param { String } msg 发送的内容
     * @param { String } from 自己的account
     * @param { String } to 对方的account
     * @param { String[] } privateKeyList 私钥数组
     */
    const sendMessage = (params) => {
        const {
            contract,
            msg,
            from,
            privateKeyList
        } = params

        const transferSignatureProvider = new JsSignatureProvider(privateKeyList);
        let transferApi = new Api({ rpc, signatureProvider: transferSignatureProvider });
        
        let action = {
            account: contract,
            name: "send",
            authorization: [{
              actor: from,
              permission: 'active',
            }],
            data: {
                from:from,
                msg: msg
            }
        }
        return transferApi.transact({ actions: [action] }, {
          blocksBehind: 3,
          expireSeconds: 30,
        })
    }

    /**
     * 阅读消息
     * @param { String } contract 合约 
     * @param { String } account_name 自己的account
     * @param { String } read_time 阅读
     * @param { String[] } privateKeyList 私钥数组
     */
    const read = (params) => {
      const {
          contract,
          account_name,
          read_time,
          privateKeyList
      } = params

      const transferSignatureProvider = new JsSignatureProvider(privateKeyList);
      let transferApi = new Api({ rpc, signatureProvider: transferSignatureProvider });
      
      let action = {
          account: contract,
          name: "read",
          authorization: [{
            actor: account_name,
            permission: 'active',
          }],
          data: {
            account_name,
            read_time
          }
      }

      return transferApi.transact({ actions: [action] }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
  }

   return {
        rpc,
        register,
        sendMessage,
        read
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