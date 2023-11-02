import {reactive, ref, onMounted, h, toRaw} from "vue";
import {type PaginationProps} from "@pureadmin/table";
import {usePublicHooks} from "@/views/system/hooks";
import {addRole, getRoleList, modifyRole, delRole} from "@/api/system/role";
import {FormItemProps} from "./types";
import {addDialog} from "@/components/ReDialog/index";
import editForm from "./form.vue";
import metaForm from "./metaForm.vue";
import {message} from "@/utils/message";
import {ElMessageBox} from "element-plus";
import {addMenuRequest, delMenuRequest, getMenuList, modifyMenuMetaRequest, modifyMenuRequest} from "@/api/system/menu";
import {handleTree} from "@/utils/tree";
import {cloneDeep} from "@pureadmin/utils";


export function useMenu() {

    const form = reactive({
        id: null,
        name: "",
        path: "",
        component: "",
    });

    const columns: TableColumnList = [
        {
            label: "名称",
            prop: "name",
            minWidth: 100,
            align: "left"
        },
        {
            label: "路径",
            prop: "path",
            minWidth: 120
        },
        {
            label: "链接文件",
            prop: "component",
            minWidth: 120
        },
        {
            label: "操作",
            fixed: "right",
            width: 240,
            slot: "operation"
        }
    ];

    const dataList = ref([]);
    const formRef = ref();
    const formRef2= ref();
    const loading = ref(true);

    async function onSearch() {
        loading.value = true;

        const {data} = await getMenuList(toRaw(form));
        dataList.value = handleTree(data); // 处理成树结构
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

    function openMetaDialog(title = "编辑Meta", row?: FormItemProps) {

        addDialog({
            title: `编辑Meta`,
            props: {
                formInline: {
                    id: row?.id ?? null,
                    meta: row?.meta ?? {
                        title: "",
                        icon:"",
                        rank:""
                    }
                }
            },
            width: "40%",
            draggable: true,
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => h(metaForm, {ref: formRef2}),
            beforeSure: (done, {options}) => {
                const FormRef = formRef2.value.getRef();
                const curData = options.props.formInline as FormItemProps;

                function chores() {
                    message(`您了菜单名称为${curData.name}的这条数据`, {
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
                        //调用接口
                        modifyMetaAPI(curData);
                        chores();

                    }
                });
            }
        });

    }


    function openDialog(title = "新增", row ?: FormItemProps) {

        addDialog({
            title: `${title}菜单`,
            props: {
                formInline: {
                    name: row?.name ?? "",
                    path: row?.path ?? "",
                    component: row?.component ?? "",
                    id: row?.id ?? null,
                    parentId: row?.parentId ?? null,
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
                    message(`您${title}了菜单名称为${curData.name}的这条数据`, {
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
                            addMenuAPI(curData);
                            chores();
                        } else {
                            //调用API接口
                            modifyMenuAPI(curData);
                            chores();
                        }
                    }
                });
            }
        });
    }

    async function addMenuAPI(param?: Object) {

        const {data, success, msg} = await addMenuRequest(param);
        if (success) {

        } else {
            message(`新增失败：${msg}`, {
                type: "error"
            });
        }
    }

    async function modifyMenuAPI(param?: Object) {

        const {data, success, msg} = await modifyMenuRequest(param);
        if (success) {

        } else {
            message(`编辑失败：${msg}`, {
                type: "error"
            });
        }
    }

    async function delMenuAPI(param?: object) {
        const {data, success, msg} = await delMenuRequest(param);

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

    async function modifyMetaAPI(param?:FormItemProps){

        const newParam ={
            id:param.meta.id,
            title:param.meta.title,
            icon:param.meta.icon,
            rank:param.meta.rank,
        }

        const {data, success, msg} = await modifyMenuMetaRequest(newParam);

        if (success) {
            message(`编辑成功！`, {
                type: "success"
            });
        } else {
            message(`编辑失败：${msg}`, {
                type: "error"
            });
        }
    }

    function handleSelectionChange(val) {
        console.log("handleSelectionChange", val);
        onSearch();
    }

    function handleDelete(row?: FormItemProps) {

        const newRow = {id: 0};
        newRow.id = row.id;

        delMenuAPI(newRow);

        setTimeout(() => {
            loading.value = false;
            onSearch();
        }, 500);
    }


    return {
        form,
        columns,
        dataList,
        onSearch,
        onReset,
        openDialog,
        openMetaDialog,
        handleDelete,
        handleSelectionChange
    }
}


