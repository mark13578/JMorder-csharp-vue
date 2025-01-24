<template>
  <div class="app-container">
    <el-form :model="form" ref="formRef" :rules="rules" @submit.prevent>
      <el-row class="mb10">
        <el-col :lg="24">
          <el-form-item label="" prop="title">
            <el-input v-model="form.title" placeholder="請輸入標題" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item prop="content" label="">
            <el-input type="textarea" rows="10" placeholder="説點什麼吧" show-word-limit v-model="form.content"></el-input>
          </el-form-item>
        </el-col>

        <el-col :lg="12">
          <el-form-item prop="categoryId" label="選擇圈子">
            <el-select v-model="form.categoryId" clearable>
              <el-option v-for="item in categoryOptions" :key="item.categoryId" :label="item.name" :value="item.categoryId"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item prop="commentSwitch" label="評論權限">
            <el-select clearable v-model="form.commentSwitch">
              <el-option v-for="item in options.sys_comment_permi" :label="item.dictLabel" :value="parseInt(item.dictValue)"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item prop="topicId" label="選擇話題">
            <el-select clearable v-model="form.topicId">
              <el-option v-for="item of topicList" :label="item.topicName" :value="item.topicId"> </el-option>
              <!-- <template #footer>
                <el-button v-if="!isAdding" text bg size="small" @click="isAdding = true"> 添加話題 </el-button>
                <template v-else>
                  <el-input v-model="topicName" class="option-input" placeholder="輸入話題名" size="small" />
                  <el-button type="primary" size="small" @click="onAddTopic"> 確定 </el-button>
                  <el-button size="small" @click="isAdding = false">取消</el-button>
                </template>
              </template> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="8">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="不公開只有自己會看到" placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                是否公開
              </span>
            </template>
            <el-switch v-model="form.isPublic" inline-prompt :active-value="1" :in-active-value="0" active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>

        <el-col :lg="24">
          <el-form-item>
            <UploadImage ref="uploadRef" v-model="form.coverUrl" :limit="9" :fileSize="15" style="width: 90px">
              <template #icon>
                <div class="upload-wrap">
                  <el-icon><plus /></el-icon>
                  <div>請選擇</div>
                </div>
              </template>
            </UploadImage>
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-button type="success" icon="upload" @click="handlePublish('1')">立即發佈</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup name="articlepublish">
import { addArticle } from '@/api/article/article.js'
import { listArticleCategory } from '@/api/article/articlecategory.js'
import { listArticleTopic } from '@/api/article/articletopic'
const { proxy } = getCurrentInstance()

// 文章目錄下拉框
const categoryOptions = ref([])
const topicName = ref('')
const isAdding = ref(false)
const formRef = ref()

const data = reactive({
  form: {
    title: undefined,
    cid: undefined,
    content: undefined,
    status: undefined,
    categoryId: undefined,
    isPublic: 1,
    articleType: 2,
    topicId: undefined,
    tags: '',
    commentSwitch: 0
  },
  rules: {
    title: [{ required: false, message: '標題不能為空', trigger: 'blur' }],
    content: [{ required: true, message: '內容不能為空', trigger: 'blur' }]
  },
  options: {
    sys_comment_permi: []
  }
})
const { form, rules, options } = toRefs(data)

proxy.getDicts(['sys_comment_permi']).then((response) => {
  response.data.forEach((element) => {
    data.options[element.dictType] = element.list
  })
})
/** 查詢菜單下拉樹結構 */
function getCategoryTreeselect() {
  listArticleCategory({ categoryType: 1, pageSize: 100 }).then((res) => {
    if (res.code == 200) {
      categoryOptions.value = res.data.result
    }
  })
}
const topicList = ref([])
listArticleTopic().then((res) => {
  topicList.value = res.data.result
})
/** 提交按鈕 */
function handlePublish(status) {
  form.value.status = status
  form.value.tags = topicList.value.find((x) => x.topicId == form.value.topicId)?.topicName

  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      addArticle(form.value).then((res) => {
        if (res.code == 200) {
          proxy.$modal.msgSuccess('發佈成功')
          proxy.$tab.closeOpenPage({ path: '/article/index' })
        } else {
          proxy.$modal.msgError('發佈失敗')
        }
      })
    }
  })
}
function onAddTopic() {}
getCategoryTreeselect()
</script>
<style scoped>
.app-container {
  position: relative;
}
.upload-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #ccc;
}
</style>
