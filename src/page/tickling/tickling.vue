<template>
  <div name='tickling' class="fillcontain">
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="id" :pagination="false" :scroll="{y: 560}" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <!--<template slot="operation" slot-scope="text, record, index">-->
        <!--<div class='editable-row-operations'>-->
          <!--<a style="text-decoration: underline" @click="checkResource(record.id)" v-show="record.bookStatus == 1">查看</a>-->
          <!--<a style="text-decoration: underline" @click="soldOutResource(record.id)" v-show="record.bookStatus == 1">下架</a>-->
          <!--<a style="text-decoration: underline" @click="editResource(record.id)" v-show="record.bookStatus == 0">编辑</a>-->
        <!--</div>-->
      <!--</template>-->
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
  import {getList} from '@/api/feedback';
  import format from '@/tools/format';
  export default {
    name: 'tickling',
    data () {
      return {
        tableData: [],
        columns: [
          {className: 'tablePadding ellipsis', title: '反馈用户', dataIndex: 'userName', width: '20%'},
          {className: 'tablePadding ellipsis', title: '用户类型', dataIndex: 'userTypeName', width: '10%'},
          {className: 'tablePadding ellipsis', title: '反馈内容', dataIndex: 'content', width: '10%'},
          {className: 'tablePadding ellipsis', title: '反馈时间', dataIndex: 'feedbackTime', width: '18%'},
          {className: 'tablePadding ellipsis', title: '操作', dataIndex: 'deal', width: '18%', scopedSlots: { customRender: 'operation' }}
        ],
        skip: 0,
        limit: 10,
        currentPage: 1,
        count: 0,
        getDataTimer: null
      };
    },
    created () {
      this.limitGetData();
    },
    activated () {
      this.limitGetData();
    },
    methods: {
      getData () {
        getList({
          skip: this.skip,
          limit: this.limit,
          creator: '',
          templateName: ''
        }).then((res) => {
          let data = res.data;
          if (data.code == 0) {
            this.count = data.total;
            let userTypeName = {
              0: '学生',
              1: '家长',
              2: '客服',
              3: '教师'
            };
            this.tableData = data.data.map((item) => {
              item.feedbackTime = format(new Date(item.feedbackTime), 'YYYY-MM-DD');
              item.userTypeName = userTypeName[item.userType];
              return item;
            });
          } else {
            this.$message.error(data.message);
          }
        });
      },
      limitGetData () {
        if (this.getDataTimer) return;
        this.getData();
        this.getDataTimer = setTimeout(() => {
          this.getDataTimer = null;
        }, 500);
      },
      onShowSizeChange (current, pageSize) {
        this.currentPage = current;
        this.limit = pageSize;
        this.skip = (current - 1) * this.limit;
        this.limitGetData();
      },
      changePage (current) {
        this.currentPage = current;
        this.skip = (current - 1) * this.limit;
        this.limitGetData();
      },
      checkTickling (row) {
        this.$router.push({'path': '/ticklingDetail', query: {id: row.id}});
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~@/style/mixin';
  [name = 'tickling']{
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .search{
      flex: 60px 0 0;
      padding: 0 30px 0 10px;
      .fj(flex-start);
      .grade, .subject{
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
