import {reactive} from "vue";
import {FormRules} from "element-plus";

export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "字典名称为必填项", trigger: "blur" }]
});

