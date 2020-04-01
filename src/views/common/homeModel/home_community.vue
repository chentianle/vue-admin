<template>
  <div id="home_community">
    <h1 class="home-title"><span>健康人群监管平台</span></h1>
    <el-row>
      <el-col :span="6">
        <title-slot title="社区状态">
           <el-row style="'height:50'">
             <el-col>
               <div class="status" :style="{color:{0:color_greed,1:'rgb(91,43,249)',2:color_yellow,3:color_red}[sbxx.rating]}">
                 {{{0:'健康',1:'低低风险',2:'中低风险',3:'高低风险'}[sbxx.rating]}}
               </div>
             </el-col>
           </el-row>
           <el-row>
             <el-col>
                <div class="sbTop" v-if="sbxx.userNum" ><div><span>社区人口</span><number-grow :time="1.5" color="rgb(246, 189, 22)" :value="sbxx.userNum"></number-grow></div></div>
                <div class="sbTop" v-if="sbxx.questionnaireNum" ><div><span>填报信息</span><number-grow :time="1.7" color="rgb(92, 206, 161)" :value="sbxx.questionnaireNum"></number-grow></div></div>
                <div class="sbTop" ><div><span>新增填报</span><number-grow :time="1.2" color="rgb(232, 100, 82)" :value="sbxx.newQuestionnaireNum"></number-grow></div></div>
             </el-col>
           </el-row>
        </title-slot>
      </el-col>
      <el-col :span="7">
        <div>
            <title-slot title="实时填报信息">
            <el-table
              :data="tbtableData"
              style="width: 100%">
              <el-table-column
                prop="subTime"
                label="填报时间"
                 header-align="center"
                align="center"
                width="160">
              </el-table-column>
              <el-table-column
                prop="hospitalName"
                label="所在社区"
                 header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                width="110"
                 header-align="center"
                align="center">
              </el-table-column>
            </el-table>
          </title-slot>
        </div>
      </el-col>
      <el-col :span="11">
        <div>
            <title-slot title="求助信息">
            <el-table
              :data="helptableData"
              style="width: 100%">
              <el-table-column
                prop="mobile"
                label="手机号"
                header-align="center"
                align="center"
                width="110">
              </el-table-column>
              <el-table-column
                prop="homeAddress"
                label="住址"
                header-align="center"
                align="center"
                >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="求助时间"
                header-align="center"
                align="center"
                width="160">
              </el-table-column>
               <el-table-column
                prop="createTime"
                label="需求时间"
                header-align="center"
                align="center"
                width="160">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                width="100"
                label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" style="padding: 4px 15px;" type="text"  @click="addOrUpdateHandle(scope.row.id)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </title-slot>
        </div>
      </el-col>
    </el-row>
<!--    中排-->
    <el-row>
      <el-col :span="16">
        <el-row>
          <el-col :span="8">
            <title-slot title="健康分布">
              <div id="container_tu_3"/>
            </title-slot>
          </el-col>
          <el-col :span="16">
            <title-slot title="疫情态势">
              <div id="container_tu_2"/>
            </title-slot>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <title-slot title="年龄分布">
          <div id="Community_health"/>
        </title-slot>
      </el-col>
    </el-row>
    <add-or-update ref="addOrUpdate"></add-or-update>
  </div>
</template>

<script>
  import DataSet from '@antv/data-set';
  import {registerShape,Chart} from '@antv/g2';

  export default {
    components:{
      TitleSlot:()=> import('../../component/title-slot'),
      TextZl: () => import('../../component/text-type-zl'),
      NumberGrow: () => import('../../component/number-grow'),
      AddOrUpdate: () => import('../../modules/generator/webCommunityHelp-details')
    },
    mounted() {
      this.init()
    },
    methods: {
      cityChange(val){
        this.cityVal = val
        this.init()
      },
      init() {
        // 发展曲线
        this.$http({
          url: this.$http.adornUrl('/generator/webUserRatingDay/progressCurve'),
          method: 'get',
          params: this.$http.adornParams({
            "hospitalId": this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
          let datas = data.data.map(ls=>{
            // {date: "2020-03-02", suspected: 3, mild: 1, severe: 0}
            return {date:ls.date, '低风险':ls.suspected,'中风险':ls.mild,'高风险':ls.severe}
          })

          const dv = new DataSet.View().source(datas);
          dv.transform({
            type: 'fold',
            fields: ['低风险', '中风险', '高风险'],
            key: 'type',
            value: 'value',
          });
          const chart = new Chart({
            container: 'container_tu_2',
            autoFit: true,
            height: 300,
          });

          chart.data(dv.rows);
          chart.scale({
            value: {
              nice: true,
            },
            date: {
              range: [0, 1],
            },
          });
          chart.tooltip({
            showCrosshairs: true,
            shared: true,
          });

          chart
            .area()
            .position('date*value')
            .color('type',[this.color_greed,this.color_yellow,this.color_red])
            .shape('smooth');
          chart
            .line()
            .position('date*value')
            .color('type',[this.color_greed,this.color_yellow,this.color_red])
            .shape('smooth');
          chart.render();
        })

        // 获取人员分布饼状图接口
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/distribution'),
          method: 'get',
          params: this.$http.adornParams({
            'hospitalId': this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
          const data2 = [
            data.data[0]
          ]
          const data1 = [
            {name:'低风险',value:data.data[1].value},
            {name:'中风险',value:data.data[2].value},
            {name:'高风险',value:data.data[3].value},
          ];
          const ds = new DataSet();
          const dv = ds.createView();
          dv.source(data2).transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent',
          });

          const colorMap = {
            低风险: '#1890ff',
            中风险: this.color_yellow,
            高风险: this.color_red,
            健康: this.color_greed,
          };

          const chart = new Chart({
            container: 'container_tu_3',
            autoFit: true,
            height: 300,
          });
          chart.data(dv.rows);
          chart.legend(false);
          chart.coordinate('theta', {
            radius: 0.5,
            innerRadius: 0.3,
          });
          chart.tooltip({
            showMarkers: false
          });
          chart
            .interval()
            .adjust('stack')
            .position('percent')
            .color('name', (val) => colorMap[val])
            .style({
              lineWidth: 0,
            })
            .tooltip('name*value', (item, value) => {
              return {
                name: item,
                value: value,
              };
            })
            .label('name', {
              offset: -5,
              style: {
                fill: 'white',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              },
            });

          const ds2 = new DataSet();
          const dv2 = ds2.createView();
          dv2.source(data1).transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent',
          });
          const outterView = chart.createView();
          outterView.data(dv2.rows);
          outterView.coordinate('theta', {
            innerRadius: 0.5 / 0.9,
            radius: 0.8,
          });
          outterView
            .interval()
            .adjust('stack')
            .position('percent')
            .color('name*value', (name, value) => colorMap[name])
            .style({
              lineWidth: 0,
            })
            .tooltip('name*value', (item, value) => {
              return {
                name: item,
                value: value,
              };
            })
            .label('name', {
              offset: -10,
              style: {
                fill: 'white',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              },
            });
          chart.interaction('element-active')
          chart.render();
        })

        // 头部汇总数据
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/communityPandect'),
          method: 'get',
          params: this.$http.adornParams({
            "hospitalId": this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
          this.$nextTick(()=>{
            this.sbxx = data.data
          })


        })
        //请求实时填报数据
        this.ssMsg()

        //请求实时求助信息
        this.askHelp()

        // 年龄分布接口
        this.$http({
          url: this.$http.adornUrl('/generator/patientBasicInfoManage/queryGeneration'),
          method: 'post',
          data: this.$http.adornData({
            'type': "",
            'hospitalId': this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
            let userData = ['lessThan17','mainAge','littleOld','middleOld','bigThan100'].map(ls=>{
            let typeName = {lessThan17:'小于17岁',mainAge:'18-65岁',littleOld:'66-79岁',middleOld:'80-99岁',bigThan100:'100岁以上'}[ls]
            return {type:typeName,value:data.generation[ls]}
          })
          // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
          const sliceNumber = 0.01;

          // 自定义 other 的图形，增加两条线
          registerShape('interval', 'slice-shape', {
            draw(cfg, container) {
              const points = cfg.points;
              let path = [];
              path.push(['M', points[0].x, points[0].y]);
              path.push(['L', points[1].x, points[1].y - sliceNumber]);
              path.push(['L', points[2].x, points[2].y - sliceNumber]);
              path.push(['L', points[3].x, points[3].y]);
              path.push('Z');
              path = this.parsePath(path);
              return container.addShape('path', {
                attrs: {
                  fill: cfg.color,
                  path,
                },
              });
            },
          });
          const chart = new Chart({
            container: 'Community_health',
            autoFit: true,
            height: 300,
          });

          chart.data(userData);
          chart.coordinate('theta', {
            radius: 0.75,
            innerRadius: 0.6,
          });
          chart.tooltip({
            showTitle: false,
            showMarkers: false,
          });
          chart
            .interval()
            .adjust('stack')
            .position('value')
            .color('type')
            .shape('slice-shape');

          chart.render();

        })
      },
      // 实时信息获取
      ssMsg(){
        this.$http({
          url: this.$http.adornUrl('/generator/webquestionnaire/communityConstantly'),
          method: 'post',
          data: this.$http.adornData({
            "hospitalId": this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
          this.tbtableData = data.data
          let num =Math.round(Math.random()*10000+12000)
          setTimeout(()=>{
            this.ssMsg()
          },num)
        })
      },
      // 实时求助获取
      askHelp(){
        this.$http({
          url: this.$http.adornUrl('/generator/webCommunityHelp/communityConstantly'),
          method: 'post',
          data: this.$http.adornData({
            "hospitalId": this.$store.state.user.hospitalId
          })
        }).then(({data}) => {
          this.helptableData = data.data
          let num =Math.round(Math.random()*10000+12000)
          setTimeout(()=>{
            this.askHelp()
          },num)
        })
      },
      // 查看详情
      addOrUpdateHandle (id) {
        console.log(this.$refs)
        this.$refs.addOrUpdate.init(id)
      }
    },
    data() {
      return {
        tbtableData:[],
        helptableData:[],
        addOrUpdateVisible: false,
        sbxx:{
          newQuestionnaireNum:0,
          userNum:0,
          questionnaireNum:0,
          rating: ''
        },
        color_red:'#E86452',
        color_yellow:'#F6BD16',
        color_greed:'#5CCEA1'
      }
    }
  }
</script>
<style>
  #home_community .el-table__body-wrapper.is-scrolling-left, #home_community .el-table__body-wrapper.is-scrolling-none{
    background: #0a1e39;
  }
</style>
<style scoped>

  .home-title {
    text-align: center;
    margin-top: 0;
    letter-spacing: 10px;
    border: 1px solid rgb(8, 57, 95);
    line-height: 50px;
    background: rgb(12, 31, 55);
    color: rgb(48, 147, 177);
  }
  .home-title span {
    background: linear-gradient(to bottom, rgb(81,253,237), rgb(69,172,244));
    -webkit-background-clip: text;
    color: transparent;
  }
  .sbTop {
    background: linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) left top no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) left top no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right top no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) right top no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) left bottom no-repeat,
    linear-gradient(to bottom, rgb(8,57,95), rgb(8,57,95)) left bottom no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right bottom no-repeat,
    linear-gradient(to left, rgb(8,57,95), rgb(8,57,95)) right bottom no-repeat;
    background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
    width: 90%;
    display: inline-block;
    text-align: center;
    margin: 0px 0px 1px 5%;
    padding: 0px;
  }
  .sbTop > div{
    background: rgba(223,223,223,.1);
  }
  .sbTop > div > span{
    text-indent: 3em;
    font-size: 18px;
    color: white;
    padding-right: 30px;
  }
  .sbTop > div > div{
    display: inline-block;
  }
  .status{
    background: rgba(223,223,223,.1);
    margin: 20px 60px;
    font-size: 40px;
    text-align: center;
    line-height: 75px;
    color: white;
    border-radius: 3px;
  }
</style>
