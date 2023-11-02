import {reactive, ref, onMounted, h, toRaw} from "vue";
import {usePublicHooks} from "@/views/system/hooks";
import {addRole, modifyRole, delRole} from "@/api/system/role";
import {FormItemProps} from "./types";
import {addDialog} from "@/components/ReDialog/index";
import editForm from "./form.vue";
import {message} from "@/utils/message";
import {ElMessageBox} from "element-plus";
import {addDeptRequest, delDeptRequest, getDeptListRequest, modifyDeptRequest} from "@/api/system/dept";
import {handleTree} from "@/utils/tree";
import {cloneDeep} from "@pureadmin/utils";


export function useDept() {

    const form = reactive({
        id: null,
        deptmentName: "",
        parentId: null,
        remark: "",
        departmentHeadName: "",
        status: null,
    });
    const formRef = ref();
    const dataList = ref([]);
    const loading = ref(true);
    const switchLoadMap = ref({});
    const {switchStyle} = usePublicHooks();

    const columns: TableColumnList = [
        {
            label: "部门名称",
            prop: "departmentName",
            minWidth: 120,
            align: "left"
        },
        {
            label: "状态",
            prop: "status",
            minWidth: 80,
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
            label: "负责人",
            prop: "departmentHeadName",
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

        const {data} = await getDeptListRequest(toRaw(form));
        dataList.value = handleTree(data);

        setTimeout(() => {
            loading.value = false;
        }, 500);
    }

    onMounted(() => {
        onSearch();
    });

    const onReset = formE => {
        if (!formE) return;
        formE.resetFields();
        onSearch();
    }

    function handleDelete(row?: FormItemProps) {
        delDeptAPI(row);

        setTimeout(() => {
            loading.value = false;
            onSearch();
        }, 500);
    }

    function handleMenu(row?: FormItemProps) {
        message(`功能开发中`, {
            type: "error"
        });
    }

    function openDialog(title = "新增", row ?: FormItemProps) {
        addDialog({
            title: `${title}角色`,
            props: {
                formInline: {
                    parentId: row?.parentId ?? null,
                    departmentName: row?.departmentName ?? "",
                    remark: row?.remark ?? "",
                    departmentHeadName: row?.departmentHeadName ?? "",
                    id: row?.id ?? null,
                    status:row?.status ?? 2,
                    higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value)),
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
                    message(`您${title}了角色名称为${curData.departmentName}的这条数据`, {
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
                            addDeptAPI(curData);
                            chores();
                        } else {
                            //调用API接口
                            modifyDeptAPI(curData);
                            chores();
                        }
                    }
                });
            }
        });
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

    async function addDeptAPI(param?: Object) {
        const {data, success, msg} = await addDeptRequest(param);
        if (success) {

        } else {
            message(`新增失败：${msg}`, {
                type: "error"
            });
        }
    }

    async function modifyDeptAPI(param?: Object) {
        const {data, success, msg} = await modifyDeptRequest(param);
        if (success) {

        } else {
            message(`编辑失败：${msg}`, {
                type: "error"
            });
        }
    }

    async function delDeptAPI(param?: object) {
        const {data, success, msg} = await delDeptRequest(param);

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


    function onChange({row, index}) {
        ElMessageBox.confirm(
            `确认要<strong>${
                row.status === 2 ? "停用" : "启用"
            }</strong><strong style='color:var(--el-color-primary)'>${
                row.departmentName
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

                modifyDeptAPI(row);

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
        columns,
        onSearch,
        onReset,
        openDialog,
        handleDelete,
        handleMenu,
    }

}
