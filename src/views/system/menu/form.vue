<script setup lang="ts">
import {ref} from "vue";
import {formRules} from "./rule";
import {FormProps} from "./types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    name: "",
    path: "",
    component: ""
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

    <el-form-item label="上级菜单">
      <el-cascader
          class="w-full"
          v-model="newFormInline.parentId"
          :options="newFormInline.higherDeptOptions"
          :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
          clearable
          filterable
          placeholder="请选择上级菜单"
      >
        <template #default="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
    </el-form-item>

    <el-form-item label="菜单名称" prop="name">
      <el-input
          v-model="newFormInline.name"
          clearable
          placeholder="请输入菜单名称"
      />
    </el-form-item>

    <el-form-item label="路径" prop="path">
      <el-input
          v-model="newFormInline.path"
          clearable
          placeholder="请输入角色标识符"
      />
    </el-form-item>

    <el-form-item label="链接文件" prop="component">
      <el-input
          v-model="newFormInline.component"
          placeholder="请输入备注信息"
          clearable
      />
    </el-form-item>


  </el-form>
</template>
