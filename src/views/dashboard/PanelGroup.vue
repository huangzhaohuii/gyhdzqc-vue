<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane name="first">
    <span slot="label"><i class="el-icon-date"></i>未完成</span> 
         <el-table :data="tasksList">
            <el-table-column label="管理类型" align="center" prop="manageTypeName" />
            <el-table-column label="工作板块" align="center" prop="workSectionName" />
            <el-table-column label="任务标题" align="center" prop="workTitle" />
            <el-table-column label="工作内容" align="center" prop="workTasks" :show-overflow-tooltip="true" />
            <el-table-column label="完成情况" align="center" prop="completionName" />
            <el-table-column label="重要程度" align="center" prop="importanceName" />
            <el-table-column label="开始时间" align="center" prop="timeBegin" />
            <el-table-column label="结束时间" align="center" prop="timeEnd" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleInfo(scope.row)"
                  v-hasPermi="['system:tasks:query']"
                >详情</el-button> -->
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-circle-check"
                  @click="handleComplete(scope.row)"
                >确认完成</el-button>
              </template>
            </el-table-column>
          </el-table>  
      </el-tab-pane>
    <el-tab-pane label="已完成" name="second">
        <el-table :data="tasksList">
          <el-table-column label="管理类型" align="center" prop="manageTypeName" />
          <el-table-column label="工作板块" align="center" prop="workSectionName" />
          <el-table-column label="任务标题" align="center" prop="workTitle" />
          <el-table-column label="工作内容" align="center" prop="workTasks" :show-overflow-tooltip="true" />
          <el-table-column label="完成情况" align="center" prop="completionName" />
          <el-table-column label="重要程度" align="center" prop="importanceName" />
          <el-table-column label="开始时间" align="center" prop="timeBegin" />
          <el-table-column label="结束时间" align="center" prop="timeEnd" />
          <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleInfo(scope.row)"
                v-hasPermi="['system:tasks:query']"
              >详情</el-button>
            </template>
          </el-table-column> -->
        </el-table> 
        <!-- <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
    </el-tab-pane>
    <el-tab-pane label="超时完成" name="third">
        <el-table :data="tasksList">
          <el-table-column label="管理类型" align="center" prop="manageTypeName" />
          <el-table-column label="工作板块" align="center" prop="workSectionName" />
          <el-table-column label="任务标题" align="center" prop="workTitle" />
          <el-table-column label="工作内容" align="center" prop="workTasks" :show-overflow-tooltip="true" />
          <el-table-column label="完成情况" align="center" prop="completionName" />
          <el-table-column label="重要程度" align="center" prop="importanceName" />
          <el-table-column label="开始时间" align="center" prop="timeBegin" />
          <el-table-column label="结束时间" align="center" prop="timeEnd" />
          <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleInfo(scope.row)"
                v-hasPermi="['system:tasks:query']"
              >详情</el-button>
            </template>
          </el-table-column> -->
        </el-table> 
    </el-tab-pane>
    <el-tab-pane label="数据统计" name="fourth">
      <el-form :model="analysisParams" ref="queryForm" :rules="rules" :inline="true" label-width="68px">
        <el-form-item label="时间" prop="timeSide">
          <el-date-picker 
              v-model="analysisParams.timeSide"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="tableData" :span-method="objectSpanMethod">
        <el-table-column label="时间" align="center" prop="planTime" width="200px"/>
        <el-table-column label="责任人" align="center" prop="createName" />
        <el-table-column label="总数量" align="center" prop="totalCount" />
        <el-table-column label="完成情况" align="center" prop="completionName" />
        <el-table-column label="对应数量" align="center" prop="count" />
        <el-table-column label="百分比" align="center" prop="percent" />
      </el-table>
    </el-tab-pane>
  </el-tabs> 
</template>
<script>
  import { listTasks, getTasks, delTasks, addTasks, updateTasks, completeTasks ,exportTasks,analysis } from "@/api/work/tasks";

  export default {
    data() {
      return {
        loading: true,
        tableData:[],
        //二维数组，用于存放单元格合并规则
        spanArr: [],
        // 总条数
        total: 0,
         // 表格数据
        tasksList: [],
        activeName: 'first',
        createBy: '',
        role: [],
        queryParams: {
          pageNum: 1,
          pageSize: 1000,
          manageType: null,
          workSection: null,
          workLine: null,
          workTasks: null,
          workTitle: null,
          completion: null,
          importance: null,
          timeBegin: null,
          timeEnd: null,
        },
        analysisParams: {
          timeSide: null
        },
        rules: {
        timeSide: [
          { required: true, message: "查询时间不能为空", trigger: "blur" }
        ],
      },
      };
    },
    created(){
      this.createBy = this.$store.state.user.name
      this.role = this.$store.state.user.roles
      this.getList('000702');
      this.getCurrentMonthFirst();
      var deptId = this.$store.state.user.userAll.deptId;
      if(deptId == '200'){
        //商务部门
        this.queryParams.manageType = '0003'
      }else if(deptId == '201'){
        //技术部门
        this.queryParams.manageType = '0001'
      }else if(deptId == '202'){
        //设计部门
        this.queryParams.manageType = '0002'
      }else if(deptId == '203'){
        //生产部门
        this.queryParams.manageType = '0004'
      }else if(deptId == '204'){
        //安全部门
        this.queryParams.manageType = '0005'
      }else{
        this.queryParams.manageType = null
      }
    },
    methods: {
      handleClick(data) {
        let name = data.name
        if(name == 'first'){
          this.getList('000702');
        }else if(name == 'second'){
          this.getList('000701');
        }else if(name == 'third'){
          this.getList('000703');
        }else if(name == 'fourth'){
          this.getAnalysis();
        }
      },
      /** 查询列表 */
    getList(status) {
      if(!this.role.includes('xmgl') && !this.role.includes('admin') && !this.role.includes('gjg')){
        this.queryParams.createBy = this.createBy
      }
      this.queryParams.completion = status;
      listTasks(this.queryParams).then(response => {
        this.tasksList = response.rows;
        this.total = response.total;
      });
    },
    /** 查看详情 */
    handleInfo(row) {
      this.reset();
      this.isAbled = true
      const id = row.id || this.ids
      getTasks(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.form.planTime = [response.data.timeBegin,response.data.timeEnd]
        this.title = "工作计划详情";
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getAnalysis();
    },
    getAnalysis() {
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          var name = this.$store.state.user.userAll.nickName;
          this.loading = true;
          if(!this.role.includes('xmgl') && !this.role.includes('admin') && !this.role.includes('gjg')){
            this.analysisParams.createName = name
          }
          if(!(this.analysisParams.timeSide == undefined || this.analysisParams.timeSide.length <= 0)){
            this.analysisParams.timeBegin = this.analysisParams.timeSide[0]
            this.analysisParams.timeEnd = this.analysisParams.timeSide[1]
          }
          analysis(this.analysisParams).then(response => {
            this.tableData = response.rows;
            this.total = response.total;
            this.loading = false;
            // this.rowspan(0,'id');
            this.rowspan(0,'time');
            this.rowspan(1,'createName');
            this.rowspan(2,'totalCount');
          });
        }
      });
      
    },
    rowspan(idx, prop) {
        this.spanArr[idx] = [];
        this.position = 0; 
        if(idx == 2){
          this.spanArr[idx] = this.spanArr[idx-1]
        }else{
          this.tableData.forEach((item,index) => {
            if( index === 0){
              this.spanArr[idx].push(1);
              this.position = 0;
            }else{
              if(this.tableData[index][prop] === this.tableData[index-1][prop] ){
                this.spanArr[idx][this.position] += 1;//有相同项
                this.spanArr[idx].push(0); // 名称相同后往数组里面加一项0
              }else{
                this.spanArr[idx].push(1);//同列的前后两行单元格不相同
                this.position = index;
              }
            }
          })
        }
      },
      //表格单元格合并
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        for(let i = 0; i < 3; i++) {
          if(columnIndex === i){
            const _row = this.spanArr[i][rowIndex];
            const _col = _row> 0 ? 1 : 0;
            // console.log('第'+rowIndex+'行','第'+i+'列','rowspan:'+_row,'colspan:'+_col)
            return {
              rowspan: _row,
              colspan: _col
            }
          }
        }
        },
      getCurrentMonthFirst () {
        var date = new Date()
        var now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate())
        date.setDate(1)
        var month = parseInt(date.getMonth() + 1)
        var day = date.getDate()
        if (month < 10)  month = '0' + month
        if (day < 10)  day = '0' + day
        var first = date.getFullYear() + '-' + month + '-' + day
        this.analysisParams.timeSide = [first,now]
    },
    //处理已完成
    handleComplete(row) {
      const ids = row.id || this.ids;
      this.$confirm('确认完成工作计划?', "确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return completeTasks({
            'id': ids,
            'timeBegin' : row.timeBegin,
            'timeEnd' : row.timeEnd
          });
        }).then(() => {
          this.getList('000702');
          this.msgSuccess("确认成功");
        }).catch(function() {});
      },
    }
  };
</script>