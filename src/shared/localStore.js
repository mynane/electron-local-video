import { remote } from "electron";
const Store = remote.require("electron-store");

console.log(remote.app.getPath("userData"));

let option = {
  name: "config", //文件名称,默认 config
  fileExtension: "json", //文件后缀,默认json
  cwd: remote.app.getPath("userData"), //文件位置,尽量不要动
  clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
};

const localStore = new Store(option);

export default localStore;
