<!--
 * @Descripttion: (建立訂單/order_1)
 * @Author: (admin)
 * @Date: (2024-12-19)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="接件編號" prop="docNum">
        <el-input v-model="queryParams.docNum" placeholder="请输入接件編號" />
      </el-form-item>
      <el-form-item label="系統建立日期">
        <el-date-picker
          v-model="dateRangeCreateTime" 
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="defaultTime"
          :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="客戶名稱" prop="customerName">
        <el-input v-model="queryParams.customerName" placeholder="请输入客戶名稱" />
      </el-form-item>
      <el-form-item label="案件名稱" prop="casename">
        <el-input v-model="queryParams.casename" placeholder="请输入案件名稱" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['order1:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['order1:edit']" plain icon="edit" @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['order1:delete']" plain icon="delete" @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column align="center" width="90">
        <template #default="scope">
          <el-button text @click="rowClick(scope.row)">{{ $t('btn.details') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="docEntry" label="流水號" align="center" v-if="columns.showColumn('docEntry')"/>
      <el-table-column prop="docNum" label="接件編號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('docNum')"/>
      <el-table-column prop="docDate" label="接件日期" :show-overflow-tooltip="true"  v-if="columns.showColumn('docDate')"/>
      <el-table-column prop="createTime" label="系統建立日期" :show-overflow-tooltip="true"  v-if="columns.showColumn('createTime')"/>
      <el-table-column prop="customerID" label="客戶編號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerID')"/>
      <el-table-column prop="customerName" label="客戶名稱" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerName')"/>
      <el-table-column prop="customerContact" label="聯絡人" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerContact')"/>
      <el-table-column prop="customerPhone" label="連絡電話" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerPhone')"/>
      <el-table-column prop="ps" label="是否留板" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('ps')"/>
      <el-table-column prop="casename" label="案件名稱" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('casename')"/>
      <el-table-column prop="casetype" label="選擇類別" align="center" v-if="columns.showColumn('casetype')">
        <template #default="scope">
          <dict-tag :options=" options.casetype " :value="scope.row.casetype"  />
        </template>
      </el-table-column>
      <el-table-column prop="caseitem" label="選擇項目" align="center" v-if="columns.showColumn('caseitem')">
        <template #default="scope">
          <dict-tag :options=" options.caseitem " :value="scope.row.caseitem"  />
        </template>
      </el-table-column>
      <el-table-column prop="print" label="印墨顏色" align="center" v-if="columns.showColumn('print')">
        <template #default="scope">
          <dict-tag :options=" options.print " :value="scope.row.print"  />
        </template>
      </el-table-column>
      <el-table-column prop="paper1" label="第一聯紙色" align="center" v-if="columns.showColumn('paper1')">
        <template #default="scope">
          <dict-tag :options=" options.paper1 " :value="scope.row.paper1"  />
        </template>
      </el-table-column>
      <el-table-column prop="paper2" label="第二聯紙色" align="center" v-if="columns.showColumn('paper2')">
        <template #default="scope">
          <dict-tag :options=" options.paper2 " :value="scope.row.paper2"  />
        </template>
      </el-table-column>
      <el-table-column prop="paper3" label="第三聯紙色" align="center" v-if="columns.showColumn('paper3')">
        <template #default="scope">
          <dict-tag :options=" options.paper3 " :value="scope.row.paper3"  />
        </template>
      </el-table-column>
      <el-table-column prop="paper4" label="第四聯紙色" align="center" v-if="columns.showColumn('paper4')">
        <template #default="scope">
          <dict-tag :options=" options.paper4 " :value="scope.row.paper4"  />
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="發印數量" align="center" v-if="columns.showColumn('quantity')"/>
      <el-table-column prop="unit" label="單位" align="center" v-if="columns.showColumn('unit')">
        <template #default="scope">
          <dict-tag :options=" options.unit " :value="scope.row.unit"  />
        </template>
      </el-table-column>
      <el-table-column prop="number" label="號碼" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('number')"/>
      <el-table-column prop="startNum" label="起號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('startNum')"/>
      <el-table-column prop="tear" label="撕線" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('tear')"/>
      <el-table-column prop="tearQty" label="撕線數量" align="center" v-if="columns.showColumn('tearQty')">
        <template #default="scope">
          <dict-tag :options=" options.tear " :value="scope.row.tearQty"  />
        </template>
      </el-table-column>
      <el-table-column prop="pasty" label="糊頭" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('pasty')"/>
      <el-table-column prop="pastyDirection" label="糊頭方向" align="center" v-if="columns.showColumn('pastyDirection')">
        <template #default="scope">
          <dict-tag :options=" options.pasty " :value="scope.row.pastyDirection"  />
        </template>
      </el-table-column>
      <el-table-column prop="copyQuantity" label="每本份數" align="center" v-if="columns.showColumn('copyQuantity')"/>
      <el-table-column prop="cover" label="牛皮" align="center" v-if="columns.showColumn('cover')">
        <template #default="scope">
          <dict-tag :options=" options.cover " :value="scope.row.cover"  />
        </template>
      </el-table-column>
      <el-table-column prop="hole" label="打洞" align="center" v-if="columns.showColumn('hole')">
        <template #default="scope">
          <dict-tag :options=" options.hole " :value="scope.row.hole"  />
        </template>
      </el-table-column>
      <el-table-column prop="holeQuantity" label="打洞數量" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('holeQuantity')"/>
      <el-table-column prop="nail" label="打釘製本" align="center" v-if="columns.showColumn('nail')">
        <template #default="scope">
          <dict-tag :options=" options.nail " :value="scope.row.nail"  />
        </template>
      </el-table-column>
      <el-table-column prop="thickplate" label="厚板" align="center" v-if="columns.showColumn('thickplate')">
        <template #default="scope">
          <dict-tag :options=" options.thickplate " :value="scope.row.thickplate"  />
        </template>
      </el-table-column>
      <el-table-column prop="preparation" label="備紙尺寸" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('preparation')"/>
      <el-table-column prop="vendor" label="備紙廠商" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('vendor')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['order1:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['order1:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="drawer" size="50%" direction="rtl">
      <el-table :data="order2List" header-row-class-name="text-navy">
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column prop="comment" label="備註"/>
      </el-table>
    </el-drawer>

    <el-dialog :title="title" :lock-scroll="false" v-model="open" :fullscreen="fullScreen">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
            
          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="流水號" prop="docEntry">
              <el-input-number v-model.number="form.docEntry" controls-position="right" placeholder="请输入流水號" :disabled="true"/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="接件編號" prop="docNum">
              <el-input v-model="form.docNum" placeholder="请输入接件編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="接件日期" prop="docDate">
              <el-date-picker
                v-model="form.docDate"
                type="datetime"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="系統建立日期" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客戶編號" prop="customerID">
              <el-input v-model="form.customerID" placeholder="请输入客戶編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客戶名稱" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客戶名稱" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="聯絡人" prop="customerContact">
              <el-input v-model="form.customerContact" placeholder="请输入聯絡人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="連絡電話" prop="customerPhone">
              <el-input v-model="form.customerPhone" placeholder="请输入連絡電話" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否留板" prop="ps">
              <el-input v-model="form.ps" placeholder="请输入是否留板" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="案件名稱" prop="casename">
              <el-input v-model="form.casename" placeholder="请输入案件名稱" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="選擇類別" prop="casetype">
              <el-select v-model="form.casetype"  placeholder="请选择選擇類別">
                <el-option
                  v-for="item in options.casetype" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="選擇項目" prop="caseitem">
              <el-select v-model="form.caseitem"  placeholder="请选择選擇項目">
                <el-option
                  v-for="item in options.caseitem" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="印墨顏色" prop="print">
              <el-radio-group v-model="form.print">
                <el-radio v-for="item in options.print" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第一聯紙色" prop="paper1">
              <el-radio-group v-model="form.paper1">
                <el-radio v-for="item in options.paper1" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第二聯紙色" prop="paper2">
              <el-radio-group v-model="form.paper2">
                <el-radio v-for="item in options.paper2" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第三聯紙色" prop="paper3">
              <el-radio-group v-model="form.paper3">
                <el-radio v-for="item in options.paper3" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第四聯紙色" prop="paper4">
              <el-radio-group v-model="form.paper4">
                <el-radio v-for="item in options.paper4" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="發印數量" prop="quantity">
              <el-input-number v-model.number="form.quantity" :controls="true" controls-position="right" placeholder="请输入發印數量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="單位" prop="unit">
              <el-select v-model="form.unit"  placeholder="请选择單位">
                <el-option
                  v-for="item in options.unit" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="號碼" prop="number">
              <el-input-number v-model.number="form.number" :controls="true" controls-position="right" placeholder="请输入號碼" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="起號" prop="startNum">
              <el-input v-model="form.startNum" placeholder="请输入起號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="撕線" prop="tear">
              <el-input-number v-model.number="form.tear" :controls="true" controls-position="right" placeholder="请输入撕線" />
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="撕線數量" prop="tearQty">
              <el-select v-model="form.tearQty"  placeholder="请选择撕線數量">
                <el-option
                  v-for="item in options.tear" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="parseInt(item.dictValue)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="糊頭" prop="pasty">
              <el-switch v-model="form.pasty" :active-value='1' :inactive-value='0' />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="糊頭方向" prop="pastyDirection">
              <el-radio-group v-model="form.pastyDirection">
                <el-radio v-for="item in options.pasty" :key="item.dictValue" :value="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="每本份數" prop="copyQuantity">
              <el-input-number v-model.number="form.copyQuantity" :controls="true" controls-position="right" placeholder="请输入每本份數" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="牛皮" prop="cover">
              <el-select v-model="form.cover"  placeholder="请选择牛皮">
                <el-option
                  v-for="item in options.cover" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="打洞" prop="hole">
              <el-select v-model="form.hole"  placeholder="请选择打洞">
                <el-option
                  v-for="item in options.hole" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="打洞數量" prop="holeQuantity">
              <el-input-number v-model.number="form.holeQuantity" :controls="true" controls-position="right" placeholder="请输入打洞數量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="打釘製本" prop="nail">
              <el-select v-model="form.nail"  placeholder="请选择打釘製本">
                <el-option
                  v-for="item in options.nail" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="厚板" prop="thickplate">
              <el-select v-model="form.thickplate"  placeholder="请选择厚板">
                <el-option
                  v-for="item in options.thickplate" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="備紙尺寸" prop="preparation">
              <el-input v-model="form.preparation" placeholder="请输入備紙尺寸" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="備紙廠商" prop="vendor">
              <el-input v-model="form.vendor" placeholder="请输入備紙廠商" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">建立訂單_建立備註信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddOrder2">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteOrder2">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="FullScreen" @click="fullScreen = !fullScreen">{{ fullScreen ? '退出全屏' : '全屏' }}</el-button>
          </el-col>
        </el-row>
        <el-table :data="order2List" :row-class-name="rowOrder2Index" @selection-change="handleOrder2SelectionChange" ref="Order2Ref">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="備註" align="center" prop="comment">
            <template #default="scope">
              <el-input v-model="scope.row.comment" placeholder="请输入備註" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="createorder">
import { listCreateOrder,
 addCreateOrder, delCreateOrder, 
 updateCreateOrder,getCreateOrder, 
 } 
from '@/api/business/createorder.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'DocNum',
  sortType: 'asc',
  docNum: undefined,
  createTime: undefined,
  customerName: undefined,
  casename: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'docEntry', label: '流水號'   },
  { visible: true, align: 'center', type: '', prop: 'docNum', label: '接件編號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'docDate', label: '接件日期'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'createTime', label: '系統建立日期'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerID', label: '客戶編號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerName', label: '客戶名稱'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerContact', label: '聯絡人'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerPhone', label: '連絡電話'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'ps', label: '是否留板'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'casename', label: '案件名稱'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'casetype', label: '選擇類別'  ,showOverflowTooltip: true  ,dictType: 'casetype' },
  { visible: false, align: 'center', type: 'dict', prop: 'caseitem', label: '選擇項目'  ,showOverflowTooltip: true  ,dictType: 'caseitem' },
  { visible: false, align: 'center', type: 'dict', prop: 'print', label: '印墨顏色'  ,showOverflowTooltip: true  ,dictType: 'print' },
  { visible: false, align: 'center', type: 'dict', prop: 'paper1', label: '第一聯紙色'  ,showOverflowTooltip: true  ,dictType: 'paper1' },
  { visible: false, align: 'center', type: 'dict', prop: 'paper2', label: '第二聯紙色'  ,showOverflowTooltip: true  ,dictType: 'paper2' },
  { visible: false, align: 'center', type: 'dict', prop: 'paper3', label: '第三聯紙色'  ,showOverflowTooltip: true  ,dictType: 'paper3' },
  { visible: false, align: 'center', type: 'dict', prop: 'paper4', label: '第四聯紙色'  ,showOverflowTooltip: true  ,dictType: 'paper4' },
  { visible: false, align: 'center', type: '', prop: 'quantity', label: '發印數量'   },
  { visible: false, align: 'center', type: 'dict', prop: 'unit', label: '單位'  ,showOverflowTooltip: true  ,dictType: 'unit' },
  { visible: false, align: 'center', type: '', prop: 'number', label: '號碼'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'startNum', label: '起號'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'tear', label: '撕線'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'tearQty', label: '撕線數量'   ,dictType: 'tear' },
  { visible: false, align: 'center', type: '', prop: 'pasty', label: '糊頭'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'pastyDirection', label: '糊頭方向'  ,showOverflowTooltip: true  ,dictType: 'pasty' },
  { visible: false, align: 'center', type: '', prop: 'copyQuantity', label: '每本份數'   },
  { visible: false, align: 'center', type: 'dict', prop: 'cover', label: '牛皮'  ,showOverflowTooltip: true  ,dictType: 'cover' },
  { visible: false, align: 'center', type: 'dict', prop: 'hole', label: '打洞'  ,showOverflowTooltip: true  ,dictType: 'hole' },
  { visible: false, align: 'center', type: '', prop: 'holeQuantity', label: '打洞數量'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'nail', label: '打釘製本'  ,showOverflowTooltip: true  ,dictType: 'nail' },
  { visible: false, align: 'center', type: 'dict', prop: 'thickplate', label: '厚板'  ,showOverflowTooltip: true  ,dictType: 'thickplate' },
  { visible: false, align: 'center', type: '', prop: 'preparation', label: '備紙尺寸'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'vendor', label: '備紙廠商'  ,showOverflowTooltip: true  },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 系統建立日期时间范围
const dateRangeCreateTime = ref([])


var dictParams = [
  "casetype",
  "caseitem",
  "print",
  "paper1",
  "paper2",
  "paper3",
  "paper4",
  "unit",
  "tear",
  "pasty",
  "cover",
  "hole",
  "nail",
  "thickplate",
]

proxy.getDicts(dictParams).then((response) => {
  response.data.forEach((element) => {
    state.options[element.dictType] = element.list
  })
})

function getList(){
  proxy.addDateRange(queryParams, dateRangeCreateTime.value, 'CreateTime');
  loading.value = true
  listCreateOrder(queryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查询操作
function resetQuery(){
  // 系統建立日期时间范围
  dateRangeCreateTime.value = []
  proxy.resetForm("queryRef")
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.docEntry);
  single.value = selection.length != 1
  multiple.value = !selection.length;
}
// 自定义排序
function sortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  queryParams.sort = sort
  queryParams.sortType = sortType
  handleQuery()
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    docNum: [{ required: true, message: "接件編號不能为空", trigger: "blur"     }],
    docDate: [{ required: true, message: "接件日期不能为空", trigger: "blur"     }],
    createTime: [{ required: true, message: "系統建立日期不能为空", trigger: "blur"     }],
  },
  options: {
    // 選擇類別 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
casetype: [],
    // 選擇項目 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
caseitem: [],
    // 印墨顏色 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
print: [],
    // 第一聯紙色 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
paper1: [],
    // 第二聯紙色 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
paper2: [],
    // 第三聯紙色 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
paper3: [],
    // 第四聯紙色 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
paper4: [],
    // 單位 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
unit: [],
    // 撕線數量 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
tear: [],
    // 糊頭方向 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
pasty: [],
    // 牛皮 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
cover: [],
    // 打洞 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
hole: [],
    // 打釘製本 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
nail: [],
    // 厚板 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
thickplate: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    docEntry: null,
    docNum: null,
    docDate: null,
    createTime: null,
    customerID: null,
    customerName: null,
    customerContact: null,
    customerPhone: null,
    ps: null,
    casename: null,
    casetype: null,
    caseitem: null,
    print: null,
    paper1: null,
    paper2: null,
    paper3: null,
    paper4: null,
    quantity: null,
    unit: null,
    number: null,
    startNum: null,
    tear: null,
    tearQty: null,
    pasty: null,
    pastyDirection: null,
    copyQuantity: null,
    cover: null,
    hole: null,
    holeQuantity: null,
    nail: null,
    thickplate: null,
    preparation: null,
    vendor: null,
  };
  order2List.value = []
  proxy.resetForm("formRef")
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
    const id = row.docEntry
    getCreateOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '查看'
      opertype.value = 3
      form.value = {
        ...data,
      }
      order2List.value = res.data.order2Nav
    }
  })
}

// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加建立訂單'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.docEntry || ids.value
  getCreateOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改建立訂單'
      opertype.value = 2

      form.value = {
        ...data,
      }
      order2List.value = res.data.order2Nav
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {

      form.value.order2Nav = order2List.value
      if (form.value.docEntry != undefined && opertype.value === 2) {
        updateCreateOrder(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCreateOrder(form.value).then((res) => {
            proxy.$modal.msgSuccess("新增成功")
            open.value = false
            getList()
          })
      }
    }
  })
}

// 删除按钮操作
function handleDelete(row) {
  const Ids = row.docEntry || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delCreateOrder(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}




/*********************建立訂單_建立備註子表信息*************************/
const order2List = ref([])
const checkedOrder2 = ref([])
const fullScreen = ref(false)
const drawer = ref(false)

/** 建立訂單_建立備註序号 */
function rowOrder2Index({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 建立訂單_建立備註添加按钮操作 */
function handleAddOrder2() {
  let obj = {};
  //下面的代码自己设置默认值
  //obj.comment = null;
  order2List.value.push(obj);
}

/** 复选框选中数据 */
function handleOrder2SelectionChange(selection) {
  checkedOrder2.value = selection.map(item => item.index)
}

/** 建立訂單_建立備註删除按钮操作 */
function handleDeleteOrder2() {
  if(checkedOrder2.value.length == 0){
    proxy.$modal.msgError('请先选择要删除的建立訂單_建立備註数据')
  } else {
    const Order2s = order2List.value;
    const checkedOrder2s = checkedOrder2.value;
    order2List.value = Order2s.filter(function(item) {
      return checkedOrder2s.indexOf(item.index) == -1
    });
  }
}

/** 建立訂單_建立備註详情 */
function rowClick(row) {
  const id = row.docEntry || ids.value
  getCreateOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      drawer.value = true
      order2List.value = data.order2Nav
    }
  })
}
handleQuery()
</script>