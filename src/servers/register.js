import { pog } from './blockChain';
import { signIn } from './pushServer'

/**
* 注册，注册后才可收发消息（如果已经注册过接口会报错重复注册，不用理会）
* @param {string} account 用户帐号
* @param {string} privateKey 用户私钥
* @param {string} regID 极光推送ID
*/ 
export async function register(account,privateKey,regID){
    try{
        let res = await pog.send.register({
            contract:"socialchat",
            name:"sign",
            from:account,
            privateKeyList: [privateKey]
        })
        
        // 向推送服务注册
        if( regID ){
            signIn({account_name: account, registration_id: regID});
        }

        return (res.processed.action_traces[0].console.split(':')[1]);
    }catch(err){
        throw err;
    }
}