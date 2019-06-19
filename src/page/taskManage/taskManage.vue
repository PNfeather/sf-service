<template>
  <div name='missionList' class="fillcontain">
    <div class="search">
      <div class="teacher">
        <span class="label">布置教师:</span>
        <a-input v-model="teacherInfo" class="input" placeholder="请输入资源名称"/>
      </div>
      <div class="service">
        <span class="label">操作客服:</span>
        <a-input v-model="service" class="input" placeholder="请输入资源名称"/>
      </div>
      <a-button type="primary" class="check" @click="check">查询</a-button>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="workId" :pagination="false" :scroll="{y: 560}" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a-popconfirm placement="topRight" title="你确定要删除该作业?" @confirm="deleteTask(record.workId)" >
            <a style="text-decoration: underline; color: #E98469;">删除</a>
          </a-popconfirm>
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
  import {worksList} from '@/api/works';
  export default {
    name: 'missionList',
    data () {
      return {
        teacherInfo: '',
        service: '',
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '作业名称', dataIndex: 'workName', width: '18.7%'},
          {className: 'tablePadding', title: '布置教师', dataIndex: 'assignTeacher', width: '19%'},
          {className: 'tablePadding', title: '班级', dataIndex: 'className', width: '23.5%'},
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
    mounted () {},
    activated () {
      this.getList();
    },
    watch: {
    },
    computed: {
      serviceList () {
        let result = this.$store.getters.serviceList;
        result.unshift({id: '', name: '全部'});
        return result;
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
            service: this.service
          }).then(res => {
            let data = res.data;
            this.count = data.total;
            if (data.code == 0) {
              this.tableData = data.data;
            }
          });
        }, 300);
      },
      check () {
        this.getList();
      },
      deleteTask (workId) {
        let data = [...this.tableData];
        let target = data.filter(item => { return (item.workId == workId); })[0];
        console.log(target);
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
