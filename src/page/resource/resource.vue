<template>
  <div name='resource' class="fillcontain">
    <div class="search">
      <div class="searchInput">
        <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
        <a-button type="primary" class="getList" @click="getList">搜索</a-button>
      </div>
      <div class="btn">
        <a-button type="primary" class="addNew" @click="addNew">新增</a-button>
      </div>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="workId" :pagination="false" :scroll="{y: 560}" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a style="text-decoration: underline" @click="() => handleTask(record.workId)">查看</a>
          <a style="text-decoration: underline" @click="() => handleTask(record.workId)">编辑</a>
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
    name: 'resource',
    data () {
      return {
        templateName: '',
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '资源名称', dataIndex: 'workName', width: '34%'},
          {className: 'tablePadding', title: '创建人', dataIndex: 'assignTeacher', width: '20%'},
          {className: 'tablePadding', title: '最后修改时间', dataIndex: 'className', width: '18%'},
          {className: 'tablePadding', title: '状态', dataIndex: 'assignTime', width: '15%'},
          {className: 'tablePadding', title: '操作', dataIndex: 'deal', width: '13%', scopedSlots: { customRender: 'operation' }}
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
    activated () {
      this.getList();
    },
    mounted () {},
    watch: {
    },
    computed: {
    },
    methods: {
      getList () {
        if (this.getListTimer) clearTimeout(this.getListTimer);
        this.getListTimer = setTimeout(() => {
          taskList({
            limit: this.limit,
            skip: this.skip,
            templateName: this.templateName
          }).then(res => {
            let data = res.data;
            this.count = data.total;
            if (data.code == 0) {
              this.tableData = data.data;
            }
          });
        }, 300);
      },
      addNew () {
        this.$router.push('startNewResource');
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
  [name = 'resource']{
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .search{
      flex: 60px 0 0;
      padding: 0 30px 0 10px;
      .fj(flex-start);
      .searchInput{
        flex: 1;
        .fj(flex-start);
        padding-left: 18px;
        .input{
          width: 220px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
