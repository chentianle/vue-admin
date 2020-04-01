<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="社区名称" prop="hospitalName">
      <el-input v-model="dataForm.hospitalName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="市" prop="area">
      <el-input v-model="dataForm.area" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="区" prop="district">
      <el-input v-model="dataForm.district" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="经度" prop="locationInfomationLongitude">
      <el-input v-model="dataForm.locationInfomationLongitude" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="纬度" prop="locationInfomationDimension">
      <el-input v-model="dataForm.locationInfomationDimension" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          hospitalName: '',
          area: '',
          district: '',
          locationInfomationDimension: '',
          locationInfomationLongitude: ''
        },
        dataRule: {
          hospitalName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          district: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          locationInfomationLongitude: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          locationInfomationDimension: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webHospital/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.hospitalName = data.webUser.hospitalName
                this.dataForm.hospitalAddress = data.webUser.hospitalAddress
                this.dataForm.area = data.webUser.area
                this.dataForm.district = data.webUser.district
                this.dataForm.locationInfomationDimension = data.webUser.locationInfomationDimension
                this.dataForm.locationInfomationLongitude = data.webUser.locationInfomationLongitude
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webHospital/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'hospitalName': this.dataForm.hospitalName,
                'area': this.dataForm.area,
                'district': this.dataForm.district,
                'locationInfomationDimension': this.dataForm.locationInfomationDimension,
                'locationInfomationLongitude': this.dataForm.locationInfomationLongitude
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
