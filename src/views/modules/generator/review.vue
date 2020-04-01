<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="mini">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.lastCheckTimeCt" type="date" placeholder="最近一次CT提报日期" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :row-class-name="tableRowClassName"
      style="width: 100%;"
      size="mini"
      :highlight-current-row="false"
      >
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="lastCheckTimeCt"
        header-align="center"
        align="center"
        label="最近一次CT提报日期" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="subTime"
        header-align="center"
        align="center"
        label="填报时间" :show-overflow-tooltip="true" >
      </el-table-column>
      <el-table-column
        prop="decisionRules"
        header-align="center"
        align="center"
        label="诊断依据" :show-overflow-tooltip="true" >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.webQuestionnaireId,scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './review_dialog'
  export default {
    data () {
      return {
        dataForm: {
          username: '',
          mobile: '',
          lastCheckTimeCt: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      stateFormat (row, column) {
        if (row.subStatus != null && row.subStatus === 1) {
          return '已提交'
        } else {
          return '未提交'
        }
      },
      handleFormat (row, column) {
        if (row.handleStatus === 1) {
          return '已处理'
        } else if (row.handleStatus === 0) {
          return '未处理'
        } else {
          return ''
        }
      },
      tableRowClassName ({row, rowIndex}) {
        if (row.verbStatus === 1) {
          return 'warning-row'
        } else if (row.verbStatus === 2) {
          return 'danger-row'
        }
      },
      // 获取数据列表
      getDataList () {
        console.log(this.dataForm)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/webUserReview/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.username,
            'mobile': this.dataForm.mobile,
            'lastCheckTimeCt': this.dataForm.lastCheckTimeCt
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data)
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 查看详情
      addOrUpdateHandle (userId, id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(userId, id)
        })
      }
    }
  }
</script>
