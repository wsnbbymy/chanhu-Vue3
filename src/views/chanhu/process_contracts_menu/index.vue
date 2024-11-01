<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单id" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入id" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="菜单名" prop="label">
        <el-input v-model="queryParams.label" placeholder="请输入菜单名" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="父菜单" prop="parentId">
        <el-input v-model="queryParams.parentId" placeholder="请输入父菜单id" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="索引" prop="menuIndex">
        <el-input v-model="queryParams.menuIndex" placeholder="索引" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['chanhu:process_contracts_menu:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['chanhu:process_contracts_menu:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['chanhu:process_contracts_menu:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['chanhu:process_contracts_menu:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- <el-table v-loading="loading" :data="process_contracts_menuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="菜单id" align="center" prop="id" />
      <el-table-column label="菜单名" align="center" prop="label" />
      <el-table-column label="父菜单id" align="center" prop="parentId" />
      <el-table-column label="菜单索引" align="center" prop="menuIndex" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['chanhu:process_contracts_menu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['chanhu:process_contracts_menu:remove']">删除</el-button>
        </template>
</el-table-column>
</el-table> -->

    <el-table v-loading="loading" :data="treeData" @selection-change="handleSelectionChange" tree-props="fasle"
      row-key="id">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="菜单id" align="left" prop="id" />
      <el-table-column label="菜单名" align="left" prop="label" />
      <!-- <el-table-column label="父菜单id" align="center" prop="parentId" /> -->
      <el-table-column label="菜单索引" align="left" prop="menuIndex" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 新增 -->
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)"
            v-hasPermi="['chanhu:process_contracts_menu:add']">新增</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['chanhu:process_contracts_menu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['chanhu:process_contracts_menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改合同菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="process_contracts_menuRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名" prop="label">
          <el-input v-model="form.label" placeholder="请输入菜单名" />
        </el-form-item>
        <!-- <el-form-item label="父菜单id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父菜单id" />
        </el-form-item> -->
        <el-form-item label="父菜单" prop="parentId">
          <el-cascader :options="treeData" :props="props" v-model="form.parentId" placeholder="请选择父菜单" clearable
            filterable />
        </el-form-item>
        <el-form-item label="菜单索引" prop="menuIndex">
          <el-input v-model="form.menuIndex" placeholder="请输入菜单索引" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Process_contracts_menu">
import { listProcess_contracts_menu, getProcess_contracts_menu, delProcess_contracts_menu, addProcess_contracts_menu, updateProcess_contracts_menu, getContractsMenu } from "@/api/chanhu/process_contracts_menu";

const { proxy } = getCurrentInstance();

const process_contracts_menuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const props = { checkStrictly: true, label: 'label', value: 'id', children: 'children', emitPath: 'false', expandTrigger: 'hover' };

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    label: null,
    parentId: null,
    menuIndex: null
  },
  rules: {
    label: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    menuIndex: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询合同菜单列表 */
function getList() {
  loading.value = true;
  listProcess_contracts_menu(queryParams.value).then(response => {
    process_contracts_menuList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    label: null,
    parentId: null,
    menuIndex: null
  };
  proxy.resetForm("process_contracts_menuRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  // getList();
  findAndHighlightRow();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd( row ) {
  reset();
  console.log(row.id)
  form.value.parentId = row.id;
  open.value = true;
  title.value = "添加合同菜单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProcess_contracts_menu(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改合同菜单";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["process_contracts_menuRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProcess_contracts_menu(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getTreeData();
        });
      } else {
        addProcess_contracts_menu(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getTreeData();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除合同菜单编号为"' + _ids + '"的数据项？').then(function () {
    return delProcess_contracts_menu(_ids);
  }).then(() => {
    // getList();
    getTreeData();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('chanhu/process_contracts_menu/export', {
    ...queryParams.value
  }, `process_contracts_menu_${new Date().getTime()}.xlsx`)
}

const treeData = ref([])

/**
 * 获取树表数据
 */
function getTreeData() {
  getContractsMenu().then(response => {
    treeData.value = response;
    loading.value = false;
  });
}

getTreeData();

// getList();



</script>
