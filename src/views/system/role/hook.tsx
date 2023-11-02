import {reactive, ref, onMounted, h, toRaw, Ref} from "vue";
import {type PaginationProps} from "@pureadmin/table";
import {usePublicHooks} from "@/views/system/hooks";
import {addRole, getRoleList, modifyRole, delRole, bindMenuRequest} from "@/api/system/role";
import {FormItemProps, MenuItemProps, MenuProps} from "./types";
import {addDialog} from "@/components/ReDialog/index";
import editForm from "./form.vue";
import menuForm from "./menuForm.vue";
import {message} from "@/utils/message";
import {ElMessageBox} from "element-plus";
import {getMenuList, getMenuListByRoleId} from "@/api/system/menu";
import {getDeptListRequest} from "@/api/system/dept";
import {handleTree} from "@/utils/tree";
import {object} from "vue-types";
import {F} from "@vueuse/motion/dist/nuxt-b4cb9b59";


export function useRole() {

  const form = reactive({
    id: null,
    name: "",
    remark: "",
    mark: "",
    status: null,
    total: 0,
    pageSize: 10,
    currentPage: 1
  });
  const formRef = ref();
  const treeRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const treeLoading = ref(true);
  const treeData = ref([]);
  const higherDeptOptions = ref();
  const switchLoadMap = ref({});
  const {switchStyle} = usePublicHooks();
  const treeSelect = ref([]);
  const menuList = ref([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "角色编号",
      prop: "id",
      minWidth: 80
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识符",
      prop: "mark",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 120,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={2}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 120
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;

    if (form.status != 1 && form.status != 2) {
      form.status = null;
    }

    form.currentPage = pagination.currentPage;
    form.pageSize = pagination.pageSize;

    const {data} = await getRoleList(toRaw(form));
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();

    // 归属部门
    getMenuListAPI({});


    setTimeout(() => {
      treeData.value = handleTree(menuList.value);
      treeLoading.value = false;

      console.log(menuList);
      console.log(treeData.value);
    }, 500);


  });

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  const onReset = formE => {
    if (!formE) return;
    formE.resetFields();
    onSearch();
  }

  function handleDelete(row?: FormItemProps) {
    delRoleAPI(row);

    setTimeout(() => {
      loading.value = false;
      onSearch();
    }, 500);
  }

  function handleMenu(row?: FormItemProps) {
    openRole("绑定菜单", row);
  }

  function openDialog(title = "新增", row ?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          remark: row?.remark ?? "",
          mark: row?.mark ?? "",
          id: row?.id ?? null
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, {ref: formRef}),
      beforeSure: (done, {options}) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); //关闭弹窗

          setTimeout(() => {
            loading.value = false;
            onSearch();
          }, 500);
        }

        FormRef.validate(valid => {
          if (valid) {
            //表单校验通过
            if (title == "新增") {
              //调用接口
              addRoleAPI(curData);
              chores();
            } else {
              //调用API接口
              modifyRoleAPI(curData);
              chores();
            }
          }
        });
      }
    });
  }

  function openRole(title = "绑定菜单", row ?: FormItemProps) {


    getMenuListByRoleIdAPI({id: row.id},row);


  }


  async function addRoleAPI(param?: Object) {
    const {data, success, msg} = await addRole(param);
    if (success) {

    } else {
      message(`新增失败：${msg}`, {
        type: "error"
      });
    }
  }

  async function modifyRoleAPI(param?: Object) {
    const {data, success, msg} = await modifyRole(param);
    if (success) {

    } else {
      message(`编辑失败：${msg}`, {
        type: "error"
      });
    }
  }

  async function delRoleAPI(param?: object) {
    const {data, success, msg} = await delRole(param);

    if (success) {
      message(`删除成功！`, {
        type: "success"
      });
    } else {
      message(`删除失败：${msg}`, {
        type: "error"
      });
    }
  }


  async function getMenuListAPI(param?: object) {
    const {data, success, msg} = await getMenuList(param);

    if (success) {

    } else {
      message(`失败：${msg}`, {
        type: "error"
      });
    }
    console.log(data);
    menuList.value = data;
  }

  async function getMenuListByRoleIdAPI(param?: object,row ?: FormItemProps) {
    const {data, success, msg} = await getMenuListByRoleId(param);

    if (success) {

      var menuId = [];

      data.forEach((item)=>{
        menuId.push(item.routerId);
      });

      treeSelect.value = menuId;



      addDialog({
        title: `绑定菜单`,
        props: {
            name: row?.name ?? "",
            id: row?.id ?? null,
            treeData: treeData.value ?? [],
            treeSelect: treeSelect.value ?? []
        },
        width: "40%",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(menuForm, {ref: treeRef}),
        beforeSure: (done, {options}) => {

          const curData = options.props


          const param = {
            roleId: curData.id,
            routerList: treeRef.value.getSelectNode()
          };

          bindMenuAPI(param);

          done(); //关闭弹窗

          setTimeout(() => {
            loading.value = false;
            onSearch();
          }, 500);

          //绑定菜单


        }
      });


    } else {
      message(`失败：${msg}`, {
        type: "error"
      });
    }

  }

  async function bindMenuAPI(param?: object) {
    const {data, success, msg} = await bindMenuRequest(param);

    if (success) {

    } else {
      message(`失败：${msg}`, {
        type: "error"
      });
    }
    console.log(data);
    menuList.value = data;
  }


  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
    onSearch();
  }

  function onChange({row, index}) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 2 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {

        modifyRoleAPI(row);

        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.status === 0 ? "停用" : "启用"}${row.name}`, {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        console.log(row.status);
        row.status === 2 ? (row.status = 1) : (row.status = 2);
      });
  }


  return {
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
  }

}
