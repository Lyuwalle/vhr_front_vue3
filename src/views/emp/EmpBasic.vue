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
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
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
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form :model="emp" :rules="rules" ref="empForm">
          <el-row>
            <el-col :span="6">
              <!--                prop是为了数据校验用的-->
              <el-form-item label="姓名:" prop="name">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name"
                          placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini" style="width: 200px;">
                  <el-option
                      v-for="item in politicStatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input size="mini" style="width: 120px" prefix-icon="el-icon-edit"
                          v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                          v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address">
                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                          v-model="emp.address" placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in jobLevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                    placement="right"
                    title="请选择部门"
                    width="200"
                    trigger="manual"
                    v-model="popVisible">
                  <el-tree default-expand-all @node-click="handleNodeClick" :data="allDeps" :props="defaultProps"></el-tree>
                  <div slot="reference"
                       style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px"
                       @click="showDepView2">{{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                          v-model="emp.phone" placeholder="电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workId">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.workId" placeholder="工号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini"
                           style="width: 150px;">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                          v-model="emp.school" placeholder="毕业院校名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                          v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px;"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px;"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px;"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同终止日期:" prop="endContract">
                <el-date-picker
                    v-model="emp.endContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="合同终止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                          v-model="emp.idCard" placeholder="请输入身份证号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!--          doAddEmp有两个作用，一是编辑，二是添加，在doAddEmp做一下判断即可-->
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>

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
      emp: {
        name: "lyuwalle",
        gender: "男",
        birthday: "1996-12-31",
        idCard: "610122199612311256",
        wedlock: "未婚",
        nationId: 1,
        nativePlace: "安徽",
        politicId: 13,
        email: "2538207459@qq.com",
        phone: "18565558897",
        address: "上海市杨浦区",
        departmentId: null,
        jobLevelId: 9,
        posId: 29,
        engageForm: "劳务合同",
        tiptopDegree: "本科",
        specialty: "信息管理与信息系统",
        school: "斯坦福大学",
        beginDate: "2021-12-31",
        workState: "在职",
        workId: "00000057",
        contractTerm: 2,
        conversionTime: "2018-03-31",
        notworkDate: null,
        beginContract: "2021-12-31",
        endContract: "2030-12-31",
        workAge: null
      },
      loading : false,
      allDeps : [],
      jobLevels : [],
      positions : [],
      nations : [],
      politicStatus : [],
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      keyword: '',
      inputDepName: '所属部门',
      showAdvanceSearchView: false,
      dialogVisible: false,
      popVisible: false,
      popVisible2: false,
      title:'',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules : {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
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
  },
  methods: {
    initEmps(type) {
      this.loading = true;
      let url = '/employee/basic/allEmp/?page=' + this.page + '&pageSize=' + this.pageSize;
      /*高级搜索*/
      if (type && type == 'advanced') {

      } else {
        url += "&name=" + this.keyword;
      }
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
      /*政治面貌*/
      if (!window.sessionStorage.getItem("politicStatus")) {
        getRequest('/employee/basic/politicsStatuses').then(resp => {
          if (resp) {
            this.politicStatus = resp;
            window.sessionStorage.setItem("politicStatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicStatus = JSON.parse(window.sessionStorage.getItem("politicStatus"));
      }
    },
    showAddEmpView() {
      this.emptyEmp();
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    emptyEmp() {
      this.emp = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: 1,
        nativePlace: "",
        politicId: "",
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: 9,
        posId: 29,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workId: "",
        contractTerm: 2,
        conversionTime: "",
        notworkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null
      },
          this.inputDepName = '';
    },
    getMaxWordID() {
      getRequest("/employee/basic/maxEmpId").then(resp => {
        if (resp) {
          this.emp.workId = resp.object;
        }
      })
    },
    doAddEmp() {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            /*由于编辑和添加员工是同一个页面，因此当emp有id时是更新员工信息，否则就是添加员工信息。*/
            this.putRequest("/employee/basic/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.postRequest("/employee/basic/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      }
    },
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.popVisible = !this.popVisible
    },
    showDepView2() {
      this.popVisible2 = !this.popVisible2
    },
  }
}
</script>

<style scoped>

</style>