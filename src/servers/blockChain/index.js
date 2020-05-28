import readBlockchain from './readBlockchain'
import transaction from './transaction'
import sendMessage from './sendMessage'

export const eos = {
  tr: transaction.eos,
  read: readBlockchain.readEos,
  send: sendMessage.eos
}
export const pog = {
  tr: transaction.pog,
  read: readBlockchain.readPog,
  send: sendMessage.pog
}

export const pogApis = {
  trxs: transaction.pogTrx,
  rpcs: readBlockchain.pogRpc
}