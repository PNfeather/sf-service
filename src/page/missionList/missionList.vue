<template>
  <div name='missionList' class="fillcontain">
    <div class="search">
      <div class="status">
        <span class="label">状态:</span>
        <a-select :value="status" :defaultValue="statusOptions[0]" style="flex: 120px 0 0; overflow: hidden" @change="changeStatus">
          <a-select-option v-for="option in statusOptions" :key="option.label">{{option.value}}</a-select-option>
        </a-select>
      </div>
      <div class="service">
        <span class="label">操作客服:</span>
        <a-select :value="serviceId" :defaultValue="serviceList[0]" style="flex: 120px 0 0; overflow: hidden" @change="changeService">
          <a-select-option v-for="option in serviceList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="btn">
        <a-button type="primary" class="refresh" @click="refresh">刷新</a-button>
      </div>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="workId" :pagination="false" :scroll="{y: 560}" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a style="text-decoration: underline" @click="() => handleTask(record.workId)">制作</a>
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
  import {taskList} from '@/api/task';
  export default {
    name: 'missionList',
    data () {
      return {
        serviceId: '',
        status: '0', // 任务状态(0:等待模板 1:模板制作中 2: 模板已完成)
        statusOptions: [
          {value: '等待模板', label: '0'},
          {value: '模板制作中', label: '1'},
          {value: '模板已完成', label: '2'}
        ],
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '作业名称', dataIndex: 'workName', width: '16.6%'},
          {className: 'tablePadding', title: '布置教师', dataIndex: 'assignTeacher', width: '16.7%'},
          {className: 'tablePadding', title: '班级', dataIndex: 'className', width: '21.8%'},
          {className: 'tablePadding', title: '布置时间', dataIndex: 'assignTime', width: '12.9%'},
          {className: 'tablePadding', title: '状态', dataIndex: 'status', width: '10%'},
          {className: 'tablePadding', title: '操作客服', dataIndex: 'serviceName', width: '10%'},
          {className: 'tablePadding', title: '操作', dataIndex: 'deal', width: '12%', scopedSlots: { customRender: 'operation' }}
        ],
        pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0
      };
    },
    created () {
      this.getList();
    },
    mounted () {},
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
        taskList({
          limit: this.limit,
          skip: this.skip,
          serviceId: this.serviceId,
          status: this.status
        }).then(res => {
          let data = res.data;
          this.count = data.total;
          if (data.code == 0) {
            this.tableData = data.data;
          }
        });
      },
      refresh () {
        this.getList();
      },
      changeStatus (value) {
        this.status = value;
        this.getList();
      },
      changeService (value) {
        this.serviceId = value;
        this.getList();
      },
      handleTask (workId) {
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
      padding: 0 30px 0 10px;
      .fj(flex-start);
      .status{
        flex: 180px 0 0;
      }
      .service{
        flex: 220px 0 0;
      }
      .status, .service{
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
