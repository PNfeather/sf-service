<template>
  <div name='missionList' class="fillcontain">
    <div class="search">
      <div class="teacher">
        <span class="label">布置教师:</span>
        <a-input v-model="teacherInfo" class="input" placeholder="请输入教师名称"/>
      </div>
      <div class="service">
        <span class="label">操作客服:</span>
        <a-select :value="serviceId" :defaultValue="serviceList[0]" style="flex: 120px 0 0; overflow: hidden" @change="changeService">
          <a-select-option v-for="option in serviceList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
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
  import {worksList, deleteWork} from '@/api/works';
  import format from '@/tools/format';
  export default {
    name: 'missionList',
    data () {
      return {
        serviceId: '',
        teacherInfo: '',
        service: '',
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '作业名称', dataIndex: 'detailName', width: '18.7%'},
          {className: 'tablePadding', title: '布置教师', dataIndex: 'teacher', width: '19%'},
          {className: 'tablePadding', title: '班级', dataIndex: 'detailClassName', width: '23.5%'},
          {className: 'tablePadding', title: '布置时间', dataIndex: 'assignTime', width: '14.6%'},
          {className: 'tablePadding', title: '操作客服', dataIndex: 'serviceName', width: '11.5%'},
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
      serviceList () {
        return [{id: '', name: '全部'}, ...this.$store.getters.serviceList];
      }
    },
    methods: {
      getList () {
        if (this.getListTimer) clearTimeout(this.getListTimer);
        this.getListTimer = setTimeout(() => {
          worksList({
            limit: this.limit,
            skip: this.skip,
            teacherInfo: this.teacherInfo,
            serviceId: this.serviceId,
            queryDelete: true
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
                item.detailClassName = item.schoolName + item.className;
                item.teacher = item.assignTeacherName + (item.assignTeacherMobile ? '(' + item.assignTeacherMobile + ')' : '');
                return item;
              });
            }
          });
        }, 500);
      },
      check () {
        this.getList();
      },
      changeService (value) {
        this.serviceId = value;
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
      .teacher{
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
