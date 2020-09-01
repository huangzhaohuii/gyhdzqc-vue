<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="form" :rules="rules" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="时间" prop="timeSide">
         <el-date-picker 
            v-model="queryParams.timeSide"
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

    <el-table border v-loading="loading" :data="tableData" :span-method="objectSpanMethod">
      <el-table-column label="时间" align="center" prop="planTime" width="200px"/>
      <el-table-column label="责任人" align="center" prop="createName" />
      <el-table-column label="总数量" align="center" prop="totalCount" />
      <el-table-column label="完成情况" align="center" prop="completionName" />
      <el-table-column label="对应数量" align="center" prop="count" />
      <el-table-column label="百分比" align="center" prop="percent" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getLaterList"
    />
  </div>
</template>

<script>
import { listTasks, getTasks, delTasks, addTasks, updateTasks, completeTasks ,exportTasks, analysis } from "@/api/work/tasks";

export default {
  name: "Tasks",
  data() {
    return {
      // 遮罩层
      loading: false,
      isAbled: false,
      //
      manageDisabled : true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      tasksList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      manageParam: '',
      // 查询参数
      queryParams: {
        timeSide: null
      },
      // 表单参数
      form: {
        manageType: null
      },
      // 表单校验
      rules: {
        timeSide: [
          { required: true, message: "查询时间不能为空", trigger: "blur" }
        ],
      },
      spanArr: [],//二维数组，用于存放单元格合并规则
      tableData: [],
    };
  },
  created() {
    this.getCurrentMonthFirst()
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      if(!(this.queryParams.timeSide == undefined || this.queryParams.timeSide.length <= 0)){
        this.queryParams.timeBegin = this.queryParams.timeSide[0]
        this.queryParams.timeEnd = this.queryParams.timeSide[1]
      }
      analysis(this.queryParams).then(response => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
        this.rowspan(0,'time');
        this.rowspan(1,'createName');
        this.rowspan(2,'totalCount');
      });
    },
    /** 查询列表 */
    getLaterList() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            this.getList();
          }
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getLaterList();
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTasks(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
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
      var now = date.getFullYear() + "-" + (date.getMonth() +1 ) + "-" + (date.getDate())
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10)  month = '0' + month
      if (day < 10)  day = '0' + day
      var first = date.getFullYear() + '-' + month + '-' + day
      this.queryParams.timeSide = [first,now]
    },
  },  
  };
</script>
