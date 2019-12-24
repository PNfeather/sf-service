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
      <div class="status">
        <span class="label">状态:</span>
        <a-select :value="status" :defaultValue="statusOptions[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('status', val)">
          <a-select-option v-for="option in statusOptions" :key="option.label">{{option.value}}</a-select-option>
        </a-select>
      </div>
      <div class="service">
        <span class="label">操作客服:</span>
        <a-select :value="serviceId" :defaultValue="serviceList[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('serviceId', val)">
          <a-select-option v-for="option in serviceList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="id" :pagination="false" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a style="text-decoration: underline" @click="() => handleTask(record.id)" v-show="record.workStatus != 2 && record.workStatus != 3">制作</a>
          <a style="text-decoration: underline" @click="() => checkTask(record)" v-show="record.workStatus == 2 || record.workStatus == 3">查看</a>
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
  import {taskList, getWork} from '@/api/works';
  import format from '@/tools/format';
  import {classesList} from '@/api/baseData';
  export default {
    name: 'missionList',
    data () {
      return {
        serviceId: '',
        status: '', // 任务状态(0:等待模板 1:模板制作中 2: 模板已完成 '':全部)
        school: '', // 学校
        grade: '', // 年级
        classId: '', // 班级
        subjectId: '', // 学科id
        subject: '', // 学科
        statusOptions: [
          {value: '全部', label: ''},
          {value: '等待模板', label: '0'},
          {value: '模板制作中', label: '1'},
          {value: '模板已完成', label: '2'}
        ],
        classesList: [{id: '', name: '全部'}], // 班级列表
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '作业名称', dataIndex: 'detailName', width: '15%'},
          {className: 'tablePadding', title: '布置教师', dataIndex: 'teacher', width: '12%'},
          {className: 'tablePadding', title: '学校', dataIndex: 'schoolName', width: '10%'},
          {className: 'tablePadding', title: '班级', dataIndex: 'className', width: '10%'},
          {className: 'tablePadding', title: '学科', dataIndex: 'subject', width: '8%'},
          {className: 'tablePadding', title: '布置时间', dataIndex: 'assignTime', width: '13%'},
          {className: 'tablePadding', title: '状态', dataIndex: 'status', width: '10%'},
          {className: 'tablePadding', title: '操作客服', dataIndex: 'serviceName', width: '10%'},
          // {
          //   className: 'tablePadding',
          //   title: '状态',
          //   dataIndex: 'status',
          //   width: '10%',
          //   filters: [
          //     {text: '等待模板', value: '0'},
          //     {text: '模板制作中', value: '1'},
          //     {text: '模板已完成', value: '2'}
          //   ],
          //   filterMultiple: false,
          //   onFilter: (value) => {
          //     console.log(value);
          //     this.status != value && (this.status = value);
          //     return true;
          //   }
          // },
          // {
          //   className: 'tablePadding',
          //   title: '操作客服',
          //   dataIndex: 'serviceName',
          //   width: '10%',
          //   filters: [...this.$store.getters.serviceList].map(item => {
          //       let cell = {
          //         value: item.id,
          //         text: item.name
          //       };
          //       return cell;
          //   }),
          //   filterMultiple: false,
          //   onFilter: (value) => {
          //     console.log(value);
          //     this.serviceId != value && (this.serviceId = value);
          //     return true;
          //   }
          // },
          {className: 'tablePadding', title: '操作', dataIndex: 'deal', width: '12%', scopedSlots: { customRender: 'operation' }}
        ],
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        getListTimer: null
      };
    },
    created () {
      this.getList();
    },
    // watch: {
    //   statusAserviceId: {
    //     handler (val) {
    //       console.log(val);
    //       this.getList();
    //     },
    //     deep: true
    //   }
    // },
    computed: {
      // statusAserviceId () {
      //   const {status, serviceId} = this;
      //   return {status, serviceId};
      // },
      serviceList () {
        return [{id: '', name: '全部'}, ...this.$store.getters.serviceList];
      },
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
      getList () {
        if (this.getListTimer) return;
        taskList({
          limit: this.limit,
          skip: this.skip,
          serviceId: this.serviceId,
          status: this.status,
          classId: this.classId,
          gradeId: this.grade,
          schoolId: this.school,
          subject: this.subject
        }).then(res => {
          let data = res.data;
          this.count = data.total;
          if (data.code == 0) {
            let statusObj = {
              '0': '等待模板',
              '1': '模板制作中',
              '2': '模板已完成', // 模板已完成
              '3': '模板已完成' // 模板完成已批改
            };
            this.tableData = data.data.map((item) => {
              let time = format(new Date(item.assignTime), 'MM月DD日 HH:mm');
              if (time[0] == 0) {
                time = time.substr(1);
              }
              item.assignTime = time;
              item.status = statusObj[item.workStatus];
              item.detailName = time.split(' ')[0] + item.name;
              item.teacher = item.assignTeacherName + (item.assignTeacherMobile ? '(' + item.assignTeacherMobile + ')' : '');
              return item;
            });
          } else {
            this.$message.error(data.message);
          }
        });
        this.getListTimer = setTimeout(() => {
          this.getListTimer = null;
        }, 500);
      },
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
        this.skip = 0;
        this.currentPage = 1;
        this.getList();
      },
      handleTask (workId) {
        getWork(workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$router.push({path: '/missionDetail', query: {workId: workId}});
          } else {
            this.$message.error(data.message);
          }
        });
      },
      checkTask (item) {
        this.$router.push({path: 'taskStart', query: {pageType: 'checkWork', workId: item.id, title: item.detailName}});
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
      padding: 0 30px 0 10px;
      overflow-x: auto;
      .fj(flex-start);
      .service{
        flex: 210px 0 0!important;
      }
      .school, .grade, .className, .subject, .status, .service{
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
      .btn{
        flex: 1;
        .fj(flex-end);
        .refresh{
          .wh(68px, 28px);
          .fac();
          font-size: 14px;
        }
      }
    }
  }
</style>
