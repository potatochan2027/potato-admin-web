<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";

import {PureTableBar} from "@/components/RePureTableBar";
import {useMenu} from "./hook";

import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Menu from "@iconify-icons/ep/menu";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import {PureTable} from "@pureadmin/table";


defineOptions({
  name: "Menu"
});

const formRef = ref();
const tableRef = ref();


const {
  loading,
  form,
  columns,
  dataList,
  onReset,
  onSearch,
  openDialog,
  openMetaDialog,
  handleDelete,
  handleSelectionChange
} = useMenu();


</script>

<template>

  <div class="main">
    <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >


      <el-form-item label="菜单名称" prop="name">
        <el-input
            v-model="form.name"
            placeholder="请输入菜单名称"
            clearable
            class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="路径" prop="path">
        <el-input
            v-model="form.path"
            placeholder="请输入路径"
            clearable
            class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="链接文件" prop="component">
        <el-input
            v-model="form.component"
            placeholder="模糊查询"
            clearable
            class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
            type="primary"
            @click="onSearch"
            :loading="loading"
            :icon="useRenderIcon(Search)"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)"
                   @click="onReset(formRef)"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
        title="菜单列表"
        @refresh="onSearch"
        :tableRef="tableRef?.getTableRef()"
        :columns="columns">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)"
                   @click="openDialog()"
        >
          新增菜单
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 32 }"
            ref="tableRef"
            :data="dataList"
            default-expand-all
            row-key="id"
            :loading="loading"
            :columns="dynamicColumns"
            :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'}"
            @selection-change="handleSelectionChange"
        >

          <template #operation="{ row }">

            <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('编辑', row)"
                :icon="useRenderIcon(EditPen)"
            >
              修改
            </el-button>

            <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openMetaDialog('编辑',row)"
                :icon="useRenderIcon(Menu)"
            >
              设置样式
            </el-button>
            <el-popconfirm
                :title="`是否确认删除菜单名称为${row.name}的这条数据`"
                @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>

    </PureTableBar>
  </div>

</template>


<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
