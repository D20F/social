import PasswordService from '../../util/PasswordService'
import CryptoAES from '../../util/CryptoAES'
import {Decimal} from 'decimal'
import {ethers} from 'ethers'
import {getabi, transfer, web3} from '../../servers/eth'


let getBalance =  async (data) => {
    var result = {};
    const provider = ethers.getDefaultProvider('homestead')
    let from = data.address
    let selectToken = data.token
    if (selectToken === 'eth') {
      provider.getBalance(from).then(balance => {
        const estr = ethers.utils.formatEther(balance);
        result.balance = estr;
        return result
      })
    } else {
      getabi({address: from}).then(async res => {
        if (res.message === 'OK') {
          const abi = JSON.parse(res.result)
          const contract = new ethers.Contract(from,abi,provider)
          const balance = await contract.balanceOf(from)
          result.balance = ethers.utils.formatUnits(balance, selectToken.decimal)
          return result
        }
      }).catch(err => {
        console.error(33,err);
      })
    }
  }



export default {
    getBalance,
}