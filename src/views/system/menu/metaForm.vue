<script setup lang="ts">

import {ref} from "vue";
import {formRules} from "@/views/system/menu/rule";
import {FormProps} from "@/views/system/menu/types";


const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    name: "",
    path: "",
    component: "",
    meta: {
      title: "",
      icon: "",
      rank: 11
    }
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);


function getRef() {
  return ruleFormRef.value;
}

defineExpose({getRef});
</script>

<template>

  <el-form
      ref="ruleFormRef"
      :model="newFormInline.meta"
      :rules="formRules"
      label-width="82px"
  >


    <el-form-item label="Meta名称" prop="title">
      <el-input
          v-model="newFormInline.meta.title"
          clearable
          placeholder="请输入Meta名称"
      />
    </el-form-item>

    <el-form-item label="Meta图标" prop="icon">
      <el-input
          v-model="newFormInline.meta.icon"
          clearable
          placeholder="请输入Meta图标"
      />
    </el-form-item>

    <el-form-item label="排序" prop="rank">
      <el-input
          v-model="newFormInline.meta.rank"
          placeholder="请输入排序"
          clearable
      />
    </el-form-item>

  </el-form>

</template>


