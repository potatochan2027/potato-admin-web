<script setup lang="ts">

import {ref} from "vue";
import {KeyProps} from "./types";
import {formRules} from "./rule";

//接收父组件传来的数据
const props = defineProps<KeyProps>();

//获取表格中一行的数据
const newFormInline = ref(props.keyInline);

const elFormRef = ref();

function getRef() {
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
    <el-form-item label="keyName" prop="keyName">
      <el-input
        v-model="newFormInline.keyName"
        clearable
        placeholder="请输入keyName"
      />
    </el-form-item>

    <el-form-item label="keyValue" prop="keyValue">
      <el-input
        v-model="newFormInline.keyValue"
        clearable
        placeholder="请输入keyValue"
      />
    </el-form-item>
  </el-form>


</template>


