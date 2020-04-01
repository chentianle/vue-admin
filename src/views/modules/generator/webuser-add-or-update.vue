<template>
  <el-dialog
    :title="'查看详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    size="mini"
    center>
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户名称:">
            {{dataForm.username}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户手机号:">
            {{dataForm.mobile}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户情况:" :style="dataForm.verbStatusColor">
            {{dataForm.verbStatus}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="评分总分:">
            {{dataForm.score}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="填报时间:">
            {{dataForm.subTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="用户基础状况" name="1">
          <el-row v-if="webBasic.length > 0">
            <el-col :span="8" v-for="(item,index) in webBasic" :key="`collapse${index}`">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="webBasic.length === 0">
            <p>用户暂未填写</p>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="用户临床观察表" name="2">
          <el-row>
            <el-col :span="8" v-for="(item,index) in webQuestionnaireList" :key="`collapse${index}`" v-if="item.classifyType === 3">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="用户临床诊断结果" name="3">
          <el-row>
            <el-col :span="8" v-for="(item,index) in webQuestionnaireList" :key="`collapse${index}`" v-if="item.classifyType === 2">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <span slot="footer" class="dialog-footer" algin="center">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<style scoped>

</style>
<script>
  export default {
    data () {
      return {
        activeNames: [
          '1',
          '2',
          '3'
        ],
        visible: false,
        webQuestionnaireId: '',
        dataForm: {
          id: 0,
          subTime: '',
          subStatus: '',
          score: '',
          replyInfo: '',
          verbStatus: '',
          doctorComment: '',
          verbStatusSubmit: ''
        },
        /* 患者基础情况 */
        webBasic: [],
        webDetail: [],
        detaiDoctorList: [],
        webQuestionnaireList: []
      }
    },
    methods: {
      init (id, type) {
        this.visible = true
        // 清空数组
        this.webBasic = []
        this.webQuestionnaireId = ''
        this.webDetail = []
        this.detaiDoctorList = []
        this.webQuestionnaireList = []
        this.dataForm = {
          id: 0,
          subTime: '',
          subStatus: '',
          score: '',
          replyInfo: '',
          verbStatus: '',
          doctorComment: ''
        }
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          if (id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webquestionnaire/allInfo`),
              method: 'post',
              data: this.$http.adornData({
                'type': type,
                'id': id
              })
            }).then(({data}) => {
              console.log(data)
              if (data && data.code === 0) {
                console.log(data.resultData.webUser)
                console.log(data.resultData.webBasic)
                this.webQuestionnaireId = data.resultData.webQuestionnaireId
                this.dataForm.verbStatus = data.resultData.webUser.rating === 0
                if (data.resultData.webUser.rating === 1) {
                  this.dataForm.verbStatus = '低风险'
                  this.dataForm.verbStatusColor = 'color:#909399'
                } else if (data.resultData.webUser.rating === 2) {
                  this.dataForm.verbStatus = '中风险'
                  this.dataForm.verbStatusColor = 'color:#E6A23C'
                } else if (data.resultData.webUser.rating === 3) {
                  this.dataForm.verbStatus = '高风险'
                  this.dataForm.verbStatusColor = 'color:#F56C6C'
                } else {
                  this.dataForm.verbStatus = '健康'
                  this.dataForm.verbStatusColor = 'color:#67C23A'
                }
                this.dataForm.score = data.resultData.webUser.score
                this.dataForm.mobile = data.resultData.webUser.mobile
                this.dataForm.handleStatus = data.resultData.webUser.handleStatus === 1 ? '已处理' : '未处理'
                this.dataForm.subTime = data.resultData.webUser.subTime
                this.dataForm.username = data.resultData.webUser.username
                // 患者基础情况
                console.log('data.resultData.webBasic.subContent')
                console.log(data.resultData.webBasic.subContent)
                if (data.resultData.webBasic != null) {
                  this.webBasic = JSON.parse(data.resultData.webBasic.subContent)
                }
                // 诊断结果
                this.webDetail = data.resultData.webDetail
                // 医生回复
                this.detaiDoctorList = data.resultData.detaiDoctorList
                // 临床诊断结果 & 复查结果
                if (data.resultData.webQuestionnaire !== '') {
                  this.webQuestionnaireList = JSON.parse(data.resultData.webQuestionnaire.subContent)
                }
              }
            })
          }
        })
      }
    }
  }
</script>
