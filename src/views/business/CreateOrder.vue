<!--
 * @Descripttion: (建立工單/order_1)
 * @Author: (admin)
 * @Date: (2025-02-13)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具區域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['order1:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['order1:export']">
          {{ $t('btn.export') }}
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
      >
      <el-table-column align="center" width="90">
        <template #default="scope">
          <el-button text @click="rowClick(scope.row)">{{ $t('btn.details') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="docEntry" label="流水號" align="center" v-if="columns.showColumn('docEntry')"/>
      <el-table-column prop="docNum" label="接件編號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('docNum')"/>
      <el-table-column prop="docDate" label="接件日期" :show-overflow-tooltip="true"  v-if="columns.showColumn('docDate')"/>
      <el-table-column prop="createTime" label="系統建立日期" :show-overflow-tooltip="true"  v-if="columns.showColumn('createTime')"/>
      <el-table-column prop="customerID" label="客户編號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerID')"/>
      <el-table-column prop="customerName" label="客户名稱" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerName')"/>
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
      <el-table-column prop="tear" label="撕線" align="center" v-if="columns.showColumn('tear')">
        <template #default="scope">
          <dict-tag :options=" options.tear " :value="scope.row.tear"  />
        </template>
      </el-table-column>
      <el-table-column prop="tearQty" label="撕線數量" align="center" v-if="columns.showColumn('tearQty')"/>
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
          <el-button type="primary" size="small" icon="view" title="詳情" @click="handlePreview(scope.row)"></el-button>
          <el-button type="success" size="small" icon="edit" title="編輯" v-hasPermi="['order1:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="刪除" v-hasPermi="['order1:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="drawer" size="50%" direction="rtl">
      <el-table :data="order2List" header-row-class-name="text-navy">
        <el-table-column label="序號" type="index" width="80" />
        <el-table-column prop="comment" label="備註"/>
      </el-table>
    </el-drawer>

    <el-dialog :title="title" :lock-scroll="false" v-model="open" :fullscreen="fullScreen">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
            
          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="流水號" prop="docEntry">
              <el-input-number v-model.number="form.docEntry" controls-position="right" placeholder="請輸入流水號" :disabled="true"/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="接件編號" prop="docNum">
              <el-input v-model="form.docNum" placeholder="請輸入接件編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="接件日期" prop="docDate">
              <el-date-picker
                v-model="form.docDate"
                type="datetime"
                placeholder="選擇日期時間"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="系統建立日期" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                placeholder="選擇日期時間"
                value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客户編號" prop="customerID">
              <el-input v-model="form.customerID" placeholder="請輸入客户編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客户名稱" prop="customerName">
              <el-input v-model="form.customerName" placeholder="請輸入客户名稱" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="聯絡人" prop="customerContact">
              <el-input v-model="form.customerContact" placeholder="請輸入聯絡人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="連絡電話" prop="customerPhone">
              <el-input v-model="form.customerPhone" placeholder="請輸入連絡電話" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否留板" prop="ps">
              <el-input v-model="form.ps" placeholder="請輸入是否留板" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="案件名稱" prop="casename">
              <el-input v-model="form.casename" placeholder="請輸入案件名稱" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="選擇類別" prop="casetype">
              <el-select v-model="form.casetype"  placeholder="請選擇選擇類別">
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
              <el-select v-model="form.caseitem"  placeholder="請選擇選擇項目">
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
              <el-select v-model="form.print"  placeholder="請選擇印墨顏色">
                <el-option
                  v-for="item in options.print" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第一聯紙色" prop="paper1">
              <el-select v-model="form.paper1"  placeholder="請選擇第一聯紙色">
                <el-option
                  v-for="item in options.paper1" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第二聯紙色" prop="paper2">
              <el-select v-model="form.paper2"  placeholder="請選擇第二聯紙色">
                <el-option
                  v-for="item in options.paper2" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第三聯紙色" prop="paper3">
              <el-select v-model="form.paper3"  placeholder="請選擇第三聯紙色">
                <el-option
                  v-for="item in options.paper3" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="第四聯紙色" prop="paper4">
              <el-select v-model="form.paper4"  placeholder="請選擇第四聯紙色">
                <el-option
                  v-for="item in options.paper4" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="發印數量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="請輸入發印數量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="單位" prop="unit">
              <el-select v-model="form.unit"  placeholder="請選擇單位">
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
              <el-input v-model="form.number" placeholder="請輸入號碼" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="起號" prop="startNum">
              <el-input v-model="form.startNum" placeholder="請輸入起號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="撕線" prop="tear">
              <el-select v-model="form.tear"  placeholder="請選擇撕線">
                <el-option
                  v-for="item in options.tear" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="撕線數量" prop="tearQty">
              <el-input v-model.number="form.tearQty" placeholder="請輸入撕線數量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="糊頭" prop="pasty">
              <el-input v-model="form.pasty" placeholder="請輸入糊頭" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="糊頭方向" prop="pastyDirection">
              <el-select v-model="form.pastyDirection"  placeholder="請選擇糊頭方向">
                <el-option
                  v-for="item in options.pasty" 
                  :key="item.dictValue" 
                  :label="item.dictLabel" 
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="每本份數" prop="copyQuantity">
              <el-input v-model.number="form.copyQuantity" placeholder="請輸入每本份數" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="牛皮" prop="cover">
              <el-select v-model="form.cover"  placeholder="請選擇牛皮">
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
              <el-select v-model="form.hole"  placeholder="請選擇打洞">
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
              <el-input v-model="form.holeQuantity" placeholder="請輸入打洞數量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="打釘製本" prop="nail">
              <el-select v-model="form.nail"  placeholder="請選擇打釘製本">
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
              <el-select v-model="form.thickplate"  placeholder="請選擇厚板">
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
              <el-input v-model="form.preparation" placeholder="請輸入備紙尺寸" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="備紙廠商" prop="vendor">
              <el-input v-model="form.vendor" placeholder="請輸入備紙廠商" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">建立訂單_建立備註信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddOrder2">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteOrder2">刪除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="FullScreen" @click="fullScreen = !fullScreen">{{ fullScreen ? '退出全屏' : '全屏' }}</el-button>
          </el-col>
        </el-row>
        <el-table :data="order2List" :row-class-name="rowOrder2Index" @selection-change="handleOrder2SelectionChange" ref="Order2Ref">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序號" align="center" prop="index" width="50"/>
          <el-table-column label="備註" align="center" prop="comment">
            <template #default="scope">
              <el-input v-model="scope.row.comment" placeholder="請輸入備註" />
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="center">建立訂單_檔案上傳</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['tool:file:add']" plain icon="upload" @click="handleAdd">
          {{ $t('btn.upload') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['tool:file:delete']" plain icon="delete" @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <right-toolbar :showSearch="showSearch" @queryTable="getList"> </right-toolbar>
          
        </el-row>
        <el-table :data="order3List" :row-class-name="rowOrder3Index" @selection-change="handleOrder3SelectionChange" ref="Order3Ref">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序號" align="center" prop="index" width="50"/>
          <el-table-column label="檔案名稱" align="center" prop="FileName"/>
          <el-table-column label="檔案大小" align="center" prop="FileType"/>          
        </el-table>
        
        <el-divider content-position="center">輸入地址</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddOrder4">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteOrder4">刪除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="FullScreen" @click="fullScreen = !fullScreen">{{ fullScreen ? '退出全屏' : '全屏' }}</el-button>
          </el-col>
        </el-row>
        <el-table :data="order4List" :row-class-name="rowOrder4Index" @selection-change="handleOrder4SelectionChange" ref="Order4Ref">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="序號" align="center" prop="index" width="50"/>
          <el-table-column label="收件公司" align="center" prop="Recipient">
            <template #default="scope">
              <el-input v-model="scope.row.Recipient" placeholder="請輸入收件公司" />
            </template>
          </el-table-column>
          <el-table-column label="收件人" align="center" prop="Contacts">
                      <template #default="scope">
              <el-input v-model="scope.row.Contacts" placeholder="請輸入收件公司" />
            </template>  
          </el-table-column>
          <el-table-column label="聯絡電話" align="center" prop="Phone">
            <template #default="scope">
              <el-input v-model="scope.row.Phone" placeholder="請輸入聯絡電話" />
            </template>
          </el-table-column>
          <el-table-column label="地址" align="center" prop="Address">
            <template #default="scope">
              <el-input v-model="scope.row.Address" placeholder="請輸入地址" />
            </template>
          </el-table-column>
          <el-table-column label="聯絡手機" align="center" prop="Mobile">
            <template #default="scope">
              <el-input v-model="scope.row.Mobile" placeholder="請輸入聯絡手機" />
            </template>
          </el-table-column>
          <el-table-column label="備註" align="center" prop="SendComment">
          <template #default="scope">
            <el-input v-model="scope.row.Address" placeholder="請輸入備註" />
            </template>
          </el-table-column>
            

        </el-table>
        
      </el-form>

      
    <el-dialog :title="title" :lock-scroll="false" v-model="open" width="400px" draggable>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="left">
        <el-row>
          <el-col :lg="24">
            <el-form-item label="存储类型" prop="storeType">
              <el-radio-group v-model="form.storeType" placeholder="请选择存储类型">
                <el-radio-button v-for="item in storeTypeOptions" :key="item.dictValue" :value="parseInt(item.dictValue)">
                  {{ item.dictLabel }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="存储目录" prop="storePath">
              <template #label>
                <span>
                  <el-tooltip content="文件目录不填则默认使用本地上传格式：yyyy/MMdd" placement="top">
                    <el-icon :size="15">
                      <questionFilled />
                    </el-icon>
                  </el-tooltip>
                  存储目录
                </span>
              </template>
              <!-- <el-input v-model="form.storePath" placeholder="请输入文件目录，默认yyyy/MMdd格式" clearable="" auto-complete="" /> -->
              <el-select
                style="width: 100%"
                v-model="form.storePath"
                allow-create
                clearable
                filterable
                default-first-option
                :reserve-keyword="false"
                placeholder="请输入文件目录，默认yyyy/MMdd格式">
                <el-option v-for="item in saveDirOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="文件名规则" prop="fileNameType">
              <el-radio-group v-model="form.fileNameType" placeholder="请选择文件名存储类型">
                <el-radio v-for="item in fileNameTypeOptions" :key="item.dictValue" :value="parseInt(item.dictValue)">
                  {{ item.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :lg="24" v-if="form.fileNameType == 2">
            <el-form-item label="自定文件名" prop="fileName">
              <el-input v-model="form.fileName" placeholder="请输入文件名" clearable="" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <UploadFile
              ref="uploadRef"
              v-model="form.accessUrl"
              :fileType="[]"
              :fileSize="100"
              :drag="true"
              :data="uploadData"
              :autoUpload="false"
              @success="handleUploadSuccess" />
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitUpload">{{ $t('btn.submit') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :lock-scroll="false" v-model="openView">
      <el-form ref="form" :model="formView" :rules="rules" label-width="90px" label-position="left">
        <el-row>
          <el-col :lg="12">
            <el-form-item label="文件id">{{ formView.id }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="源文件名">{{ formView.realName }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="文件类型">
              <el-tag>{{ formView.fileType }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="扩展名">
              <el-tag>{{ formView.fileExt }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="文件名">{{ formView.fileName }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="存储目录">{{ formView.storePath }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="文件大小">{{ formView.fileSize }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="创建人">{{ formView.create_by }}</el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="预览">
              <el-image :src="formView.accessUrl" fit="contain" style="width: 100px"></el-image>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="二维码">
              <div ref="imgContainerRef" id="imgContainer" class="qrCode"></div>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="访问路径">
              {{ formView.accessUrl }}
              <el-button class="copy-btn-main" icon="document-copy" text @click="copyText(formView.accessUrl)">
                {{ $t('btn.copy') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="存储路径">
              <div>
                {{ formView.fileUrl }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

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
  sort: 'DocEntry',
  sortType: 'asc',
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'docEntry', label: '流水號'   },
  { visible: true, align: 'center', type: '', prop: 'docNum', label: '接件編號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'docDate', label: '接件日期'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'createTime', label: '系統建立日期'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerID', label: '客户編號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'customerName', label: '客户名稱'  ,showOverflowTooltip: true  },
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
  { visible: false, align: 'center', type: 'dict', prop: 'tear', label: '撕線'  ,showOverflowTooltip: true  ,dictType: 'tear' },
  { visible: false, align: 'center', type: '', prop: 'tearQty', label: '撕線數量'   },
  { visible: false, align: 'center', type: '', prop: 'pasty', label: '糊頭'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'pastyDirection', label: '糊頭方向'  ,showOverflowTooltip: true  ,dictType: 'pasty' },
  { visible: false, align: 'center', type: '', prop: 'copyQuantity', label: '每本份數'   },
  { visible: false, align: 'center', type: 'dict', prop: 'cover', label: '牛皮'  ,showOverflowTooltip: true  ,dictType: 'cover' },
  { visible: false, align: 'center', type: 'dict', prop: 'hole', label: '打洞'  ,showOverflowTooltip: true  ,dictType: 'hole' },
  { visible: false, align: 'center', type: '', prop: 'holeQuantity', label: '打洞數量'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: 'dict', prop: 'nail', label: '打釘製本'  ,showOverflowTooltip: true  ,dictType: 'nail' },
  { visible: false, align: 'center', type: 'dict', prop: 'thickplate', label: '厚板'  ,showOverflowTooltip: true  ,dictType: 'thickplate' },
  { visible: false, align: 'center', type: '', prop: 'preparation', label: '備紙尺寸'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'vendor', label: '備紙廠商', showOverflowTooltip: true },

  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


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

// 查詢
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查詢操作
function resetQuery(){
  proxy.resetForm("queryRef")
  handleQuery()
}
// 自定義排序
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
// 操作類型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    docNum: [{ required: true, message: "接件編號不能為空", trigger: "blur"     }],
    docDate: [{ required: true, message: "接件日期不能為空", trigger: "blur"     }],
    createTime: [{ required: true, message: "系統建立日期不能為空", trigger: "blur"     }],
  },
  options: {
    // 選擇類別 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
casetype: [],
    // 選擇項目 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
caseitem: [],
    // 印墨顏色 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
print: [],
    // 第一聯紙色 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
paper1: [],
    // 第二聯紙色 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
paper2: [],
    // 第三聯紙色 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
paper3: [],
    // 第四聯紙色 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
paper4: [],
    // 單位 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
unit: [],
    // 撕線 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
tear: [],
    // 糊頭方向 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
pasty: [],
    // 牛皮 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
cover: [],
    // 打洞 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
hole: [],
    // 打釘製本 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
nail: [],
    // 厚板 選項列表 格式 eg:{ dictLabel: '標籤', dictValue: '0'}
thickplate: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 關閉dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表單
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
  order3List.value = []
  order4List.value = []
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

// 添加按鈕操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加建立工單'
  opertype.value = 1
}
// 修改按鈕操作
function handleUpdate(row) {
  reset()
  const id = row.docEntry || ids.value
  getCreateOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改建立工單'
      opertype.value = 2

      form.value = {
        ...data,
      }
      order2List.value = res.data.order2Nav
    }
  })
}

// 添加&修改 表單提交
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

// 刪除按鈕操作
function handleDelete(row) {
  const Ids = row.docEntry || ids.value

  proxy
    .$confirm('是否確認刪除參數編號為"' + Ids + '"的數據項？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delCreateOrder(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("刪除成功")
    })
}



// 導出按鈕操作
function handleExport() {
  proxy
    .$confirm("是否確認導出建立工單數據項?", "警告", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      await proxy.downFile('/business/CreateOrder/export', { ...queryParams })
    })
}

/*********************建立訂單_建立備註子表信息*************************/
const order2List = ref([])
const order3List = ref([])
const order4List = ref([])
const checkedOrder2 = ref([])
const checkedOrder3 = ref([])
const checkedOrder4 = ref([])
const fullScreen = ref(false)
const drawer = ref(false)

/** 建立訂單_建立備註序號 */
function rowOrder2Index({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 建立訂單_檔案上傳序號 */
function rowOrder3Index({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 建立訂單_寄送地址序號 */
function rowOrder4Index({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 建立訂單_建立備註添加按鈕操作 */
function handleAddOrder2() {
  let obj = {};
  //下面的代碼自己設置默認值
  //obj.comment = null;
  order2List.value.push(obj);
}

/** 建立訂單_檔案上傳添加按鈕操作 */
function handleAddOrder3() {
  let obj = {};
  //下面的代碼自己設置默認值
  //obj.comment = null;
  order3List.value.push(obj);
}

/** 建立訂單_寄送地址添加按鈕操作 */
function handleAddOrder4() {
  let obj = {};
  //下面的代碼自己設置默認值
  //obj.comment = null;
  order4List.value.push(obj);
}

/** 複選框選中數據 */
function handleOrder2SelectionChange(selection) {
  checkedOrder2.value = selection.map(item => item.index)
}

/** 複選框選中數據 */
function handleOrder3SelectionChange(selection) {
  checkedOrder3.value = selection.map(item => item.index)
}

/** 複選框選中數據 */
function handleOrder4SelectionChange(selection) {
  checkedOrder4.value = selection.map(item => item.index)
}

/** 建立訂單_建立備註刪除按鈕操作 */
function handleDeleteOrder2() {
  if(checkedOrder2.value.length == 0){
    proxy.$modal.msgError('請先選擇要刪除的建立訂單_建立備註數據')
  } else {
    const Order2s = order2List.value;
    const checkedOrder2s = checkedOrder2.value;
    order2List.value = Order2s.filter(function(item) {
      return checkedOrder2s.indexOf(item.index) == -1
    });
  }
}

/** 建立訂單_檔案上傳刪除按鈕操作 */
function handleDeleteOrder3() {
  if(checkedOrder3.value.length == 0){
    proxy.$modal.msgError('請先選擇要刪除的建立訂單_檔案上傳數據')
  } else {
    const Order3s = order3List.value;
    const checkedOrder3s = checkedOrder3.value;
    order3List.value = Order3s.filter(function(item) {
      return checkedOrder3s.indexOf(item.index) == -1
    });
  }
}

/** 建立訂單_檔案上傳刪除按鈕操作 */
function handleDeleteOrder4() {
  if(checkedOrder4.value.length == 0){
    proxy.$modal.msgError('請先選擇要刪除的建立訂單_檔案上傳數據')
  } else {
    const Order4s = order4List.value;
    const checkedOrder4s = checkedOrder4.value;
    order4List.value = Order4s.filter(function(item) {
      return checkedOrder4s.indexOf(item.index) == -1
    });
  }
}

/** 建立訂單_建立備註詳情 */
function rowClick(row) {
  const id = row.docEntry || ids.value
  getCreateOrder(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      drawer.value = true
      order2List.value = data.order2Nav
      order3List.value = data.order3Nav
      order4List.value = data.order4Nav
    }
  })
}
handleQuery()
</script>