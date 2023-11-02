<script setup lang="ts">

import {ref} from "vue";
import {FormProps} from "./types";
import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import {useKey} from "@/views/system/dict/keyHook";
import {PureTable} from "@pureadmin/table";
import {PureTableBar} from "@/components/RePureTableBar";

//接收父组件传来的数据
const props = defineProps<FormProps>();

//获取表格中一行的数据
const newFormInline = ref(props.formInline);






const {
  columns,
  dataList,
  onSearch,
  onAddDialog,
  onEditDialog,
  onDel
} = useKey(props.formInline);


</script>

<template>

  <PureTableBar
    title="KEY-VALUE"
    @refresh="onSearch"
    :columns="columns">

    <template #buttons>
      <el-button type="primary" :icon="useRenderIcon(AddFill)"
                 @click="onAddDialog()">
        新增KV
      </el-button>
    </template>

    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :size="size"

        :data="dataList"
        :columns="dynamicColumns"
        :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'}"
        :paginationSmall="size === 'small' ? true : false"
      >

        <template #operation="{ row }">

          <el-button
            class="reset-margin"
            link
            type="primary"
            :size="size"
            @click="onEditDialog(row)"
            :icon="useRenderIcon(EditPen)"
          >
            修改
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

</template>


