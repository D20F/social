/**
 * 根据json名称分组 
 * @param {arr} arr
 * 
 */ 
function groupJson(arr){
    var map = {},dest = [];
    for(var i = 0; i < arr.length; i++){
        var ai = arr[i];
        if(!map[ai.from]){
            dest.push({
                from: ai.from,
                data: [ai]
            });
            map[ai.from] = ai;
        }else{
            for(var j = 0; j < dest.length; j++){
                var dj = dest[j];
                if(dj.from == ai.from){
                    dj.data.push(ai);
                    break;
                }
            }
        }
    }
    return dest
}

export default groupJson
