# social
社交软件

### 安卓编译环境变量
ANDROID_HOME        C:\Users\Administrator\AppData\Local\Android\Sdk
JAVA_HOME           C:\Program Files\Java\jdk1.8.0_241
CLASSPATH           %JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar
Path                %JAVA_HOME%\jre\bin
                    %JAVA_HOME%\bin
                    %ANDROID_HOME%\tools\bin
                    %ANDROID_HOME%\tools
                    D:\Program Files\gradle-6.3\bin

### 目录结构
                    ┌─      aes.js替换于eosjs-ecc文件夹   
├─  package-replac  |   
                    └─      eosjs-numeric.js替换于eosjs文件夹   
├─  src-cordova     ──      cordova打包环境
└─  src
    ├─ assets               项目公共资源
    ├─ common               通用CSS,JS文件     
    ├─ components           项目公共组件
    ├─ mixins               复杂的页面逻辑会写入混入，然后加载到页面
    ├─ router               Router管理
    ├─ servers              链操作文件
    ├─ store                VUEX文件
    ├─ utils                链加密解密文件
    ├─ views                vue页面文件夹
    ├─ app                  vue app主页面
    └─ main                 vue入口JS文件






    /**
        *存储数据结构
        *localStorage
    */
                                                                               
    ┌─    
    |                                                                         
    ├─    current_wallet        {                                                  * @param {object}   current_wallet   当前钱包信息  
    |                               chain:string,                                  * @param {string}   chain            钱包类型
    |                               privateKey:string,                             * @param {string}   privateKey       加密私钥
    |                               publicKey:string,                              * @param {string}   publicKey        公钥
    |                               name:string,                                   * @param {string}   name             账号名
    |                               tokenList:Array,                               * @param {Array}    tokenList        添加的货币token
    |                               isDefault:string,                              * @param {string}   isDefault        当前钱包标识 ── 弃用
    |                               balance:string,                                * @param {string}   balance          余额
    |                               password:string,                               * @param {string}   password         加密密码
    |                               key:string,                                    * @param {string}   key              聊天所需key
    |                            }                                                **/
    |
    |                                                                             /**
    ├─    isecsp_wallet     {                                                      * @param {object}   isecsp_wallet    储存所有钱包  按照钱包类别储存  
    |                           Eth:[]                                             * @param {Array}    contactPerson    Eth钱包  里面数据格式参考当前钱包格式
    |                           Eos:[]                                             * @param {Array}    contactPerson    Eos钱包  里面数据格式参考当前钱包格式
    |                           Pog:[]                                             * @param {Array}    contactPerson    Pog钱包  里面数据格式参考当前钱包格式
    └─                       }                                                     **/

    /**
        *数据库数据结构
        *采用多数据库多表
        *indexedOB
    */






数据库 二次封装



