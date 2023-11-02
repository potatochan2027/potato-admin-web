<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";

import {PureTableBar} from "@/components/RePureTableBar";
import {useRole} from "./hook";

import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Menu from "@iconify-icons/ep/menu";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import {PureTable} from "@pureadmin/table";


defineOptions({
  name: "Role"
});

const formRef = ref();

const {
  form,
  loading,
  dataList,
  pagination,
  columns,
  onSearch,
  onReset,
  openDialog,
  handleDelete,
  handleMenu,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useRole();


</script>

<template>

  <div class="main">
    <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >


      <el-form-item label="角色名称" prop="name">
        <el-input
            v-model="form.name"
            placeholder="请输入角色名称"
            clearable
            class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="角色标识符" prop="mark">
        <el-input
            v-model="form.mark"
            placeholder="请输入标识符"
            clearable
            class="!w-[200px]"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-select
            v-model="form.status"
            placeholder="请选择状态"
            clearable
            class="!w-[180px]"
        >
          <el-option label="已启用" value="1"/>
          <el-option label="已停用" value="2"/>
        </el-select>
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
                   @click="onReset(formRef)"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
        title="角色列表"
        @refresh="onSearch"
        :columns="columns">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)"
                   @click="openDialog()"
        >
          新增角色
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
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
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
                @click="handleMenu(row)"
                :icon="useRenderIcon(Menu)"
            >
              菜单权限
            </el-button>
            <el-popconfirm
                :title="`是否确认删除角色名称为${row.name}的这条数据`"
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
