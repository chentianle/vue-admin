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
          <el-form-item label="填报时间:">
            {{dataForm.subTime}}
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
          <el-form-item label="处理状态:">
            {{dataForm.handleStatus}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户情况:" :style="dataForm.verbStatusColor">
            {{dataForm.verbStatus}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="诊断结果" name="1">
          <el-row v-for="(item,index) in webDetail" :key="`collapse${index}`">
            <el-col :span="8" >
              <el-form-item label="诊断依据:">
                {{item.decisionRules}}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="用户端建议:">
                {{item.nounValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="管理端建议:">
                {{item.diagnosisValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="webDetail.length === 0">
            <p>暂无诊断结果</p>
          </el-row>

        </el-collapse-item>
        <el-collapse-item title="用户基础状况" name="2">
          <el-row v-if="webBasic.length > 0">
            <el-col :span="8" v-for="(item,index) in webBasic" :key="`collapse${index}`">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="webBasic.length === 0">
            <p>患者暂未填写</p>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="用户临床观察表" name="3">
          <el-row>
            <el-col :span="8" v-for="(item,index) in webQuestionnaireList" :key="`collapse${index}`" v-if="item.classifyType === 3">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="用户临床诊断结果" name="4">
          <el-row>
            <el-col :span="8" v-for="(item,index) in webQuestionnaireList" :key="`collapse${index}`" v-if="item.classifyType === 2">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="医生回复历史记录" name="5">
          <el-row v-for="(item,index) in detaiDoctorList" :key="`collapse${index}`">
            <el-col :span="12" >
              <el-form-item label="时间:">
                {{item.createTime}}
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item label="回复内容:">
                {{item.doctorComment}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detaiDoctorList.length === 0">
            <p>还未回复过内容</p>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row style="margin-top:10px;">
        <el-col :span="24">
          <el-form-item label="医生回复:">
              <el-input type="textarea" :rows="4"  placeholder="请输入内容" v-model="dataForm.doctorComment"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="处理结果:">
            <el-select v-model="dataForm.verbStatusSubmit" placeholder="用户状态" clearable>
              <el-option key="" label="请选择" value=""></el-option>
              <el-option key="-1" label="忽略" value="-1"></el-option>
              <el-option key="0" label="解除疑似或解除风险" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" algin="center">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
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
          '2'
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
        webBasic: [{
          value: '',
          content: ''
        }],
        webDetail: [],
        detaiDoctorList: [],
        webQuestionnaireList: []
      }
    },
    methods: {
      init (id, type) {
        this.visible = true
        // 清空数组
        this.webBasic = [{
          value: '',
          content: ''
        }]
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
                this.webBasic = JSON.parse(data.resultData.webBasic.subContent)
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
      },
      // 表单提交
      dataFormSubmit () {
        if (this.dataForm.doctorComment === '') {
          this.$message({
            message: '医生回复不能为空',
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (this.webQuestionnaireId !== '') {
          this.$http({
            url: this.$http.adornUrl(`/generator/webDoctorComment/save`),
            method: 'post',
            data: this.$http.adornData({
              'doctorComment': this.dataForm.doctorComment,
              'verbStatusSubmit': this.dataForm.verbStatusSubmit,
              'webQuestionnaireId': this.webQuestionnaireId
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
        } else {
          this.$message({
            message: '当前患者还没有提交今日信息',
            type: 'error',
            duration: 1500
          })
        }
      }
    }
  }
</script>
