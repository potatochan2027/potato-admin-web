<script setup lang="ts">
import {ref} from "vue";
import {formRules} from "./rule";
import {FormProps} from "./types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    departmentName: "",
    status: 0,
    remark: "",
    departmentHeadName:""
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
      :model="newFormInline"
      :rules="formRules"
      label-width="82px"
  >

    <el-form-item label="上级部门">
      <el-cascader
          class="w-full"
          v-model="newFormInline.parentId"
          :options="newFormInline.higherDeptOptions"
          :props="{
              value: 'id',
              label: 'departmentName',
              emitPath: false,
              checkStrictly: true
            }"
          clearable
          filterable
          placeholder="请选择上级部门"
      >
        <template #default="{ node, data }">
          <span>{{ data.departmentName }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
    </el-form-item>

    <el-form-item label="部门名称" prop="deptmentName">
      <el-input
          v-model="newFormInline.departmentName"
          clearable
          placeholder="请输入部门名称"
      />
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
          v-model="newFormInline.remark"
          clearable
          placeholder="请输入备注"
      />
    </el-form-item>

    <el-form-item label="负责人" prop="departmentHeadName">
      <el-input
          v-model="newFormInline.departmentHeadName"
          placeholder="请输入负责人"
          clearable
      />
    </el-form-item>


  </el-form>
</template>
