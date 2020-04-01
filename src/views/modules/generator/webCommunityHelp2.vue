<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="mini">
       <el-form-item>
        <el-input v-model="dataForm.username" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.feedbackStatus" placeholder="反馈状态" clearable>
          <el-option key="1" label="暂无反馈" value="1"> </el-option>
          <el-option key="2" label="已反馈" value="2"> </el-option>
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
    </el-form>
    <el-table
      size="mini"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名称">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="求助时间">
      </el-table-column>
      <el-table-column
        prop="describeValue"
        header-align="center"
        align="center"
        width="180"
        label="用户描述">
      </el-table-column>
      <el-table-column
        prop="feedbackStatus"
        header-align="center"
        align="center"
        label="反馈状态" :formatter = "stateFormat">
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        header-align="center"
        align="center"
        width="180"
        label="社区名称">
      </el-table-column>
       <el-table-column
        fixed="right"
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

<script>
  import AddOrUpdate from './webCommunityHelp-details'
  import { areaListFunction, selectByDistrict, selectByHospitalName, remoteMethod } from '@/utils/areaAndDistrict'
  export default {
    data () {
      return {
        dataForm: {
          area: '',
          district: '',
          hospitalName: '',
          username: '',
          mobile: '',
          area: '',
          district: '',
          feedbackStatus: ''
        },
        areaList: [],
        districtList: [],
        options: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        selectLoading: false,
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
        if (row.feedbackStatus != null && row.feedbackStatus === 1) {
          return '暂无反馈'
        } else if (row.feedbackStatus != null && row.feedbackStatus === 2){
          return '已反馈'
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/webCommunityHelp/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'hospitalName': this.dataForm.hospitalName,
            'username': this.dataForm.username,
            'mobile': this.dataForm.mobile,
            'feedbackStatus': this.dataForm.feedbackStatus,
            'area': this.dataForm.area,
            'district': this.dataForm.district,
            'type': 2
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/webHospital/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
