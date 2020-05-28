import { pogApis } from './index'
const Api = {}

Api.install = (Vue, options) => {
  const lastNode = localStorage.node_key
  ? localStorage.node_key
  : 'node0'
  console.log(lastNode)
  if (localStorage.node_key) {
    console.log(`上次app使用节点：${localStorage.node_key}`)
  }
  const apiPrototype = Vue.extend({
    data() {
      return {
        pog: {
          read: pogApis.rpcs[lastNode],
          tr: pogApis.trxs[lastNode],
          status: 'pending',
          key: lastNode
        }
      }
    },
    methods: {
      delayTest() {

      },
      toggleNode() {

      }
    },
  })
  const instance = new apiPrototype()
  const recordResponseTime = (key, node) => {
    return new Promise((resolve, reject) => {
      let reqTime = new Date().getTime()
      node.getInfo().then(() => {
        let resTime = new Date().getTime()
        if (instance.pog.status === 'pending') {
          console.log(`切换到: ${key}`)
          instance.pog.status = 'fulfilled'
          instance.pog.read = pogApis.rpcs[key]
          instance.pog.tr = pogApis.trxs[key]
          instance.pog.key = key
        }
        console.log('after', instance.pog.status)
        resolve({
          time: resTime - reqTime,
          key
        })
      }).catch(e => {
        resolve(e)
      })
    })
  }
  Vue.prototype.$nodeTest = async () => {
    const tasks = []
    Object.keys(pogApis.rpcs).map(key => {
      tasks.push(recordResponseTime(key, pogApis.rpcs[key]))
    })
    await Promise.all(tasks)
  }
  Vue.prototype.$nodeApi = instance.pog
}

export default Api