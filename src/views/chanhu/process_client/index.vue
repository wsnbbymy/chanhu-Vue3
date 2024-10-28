<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户单位" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户单位" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="员工人数" prop="employerNum">
        <el-input v-model="queryParams.employerNum" placeholder="请输入员工人数" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="行业" prop="industry">
        <el-input v-model="queryParams.industry" placeholder="请输入行业" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['chanhu:process_client:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['chanhu:process_client:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['chanhu:process_client:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['chanhu:process_client:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="process_clientList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户单位" align="center" prop="clientName" />
      <el-table-column label="员工人数" align="center" prop="employerNum" />
      <el-table-column label="行业" align="center" prop="industry" />
      <el-table-column label="备注" align="center" prop="comments" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 部门列表弹窗 -->
          <el-button link type="primary" icon="Search" @click="toDepartment(scope.row)"
            v-hasPermi="['chanhu:department:list']">部门列表</el-button>
          <el-button link type="primary" icon="Search" @click="toContract(scope.row)"
            v-hasPermi="['chanhu:contract:list']">合同列表</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['chanhu:process_client:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['chanhu:process_client:remove']">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="process_clientRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户单位" prop="clientName">
          <el-input v-model="form.clientName" placeholder="请输入客户单位" />
        </el-form-item>
        <el-form-item label="员工人数" prop="employerNum">
          <el-input v-model="form.employerNum" placeholder="请输入员工人数" />
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="form.industry" placeholder="请输入行业" />
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改客户单位部门管理对话框 -->
    <el-dialog :title="title" v-model="openDepartment" width="500px" append-to-body>
      <el-form ref="departmentRef" :model="departmentForm" :rules="rules" label-width="80px">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="departmentForm.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门联系人姓名" prop="contactsName">
          <el-input v-model="departmentForm.contactsName" placeholder="请输入部门联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactsMobile">
          <el-input v-model="departmentForm.contactsMobile" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="联系人职务" prop="duties">
          <el-input v-model="departmentForm.duties" placeholder="请输入联系人职务" />
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="departmentForm.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDepartmentForm">确 定</el-button>
          <el-button @click="cancelDepartment">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="Process_client">
import { listProcess_client, getProcess_client, delProcess_client, addProcess_client, updateProcess_client } from "@/api/chanhu/process_client";
import { getDepartment, delDepartment, updateDepartment, addDepartment, listDepartment } from "@/api/chanhu/department";
import { ref } from "vue";

const { proxy } = getCurrentInstance();

const process_clientList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const departmentTitle = ref("");
const departmentForm = ref("");
const openDepartment = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    clientName: null,
    employerNum: null,
    industry: null,
    comments: null
  },
  rules: {
    clientName: [
      { required: true, message: "客户单位不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户信息列表 */
function getList() {
  loading.value = true;
  listProcess_client(queryParams.value).then(response => {
    process_clientList.value = response.rows;
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
    clientName: null,
    employerNum: null,
    industry: null,
    comments: null
  };
  proxy.resetForm("process_clientRef");
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
  title.value = "添加客户信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProcess_client(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["process_clientRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProcess_client(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProcess_client(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除客户信息编号为"' + _ids + '"的数据项？').then(function () {
    return delProcess_client(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('chanhu/process_client/export', {
    ...queryParams.value
  }, `process_client_${new Date().getTime()}.xlsx`)
}

/** 修改部门按钮操作 */
function handleUpdateDepartment(row) {
  resetDepartmentForm();
  const _id = row.id || ids.value
  getDepartment(_id).then(response => {
    departmentForm.value = response.data;
    openDepartment.value = true;
    departmentTitle.value = "修改客户单位部门管理";
  });
}

/** 新增部门按钮操作 */
function handleAddDepartment(row) {
  resetDepartmentForm();
  openDepartment.value = true;
  var clientUnitId = row.id;
  departmentForm.value = {
    clientUnitId: clientUnitId
  };
  console.log(clientUnitId);
  console.log(departmentForm.value);

  departmentTitle.value = "添加客户单位部门管理";
}

// 取消部门修改按钮
function cancelDepartment() {
  openDepartment.value = false;
  resetDepartmentForm();
}

// 重置修改部门表单
function resetDepartmentForm() {
  departmentForm.value = {};
  proxy.resetForm("departmentRef");
}

/** 删除部门按钮操作 */
function handleDeleteDepartment(row) {
  const _ids = row.id || ids.value;

  proxy.$modal.confirm('是否确认删除客户信息编号为"' + row.departmentName + '"的数据项？').then(function () {
    return delDepartment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 提交按钮 */
function submitDepartmentForm() {
  proxy.$refs["departmentRef"].validate(valid => {
    if (valid) {
      if (departmentForm.value.id != null) {
        updateDepartment(departmentForm.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          openDepartment.value = false;
          getList();
        });
      } else {
        addDepartment(departmentForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          openDepartment.value = false;
          getList();
        });
      }
    }
  });
}


// todo
/** 合同列表，跳转到"/contracts"，并且传入当前部门id */
function toContract(row) {
  // todo
  proxy.$router.push({ path: '/contracts', query: { departmentId: row.id } });
}

/** 跳转到当前单位的部门列表页面 */
function toDepartment(row) {
  proxy.$router.push({ path: '/department', query: { clientUnitId: row.id } });
}

getList();
</script>
