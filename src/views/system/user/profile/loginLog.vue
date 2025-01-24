<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登錄時間">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="開始日期"
          end-placeholder="結束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" border>
      <el-table-column label="IP地址" align="center" prop="ipaddr" width="130">
        <template #default="{ row }">
          <div>{{ row.ipaddr }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登錄地點" align="center" prop="position" />
      <el-table-column label="操作系統" align="center" prop="os" />
      <el-table-column label="操作狀態" align="center" prop="status" width="90">
        <template #default="{ row }">
          <dict-tag :options="statusOptions" :value="row.status"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作信息" align="center" prop="msg" />
      <el-table-column label="登錄日期" align="center" prop="loginTime" width="100">
        <template #default="scope">
          <span>{{ showTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import { queryMylist as queryList } from '@/api/monitor/logininfor'
import { showTime } from '@/utils'
// 遮罩層
const loading = ref(true)

// 總條數
const total = ref(0)
// 表格數據
const list = ref([])
// 狀態數據字典
const statusOptions = ref([])
// 日期範圍
const dateRange = ref([])
// 查詢參數
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  status: undefined
})

const { proxy } = getCurrentInstance()
/** 查詢登錄日誌列表 */
function getList() {
  loading.value = true
  queryList(proxy.addDateRange(queryParams, dateRange.value)).then((response) => {
    loading.value = false
    if (response.code == 200) {
      list.value = response.data.result
      total.value = response.data.totalNum
    } else {
      total.value = 0
      list.value = []
    }
  })
}
getList()
proxy.getDicts('sys_common_status').then((response) => {
  statusOptions.value = response.data
})

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
</script>
