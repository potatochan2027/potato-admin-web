import {reactive, ref, h, toRaw, onMounted} from "vue";
import {FormItemProps} from "./types";
import openForm from "./form.vue";
import keyForm from "./keyForm.vue";
import {addDialog} from "@/components/ReDialog/index";
import {PaginationProps} from "@pureadmin/table";
import {addDictRequest, delDictRequest, listDictRequest, modifyDictRequest} from "@/api/system/dict";
import {message} from "@/utils/message";


export function useDict() {

  // 对应 搜索FORM
  const form = reactive({
    id: null,
    name: "",
    remark: "",
    pageSize: 10,
    currentPage: 1
  });

  //loading动画控制开关
  const loading = ref(true);

  //列表的表头
  const columns: TableColumnList = [
    {
      label: "编号",
      prop: "id",
      minWidth: 50
    },
    {
      label: "字典名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  //列表数据
  const dataList = ref([]);

  //弹出框对象
  const openFormRef = ref();

  const openKeyFormRef=ref();

  //分页对象
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });


  // 相应页面操作

  /**
   * 搜索按钮
   */
  async function onSearch() {
    startLoading()
    //完善参数
    form.pageSize = pagination.pageSize;
    form.currentPage = pagination.currentPage;
    //请求数据
    getListAPI(toRaw(form));
  }

  async function onSearchDelay() {
    setTimeout(() => {
      onSearch();
    }, 500);
  }


  /**
   * 重置搜索框的内容
   * @param formSearch
   */
  function onReset(formSearch) {
    if (!formSearch) {
      return;
    }
    formSearch.resetFields();
    onSearch();
  }

  /**
   * 新增对话框
   */
  function onAddDialog() {
    addDialog({
      title: "新增字典",
      props: {
        formInline: {
          id: null,
          name: "",
          remark: ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(openForm, {ref: openFormRef}),
      beforeSure: (done, {options}) => {
        const ELFormRef = openFormRef.value.getRef(); //获取EL-FORM 对象
        const curData = options.props.formInline as FormItemProps;

        ELFormRef.validate(valid => {
          //表单校验通过
          if (valid) {
            addAPI(curData);
            done();
            onSearchDelay();
          }
        });
      }
    });
  }

  function onEditDialog(row: FormItemProps) {
    addDialog({
      title: "编辑字典",
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          remark: row.remark
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(openForm, {ref: openFormRef}),
      beforeSure: (done, {options}) => {
        const ELFormRef = openFormRef.value.getRef(); //获取EL-FORM 对象
        const curData = options.props.formInline as FormItemProps;

        ELFormRef.validate(valid => {
          //表单校验通过
          if (valid) {
            editAPI(curData);
            done();
            onSearchDelay();
          }
        });
      }
    });
  }

  function onKeyDialog(row?: FormItemProps) {
    addDialog({
      title: "KEY-VALUE编辑",
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          remark: row.remark
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(keyForm, {ref: openKeyFormRef}),
      beforeSure: (done, {options}) => {
          done();
      }
    });
  }


  function onDel(row: FormItemProps) {
    delAPI({id: row.id});
    onSearchDelay();
  }


  /**
   * 监听表格中的多选框
   */
  function onTableSelectChange() {
    //本表格无多选,无需实现
  }


  /**
   * 表格分页组件，每页数量发生改变
   */
  function onTablePageSizeChange() {
    onSearch();
  }

  /**
   * 表格-分页组件，当前页发生改变
   */
  function onTablePageCurrentChange() {
    onSearch();
  }


  //--------调用API---------

  async function getListAPI(param?: Object) {
    const {data, success, msg} = await listDictRequest(param);
    if (success) {
      dataList.value = data.list;
      pagination.total = data.total;
      pagination.currentPage = data.currentPage;
      pagination.pageSize = data.pageSize;
    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function addAPI(param?: Object) {
    const {data, success, msg} = await addDictRequest(param);

    if (success) {

    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function editAPI(param?: Object) {
    const {data, success, msg} = await modifyDictRequest(param);

    if (success) {

    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function delAPI(param?: Object) {
    const {data, success, msg} = await delDictRequest(param);

    if (success) {

    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  //--------Loading等动画---------

  /**
   * 开始loading动画
   */
  function startLoading() {
    loading.value = true;
  }

  /**
   * 停止loading动画
   */
  function stopLoading() {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  //--------生命周期---------
  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    onReset,
    onAddDialog,
    onEditDialog,
    onKeyDialog,
    onDel,
    onTableSelectChange,
    onTablePageSizeChange,
    onTablePageCurrentChange,
    pagination
  }

}
