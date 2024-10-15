<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户经理" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户经理"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入电话号码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="绑定id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入绑定id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属单元" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入所属单元"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入所属区域"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['chanhu:process_manager:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['chanhu:process_manager:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['chanhu:process_manager:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['chanhu:process_manager:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="process_managerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="序号" align="center" prop="id" /> -->
      <el-table-column label="客户经理" align="center" prop="name" />
      <el-table-column label="电话号码" align="center" prop="mobile" />
      <el-table-column label="绑定id" align="center" prop="userId" />
      <el-table-column label="所属单元" align="center" prop="unitName" />
      <el-table-column label="所属区域
" align="center" prop="areaName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['chanhu:process_manager:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['chanhu:process_manager:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户经理信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="process_managerRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户经理" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户经理" />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="绑定id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入绑定账号id" />
        </el-form-item>
        <el-form-item label="所属单元" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入所属单元" />
        </el-form-item>
        <el-form-item label="所属区域" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入所属区域" />
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

<script setup name="Process_manager">
import { listProcess_manager, getProcess_manager, delProcess_manager, addProcess_manager, updateProcess_manager } from "@/api/chanhu/process_manager";

const { proxy } = getCurrentInstance();

const process_managerList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    mobile: null,
    userId: null,
    unitName: null,
    areaName: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户经理信息管理列表 */
function getList() {
  loading.value = true;
  listProcess_manager(queryParams.value).then(response => {
    process_managerList.value = response.rows;
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
    name: null,
    mobile: null,
    userId: null,
    unitName: null,
    areaName: null
  };
  proxy.resetForm("process_managerRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
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
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户经理信息管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProcess_manager(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户经理信息管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["process_managerRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProcess_manager(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProcess_manager(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除客户经理信息管理编号为"' + _ids + '"的数据项？').then(function() {
    return delProcess_manager(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('chanhu/process_manager/export', {
    ...queryParams.value
  }, `process_manager_${new Date().getTime()}.xlsx`)
}

getList();
</script>
