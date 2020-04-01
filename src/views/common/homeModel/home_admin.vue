<template>
  <div id="home_admin">
    <h1 class="home-title"><span>健康人群监管平台</span></h1>
    <!-- <h1 class="home-title"><span>{{cityVal}}社区健康人群监管平台</span></h1> -->
<!--    <number-grow :value="720000"></number-grow>-->
<!--    顶排-->
    <el-row>
<!--      <div id="container_tu_4"/>-->
      <el-col :span="16" style="    position: relative;">
          <div class="map_area_dropdown" v-if="userType === 0">
            <span style="color:#4FF1EE;font-weight: 400;">地区：</span>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{cityVal}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in area"
                                  :key="index"
                                  :command="item.area">{{item.area}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="map_area_dropdown" v-if="userType === 1">
            <span style="color:#4FF1EE;font-weight: 400;">地区：{{cityVal}}</span>
          </div>
          <div v-loading="mapLoading" element-loading-text="数据加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)" id="map" style="position: relative; height: 544px; padding: 0px 10px;margin-bottom: 15px;" />
      </el-col>
      <el-col :span="8">
        <div style="padding-left: 20px;">
          <div class="sbTop" v-if="sbxx.communityNum"><div><span>覆盖地区</span><number-grow :time="1.2" color="rgb(232, 100, 82)" :value="sbxx.communityNum"></number-grow></div></div>
          <div class="sbTop" v-if="sbxx.userNum"><div><span>覆盖人口</span><number-grow :time="1.5" color="rgb(246, 189, 22)" :value="sbxx.userNum"></number-grow></div></div>
          <div class="sbTop" v-if="sbxx.questionnaireNum"><div><span>上报信息</span><number-grow :time="1.7" color="rgb(92, 206, 161)" :value="sbxx.questionnaireNum"></number-grow></div></div>
          <title-slot type="2" title="实时求助信息">
            <el-table
              :data="tbtableData2"
              style="width: 100%" size="mini">
              <el-table-column
                prop="createTime"
                width="140"
                label="填报时间">
              </el-table-column>
              <el-table-column
                prop="username"
                label="姓名"
                width="80">
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                width="110">
              </el-table-column>
              <el-table-column
                prop="hospitalName"
                label="社区名称"
                width="160">
              </el-table-column>
              <el-table-column
                prop="homeAddress"
                label="住址"
                width="160">
              </el-table-column>
              <el-table-column
                prop="demandTime"
                label="需求时间"
                width="140">
              </el-table-column>
            </el-table>
          </title-slot>
          <title-slot type="2" title="实时填报信息">
            <el-table
              size="mini"
              :data="tbtableData"
              style="width: 100%">
              <el-table-column
                prop="subTime"
                label="填报时间">
              </el-table-column>
              <el-table-column
                prop="hospitalName"
                label="所在社区"
                width="180">
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机号"
                width="110">
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
        <title-slot title="今日统计">
          <el-row :gutter="30">
            <el-col :span="12">
              <text-zl name="风险人数" :newNum="this.initNum.newIllnessNum" :value="this.initNum.illnessNum" />
            </el-col>
            <el-col :span="12">
              <text-zl name="低风险人数" :color="color_greed" :newNum="this.initNum.newSuspectedNum" :value="this.initNum.suspectedNum" />
            </el-col>
            <el-col :span="12">
              <text-zl name="中风险人数" :color="color_yellow" :newNum="this.initNum.newMildNum" :value="this.initNum.mildNum" />
            </el-col>
            <el-col :span="12">
              <text-zl name="高风险人数" :color="color_red" :newNum="this.initNum.newSevereNum" :value="this.initNum.severeNum" />
            </el-col>
          </el-row>
        </title-slot>
      </el-col>
    </el-row>
<!--    底排-->
    <el-row>
      <el-col :span="9">
        <title-slot title="重点社区">
          <div id="Community_suspected"/>
        </title-slot>
      </el-col>
      <el-col :span="9">
        <title-slot title="影响因素">
          <div id="Community_severe"/>
        </title-slot>
      </el-col>
      <el-col :span="6">
        <title-slot title="年龄分布">
          <div id="Community_health"/>
        </title-slot>
      </el-col>
      <!--      <el-col :span="6">-->
      <!--        <title-slot title="社区中风险排行">-->
      <!--          <div id="Community_mild"/>-->
      <!--        </title-slot>-->

      <!--      </el-col>-->
    </el-row>
  </div>

</template>

<script>
  import DataSet from '@antv/data-set';
  import { PointLayer, Popup, Scene} from '@antv/l7';
  import {Mapbox} from '@antv/l7-maps';
  import {registerShape,Chart} from '@antv/g2';

  export default {
    components:{
      TitleSlot:()=> import('../../component/title-slot'),
      TextZl: () => import('../../component/text-type-zl'),
      NumberGrow: () => import('../../component/number-grow')
    },
    mounted() {
      this.userType = this.$store.state.user.hospitalId
      if(this.userType === 1){
        this.cityVal = this.$store.state.user.hospitalName
      }
      this.getCharCity()
      this.init()
      this.getArea()

    },
    methods: {
      getArea() {
        this.$http({
          url: this.$http.adornUrl('/generator/webHospital/selectByArea'),
          method: 'get'
        }).then(({data}) => {
          this.area = data.list.filter(ls=> ls.area !== "武汉市" && ls.area !== "贵阳市")
        })
      },
      handleCommand(command) {
        this.cityVal = command
      },
      cityChange(val){
        this.getCharCity(true)
        // this.init(true)
      },
      fkMatter(val,item){
        console.log(val,item)
      },
      init(val = false) {
        // 发展曲线
        this.$http({
          url: this.$http.adornUrl('/generator/webUserRatingDay/progressCurve'),
          method: 'post'
        }).then(({data}) => {
          let datas = data.data.map(ls=>{
            return {date:ls.date, '低风险':ls.suspected,'中风险':ls.mild,'高风险':ls.severe}
          })

          const dv = new DataSet.View().source(datas);
          dv.transform({
            type: 'fold',
            fields: ['低风险', '中风险', '高风险'],
            key: 'type',
            value: 'value',
          });
          if(val){
            this.charts.ls1.changeData(dv.rows)
            return
          }
          const chart = this.charts.ls1 = new Chart({
            container: 'container_tu_2',
            autoFit: true,
            height: 250,
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
        // 社区前十名
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/ranking'),
          method: 'post'
        }).then(({data}) => {
          let datas = data.data.map(ls=>{
            return {低风险: ls.suspected, 中风险: ls.mild, 高风险: ls.severe, hospitalName: ls.hospitalName, illness: ls.illness}
          })
          // 重点社区
          const ds = new DataSet();
          const dv = ds.createView().source(datas);
          dv.transform({
            type: 'fold',
            fields: ['低风险', '中风险', '高风险'], // 展开字段集
            key: '状态', // key字段
            value: '患者总数', // value字段
            retains: ['hospitalName'], // 保留字段集，默认为除fields以外的所有字段
          });
          if(val){
            this.charts.ls2.changeData(dv.rows)
            return
          }
          const chart = this.charts.ls2 = new Chart({
            container: 'Community_suspected',
            autoFit: true,
            height: 300,
          });

          chart.coordinate().transpose();

          chart.data(dv.rows);

          chart.axis('hospitalName', {
            label: {
              offset: 12,
            },
          });

          chart.tooltip({
            shared: true,
            showMarkers: false,
          });

          chart
            .interval()
            .adjust('stack')
            .position('hospitalName*患者总数')
            .color('状态',[this.color_greed,this.color_yellow,this.color_red]);

          chart.interaction('active-region');

          chart.render();
        })
        // 获取人员分布饼状图接口
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/distribution'),
          method: 'get'
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
          const ds2 = new DataSet();
          const dv2 = ds2.createView();
          dv2.source(data1).transform({
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
          if(val){
            this.charts.ls3.changeData(dv.rows)
            this.charts.ls3_2.changeData(dv2.rows)
            return
          }
          console.log(dv.rows)
          const chart = this.charts.ls3 = new Chart({
            container: 'container_tu_3',
            autoFit: true,
            height: 250,
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


          const outterView = this.charts.ls3_2 = chart.createView();
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
        // 汇总数据接口
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/collect'),
          method: 'post'
        }).then(({data}) => {
          this.initNum = data.data
        })
        // 头部汇总数据
        this.$http({
          url: this.$http.adornUrl('/generator/webuser/pandect'),
          method: 'post'
        }).then(({data}) => {
          this.$nextTick(()=>{
            this.sbxx = data.data
            this.ssMsg()
          })


        })

        // 年龄分布接口
        this.$http({
          url: this.$http.adornUrl('/generator/patientBasicInfoManage/queryGeneration'),
          method: 'post',
          data: this.$http.adornData({
            'type': 1,
            'hospitalId': ""
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
          if(val){
            this.charts.ls4.changeData(userData)
            return
          }
          const chart = this.charts.ls4 = new Chart({
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
        // 流行病触发条件占比接口
        let syncB = this.$http({
          url: this.$http.adornUrl('/generator/patientBasicInfoManage/queryTriggeringConditions'),
          method: 'post'
        })
        // 临床症状总数占比
        let syncA = this.$http({
          url: this.$http.adornUrl('/generator/webUserRatingDay/symptom'),
          method: 'post'
        })
        Promise.all([syncA,syncB]).then(res => {
            let valueA = res[0].data.data
            let valueB = res[1].data.triggeringConditions
            let map = {
              travelOrReside:	"近期疫情严重地区旅行史或居住史",
              contactPatient:	"曾接触过疫情严重地区发热伴有呼吸道症状的患者",
              closeContact:	"曾与确诊患者近距离接触",
              multipleOnset:	"居住地或工作场所中有多人发病",
              crowded:	"曾去过人群密集场所并且发热或者呼吸困难",
              feverQuestion:	"出现健康问题日期距离填表日期大于等于5天并且发热",
            }
            let newValB = Object.keys(map).map(res=>{
              return {name:map[res],value:valueB[res]}
            })
          if(val){
            this.charts.ls5.changeData([...valueA,...newValB])
            return
          }
          const chart = this.charts.ls5 = new Chart({
            container: 'Community_severe',
            autoFit: true,
            height: 300,
          });

          chart.data([...valueA,...newValB]);
          chart.scale('value', {
            alias: '数量',
            nice: true,
          });
          chart.axis('name', false);
          chart.tooltip({
            showMarkers: false
          });
          chart.interaction('active-region');

          chart.interval().position('name*value');

          chart.render();

        })

      },
      // 实时信息获取
      ssMsg(){
        this.$http({
          url: this.$http.adornUrl('/generator/webCommunityHelp/constantly'),
          method: 'post'
        }).then(({data}) => {
          this.tbtableData2 = data.data.map(ls=>{
            Object.keys(ls).forEach(ts=>{
              ls[ts] = !!ls[ts] ? ls[ts] : ' — '
            })
            return ls
          })
        })

        this.$http({
          url: this.$http.adornUrl('/generator/webquestionnaire/constantly'),
          method: 'post'
        }).then(({data}) => {
          this.tbtableData = data.data
          let num =Math.round(Math.random()*10000+12000)
          setTimeout(()=>{
            this.ssMsg()
          },num)
        })

      },
      getCharCity(val = false) {
        this.mapLoading = true;

        let fd = new FormData()
        fd.append('area', this.cityVal)
        this.$http({
          url: this.$http.adornUrl('/generator/webHospital/mapData'),
          method: 'post',
          data: fd
        }).then(({data}) => {


          if(val){
            this.layer.setData(data['data'])
            this.scene.setZoomAndCenter(this.zoomVal[this.cityVal],this.cityGP[this.cityVal])
            this.mapLoading = false;
            return
          }
          let scene = this.scene = new Scene({
            id: 'map',
            map: new Mapbox({
              pitch: 48.62562,
              style: 'dark',
              center: this.cityGP[this.cityVal],
              zoom: this.zoomVal[this.cityVal],
              // maxZoom: 10,
              plugin: ['AMap.ToolBar']
            })
          });

          let pointLayer = this.layer = new PointLayer({})

                pointLayer.source(data['data'], {
                  parser: {
                    type: 'json',
                    x: 'locationInfomationLongitude',
                    y: 'locationInfomationDimension'
                  }
                })

                pointLayer.shape('circle')
                pointLayer.size('illness', [20, 40])
                pointLayer.active(true)
                pointLayer.color(['severe', 'mild'], (severe, mild) => {
                  let color = (severe > 0 && this.color_red) || (mild > 0 && this.color_yellow) || this.color_greed
                  return color
                })
                pointLayer.animate(true)
                pointLayer.style({
                  opacity: .6,
                });

                const popup = new Popup({
                  offsets: [0, 0],
                  closeButton: false
                })
                pointLayer.on('mousemove', e => {
                    popup.setLnglat(e.lngLat)
                    .setHTML(`
                      <h3>${e.feature.hospitalName}</h3>
                      <p>健康:${e.feature.health}</p>
                      <p>低风险:${e.feature.suspected}</p>
                      <p>中风险:${e.feature.mild}</p>
                      <p>高风险:${e.feature.severe}</p>

                    `);
                  // console.log('没有了',popup)
                  scene.addPopup(popup);
                });
                pointLayer.on('mouseout', e =>{
                  popup.close()
                })
          this.mapLoading = false;
          scene.addLayer(pointLayer);

        })
      },

    },
    data() {
      return {
        userType: 0,
        area:[],
        charts:{
          ls1:'',
          ls2:'',
          ls3:'',
          ls3_2:'',
          ls4:'',
          ls5:'',
        },
        tbtableData2:[],
        tbtableData:[],
        sbxx:{
          communityNum:0,
          userNum:0,
          questionnaireNum:0
        },
        initNum: {
          severeNum: '',
          userNum: '',
          suspectedNum: '',
          newIllnessNum: '',
          newMildNum: '',
          mildNum: '',
          newUserNum: '',
          illnessNum: '',
          newSevereNum: '',
          newSuspectedNum: '',
          communityNum: '',
        },
        cityGP: {意大利:[ 12.29, 41.54 ],美国:[ -116.24, 43.58 ],加拿大:[ -107.99, 60.28],英国:[ -4, 52.38 ],法国:[ 1.24357, 44.58264 ],德国:[ 10.054293, 49.24],
        伊朗:[ 54.054293, 30.24],日本:[ 135.054293, 36],韩国:[ 127.554293, 35.5],新西兰:[ 177.41803, -39.03517]},
        zoomVal: {意大利:4,美国:2,英国:6.4,法国:6.5,德国:5.056,伊朗:5.056,日本:5.056,韩国:7.056,加拿大:2.5,新西兰:4.056},
        mapLoading: false,
        community_w: 130,
        color_red:'#E86452',
        color_yellow:'#F6BD16',
        color_greed:'#5CCEA1',
        layer:{},
        scene:{}
      }
    },
    computed:{
      cityVal:{
        get(){
          return this.$store.state.user.city
        },
        set(val) {
          this.$store.commit('user/updateCity', val)
        }
      },
    },
    watch:{
      cityVal:function(old,nld){
        this.cityChange()
      }
    }
  }
</script>
<style>
  #home_admin .el-table__body-wrapper{
    background: #0a1e39;
  }
  #home_admin .map_area_dropdown{
    position: absolute;
    z-index: 300;
    left: 30px;
    top: 10px;
    font-size: 22px;
  }
  #home_admin .map_area_dropdown .el-dropdown{
    font-size: 21px;
    color: white;
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

</style>
