<template>
  <el-dialog
    :title="'查看详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    size="mini"
    center>
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px" size="mini"> 
      <el-collapse v-model="activeNames">
        <el-collapse-item title="患者基础状况" name="2">
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
        <el-collapse-item title="最近一次临床观察表" name="3">
          <el-row>
            <el-col :span="8" v-for="(item,index) in webQuestionnaireList" :key="`collapse${index}`" v-if="item.classifyType === 3">
              <el-form-item :label="`${item.content}:`" :key="`${index}`">
                {{item.value}} 
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row style="margin-top:10px;">
        <el-col :span="24">
          <el-form-item label="处理方式:">
            <el-select v-model="dataForm.handleStatus" placeholder="" clearable>
              <el-option key="" label="请选择" value=""></el-option>
              <el-option key="2" label="忽略" value="2"></el-option>
              <el-option key="1" label="已检查" value="1"></el-option>
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
          '3',
          '2'
        ],
        visible: false,
        webQuestionnaireId: '',
        dataForm: {
          id: 0,
          handleStatus: ''
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
      init (userId, id) {
        this.visible = true
        // 清空数组
        this.webBasic = [{
          value: '',
          content: ''
        }]
        this.webQuestionnaireList = []
        this.dataForm = {
          id: id,
          handleStatus: ''
        }
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          if (userId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/webUserReview/allInfoByUserId`),
              method: 'post',
              data: this.$http.adornData({
                'id': userId
              })
            }).then(({data}) => {
              console.log(data)
              if (data && data.code === 0) {
                // 患者基础情况
                this.webBasic = JSON.parse(data.resultData.webBasic.subContent)
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
        this.$http({
          url: this.$http.adornUrl(`/generator/webUserReview/update`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'handleStatus': this.dataForm.handleStatus
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
    }
  }
</script>
