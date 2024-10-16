<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同类型" prop="contractType">
        <el-input v-model="queryParams.contractType" placeholder="请输入合同类型" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商" prop="provider">
        <el-select v-model="queryParams.provider" placeholder="请选择供应商" clearable>
          <el-option v-for="dict in process_provider" :key="dict.value" :label="dict.label"
            :value="parseInt(dict.value)"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker clearable v-model="queryParams.startDate" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="终止日期" prop="endDate">
        <el-date-picker clearable v-model="queryParams.endDate" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择终止日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-select v-model="queryParams.departmentId" v-if="departments.length">
          <el-option v-for="department in departments" :key="department.id" :value="department.id"
            :label="department.departmentName" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['chanhu:contracts:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['chanhu:contracts:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['chanhu:contracts:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['chanhu:contracts:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同类型" align="center" prop="contractType" />
      <el-table-column label="供应商" align="center" prop="provider">
        <template #default="scope">
          <dict-tag :options="process_provider" :value="scope.row.provider" />
        </template>
      </el-table-column>
      <el-table-column label="合同开始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同终止日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="具体信息" align="center" prop="detail" />
      <el-table-column label="备注" align="center" prop="comments" />
      <el-table-column label="部门" align="center" prop="departmentId">
        <!-- 显示与departmentId对应的departmentName -->
        <template #default="scope">
          {{ getDepartmentName(scope.row.departmentId) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['chanhu:contracts:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['chanhu:contracts:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改合同管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="contractsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同类型" prop="contractType">
          <el-input v-model="form.contractType" placeholder="请输入合同类型" />
        </el-form-item>
        <el-form-item label="供应商" prop="provider">
          <el-select v-model="form.provider" placeholder="请选择供应商">
            <el-option v-for="dict in process_provider" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable v-model="form.startDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终止日期" prop="endDate">
          <el-date-picker clearable v-model="form.endDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择终止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="具体信息" prop="detail">
          <el-input v-model="form.detail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="form.departmentId" v-if="departments.length">
            <el-option v-for="department in departments" :key="department.id" :value="department.id"
              :label="department.departmentName">
              {{ department.departmentName }}
            </el-option>
          </el-select>
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

<script setup name="Contracts">
import { listContracts, getContracts, delContracts, addContracts, updateContracts } from "@/api/chanhu/contracts";
import { listDepartment } from "@/api/chanhu/department";

const { proxy } = getCurrentInstance();
const { process_provider } = proxy.useDict('process_provider');

const contractsList = ref([]);
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
    contractType: null,
    provider: null,
    startDate: null,
    endDate: null,
    detail: null,
    comments: null,
    departmentId: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

// 在组件挂载时加载数据
onMounted(() => {
  loadDepartments();
});

/** 查询合同管理列表 */
function getList() {
  loading.value = true;
  console.log(queryParams.value);
  listContracts(queryParams.value).then(response => {
    contractsList.value = response.rows;
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
    contractType: null,
    provider: null,
    startDate: null,
    endDate: null,
    detail: null,
    comments: null,
    departmentId: null
  };
  proxy.resetForm("contractsRef");
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
  title.value = "添加合同管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getContracts(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改合同管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["contractsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateContracts(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addContracts(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除合同管理编号为"' + _ids + '"的数据项？').then(function () {
    return delContracts(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('chanhu/contracts/export', {
    ...queryParams.value
  }, `contracts_${new Date().getTime()}.xlsx`)
}

// 定义响应式变量
const departments = ref([]);

/**
 * 加载部门数据的方法
 */
function loadDepartments() {
  listDepartment().then(response => {
    departments.value = response.rows;
    console.log(departments.value);
  });
}

function getDepartmentName(departmentId) {
  const department = this.departments.find(d => d.id === departmentId);
  return department ? department.departmentName : '未知部门';
}


getList();
</script>

<style>
.el-form--inline {
  .el-form-item {

    .el-input,
    .el-cascader,
    .el-select,
    .el-autocomplete {
      width: 240px;
    }
  }
}
</style>