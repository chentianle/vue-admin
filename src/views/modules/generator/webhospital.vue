<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.area" placeholder="市" clearable @change="selectByDistrict">
          <el-option
            v-for="item in areaList"
            :key="item.area"
            :label="item.area"
            :value="item.area">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.district" placeholder="区" filterable clearable @change="selectByHospitalName">
          <el-option
            v-for="item in districtList"
            :key="item.district"
            :label="item.district"
            :value="item.district">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
        v-model="dataForm.hospitalName"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="社区"
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
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!-- <el-table-column
      prop="id"
      header-align="center"
      align="center"
      label="社区ID">
      </el-table-column> -->
      <el-table-column
        prop="area"
        header-align="center"
        align="center"
        label="市">
      </el-table-column>
      <el-table-column
        prop="district"
        header-align="center"
        align="center"
        label="区">
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        header-align="center"
        align="center"
        width="280"
        label="社区名称">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="280"
        label="经纬度">
        <template slot-scope="scope">
          [{{scope.row.locationInfomationLongitude}},{{scope.row.locationInfomationDimension}}]
        </template>
      </el-table-column>
       <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
  import AddOrUpdate from './webhospital-add-or-update'
  import { areaListFunction, selectByDistrict, selectByHospitalName, remoteMethod } from '@/utils/areaAndDistrict'
  export default {
    data () {
      return {
        dataForm: {
          area: '',
          district: '',
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
        selectLoading: false,
        addOrUpdateVisible: false
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/webHospital/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
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
