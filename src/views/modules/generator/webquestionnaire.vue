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
        <el-date-picker v-model="dataForm.subTime" type="date" placeholder="提交日期" clearable style="width:160px"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.verbStatus" placeholder="用户状态" clearable>
          <el-option key="-1" label="忽略" value="-1"></el-option>
          <el-option key="0" label="健康" value="0"></el-option>
          <el-option key="1" label="低风险" value="1"></el-option>
          <el-option key="2" label="中风险" value="2"></el-option>
          <el-option key="2" label="高风险" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="superFlag=='yes' || hospitalType == 0">
        <el-select v-model="dataForm.area" placeholder="国家" clearable @change="selectByDistrict">
          <el-option
            v-for="item in areaList"
            :key="item.area"
            :label="item.area"
            :value="item.area">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="superFlag=='yes' || hospitalType == 0 || hospitalType == 1">
        <el-select v-model="dataForm.district" placeholder="大区" filterable clearable @change="selectByHospitalName">
          <el-option
            v-for="item in districtList"
            :key="item.district"
            :label="item.district"
            :value="item.district">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="superFlag=='yes' || hospitalType == 0 || hospitalType == 1 || hospitalType == 2">
        <el-select
        v-model="dataForm.hospitalName"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="区域"
        :remote-method="remoteMethod"
        :loading="selectLoading">
          <el-option
            v-for="item in options"
            :key="item.hospitalName"
            :label="item.hospitalName"
            :value="item.hospitalName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item  v-if="superFlag=='yes'">
        <el-button @click='handleExport()'>导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :row-class-name="tableRowClassName"
      style="width: 100%;"
      size="mini"
      >
      <el-table-column v-if="superFlag=='yes'"
        prop="hospitalName"
        header-align="center"
        align="center"
        label="社区名称">
      </el-table-column>
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
      <el-table-column  prop="handleStatus"  header-align="center" align="center" label="处理状态" :formatter = "handleFormat">
      </el-table-column>
      <el-table-column
        prop="subTime"
        header-align="center"
        align="center"
        label="提交时间" :show-overflow-tooltip="true" width="160px;">
      </el-table-column>
      <el-table-column
        prop="score"
        header-align="center"
        align="center"
        label="得分">
      </el-table-column>
      <el-table-column
        prop="nounValue"
        header-align="center"
        align="center"
        label="用户概要情况" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="diagnosisValue"
        header-align="center"
        align="center"
        label="诊断建议" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">查看详情</el-button>
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
<style>
  /* .el-table .danger-row {
    background: #F56C6C;
  }
  .el-table .warning-row {
    background: #E6A23C;
  }
  .el-table .danger-row:hover>td {
    background-color: #F56C6C!important
  }
  .el-table .warning-row:hover>td {
    background-color: #E6A23C!important
  } */
</style>
<script>
  import AddOrUpdate from './webquestionnaire-add-or-update'
  import { DownFile } from '@/utils/download'
  import http from '@/utils/httpRequest'
  import { areaListFunction, selectByDistrict, selectByHospitalName, remoteMethod } from '@/utils/areaAndDistrict'
  export default {
    data () {
      return {
        dataForm: {
          verbStatus: '',
          username: '',
          mobile: '',
          subTime: '',
          hospitalName: [],
          area: '',
          district: ''
        },
        areaList: [],
        districtList: [],
        options: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        selectLoading: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        superFlag: this.$cookie.get('superAdminFlag'),
        hospitalType : ''
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      areaListFunction(this)
    },
    methods: {
      selectByDistrict () {
        selectByDistrict(this)
      },
      selectByHospitalName () {
        selectByHospitalName(this)
      },
      remoteMethod (query) {
        remoteMethod(query, this)
      },
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
        this.dataListLoading = true

        http({
          url: http.adornUrl('/generator/webquestionnaire/adminHistorylist'),
          method: 'get',
          params: http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'verbStatus': this.dataForm.verbStatus,
            'username': this.dataForm.username,
            'mobile': this.dataForm.mobile,
            'subTime': this.dataForm.subTime,
            'hospitalName': this.dataForm.hospitalName,
            'area': this.dataForm.area,
            'district': this.dataForm.district
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
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
      addOrUpdateHandle (id) {
        console.log(id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, 2)
        })
      },
      handleExport () {
        this.loading = true
        http({
          url: http.adornUrl('/generator/webquestionnaire/exportDataList'),
          method: 'post',
          responseType: 'blob',
          data: http.adornData({
            'verbStatus': this.dataForm.verbStatus,
            'username': this.dataForm.username,
            'mobile': this.dataForm.mobile,
            'subTime': this.dataForm.subTime,
            'hospitalIds': this.dataForm.hospitalIds !== [] ? this.dataForm.hospitalIds.join() : this.dataForm.hospitalIds
          })
        }).then(r => {
          this.loading = false
          DownFile(r, '全部数据.xls', true)
        }).catch(r => {
          this.loading = false
        })
      }
    }
  }
</script>
