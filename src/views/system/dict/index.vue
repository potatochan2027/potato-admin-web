<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";

import {PureTableBar} from "@/components/RePureTableBar";
import {useDict} from "./hook";

import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Menu from "@iconify-icons/ep/menu";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import {PureTable} from "@pureadmin/table";


defineOptions({
  name: "DICT"
});


// 搜索框的form
const formSearchRef = ref();

const {
  form,
  loading,
  columns,
  dataList,
  onSearch,
  onReset,
  onAddDialog,
  onEditDialog,
  onDel,
  onKeyDialog,
  onTableSelectChange,
  onTablePageSizeChange,
  onTablePageCurrentChange,
  pagination
} = useDict();


</script>

<template>

  <div class="main">
    <el-form
      ref="formSearchRef"
      :model="form"
      :inline="true"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >

      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入字典名称"
          clearable
          class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
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
                   @click="onReset(formSearchRef)"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="字典列表"
      @refresh="onSearch"
      :columns="columns">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)"
                   @click="onAddDialog()">
          新增字典
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'}"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          @selection-change="onTableSelectChange"
          @page-size-change="onTablePageSizeChange"
          @page-current-change="onTablePageCurrentChange"
        >

          <template #operation="{ row }">

            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onEditDialog( row)"
              :icon="useRenderIcon(EditPen)"
            >
              修改
            </el-button>

            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onKeyDialog(row)"
              :icon="useRenderIcon(Menu)"
            >
              KEY管理
            </el-button>
            <el-popconfirm
              :title="`是否确认删除角色名称为${row.name}的这条数据`"
              @confirm="onDel(row)"
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


<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
