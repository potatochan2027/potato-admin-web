<script setup lang="ts">

import {ref} from "vue";
import {FormProps} from "./types";
import {formRules} from "./rule";

//接收父组件传来的数据
const props = defineProps<FormProps>();

//获取表格中一行的数据
const newFormInline = ref(props.formInline);

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
    <el-form-item label="登录网址" prop="url">
      <el-input
        v-model="newFormInline.url"
        clearable
        placeholder="请输入登录网址"
      />
    </el-form-item>

    <el-form-item label="爬虫模板" prop="crawlerType">

      <el-radio-group v-model="newFormInline.crawlerType" label="爬虫模板">

        <el-radio v-for="item in newFormInline.crawlerList" :key="item.keyValue" :label="item.keyValue">
          {{ item.keyName }}
        </el-radio>
      </el-radio-group>


    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        clearable
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>


</template>


