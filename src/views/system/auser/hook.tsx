import "./reset.css";
import dayjs from "dayjs";
import roleForm from "./roleForm.vue";
import editForm from "./form.vue";
//import { zxcvbn } from "@zxcvbn-ts/core";
import {handleTree} from "@/utils/tree";
import {message} from "@/utils/message";
import croppingUpload from "../upload.vue";
import {usePublicHooks} from "../hooks";
import {addDialog} from "@/components/ReDialog";
import {type PaginationProps} from "@pureadmin/table";
import type {FormItemProps, RoleFormItemProps} from "./types";
import {hideTextAtIndex, getKeyList, isAllEmpty} from "@pureadmin/utils";

import {getDeptListRequest} from "@/api/system/dept";
import {addRole, getRoleList, getRoleListByUIDRequest} from "@/api/system/role";
import {
    addUserRequest,
    batchDelUserRequest, bindRoleRequest,
    delUserRequest,
    getUserListRequest,
    modifyUserRequest
} from "@/api/system/auser";


import {
    ElForm,
    ElInput,
    ElFormItem,
    ElProgress,
    ElMessageBox
} from "element-plus";
import {
    type Ref,
    h,
    ref,
    toRaw,
    watch,
    computed,
    reactive,
    onMounted
} from "vue";





export function useUser(tableRef: Ref, treeRef: Ref) {
    const form = reactive({
        // 左侧部门树的id
        deptId: null,
        id: null,
        username: "",
        total: 0,
        pageSize: 10,
        currentPage: 1
    });
    const formRef = ref();

    const dataList = ref([]);
    const loading = ref(true);

    const switchLoadMap = ref({});
    const {switchStyle} = usePublicHooks();
    const higherDeptOptions = ref();
    const treeData = ref([]);
    const treeLoading = ref(true);
    const selectedNum = ref(0);
    const pagination = reactive<PaginationProps>({
        total: 0,
        pageSize: 10,
        currentPage: 1,
        background: true
    });
    const columns: TableColumnList = [
        {
            label: "勾选列", // 如果需要表格多选，此处label必须设置
            type: "selection",
            fixed: "left",
            reserveSelection: true // 数据刷新后保留选项
        },
        {
            label: "用户编号",
            prop: "id",
            width: 60
        },
        {
            label: "用户名称",
            prop: "username",
            minWidth: 120
        },
        {
            label: "操作",
            fixed: "right",
            width: 300,
            slot: "operation"
        }
    ];
    const buttonClass = computed(() => {
        return [
            "!h-[20px]",
            "reset-margin",
            "!text-gray-500",
            "dark:!text-white",
            "dark:hover:!text-primary"
        ];
    });
    // 重置的新密码
    const pwdForm = reactive({
        newPwd: ""
    });
    const pwdProgress = [
        {color: "#e74242", text: "非常弱"},
        {color: "#EFBD47", text: "弱"},
        {color: "#ffa500", text: "一般"},
        {color: "#1bbf1b", text: "强"},
        {color: "#008000", text: "非常强"}
    ];
    // 当前密码强度（0-4）
    const curScore = ref();
    const roleOptions = ref([]);

    function onChange({row, index}) {
        ElMessageBox.confirm(
            `确认要<strong>${
                row.status === 0 ? "停用" : "启用"
            }</strong><strong style='color:var(--el-color-primary)'>${
                row.username
            }</strong>用户吗?`,
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
                    message("已成功修改用户状态", {
                        type: "success"
                    });
                }, 300);
            })
            .catch(() => {
                row.status === 0 ? (row.status = 1) : (row.status = 0);
            });
    }

    function handleUpdate(row) {
        console.log(row);
    }

    function handleDelete(row) {
        message(`您删除了用户编号为${row.id}的这条数据`, {type: "success"});
        delUserAPI(row);
        setTimeout(() => {
            loading.value = false;
            onSearch();// 刷新表格数据
        }, 500);
    }

    function handleSizeChange(val: number) {
        onSearch();
    }

    function handleCurrentChange(val: number) {
        onSearch();
    }

    /** 当CheckBox选择项发生变化时会触发该事件 */
    function handleSelectionChange(val) {
        selectedNum.value = val.length;
        // 重置表格高度
        tableRef.value.setAdaptive();
    }

    /** 取消选择 */
    function onSelectionCancel() {
        selectedNum.value = 0;
        // 用于多选表格，清空用户的选择
        tableRef.value.getTableRef().clearSelection();
    }

    /** 批量删除 */
    function onbatchDel() {
        // 返回当前选中的行
        const curSelected = tableRef.value.getTableRef().getSelectionRows();
        // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
        message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
            type: "success"
        });

        const selectIdList = {
            idList: getKeyList(curSelected, "id")
        };
        batchDelUserAPI(selectIdList);

        tableRef.value.getTableRef().clearSelection();
    }

    async function onSearch() {
        loading.value = true;


        form.currentPage = pagination.currentPage;
        form.pageSize = pagination.pageSize;

        const {data} = await getUserListRequest(toRaw(form));
        dataList.value = data.list;
        pagination.total = data.total;
        pagination.pageSize = data.pageSize;
        pagination.currentPage = data.currentPage;

        setTimeout(() => {
            loading.value = false;
        }, 500);
    }

    const resetForm = formEl => {
        if (!formEl) return;
        formEl.resetFields();
        form.deptId = null;
        treeRef.value.onTreeReset();
        onSearch();
    };

    function onTreeSelect({id, selected}) {
        form.deptId = selected ? id : null;
        onSearch();
    }

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

    function openDialog(title = "新增", row?: FormItemProps) {
        addDialog({
            title: `${title}用户`,
            props: {
                formInline: {
                    title,
                    higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
                    username: row?.username ?? "",
                    password: row?.password ?? "",
                    id: row?.id ?? null,
                    deptId: row?.deptId ?? null,
                }
            },
            width: "46%",
            draggable: true,
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => h(editForm, {ref: formRef}),
            beforeSure: (done, {options}) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as FormItemProps;

                function chores() {
                    message(`您${title}了用户名称为${curData.username}的这条数据`, {
                        type: "success"
                    });
                    done(); // 关闭弹框

                    setTimeout(() => {
                        loading.value = false;
                        onSearch();// 刷新表格数据
                    }, 500);
                }

                FormRef.validate(valid => {
                    if (valid) {
                        console.log("curData", curData);
                        // 表单规则校验通过
                        if (title === "新增") {
                            // 实际开发先调用新增接口，再进行下面操作
                            addUserAPI(curData);
                            chores();
                        } else {
                            // 实际开发先调用编辑接口，再进行下面操作
                            modifyUserAPI(curData);
                            chores();
                        }
                    }
                });
            }
        });
    }


    /** 分配角色 */
    async function handleRole(row) {
        // 选中的角色列表

        const ids = (await getRoleListByUIDRequest({id: row.id})).data ?? [];


        addDialog({
            title: `分配 ${row.username} 用户的角色`,
            props: {
                formInline: {
                    id: row?.id ?? null,
                    username: row?.username ?? "",
                    roleOptions: roleOptions.value ?? [],
                    ids
                }
            },
            width: "400px",
            draggable: true,
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => h(roleForm),
            beforeSure: (done, {options}) => {
                const curData = options.props.formInline as RoleFormItemProps;
                console.log("curIds", curData.ids);
                // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
                done(); // 关闭弹框

                for (var i in ids) {

                }


                bindRoleAPI({
                    uid: curData.id,
                    ids: curData.ids
                })
            }
        });
    }


    onMounted(async () => {
        treeLoading.value = true;
        onSearch();

        // 归属部门
        const {data} = await getDeptListRequest();
        higherDeptOptions.value = handleTree(data);
        treeData.value = handleTree(data);
        treeLoading.value = false;

        // 角色列表
        roleOptions.value = (await getRoleList()).data.list;

    });


    /**
     *  网络请求
     */

    /*获取用户列表*/
    async function addUserAPI(param?: FormItemProps) {
        const {data, success, msg} = await addUserRequest(param);
        if (success) {

        } else {
            message(`新增失败：${msg}`, {
                type: "error"
            });
        }
    }

    /*修改用户*/
    async function modifyUserAPI(param?: FormItemProps) {
        const {data, success, msg} = await modifyUserRequest(param);
        if (success) {

        } else {
            message(`编辑失败：${msg}`, {
                type: "error"
            });
        }
    }

    /*删除用户*/
    async function delUserAPI(param?: FormItemProps) {
        const {data, success, msg} = await delUserRequest(param);
        if (success) {

        } else {
            message(`删除失败：${msg}`, {
                type: "error"
            });
        }
    }

    /*批量删除用户*/
    async function batchDelUserAPI(param?: Object) {
        const {data, success, msg} = await batchDelUserRequest(param);
        if (success) {

        } else {
            message(`删除失败：${msg}`, {
                type: "error"
            });
        }
    }

    async function bindRoleAPI(param?: Object) {
        const {data, success, msg} = await bindRoleRequest(param);
        if (success) {

        } else {
            message(`删除失败：${msg}`, {
                type: "error"
            });
        }
    }


    return {
        form,
        loading,
        columns,
        dataList,
        treeData,
        treeLoading,
        selectedNum,
        pagination,
        buttonClass,
        onSearch,
        resetForm,
        onbatchDel,
        openDialog,
        onTreeSelect,
        handleUpdate,
        handleDelete,
        handleSizeChange,
        handleRole,
        onSelectionCancel,
        handleCurrentChange,
        handleSelectionChange
    };
}
