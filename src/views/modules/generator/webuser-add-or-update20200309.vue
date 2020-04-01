<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="名称" prop="username">
        <el-input v-model="dataForm.username" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="所属社区" prop="hospitalId">
        <el-select
        v-model="dataForm.hospitalId"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="社区"
        :remote-method="remoteMethod"
        :loading="selectLoading">
        <el-option
          v-for="item in hospital"
          :key="item.id"
          :label="item.hospitalName"
          :value="item.id">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="用户情况：">
        <el-select v-model="dataForm.userStatus" placeholder="患者用户情况">
          <el-option key="0" label="健康" value="0"></el-option>
          <el-option key="1" label="疑似" value="1"></el-option>
          <el-option key="2" label="确证" value="2"></el-option>
          <el-option key="3" label="死亡" value="3"></el-option>
        </el-select>
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
        hospital: [],
        dataForm: {
          userId: 0,
          username: '',
          mobile: '',
          password: '',
          createTime: '',
          userStatus: ''
        },
        dataRule: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webuser/info/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.username = data.webUser.username
                this.dataForm.mobile = data.webUser.mobile
                this.dataForm.hospitalId = data.webUser.hospitalId
                this.$http({
                  url: this.$http.adornUrl('/generator/webHospital/selectList'),
                  method: 'get',
                  params: this.$http.adornParams({'id': this.dataForm.hospitalId})
                }).then(({data}) => {
                  this.hospital = data && data.code === 0 ? data.list : []
                })
                this.dataForm.createTime = data.webUser.createTime
                this.dataForm.userStatus = data.webUser.userStatus + ''
              }
            })
          }
        })
      },
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/generator/webHospital/selectList'),
            method: 'get',
            params: this.$http.adornParams({'hospitalName': query})
          }).then(({data}) => {
            this.loading = false
            this.hospital = data && data.code === 0 ? data.list : []
          })
        } else {
          this.hospital = []
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webuser/${!this.dataForm.userId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
                'username': this.dataForm.username,
                'mobile': this.dataForm.mobile,
                'password': this.dataForm.password,
                'hospitalId': this.dataForm.hospitalId,
                'userStatus': this.dataForm.userStatus
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
