<template>
  <div class="app-container">
    <el-form :model="queryParams" label-position="left" inline ref="queryForm" v-show="showSearch" @submit.prevent>
      <el-form-item label="標題" prop="title">
        <el-input v-model="queryParams.title" placeholder="請輸入標題" />
      </el-form-item>
      <el-form-item label="摘要" prop="abstractText">
        <el-input v-model="queryParams.abstractText" placeholder="請輸入摘要" />
      </el-form-item>
      <el-form-item label="分類" prop="categoryId">
        <el-cascader
          class="w100"
          :options="categoryOptions"
          :props="{ checkStrictly: true, value: 'categoryId', label: 'name', emitPath: false }"
          placeholder="請選擇分類"
          clearable
          v-model="queryParams.categoryId" />
      </el-form-item>
      <el-form-item label="審核狀態" prop="auditStatus">
        <el-radio-group v-model="queryParams.auditStatus" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in options.auditOptions" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="status">
        <el-radio-group v-model="queryParams.status" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in options.sys_article_status" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="articleType">
        <el-radio-group v-model="queryParams.articleType" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in options.sys_article_type" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否公開" prop="isPublic">
        <el-radio-group v-model="queryParams.isPublic" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in options.isPublicOptions" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否置頂" prop="isTop">
        <el-radio-group v-model="queryParams.isTop" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in options.isPublicOptions" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" :disabled="multiple" v-hasPermi="['article:audit']" plain icon="check" size="small" @click="handleAuditPass">
          通過
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['article:audit']" plain icon="close" size="small" @click="handleAuditReject">
          拒絕
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" v-hasPermi="['system:article:add']" size="small" @click="handleAdd">發佈文章</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="plus" v-hasPermi="['system:article:add']" size="small" @click="handleMonents">發佈動態</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      :data="dataList"
      height="600px"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      highlight-current-row
      @sort-change="sortChange"
      ref="table">
      <el-table-column type="selection" width="50" align="center" :selectable="checkSelectable" />
      <el-table-column prop="cid" label="文章信息" width="130">
        <template #default="{ row }">
          <div @click="handleView(row)">內容id：{{ row.cid }}</div>
          <div>作者：{{ row.authorName }}</div>
          <div>標籤：{{ row.tags }}</div>
        </template>
      </el-table-column>
      <el-table-column label="分類">
        <template #default="{ row }">
          <div v-if="row.articleCategoryNav">{{ row.articleCategoryNav.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="標題" width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="coverUrl" label="封面" width="90" :show-overflow-tooltip="true">
        <template #default="{ row }">
          <image-preview :src="row.coverUrl" split="," style="width: 40px" v-if="row.coverUrl"></image-preview>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="authorName" label="作者" width="80"> </el-table-column> -->
      <!-- <el-table-column prop="fmt_type" label="編輯器類型" width="100"> </el-table-column> -->
      <!-- <el-table-column prop="tags" label="標籤" width="100" :show-overflow-tooltip="true"> </el-table-column> -->
      <el-table-column prop="hits" label="瀏覽" width="80" align="center" sortable> </el-table-column>
      <el-table-column prop="praiseNum" label="贊" width="80" align="center" sortable> </el-table-column>
      <el-table-column prop="commentNum" label="評論" width="80" align="center" sortable> </el-table-column>
      <el-table-column prop="abstractText" label="摘要" v-if="columns.showColumn('abstractText')"> </el-table-column>
      <el-table-column prop="status" align="center" label="狀態" width="90">
        <template #default="scope">
          <el-tag :type="scope.row.status == '2' ? 'danger' : 'success'">{{ scope.row.status == '2' ? '草稿' : '已發佈' }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" align="center" label="審核" width="90">
        <template #default="scope">
          <dict-tag :options="options.auditOptions" :value="scope.row.auditStatus"> </dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="置頂" prop="isTop" width="90" align="center" v-if="columns.showColumn('isTop')" sortable>
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            inline-prompt
            disabled
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="公開" align="center" prop="isPublic" width="90">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isPublic"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="發佈時間" width="128" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ showTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="scope">
          <el-button-group>
            <el-button size="small" icon="view" @click="handleView(scope.row)"> </el-button>
            <el-button
              size="small"
              icon="edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:article:update']"
              v-if="scope.row.articleType == 0">
            </el-button>
            <el-popconfirm title="確定刪除嗎？" @confirm="handleDelete(scope.row)" style="margin-left: 10px">
              <template #reference>
                <el-button size="small" type="danger" icon="delete" v-hasPermi="['system:article:delete']"></el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="previewInfo.title" v-model="showPreview">
      <image-preview :src="previewInfo.coverUrl" split="," style="height: 140px" v-if="previewInfo.coverUrl"></image-preview>
      <MdPreview show-code-row-number editorId="id1" :theme="settingsStore.codeMode" :modelValue="previewInfo.content" />
    </el-dialog>
  </div>
</template>
<script setup name="index">
import { listArticle, delArticle, auditArticle, getArticle } from '@/api/article/article.js'
import { treelistArticleCategory } from '@/api/article/articlecategory.js'
import { MdPreview } from 'md-editor-v3'
import { showTime } from '@/utils/index'
import 'md-editor-v3/lib/preview.css'
import useSettingsStore from '@/store/modules/settings'
const settingsStore = useSettingsStore()
const { proxy } = getCurrentInstance()
const router = useRouter()
// 選中mid數組數組
const ids = ref([])
// 非單選禁用
const single = ref(true)
// 非多個禁用
const multiple = ref(true)
// 顯示搜索條件
const showSearch = ref(true)
// 數據列表
const dataList = ref([])
// 總記錄數
const total = ref(0)

// 文章目錄下拉框
const categoryOptions = ref([])
const loading = ref(false)
const data = reactive({
  form: {},
  queryParams: {
    sort: 'cid',
    sortType: 'desc',
    status: '',
    isPublic: '',
    isTop: '',
    articleType: '',
    auditStatus: ''
  },
  options: {
    isPublicOptions: [
      { dictLabel: '是', dictValue: '1' },
      { dictLabel: '否', dictValue: '0', listClass: 'info' }
    ],
    auditOptions: [
      { dictLabel: '通過', dictValue: '1' },
      { dictLabel: '待審核', dictValue: '0', listClass: 'info' },
      { dictLabel: '不通過', dictValue: '2', listClass: 'danger' }
    ],
    // 評論權限
    sys_comment_permi: [],
    //文章狀態
    sys_article_status: [],
    // 文章類型
    sys_article_type: []
  }
})
const columns = ref([
  { visible: false, prop: 'abstractText', label: '摘要' },
  { visible: false, prop: 'isTop', label: '置頂' }
])
const queryForm = ref()
const { queryParams, options } = toRefs(data)

// 自定義排序
function sortChange(column) {
  if (column.prop == null || column.order == null) {
    queryParams.sort = undefined
    queryParams.sortType = undefined
  } else {
    queryParams.sort = column.prop
    queryParams.sortType = column.order
  }

  handleQuery()
}

proxy.getDicts(['sys_article_status', 'sys_article_type', 'sys_comment_permi']).then((response) => {
  response.data.forEach((element) => {
    data.options[element.dictType] = element.list
  })
})

/** 查詢菜單下拉樹結構 */
function getCategoryTreeselect() {
  treelistArticleCategory().then((res) => {
    if (res.code == 200) {
      categoryOptions.value = res.data
    }
  })
}
// 查詢數據
function getList() {
  loading.value = true
  listArticle(queryParams.value).then((res) => {
    loading.value = false
    if (res.code == 200) {
      dataList.value = res.data.result
      total.value = res.data.totalNum
    }
  })
}

/** 重置查詢操作 */
function resetQuery() {
  proxy.resetForm('queryForm')
  handleQuery()
}
/** 搜索按鈕操作 */
function handleQuery() {
  getList()
}

/** 新增按鈕操作 */
function handleAdd() {
  router.push({ path: '/article/publish' })
}

function handleMonents() {
  router.push({ path: '/article/publishMoments' })
}

/** 刪除按鈕操作 */
function handleDelete(row) {
  delArticle(row.cid).then((res) => {
    if (res.code == 200) {
      proxy.$modal.msgSuccess('刪除成功')
      handleQuery()
    }
  })
}

/** 修改按鈕操作 */
function handleUpdate(row) {
  router.push({ path: '/article/publish', query: { cid: row.cid } })
}
// 詳情
const previewInfo = ref({})
function handleView(row) {
  getArticle(row.cid).then((res) => {
    previewInfo.value = res.data
    showPreview.value = true
  })
}
// function handleTopChange(row) {
//   topArticle({ cid: row.cid, isTop: row.isTop }).then((res) => {
//     handleQuery()
//   })
// }
// function handleChangePublic(row) {
//   changeArticlePublic({ cid: row.cid, isPublic: row.isPublic }).then((res) => {
//     handleQuery()
//   })
// }
function checkSelectable(row) {
  return row.auditStatus == 0 ? true : false
}
/**
 * 審核通過
 * @param {審核} row
 */
function handleAuditPass(row) {
  const id = row.cid || ids.value
  auditArticle('pass', id).then((res) => {
    const { code } = res
    if (code == 200) {
      proxy.$modal.msgSuccess('通過成功')
    }
    getList()
  })
}

/**
 * 拒絕
 * @param {*} row
 */
function handleAuditReject(row) {
  const id = row.cid || ids.value

  proxy.$prompt('請輸入拒絕原因', 'Tip', {}).then(({ value }) => {
    auditArticle('reject', id, { reason: value }).then((res) => {
      const { code } = res
      if (code == 200) {
        proxy.$modal.msgSuccess('拒絕成功')
      }
      getList()
    })
  })
}

// 多選框選中數據
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.cid)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const showPreview = ref(false)

getCategoryTreeselect()
handleQuery()
</script>
