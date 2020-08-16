<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="管理类型" prop="manageType">
        <el-select v-model="queryParams.manageType" placeholder="请选择管理类型" clearable size="small">
          <el-option
              v-for="dict in deptOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="工作板块" prop="workSection">
        <el-select v-model="queryParams.workSection" placeholder="请选择工作板块" clearable  size="small" @change="getQueryDict">
            <el-option
              v-for="dict in businessOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
      </el-form-item>
      <el-form-item label="工作线条" prop="workLine">
        <el-select v-model="queryParams.workLine" placeholder="请选择工作线条" clearable size="small">
          <el-option
            v-for="dict in lineOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务标题" prop="workTitle">
        <el-input
          v-model="queryParams.workTitle"
          placeholder="请输入工作任务标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成情况" prop="completion">
        <el-select v-model="queryParams.completion" placeholder="请选择完成情况" clearable size="small">
          <el-option
            v-for="dict in completionOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度" prop="importance">
        <el-select v-model="queryParams.importance" placeholder="请选择重要程度" clearable size="small">
          <el-option
            v-for="dict in importOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="timeBegin">
        <el-date-picker 
            v-model="queryParams.timeBegin"
            type="date"
            placeholder="请选择开始时间" value-format="yyyy-MM-dd" size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="timeEnd">
        <el-date-picker 
            v-model="queryParams.timeEnd"
            type="date"
            placeholder="请选择结束时间" value-format="yyyy-MM-dd" size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="责任人" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入工作责任人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:tasks:export']"
        >导出</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="tasksList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
      <el-table-column label="负责人" align="center" prop="createByName" />
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleInfo(scope.row)"
            v-hasPermi="['system:tasks:query']"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :disabled="isAbled" label-width="80px">
        <el-row>
          <el-col :span="8">
          <el-form-item label="工作板块" prop="workSection">
            <el-select v-model="form.workSection" placeholder="请选择工作板块" clearable  size="small" @change="getFormDict">
              <el-option
                v-for="dict in businessOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作线条" prop="workLine">
            <el-select v-model="form.workLine" placeholder="请选择工作线条" clearable size="small">
              <el-option
                v-for="dict in lineOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重要程度" prop="importance">
            <el-select v-model="form.importance" placeholder="请选择重要程度" clearable size="small">
              <el-option
                v-for="dict in importOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="计划时间" prop="planTime"> 
            <el-date-picker 
            v-model="form.planTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item> 
        <el-form-item label="任务标题" prop="workTitle">
          <el-input v-model="form.workTitle" placeholder="请输入工作任务标题" />
        </el-form-item>
        <el-form-item label="任务详情" prop="workTasks">
          <el-input v-model="form.workTasks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="完成情况" prop="completion" v-if="this.title == '工作计划详情' && form.completeTime != null">
          <el-select v-model="form.completion" placeholder="请选择完成情况" clearable size="small">
            <el-option
              v-for="dict in completionOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间" prop="completeTime" v-if="this.title == '工作计划详情' && form.completeTime != null">
          <el-input v-model="form.completeTime" placeholder="请输入完成时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .el-table .one-row{
    background: oldlace
  }
  .el-table .two-row{
    background:mistyrose
    /* palegoldenrod */
  }
  .el-table .three-row{
    background:powderblue
    /* palegoldenrod */
  }
  /* .el.table .three-row{
    background:
  } */
</style>

<script>
import { listTasks, getTasks, delTasks, addTasks, updateTasks, completeTasks ,exportTasks } from "@/api/work/tasks";

export default {
  name: "Tasks",
  data() {
    return {
      // 遮罩层
      loading: true,
      isAbled: false,
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
      //部门数据字典
      deptOptions: [],
      // 状态数据字典
      completionOptions: [],
      // 状态数据字典
      importOptions: [],
      // 工作板块数据字典
      businessOptions: [],
      // 工作线条数据字典
      lineOptions: [],
      manageParam: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        manageType: null,
        workSection: null,
        workLine: null,
        workTasks: null,
        workTitle: null,
        completion: null,
        importance: null,
        timeBegin: null,
        timeEnd: null,
        createName: null
      },
      // 表单参数
      form: {
        manageType: null
      },
      // 表单校验
      rules: {
        workSection: [
          { required: true, message: "工作板块不能为空", trigger: "blur" }
        ],
        workTitle: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        workTasks: [
          { required: true, message: "任务内容不能为空", trigger: "blur" }
        ],
        planTime: [
          { required: true, message: "计划时间不能为空", trigger: "blur" }
        ],
        importance: [
          { required: true, message: "重要程度不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //获取部门数据字典
    this.getDicts("00").then(response => {
      this.deptOptions = response.data;
    });
    this.getList();
    this.getDicts("0007").then(response => {
      this.completionOptions = response.data;
    });
    this.getDicts(this.queryParams.manageType).then(response => {
      this.businessOptions = response.data;
    });
    this.getDicts("0008").then(response => {
      this.importOptions = response.data;
    });
    
    
  },
  methods: {
    tableRowClassName({row,rowIndex}){
      console.log()
        if(row.completion == '000701'){
          return 'three-row';
        }else if(row.completion == '000702'){
          return 'one-row';
        }else if(row.completion == '000703'){
          return 'two-row';
        }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listTasks(this.queryParams).then(response => {
        this.tasksList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        manageType: this.queryParams.manageType,
        workSection: null,
        workLine: null,
        createBy: null,
        workTasks: null,
        workTitle: null,
        completion: '000702',
        importance: null,
        timeBegin: null,
        timeEnd: null,
        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm() {
      this.form.timeBegin = this.form.planTime[0]
      this.form.timeEnd = this.form.planTime[1]
      this.form.manageType = '0003'
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTasks(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTasks(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTasks(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
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
          this.getList();
          this.msgSuccess("确认成功");
        }).catch(function() {});
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
    getFormDict(){
      this.getDicts(this.form.workSection).then(response => {
      this.lineOptions = response.data;
    });
    },
    getQueryDict(){
      if(this.queryParams.workSection){
        this.getDicts(this.queryParams.workSection).then(response => {
          this.lineOptions = response.data;
         });
      }
    }
  }
};
</script>
