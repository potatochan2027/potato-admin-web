import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  mark:[{ required: true, message: "角色标识符为必填项", trigger: "blur" }]
});
