import {ref, h, toRaw, onMounted} from "vue";
import {
  addDictKeyRequest,
  delDictKeyRequest,
  listDictKeyRequest,
  listDictRequest,
  modifyDictKeyRequest
} from "@/api/system/dict";
import {message} from "@/utils/message";
import {FormItemProps, KeyItemProps} from "@/views/system/dict/types";
import {addDialog} from "@/components/ReDialog/index";
import openForm from "@/views/system/dict/addKeyForm.vue";


export function useKey(newFormInline: FormItemProps) {

  //列表的表头
  const columns: TableColumnList = [
    {
      label: "编号",
      prop: "id",
      minWidth: 50
    },
    {
      label: "KEY名称",
      prop: "keyName",
      minWidth: 100
    },
    {
      label: "KEY值",
      prop: "keyValue",
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
  const loading = ref(false);
  //弹出框对象
  const openFormRef = ref();

  async function onSearch() {
    startLoading()
    //完善参数

    const param = {
      id: newFormInline.id
    };

    //请求数据
    getListAPI(param);
  }

  async function onSearchDelay() {
    setTimeout(() => {
      onSearch();
    }, 500);
  }


  function onAddDialog() {
    addDialog({
      title: "新增KEY_VALUE",
      props: {
        keyInline: {
          id: null,
          keyName: "",
          dictId: newFormInline.id,
          keyValue: ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(openForm, {ref: openFormRef}),
      beforeSure: (done, {options}) => {
        const ELFormRef = openFormRef.value.getRef(); //获取EL-FORM 对象
        const curData = options.props.keyInline as KeyItemProps;

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


  function onEditDialog(row: KeyItemProps) {
    addDialog({
      title: "新增KEY_VALUE",
      props: {
        keyInline: {
          id: row.id,
          keyName: row.keyName,
          dictId: row.dictId,
          keyValue: row.keyValue
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(openForm, {ref: openFormRef}),
      beforeSure: (done, {options}) => {
        const ELFormRef = openFormRef.value.getRef(); //获取EL-FORM 对象
        const curData = options.props.keyInline as KeyItemProps;

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

  function onDel(row?:KeyItemProps) {
    delAPI({id: row.id});
    onSearchDelay();
  }

  //--------调用API---------

  async function getListAPI(param?: Object) {
    const {data, success, msg} = await listDictKeyRequest(param);
    if (success) {
      dataList.value = data;
    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function addAPI(param?: Object) {
    const {data, success, msg} = await addDictKeyRequest(param);

    if (success) {

    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function editAPI(param?: Object) {
    const {data, success, msg} = await modifyDictKeyRequest(param);

    if (success) {

    } else {
      message(`请求失败：${msg}`, {
        type: "error"
      });
    }
    stopLoading();
  }

  async function delAPI(param?: Object) {
    const {data, success, msg} = await delDictKeyRequest(param);

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
    columns,
    dataList,
    onSearch,
    onAddDialog,
    onEditDialog,
    onDel
  }
}
