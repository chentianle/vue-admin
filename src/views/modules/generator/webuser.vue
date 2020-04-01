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
        <el-select v-model="dataForm.rating" placeholder="用户状态" clearable>
          <el-option key="0" label="健康" value="0"></el-option>
          <el-option key="1" label="低风险" value="1"></el-option>
          <el-option key="2" label="中风险" value="2"></el-option>
          <el-option key="3" label="高风险" value="3"></el-option>
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
        <!-- <el-button v-if="isAuth('generator:webuser:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('generator:webuser:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      size="mini">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名称">
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        header-align="center"
        align="center"
        label="所属社区">
      </el-table-column>
      <el-table-column
        prop="rating"
        header-align="center"
        align="center"
        label="用户状态" :formatter = "stateFormat">
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
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">查看详情</el-button>
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
  import AddOrUpdate from './webuser-add-or-update'
  import { areaListFunction, selectByDistrict, selectByHospitalName, remoteMethod } from '@/utils/areaAndDistrict'
  export default {
    data () {
      return {
        dataForm: {
          username: '',
          rating: '',
          mobile: '',
          hospitalName: '',
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
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        selectLoading: false,
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
      stateFormat (row, column) {
        if (row.rating != null && row.rating === 0) {
          return '健康'
        } else if (row.rating != null && row.rating === 1){
          return '低风险'
        } else if (row.rating != null && row.rating === 2){
          return '中风险'
        } else if (row.rating != null && row.rating === 3){
          return '高风险'
        } else {
          return '还未填报'
        }
      },
      selectByDistrict () {
        selectByDistrict(this)
      },
      selectByHospitalName () {
        selectByHospitalName(this)
      },
      remoteMethod (query) {
        remoteMethod(query, this)
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'mobile': this.dataForm.mobile,
            'username': this.dataForm.username,
            'rating': this.dataForm.rating,
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, 1)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/webuser/delete'),
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
