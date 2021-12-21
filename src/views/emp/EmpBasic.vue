<template>
<!--  这个div下面有三个div块，第一个是表格上面的搜索添加等按钮，第二个div是高级搜索，第三个div是表格-->
<div>
  <div>
<!--    搜索框，导入，导出，添加员工按钮-->
<!--    space-between表示下面的两个div标签在同一行-->
    <div style="display: flex; justify-content: space-between">
      <div>
        <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                  clearable
                  @clear="initEmps"
                  style="width: 350px;margin-right: 10px;margin-top: 10px"
                  v-model="keyword"
                  :disabled="showAdvanceSearchView"
                  @keydown.enter.native="initEmps">
        </el-input>
        <el-button icon="el-icon-search" type="primary" @click="initEmps" >搜索</el-button>
        <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
          <i :class="showAdvanceSearchView ? 'fa fa-angle-double-up':'fa fa-angle-double-down'"
             aria-hidden="true"></i>
          高级搜索
        </el-button>
      </div>
      <div style="margin-top: 10px">
        <el-upload
            :show-file-list="false"
            style="display: inline-flex; margin-right: 8px"
            action="/employee/basic/import">
          <el-button  type="success" >
            批量导入
          </el-button>
        </el-upload>
        <el-button type="success" icon="el-icon-download">
          导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus">
          添加员工
        </el-button>
      </div>
    </div>
  </div>
  <div></div>
<!--  表格+分页栏+编辑对话框-->
  <div style="margin-top: 10px">
<!--    表格-->
    <el-table
        :data="emps"
        stripe
        border
        v-loading="loading"
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%"
        >
<!--      选择框-->
      <el-table-column type="selection" width="55"></el-table-column>
<!--      各个列-->
      <el-table-column prop="name" label="姓名" fixed align="left" width="100"></el-table-column>
      <el-table-column prop="workId" label="工号" align="left" width="90"></el-table-column>
      <el-table-column prop="gender" label="性别" align="left" width="85"></el-table-column>
      <el-table-column prop="birthday" label="生日" align="left" width="105"></el-table-column>
      <el-table-column prop="idCard" label="身份证号码" align="left" width="165"></el-table-column>
      <el-table-column prop="wedlock" label="婚姻情况" width="100"></el-table-column>
      <el-table-column prop="nation.name" label="民族" width="50"></el-table-column>
      <el-table-column prop="nativePlace" label="籍贯" width="80"></el-table-column>
      <el-table-column prop="politicStatus.name" label="政治面貌" ></el-table-column>
      <el-table-column prop="email" label="电子邮件" align="left" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话号码" align="left" width="115"></el-table-column>
      <el-table-column prop="address" label="地址"  align="left" width="220"></el-table-column>
      <el-table-column prop="department.name" label="部门" align="left" width="100"></el-table-column>
      <el-table-column prop="position.name" label="职位" width="100"></el-table-column>
      <el-table-column prop="jobLevel.name" label="职称" width="100"></el-table-column>
      <el-table-column prop="engageForm" label="聘用形式" align="left" width="100"></el-table-column>
      <el-table-column prop="tiptopDegree" label="最高学历" align="left" width="80"></el-table-column>
      <el-table-column prop="specialty" label="专业" align="left" width="150"></el-table-column>
      <el-table-column prop="school" label="毕业学校" align="left" width="150"></el-table-column>
      <el-table-column prop="beginDate" label="入职日期" align="left" width="105"></el-table-column>
      <el-table-column prop="conversionTime" label="转正日期" align="left" width="105"></el-table-column>
      <el-table-column prop="beginContract" label="合同开始日期" align="left" width="110"></el-table-column>
      <el-table-column prop="endContract" label="合同截止日期" align="left" width="110"></el-table-column>
      <el-table-column label="合同期限" align="left" width="100">
        <template slot-scope="scope">
          <el-tag>{{scope.row.contractTerm}}</el-tag>年
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100"></el-table-column>

    </el-table>
<!--    分页栏-->
    <div style="display: flex; justify-content: flex-end">
      <!--        @current-change表示page改变时会触发-->
      <!--        @size-change表示pageSize改变时会触发-->
      <el-pagination
          background
          @current-change="pageChange"
          @size-change="pageSizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total" >
      </el-pagination>
    </div>
<!--    编辑对话框-->
    <el-dialog>

    </el-dialog>
  </div>
</div>
</template>

<script>
import {getRequest} from "@/utils/api";
export default {
  name: "EmpBasic",
  data() {
    return {
      page : 1,
      pageSize : 10,
      total : 0,

      emps : [],
      loading : false,
      allDeps : [],
      jobLevels : [],
      positions : [],
      nations : [],
      politicStatus : [],
      tipTopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      keyword: '',
      showAdvanceSearchView: false,
      rules : {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        wedLock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入您组', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workId: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
        notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
        workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
      }

    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
    initEmps: function (type) {
      this.loading = true;
      let url = '/employee/basic/allEmp/?page=' + this.page + '&pageSize=' + this.pageSize;
      getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          /*records和total是后端返回的数据*/
          /*赋值的时候，emps里面的属性和表格里面的字段的属性相同的时候才会赋值成功*/
          this.emps = resp.records;
          this.total = resp.total;
        }
      })
    },
    pageSizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initEmps();
    },
    //todo 要加高级搜索标识？
    pageChange(currentPage) {
      this.page = currentPage;
      this.initEmps();
    },
    initPositions() {
      getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    initData() {
      /*初始化之后就把nations，jobLevels，politicsStatus，deps保存在window.sessionStorage里面（缓存），下次不用再次请求 */
      /*民族*/
      if (!window.sessionStorage.getItem("nations")) {
        getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      /*职称*/
      if (!window.sessionStorage.getItem("jobLevels")) {
        getRequest('/employee/basic/jobLevels').then(resp => {
          if (resp) {
            this.jobLevels = resp;
            window.sessionStorage.setItem("jobLevels", JSON.stringify(resp));
          }
        })
      } else {
        this.jobLevels = JSON.parse(window.sessionStorage.getItem("jobLevels"));
      }
      /*部门*/
      if (!window.sessionStorage.getItem("deps")) {
        getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
      /*职位*/
      if (!window.sessionStorage.getItem("positions")) {
        getRequest('/employee/basic/positions').then(resp => {
          if (resp) {
            this.positions = resp;
            window.sessionStorage.setItem("positions", JSON.stringify(resp));
          }
        })
      } else {
        this.positions = JSON.parse(window.sessionStorage.getItem("positions"));
      }
    }
  }
}
</script>

<style scoped>

</style>