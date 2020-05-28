
/**
 * 日期操作 
 * @param {function} search     查找数据内是否有其值  找到返回true 否false
**/



  /**
   * 日期转换时间戳
   * @param {Array}  data   数组
   * @param {string} index  索引名
   * @param {string} info   查找内容
  **/
  function search(data,index,info) {
    let state = false;
    for (let item of data) {
        if(item[index] == info){
            state = true
        }
    }
    return state
  }
 
  


export default {
  search,
};


