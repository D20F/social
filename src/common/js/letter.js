/**
 * 数据 按照 拼音首字母 排序 并分组
 * @param {Json} data ; 需要 排序的 数据
 * @param {String} field ；必须；排序所依据的 字段 名
 * @return {Json} ; 例如：{A:[{},{}],B:[{},{}],C:[{}],#:[]}
 */
function dataLetterSort (data, field) {
    var letter_reg = /^[A-Z]$/;
    var list = new Array();
    for (var i = 0; i < data.length; i++) {
        // 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
        list['#'] = new Array();
        // 首字母 转 大写英文
        var letter = (data[i][field]).substr(0, 1).toUpperCase();
        // 是否 大写 英文 字母
        if (!letter_reg.test(letter)) {
            letter = '#';
        }
        // 创建 字母 分组
        if (!(letter in list)) {
            list[letter] = new Array();
        }
        // 字母 分组 添加 数据
        list[letter].push(data[i]);
    }
    // 转换 格式 进行 排序；
    var resault = new Array();
    for (var key in list) {
        resault.push({
            letter: key,
            list: list[key]
        });
    }
    resault.sort(function (x, y) {
        return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
    });
    // # 号分组 放最后
    var last_arr = resault[0];
    resault.splice(0, 1);
    resault.push(last_arr);
 
    // 转换 数据 格式
    var json_sort = {}
    for (var i = 0; i < resault.length; i++) {
        json_sort[resault[i].letter] = resault[i].list;
    }
 
    return json_sort;
}

export default dataLetterSort;