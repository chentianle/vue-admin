<template>
  <el-dialog
    title="求助详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户姓名:">
            {{dataForm.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户手机号:">
            {{dataForm.mobile}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提出时间:">
            {{dataForm.createTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dataForm.type == 1">
        <el-col :span="8">
          <el-form-item label="需求时间:">
            {{dataForm.demandTime}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="求助类型:">
            {{dataForm.optionValue}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="家庭住址:">
            {{dataForm.homeAddress}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="社区名称:">
            {{dataForm.hospitalName}}
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="描述:">
            {{dataForm.describeValue}}
          </el-form-item>
        </el-col>
      </el-row>
   
     <el-collapse v-model="activeNames">
        <el-collapse-item title="反馈记录" name="1">
          <el-row v-for="(item,index) in list" :key="`collapse${index}`">
            <el-col :span="8" >
              <el-form-item label="反馈人:">
                {{item.userName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="反馈内容:">
                {{item.feedbackValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="反馈时间:">
                {{item.feedbackTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="list.length === 0">
            <p>暂无反馈</p>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="反馈操作" name="2">
          <el-row>
            <el-col :span="24" >
              <el-form-item label="反馈内容:">
                 <el-input type="textarea" :rows="4"  placeholder="请输入内容" v-model="dataForm.feedbackValue"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
     </el-collapse>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        activeNames: ['1','2'],
        visible: false,
        dataForm: {
          userName: '',
          mobile: '',
          demandTime: '',
          homeAddress: '',
          optionValue: '',
          hospitalName: '',
          describeValue: '',
          createTime: '',
          type: '1',
          feedbackValue: ''
        },
        list: []
      }
    },
    methods: {
      init (id) {
        this.dataForm =  {
            userName: '',
            mobile: '',
            demandTime: '',
            homeAddress: '',
            optionValue: '',
            hospitalName: '',
            describeValue: '',
            createTime: '',
            type: '1',
            feedbackValue: ''
        }
        this.list = []
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webCommunityHelp/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.bean.userName
                this.dataForm.mobile = data.bean.mobile
                this.dataForm.demandTime = data.bean.demandTime
                this.dataForm.homeAddress = data.bean.homeAddress
                this.dataForm.optionValue = data.bean.optionValue
                this.dataForm.hospitalName = data.bean.hospitalName
                this.dataForm.describeValue = data.bean.describeValue
                this.dataForm.createTime = data.bean.createTime
                this.dataForm.type = data.bean.type
                this.list = data.bean.list
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
          if (this.dataForm.feedbackValue !== '') {
            this.$http({
              url: this.$http.adornUrl(`/generator/webCommunityHelp/saveFeedback`),
              method: 'post',
              data: this.$http.adornData({
                'feedbackValue': this.dataForm.feedbackValue,
                'communityHelpId': this.dataForm.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }else{
            this.$message({
              message: '反馈内容不能为空',
              type: 'error',
              duration: 1500
            })
          }
      }
    }
  }
</script>
