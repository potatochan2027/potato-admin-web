<script setup lang="ts">

import {ref} from "vue";
import {FormProps} from "./types";
import {formRules} from "./rule";

//接收父组件传来的数据
const props = defineProps<FormProps>();

//获取表格中一行的数据
const newFormInline = ref(props.formInline);

const elFormRef = ref();

function getRef(){
  return elFormRef.value;
}

defineExpose({getRef});

</script>

<template>

  <el-form
    ref="elFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="字典名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入字典名称"
      />
    </el-form-item>

    <el-form-item label="字典备注" prop="mark">
      <el-input
        v-model="newFormInline.remark"
        clearable
        placeholder="请输入字典备注"
      />
    </el-form-item>
  </el-form>


</template>


