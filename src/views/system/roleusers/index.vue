<template>
  <div class="app-container">
    <el-form :inline="true" @submit.prevent>
      <el-form-item label="角色名">
        <el-input v-model="roleUserQueryParams.roleName" disabled />
      </el-form-item>
      <el-form-item label="角色字符串">
        <el-input v-model="roleUserQueryParams.roleKey" disabled />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="roleUserQueryParams.userName"
          placeholder="請輸入用户名稱"
          clearable
          prefix-icon="search"
          @keyup.enter="searchRoleUser" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="searchRoleUser">{{ $t('btn.search') }}</el-button>
        <!-- <el-button icon="refresh"  @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleGetUserTable" v-hasPermi="['system:roleusers:add']">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="circle-close" @click="cancelAuthUserAll" v-hasPermi="['system:roleusers:remove']">
          {{ $t('btn.multi') }}{{ $t('btn.cancel') }}{{ $t('btn.authorize') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="close" @click="handleClose">{{ $t('btn.close') }}</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="roleUserTableRef"
      v-loading="loading"
      :data="roleUserList"
      @selection-change="handleCancelSelectionChange"
      row-key="userId"
      stripe
      border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="userId" align="center" label="用户Id" width="150" />
      <el-table-column prop="userName" align="center" label="用户名" width="150" />
      <el-table-column prop="nickName" align="center" label="用户暱稱" width="150" />
      <el-table-column prop="status" align="center" label="賬號狀態" width="110">
        <template #default="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :show-overflow-tooltip="true" align="center" label="備註" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            text
            size="small"
            icon="el-icon-circle-close"
            @click="handleCancelPerm(scope.row)"
            v-if="scope.row.userId != 1"
            v-hasPermi="['system:roleusers:del']">
            {{ $t('btn.cancel') }}{{ $t('btn.authorize') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-model:total="roleUserCount"
      v-model:page="roleUserQueryParams.pageNum"
      v-model:limit="roleUserQueryParams.pageSize"
      @pagination="getRoleUser" />

    <!-- 添加或修改菜單對話框 -->
    <el-dialog title="添加用户" v-model="open" append-to-body @close="cancel">
      <el-form :inline="true" @submit.prevent>
        <el-form-item>
          <el-input
            v-model="userQueryParams.userName"
            placeholder="請輸入用户名稱"
            clearable
            prefix-icon="search"
            @keyup.enter="handleSearchRoleUser" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col>
          <el-table
            ref="userTable"
            v-loading="loadingUser"
            :data="dataUserTable"
            @selection-change="handleSelectionChange"
            row-key="userId"
            stripe
            border
            :height="tableHeight * 0.5">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="userId" align="center" label="用户編號" width="150" />
            <el-table-column prop="userName" align="center" label="用户名稱" width="150" />
            <el-table-column prop="nickName" align="center" label="用户暱稱" width="150" />
            <el-table-column prop="status" align="center" label="用户狀態">
              <template #default="scope">
                <dict-tag :options="statusOptions" :value="scope.row.status" />
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="dataUserCount"
            v-model:page="userQueryParams.pageNum"
            v-model:limit="userQueryParams.pageSize"
            @pagination="handleGetUserTable" />
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button text @click="open = false">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('btn.submit') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="roleUsers">
// import { listRole } from "@/api/system/role";
import { getRole } from '@/api/system/role'
import { getRoleUsers, createRoleUsers, deleteRoleUsers, getExcludeUsers } from '@/api/system/userRoles'

const loadingUser = ref(false)
const loading = ref(false)
// 表格高度
const tableHeight = ref(window.innerHeight)
// 已添加用户列表
const roleUserList = ref([])
const roleUserCount = ref(0)
// 未添加用户列表
const dataUserTable = ref([])
const dataUserCount = ref(0)
// 勾選添加用户列表
const addSelections = ref([])
// 勾選刪除用户列表
const delSelections = ref([])
// 是否顯示彈出層
const open = ref(false)
const roleUserTableRef = ref()
// 角色用户查詢參數
const roleUserQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleId: undefined,
  userName: undefined,
  roleName: undefined,
  roleKey: undefined
})
const userQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleId: undefined,
  userName: undefined
})
// 狀態字典
const statusOptions = ref([])

const { proxy } = getCurrentInstance()
const route = useRoute()
proxy.getDicts('sys_normal_disable').then((response) => {
  statusOptions.value = response.data
})
const role_id = route.query.roleId
roleUserQueryParams.roleId = role_id
userQueryParams.roleId = role_id

function init() {
  searchRoleUser()

  getRole(roleUserQueryParams.roleId).then((response) => {
    const { code, data } = response
    if (code == 200) {
      roleUserQueryParams.roleName = data.roleName
      roleUserQueryParams.roleKey = data.roleKey
    }
  })
}

function searchRoleUser() {
  roleUserQueryParams.pageNum = 1
  getRoleUser()
}

// 獲取角色用户
function getRoleUser() {
  loading.value = true
  getRoleUsers(roleUserQueryParams).then((response) => {
    roleUserList.value = response.data.result
    roleUserCount.value = response.data.totalNum
    loading.value = false
  })
}
// 返回按鈕
function handleClose() {
  const obj = { path: '/system/role' }
  proxy.$tab.closeOpenPage(obj)
}
function handleCancelSelectionChange(selection) {
  delSelections.value = selection.map((item) => item.userId)
}
// 批量刪除角色用户
function cancelAuthUserAll() {
  if (delSelections.value.length === 0) {
    proxy.$modal.msgError('請選擇要刪除的用户')
    return
  }
  proxy
    .$confirm('是否確認刪除選中的 ' + delSelections.value.length + ' 條數據?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      deleteRoleUsers({
        roleId: role_id,
        userIds: delSelections.value
      }).then((response) => {
        if (response.code === 200) {
          proxy.$message({
            message: '成功刪除' + response.data + '條數據',
            type: 'success'
          })
          getRoleUser()
        }
      })
    })
    .catch(() => {})
}
// 取消授權
function handleCancelPerm(row) {
  delSelections.value = []
  delSelections.value.push(row.userId)

  deleteRoleUsers({
    roleId: role_id,
    userIds: delSelections.value
  }).then((response) => {
    if (response.code === 200) {
      proxy.$message({
        message: '成功刪除' + response.data + '條數據',
        type: 'success'
      })
      getRoleUser()
    }
  })
}
// 選中角色
// 多選框選中數據
function handleSelectionChange(selection) {
  addSelections.value = selection.map((item) => item.userId)
}

function handleSearchRoleUser() {
  userQueryParams.pageNum = 1
  handleGetUserTable()
}
// 獲取未添加角色列表
function handleGetUserTable() {
  open.value = true
  loadingUser.value = true
  getExcludeUsers(userQueryParams).then((response) => {
    dataUserTable.value = response.data.result
    dataUserCount.value = response.data.totalNum
    loadingUser.value = false
  })
}
// 新增用户角色
function handleSubmit() {
  if (addSelections.value.length <= 0) {
    proxy.$modal.msgError('請選擇要添加的用户')
    return
  }
  createRoleUsers({
    roleId: role_id,
    userIds: addSelections.value
  }).then((response) => {
    if (response.code === 200) {
      proxy.$message({
        message: '成功添加' + response.data + '條數據',
        type: 'success'
      })
      getRoleUser()
      open.value = false
    }
  })
}
function cancel() {
  open.value = false
}
init()
</script>
