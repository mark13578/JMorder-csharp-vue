<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="角色名稱" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="請輸入角色名稱" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="權限字符" prop="roleKey">
        <el-input v-model="queryParams.roleKey" placeholder="請輸入權限字符" clearable  style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="狀態" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色狀態" clearable>
          <el-option label="全部" :value="-1" />
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['system:role:add']">{{ $t('btn.add') }}</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column label="編號" prop="roleId" width="80" />
      <el-table-column label="名稱" prop="roleName" />
      <el-table-column label="顯示順序" prop="roleSort"></el-table-column>
      <el-table-column label="權限字符" prop="roleKey" />
      <el-table-column label="權限範圍" prop="dataScope" :formatter="dataScopeFormat"></el-table-column>
      <el-table-column label="狀態" width="90">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :disabled="scope.row.roleKey == 'admin'"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="用户個數" align="center" prop="userNum" width="90">
        <template #default="scope">
          <el-link type="primary" @click="handleAuthUser(scope.row)">{{ scope.row.userNum }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="創建時間" prop="createTime" width="150" />
      <el-table-column label="備註" align="center" prop="remark" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <div v-if="scope.row.roleKey != 'admin'">
            <el-button text icon="edit" :title="$t('btn.edit')" @click.stop="handleUpdate(scope.row)" v-hasPermi="['system:role:edit']">
            </el-button>
            <el-button text icon="delete" :title="$t('btn.delete')" @click.stop="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">
            </el-button>

            <el-dropdown
              @command="(command) => handleCommand(command, scope.row)"
              v-hasPermi="['system:role:edit', 'system:role:authorize', 'system:roleusers:list']">
              <span class="el-dropdown-link">
                {{ $t('btn.more') }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleDataScope" icon="circle-check">{{ $t('menu.menuPermi') }}</el-dropdown-item>
                  <el-dropdown-item command="handleAuthUser" icon="user">{{ $t('menu.assignUsers') }}</el-dropdown-item>
                  <el-dropdown-item command="handleExportMenu" icon="download">導出菜單</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 角色菜單彈框 -->
    <zr-dialog title="角色權限分配" key="role" top="0vh" draggable="" v-model="showRoleScope" width="700px" @close="cancel">
      <el-form :model="form" label-width="80px">
        <el-form-item label="菜單搜索">
          <el-input placeholder="請輸入關鍵字進行過濾" v-model="searchText"></el-input>
        </el-form-item>
        <el-form-item label="權限字符">
          {{ form.roleKey }}
        </el-form-item>
        <el-form-item label="菜單權限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展開/摺疊</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全選/全不選</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子聯動</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加載中，請稍後"
            highlight-current
            :filter-node-method="menuFilterNode"
            :props="{ children: 'children', label: 'label', class: customNodeClass }">
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span class="fl" :title="data.permission">{{ node.label }}</span>
                <span class="fr ml10">
                  <el-tag v-if="data.status == 1" type="danger">停用</el-tag>
                </span>
              </div>
            </template>
          </el-tree>
          <div style="color: red">請在菜單管理裏面添加對應的菜單權限</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitDataScope" v-hasPermi="['system:role:authorize']">{{ $t('btn.save') }}</el-button>
      </template>
    </zr-dialog>

    <!-- 添加或修改角色配置對話框 -->
    <zr-dialog :title="title" key="roleEdit" v-model="open" append-to-body @close="cancel">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :lg="12">
            <el-form-item label="角色名稱" prop="roleName">
              <el-input v-model="form.roleName" placeholder="請輸入角色名稱" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="權限字符" prop="roleKey">
              <template #label>
                <span>
                  <el-tooltip content="使用： v-hasRole='['admin']'" placement="top">
                    <el-icon :size="15">
                      <questionFilled />
                    </el-icon>
                  </el-tooltip>
                  權限字符
                </span>
              </template>
              <el-input v-model="form.roleKey" placeholder="請輸入權限字符" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="角色順序" prop="roleSort">
              <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="數據範圍">
              <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
                <el-option
                  v-for="item in dataScopeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="parseInt(item.dictValue)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="狀態">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :value="parseInt(dict.dictValue)">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="數據權限" v-show="form.dataScope == 2">
              <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展開/摺疊</el-checkbox>
              <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全選/全不選</el-checkbox>
              <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">
                父子聯動
                <el-tooltip content="勾選父節點是否同時選中子節點" placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-tree
                class="tree-border"
                :data="deptOptions"
                show-checkbox
                default-expand-all
                ref="deptRef"
                node-key="id"
                :check-strictly="!form.deptCheckStrictly"
                empty-text="加載中，請稍候"
                :props="defaultProps"></el-tree>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="備註">
              <el-input v-model="form.remark" type="textarea" placeholder="請輸入內容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </zr-dialog>
  </div>
</template>

<script setup name="role">
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus, exportRoleMenu } from '@/api/system/role'
import { roleMenuTreeselect } from '@/api/system/menu'
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/system/dept'

const { proxy } = getCurrentInstance()

const loading = ref(true)
// 選中數組
const ids = ref([])
// 非單個禁用
const single = ref(true)
// 非多個禁用
const multiple = ref(true)
// 顯示搜索條件
const showSearch = ref(true)
// 總條數
const total = ref(0)
// 角色表格數據
const roleList = ref([])
// 彈出層標題
const title = ref('')
// 是否顯示彈出層
const open = ref(false)
const menuExpand = ref(true)
const menuNodeAll = ref(false)
const deptExpand = ref(true)
const deptNodeAll = ref(false)
// 日期範圍
const dateRange = ref([])
// 狀態數據字典
const statusOptions = ref([])
// 是否顯示下拉菜單分配
const showRoleScope = ref(false)
// 數據範圍選項
const dataScopeOptions = ref([
  {
    dictValue: '1',
    dictLabel: '全部'
  },
  {
    dictValue: '2',
    dictLabel: '自定義'
  },
  {
    dictValue: '3',
    dictLabel: '本部門'
  },
  {
    dictValue: '4',
    dictLabel: '本部門及以下'
  },
  {
    dictValue: '5',
    dictLabel: '僅本人'
  }
])
// 菜單列表
const menuOptions = ref([])
// 部門列表
const deptOptions = ref([])
// 查詢參數
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: undefined,
  roleKey: undefined,
  status: -1
})
const searchText = ref('')

const state = reactive({
  form: {},
  rules: {
    roleName: [{ required: true, message: '角色名稱不能為空', trigger: 'blur' }],
    roleKey: [{ required: true, message: '權限字符不能為空', trigger: 'blur' }],
    roleSort: [{ required: true, message: '角色順序不能為空', trigger: 'blur' }]
  },
  defaultProps: {
    children: 'children',
    label: 'label',
    menuType: customNodeClass
  }
})
const menuRef = ref()
const deptRef = ref()
const formRef = ref()
const { form, rules, defaultProps } = toRefs(state)

watch(searchText, (val) => {
  proxy.$refs.menuRef.filter(val)
})

/** 查詢角色列表 */
function getList() {
  loading.value = true

  listRole(proxy.addDateRange(queryParams, dateRange.value)).then((response) => {
    roleList.value = response.data.result
    total.value = response.data.totalNum
    loading.value = false
  })
}

/** 查詢部門樹結構 */
function getDeptTreeselect() {
  deptTreeselect().then((response) => {
    deptOptions.value = response.data
  })
}
// 所有菜單節點數據
function getMenuAllCheckedKeys() {
  // 目前被選中的菜單節點
  const checkedKeys = proxy.$refs.menuRef.getCheckedKeys()
  // 半選中的菜單節點
  const halfCheckedKeys = proxy.$refs.menuRef.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
// 所有部門節點數據
function getDeptAllCheckedKeys() {
  // 目前被選中的部門節點
  const checkedKeys = proxy.$refs.deptRef.getCheckedKeys()
  // 半選中的部門節點
  const halfCheckedKeys = proxy.$refs.deptRef.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
/** 根據角色ID查詢菜單樹結構 */
function getRoleMenuTreeselect(roleId) {
  return roleMenuTreeselect(roleId).then((response) => {
    menuOptions.value = response.data.menus
    return response
  })
}
/** 根據角色ID查詢部門樹結構 */
function getRoleDeptTreeselect(roleId) {
  return roleDeptTreeselect(roleId).then((response) => {
    deptOptions.value = response.data.depts
    return response
  })
}
// 角色狀態修改
function handleStatusChange(row) {
  const text = row.status == '0' ? '啓用' : '停用'

  proxy
    .$confirm('確認要"' + text + '""' + row.roleName + '"角色嗎?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return changeRoleStatus(row.roleId, row.status)
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
    })
    .catch(function () {
      row.status = row.status == 0 ? 1 : 0
    })
}
// 取消按鈕
function cancel() {
  open.value = false
  showRoleScope.value = false
  reset()
}
// 表單重置
function reset() {
  if (proxy.$refs.menuRef != undefined) {
    proxy.$refs.menuRef.setCheckedKeys([])
  }
  ;(menuExpand.value = false),
    (menuNodeAll.value = false),
    (deptExpand.value = true),
    (deptNodeAll.value = false),
    (form.value = {
      roleId: undefined,
      roleName: undefined,
      roleKey: undefined,
      roleSort: 99,
      status: 0,
      menuIds: [],
      deptIds: [],
      dataScope: 1,
      menuCheckStrictly: true,
      deptCheckStrictly: true,
      remark: undefined
    })
  proxy.resetForm('form')
}
/** 搜索按鈕操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
/** 重置按鈕操作 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm('queryForm')
  handleQuery()
}
// 多選框選中數據
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.roleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
// 更多操作觸發
function handleCommand(command, row) {
  switch (command) {
    case 'handleDataScope':
      handleDataScope(row)
      break
    case 'handleAuthUser':
      handleAuthUser(row)
      break
    case 'handleExportMenu':
      handleExportMenu(row)
    default:
      break
  }
}
// 樹權限（展開/摺疊）
function handleCheckedTreeExpand(value, type) {
  if (type == 'menu') {
    const treeList = menuOptions.value
    for (let i = 0; i < treeList.length; i++) {
      proxy.$refs.menuRef.store.nodesMap[treeList[i].id].expanded = value
    }
  } else if (type == 'dept') {
    const treeList = deptOptions.value
    for (let i = 0; i < treeList.length; i++) {
      proxy.$refs.deptRef.store.nodesMap[treeList[i].id].expanded = value
    }
  }
}

// 樹權限（全選/全不選）
function handleCheckedTreeNodeAll(value, type) {
  if (type == 'menu') {
    proxy.$refs.menuRef.setCheckedNodes(value ? menuOptions.value : [])
  } else if (type == 'dept') {
    proxy.$refs.deptRef.setCheckedNodes(value ? deptOptions.value : [])
  }
}

// 樹權限（父子聯動）
function handleCheckedTreeConnect(value, type) {
  if (type == 'menu') {
    form.value.menuCheckStrictly = !!value
  } else if (type == 'dept') {
    form.value.deptCheckStrictly = !!value
  }
}

// 菜單篩選
function menuFilterNode(value, data) {
  if (!value) return true
  return data.label.indexOf(value) !== -1 || (data.permission && data.permission.indexOf(value) !== -1)
}

/** 新增按鈕操作 */
function handleAdd() {
  reset()
  getDeptTreeselect()
  open.value = true
  title.value = '添加角色'
  showRoleScope.value = false
}

/** 修改按鈕操作 ok */
function handleUpdate(row) {
  reset()
  showRoleScope.value = false
  const roleId = row.roleId || ids.value
  const roleDeptTreeselect = getRoleDeptTreeselect(row.roleId)
  getRole(roleId).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改角色'

    nextTick(() => {
      roleDeptTreeselect.then((res) => {
        proxy.$refs.deptRef.setCheckedKeys(res.data.checkedKeys)
      })
    })
  })
}
/** 選擇角色權限範圍觸發 */
function dataScopeSelectChange(value) {
  if (value !== '2') {
    proxy.$refs.deptRef.setCheckedKeys([])
  }
}
// 數據權限
function dataScopeFormat(row, column) {
  return proxy.selectDictLabel(dataScopeOptions.value, row.dataScope)
}
/** 分配角色權限按鈕操作 */
// 新增 和上面代碼基本相同
function handleDataScope(row) {
  if (row.roleId == 1) {
    showRoleScope.value = false
    return
  }
  reset()
  showRoleScope.value = true
  const roleId = row.roleId || ids.value
  const roleMenu = getRoleMenuTreeselect(roleId)

  roleMenu.then((res) => {
    const checkedKeys = res.data.checkedKeys
    checkedKeys.forEach((v) => {
      nextTick(() => {
        proxy.$refs.menuRef.setChecked(v, true, false)
      })
    })
  })
  form.value = {
    roleId: row.roleId,
    roleName: row.roleName,
    roleKey: row.roleKey,
    menuCheckStrictly: row.menuCheckStrictly
  }
}
const router = useRouter()
/** 分配用户操作 */
function handleAuthUser(row) {
  const roleId = row.roleId
  var hasPermi = proxy.$auth.hasPermiAnd(['system:role:authorize', 'system:roleusers:list'])
  if (hasPermi) {
    router.push({ path: '/system/roleusers', query: { roleId } })
  } else {
    proxy.$modal.msgError('你沒有權限訪問')
  }
}
/** 提交按鈕 */
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.roleId != undefined && form.value.roleId > 0) {
        form.value.type = 'edit'
        form.value.deptIds = getDeptAllCheckedKeys()
        updateRole(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.type = 'add'
        form.value.deptIds = getDeptAllCheckedKeys()
        addRole(form.value).then((response) => {
          open.value = false
          if (response.code == 200) {
            proxy.$modal.msgSuccess('新增成功')
            getList()
          } else {
            proxy.$modal.msgError(response.msg)
          }
        })
      }
    }
  })
}

/** 提交按鈕（菜單數據權限） */
function submitDataScope() {
  if (form.value.roleId != undefined) {
    form.value.menuIds = getMenuAllCheckedKeys()
    dataScope(form.value).then((response) => {
      proxy.$modal.msgSuccess('修改成功')
      getList()
      cancel()
    })
  } else {
    proxy.$modal.msgError('請選擇角色')
  }
}

/** 刪除按鈕操作 */
function handleDelete(row) {
  const roleIds = row.roleId || ids.value
  proxy
    .$confirm('是否確認刪除角色編號為"' + roleIds + '"的數據項?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return delRole(roleIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('刪除成功')
    })
}

/** 導出按鈕操作 */
function handleExport() {
  proxy
    .$confirm('是否確認導出所有角色數據項?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return exportRole(queryParams)
    })
    .then((response) => {
      proxy.download(response.data.path)
    })
}
// 導出角色菜單
function handleExportMenu(row) {
  proxy.$modal
    .confirm('是否確認導出所有角色菜單數據項?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await exportRoleMenu({ roleId: row.roleId })
    })
}
getList()
proxy.getDicts('sys_normal_disable').then((response) => {
  statusOptions.value = response.data
})

function customNodeClass(data, node) {
  if (data.menuType == 'C') {
    return 'tree-item-flex'
  }
  return null
}
</script>
<style scoped>
/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: var(--base-bg-main) none;
  border-radius: 4px;
  width: 100%;
  height: 400px;
  overflow-y: auto;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown {
  vertical-align: middle;
}
</style>
