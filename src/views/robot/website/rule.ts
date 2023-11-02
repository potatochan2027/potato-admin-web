import {reactive} from "vue";
import {FormRules} from "element-plus";

export const formRules = reactive(<FormRules>{
  url: [{ required: true, message: "登录网址为必填项", trigger: "blur" }]
});
