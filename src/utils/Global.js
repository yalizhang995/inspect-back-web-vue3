//全局注册 ip地址正则
const IpRegex =
  /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
const IpRegex_msg = "请输入合法_有效的 IP地址";

//全局注册 端口地址正则
const PortRegex =
  /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const PortRegex_msg = "请输入合法_有效的 端口地址";

//全局注册 正整数
const PositiveIntegerRegex = /^[0-9]*[1-9][0-9]*$/;
const PositiveIntegerRegex_msg = "请输入合法_有效的端口地址";

//全局注册 正整数
const XmigrationRestUrlRegex = /^http:\/\/(\d{1,3}\.){3}\d{1,3}:\d+$/;
const XmigrationRestUrlRegex_msg =
  '请输入合法_有效的地址，例如："http://ip:port"';

// 数据传输-zookeeper 
// 单个ip端口
const IpRegex_PortRegex_d = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$/
const IpRegex_PortRegex_d_msg = "请输入合法_有效的IP端口地址"

// 多个ip端口 以英文逗号分割
const IpRegex_PortRegex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))*$/
const IpRegex_PortRegex_msg = "请输入合法_有效的IP端口地址,多个以英文逗号分割"
const IpRegex_PortRegex_ = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])(;(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))*$/
const IpRegex_PortRegex_msg_ = "请输入合法_有效的IP端口地址,多个以英文分号分割"

// 固话正则  例如：020-1234567
const isMob=/^((0\d{2,3})-)?(\d{7,8})$/;
const isMob_msg = '请输入正确的办公电话座机';
// 手机号码正则  例如：13723244256
const isPhone = /^1[3456789]\d{9}$/;
const isPhone_msg = '请输入正确的手机号';

// url、ip
// const strRegex = '^((https|http|ftp|rtsp|mms)?://)'
//             +'?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
//             + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
//             + '|' // 允许IP和DOMAIN（域名）
//             + '([0-9a-z_!~*()-]+.)*' // 域名- www.
//             + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
//             + '[a-z]{2,6})' // first level domain- .com or .museum
//             + '(:[0-9]{1,4})?' // 端口- :80
//             + '((/?)|' // a slash isn't required if there is no file name
//             + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$';
const strRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
const strRegex_msg = '请输入正确的url地址';


const siteCodes = /^\d{10}(,\d{10})*$/;
const siteCodes_msg = '请输入正确的填报单位标识码,多个请以英文逗号分割';

// const domainRegex = /^(?!.*[:/])([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const domainRegex = /^(?:[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$)|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
const domainRegex_msg = '请输入正确域名';


// /^(https?|ftp):\/\/(\w+\.)+[\w\.]+(\/[\w\-\u4e00-\u9fa5]*)*\/?(\?[\w\-\u4e00-\u9fa5%=&]*)?(#\w*)?$/i
export default {
  IpRegex, //ip地址正则
  IpRegex_msg,
  PortRegex, // 端口地址正则
  PortRegex_msg,
  PositiveIntegerRegex, //正整数
  PositiveIntegerRegex_msg,
  XmigrationRestUrlRegex,
  XmigrationRestUrlRegex_msg,
  IpRegex_PortRegex,
  IpRegex_PortRegex_msg,
  IpRegex_PortRegex_,
  IpRegex_PortRegex_msg_,
  IpRegex_PortRegex_d,
  IpRegex_PortRegex_d_msg,
  isMob,
  isMob_msg,
  isPhone,
  isPhone_msg,
  strRegex,
  strRegex_msg,
  siteCodes,
  siteCodes_msg,
  domainRegex,
  domainRegex_msg
};
