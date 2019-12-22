<template>
  <div name='missionList' class="fillcontain">
    <div class="search">
      <div class="school">
        <span class="label">学校:</span>
        <a-select :value="school" :defaultValue="schoolList[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('school', val)">
          <a-select-option v-for="option in schoolList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="grade">
        <span class="label">年级:</span>
        <a-select :value="grade" :defaultValue="gradeList[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('grade', val)">
          <a-select-option v-for="option in gradeList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="className">
        <span class="label">班级:</span>
        <a-select :value="classId" :defaultValue="classesList[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('classId', val)">
          <a-select-option v-for="option in classesList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="subject">
        <span class="label">学科:</span>
        <a-select :value="subjectId" :defaultValue="subjectList[0]" style="flex: 120px 0 0; overflow: hidden"  @change="(val) => changeFilter('subjectId', val)">
          <a-select-option v-for="option in subjectList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="teacher">
        <span class="label">布置教师:</span>
        <a-input v-model="teacherInfo" class="input" placeholder="请输入教师名称"/>
      </div>
      <a-button type="primary" class="check" @click="check">查询</a-button>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="id" :pagination="false" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a-popconfirm v-show="record.status != 2" placement="topRight" title="你确定要删除该作业?" @confirm="deleteTask(record.id)" >
            <a style="text-decoration: underline; color: #E98469;">删除</a>
          </a-popconfirm>
          <p v-show="record.status == 2" style="color: #999; margin: 0">已删除</p>
        </div>
      </template>
    </a-table>
    <a-pagination
      :style="{flex: '100px 0 0', paddingTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flexStart'}"
      :pageSizeOptions="pageSizeOptions"
      :total="count"
      :showTotal="total => `共 ${total} 条记录`"
      showSizeChanger
      :defaultPageSize="10"
      v-model="currentPage"
      showQuickJumper
      @change="changePage"
      @showSizeChange="onShowSizeChange">
    </a-pagination>
  </div>
</template>

<script type='text/babel'>
  import {workList, deleteWork} from '@/api/works';
  import format from '@/tools/format';
  import {classesList} from '@/api/baseData';
  export default {
    name: 'missionList',
    data () {
      return {
        teacherInfo: '',
        school: '', // 学校
        grade: '', // 年级
        classId: '', // 班级
        classesList: [{id: '', name: '全部'}], // 班级列表
        subjectId: '', // 学科id
        subject: '', // 学科
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '作业名称', dataIndex: 'detailName', width: '18.7%'},
          {className: 'tablePadding', title: '布置教师', dataIndex: 'teacher', width: '19%'},
          {className: 'tablePadding', title: '学校', dataIndex: 'schoolName', width: '10%'},
          {className: 'tablePadding', title: '班级', dataIndex: 'className', width: '10%'},
          {className: 'tablePadding', title: '学科', dataIndex: 'subject', width: '8%'},
          {className: 'tablePadding', title: '布置时间', dataIndex: 'assignTime', width: '14.6%'},
          {className: 'tablePadding', title: '操作', dataIndex: 'deal', width: '12.7%', scopedSlots: { customRender: 'operation' }}
        ],
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        getListTimer: 0
      };
    },
    created () {
      this.getList();
    },
    computed: {
      schoolList () {
        return [{id: '', name: '全部'}, ...this.$store.getters.schoolList];
      },
      gradeList () {
        return [{id: '', name: '全部'}, ...this.$store.getters.gradeList];
      },
      subjectList () {
        return [...this.$store.getters.subjectList];
      }
    },
    activated () {
      this.getList();
    },
    methods: {
      changeFilter (type, val) {
        this[type] = val;
        if (type == 'school' || type == 'grade') { // 选择学校年级，班级联动
          if (this.school && this.grade) {
            classesList(this.school, this.grade).then(res => {
              let data = res.data;
              if (data.code == 0) {
                let reData = data.data;
                this.classesList.splice(1, this.classesList.length); // 保留全部选项
                this.classesList.push(...reData);
              } else {
                this.$message.error(data.msg);
              }
            }).catch((err) => {
              this.$message.error(err);
            });
          } else {
            this.classesList.splice(1, this.classesList.length); // 保留'全部'选项
            this.classId = ''; // 清空已选择的班级id
          }
        }
        if (type == 'subjectId') {
          this.subjectList.forEach(item => {
            item.id == val && (this.subject = item.name);
          });
        }
        this.check();
      },
      getList () {
        if (this.getListTimer) return;
        workList({
          limit: this.limit,
          skip: this.skip,
          teacherInfo: this.teacherInfo,
          queryDelete: true,
          classId: this.classId,
          gradeId: this.grade,
          schoolId: this.school,
          subject: this.subject
        }).then(res => {
          let data = res.data;
          this.count = data.total;
          if (data.code == 0) {
            this.tableData = data.data.map((item) => {
              let time = format(new Date(item.assignTime), 'MM月DD日 HH:mm');
              if (time[0] == 0) {
                time = time.substr(1);
              }
              item.assignTime = time;
              item.detailName = time.split(' ')[0] + item.name;
              item.teacher = item.assignTeacherName + (item.assignTeacherMobile ? '(' + item.assignTeacherMobile + ')' : '');
              return item;
            });
          }
        });
        this.getListTimer = setTimeout(() => {
          this.getListTimer = null;
        }, 500);
      },
      check () {
        this.skip = 0;
        this.currentPage = 1;
        this.getList();
      },
      deleteTask (workId) {
        deleteWork(workId).then((res) => {
          if (res.data.code == 0) {
            this.$message.warn('作业删除');
            this.getList();
          }
        });
      },
      onShowSizeChange (current, pageSize) {
        this.currentPage = current;
        this.limit = pageSize;
        this.skip = (current - 1) * this.limit;
        this.getList();
      },
      changePage (current) {
        this.currentPage = current;
        this.skip = (current - 1) * this.limit;
        this.getList();
      }
    }
  };
</script>
<style>
  th.tablePadding,
  td.tablePadding {
    padding-left: 30px !important;
  }
</style>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'missionList']{
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .search{
      flex: 60px 0 0;
      padding: 0 30px 0 30px;
      .fj(flex-start);
      .school, .grade, .className, .subject{
        flex: 180px 0 0;
        .fj();
        .label{
          flex: 1;
          text-align: right;
          margin-right: 10px;
        }
        .ant-select{
          flex: 1.2rem 0 0;
        }
      }
      .teacher{
        margin-left: 10px;
        width: 246px;
        .input{
          width: 176px;
        }
      }
      .service{
        margin-left: 30px;
        width: 196px;
        .input{
          width: 126px;
        }
      }
      .teacher, .service{
        .fj(flex-start);
        .label{
          width: 70px;
        }
      }
      .check{
        margin-left: 30px;
      }
    }
  }
</style>
