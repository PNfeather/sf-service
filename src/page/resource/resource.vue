<template>
  <div name='resource' class="fillcontain">
    <div class="search">
      <div class="grade">
        <span class="label">年级:</span>
        <a-select :value="grade" :defaultValue="gradeList[0]" style="flex: 120px 0 0; overflow: hidden" @change="(val) => changeFilter('grade', val)">
          <a-select-option v-for="option in gradeList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="subject">
        <span class="label">学科:</span>
        <a-select :value="subjectId" :defaultValue="subjectList[0]" style="flex: 120px 0 0; overflow: hidden"  @change="(val) => changeFilter('subjectId', val)">
          <a-select-option v-for="option in subjectList" :key="option.id">{{option.name}}</a-select-option>
        </a-select>
      </div>
      <div class="searchInput">
        <a-input v-model="templateName" class="input" placeholder="请输入资源名称"/>
        <a-button type="primary" class="getList" @click="search">搜索</a-button>
      </div>
      <div class="btn">
        <a-button type="primary" class="addNew" @click="addNew">新增</a-button>
      </div>
    </div>
    <a-table :style="{width: '101%', marginLeft: '-2px', flex: '1'}" :columns="columns" :dataSource="tableData" rowKey="id" :pagination="false" :scroll="{y: 560}" bordered>
      <template slot="name" slot-scope="text">
        <a href="javascript:;">{{text}}</a>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <a style="text-decoration: underline" @click="checkResource(record.id)" v-show="record.bookStatus == 1">查看</a>
          <a style="text-decoration: underline" @click="soldOutResource(record.id)" v-show="record.bookStatus == 1">下架</a>
          <a style="text-decoration: underline" @click="editResource(record.id)" v-show="record.bookStatus == 0">编辑</a>
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
  import {getBookList, soldOutBook} from '@/api/tBook';
  import format from '@/tools/format';
  export default {
    name: 'resource',
    data () {
      return {
        templateName: '',
        grade: '', // 年级
        subjectId: '', // 学科id
        subject: '', // 学科
        tableData: [],
        columns: [
          {className: 'tablePadding', title: '资源名称', dataIndex: 'name', width: '20%'},
          {className: 'tablePadding', title: '年级', dataIndex: 'gradeName', width: '10%'},
          {className: 'tablePadding', title: '学科', dataIndex: 'subject', width: '10%'},
          {className: 'tablePadding', title: '创建人', dataIndex: 'creatorName', width: '18%'},
          {className: 'tablePadding', title: '最后修改时间', dataIndex: 'updatedAt', width: '14%'},
          {className: 'tablePadding', title: '状态', dataIndex: 'statusName', width: '10%'},
          {className: 'tablePadding', title: '操作', dataIndex: 'deal', width: '18%', scopedSlots: { customRender: 'operation' }}
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
      gradeList () {
        return [{id: '', name: '全部'}, ...this.$store.getters.gradeList];
      },
      subjectList () {
        return [...this.$store.getters.subjectList];
      }
    },
    methods: {
      changeFilter (type, val) {
        this[type] = val;
        if (type == 'subjectId') {
          this.subjectList.forEach(item => {
            item.id == val && (this.subject = item.name);
          });
        }
        this.search();
      },
      search () {
        this.skip = 0;
        this.currentPage = 1;
        this.getList();
      },
      getList () {
        if (this.getListTimer) return;
        getBookList({
          limit: this.limit,
          skip: this.skip,
          templateBookName: this.templateName,
          subject: this.subject,
          gradeId: this.grade
        }).then(res => {
          let data = res.data;
          this.count = data.total;
          if (data.code == 0) {
            this.tableData = data.data.map((item) => {
              item.statusName = (item.bookStatus == 0) ? '草稿' : '已发布';
              item.updatedAt = format(new Date(item.updatedAt), 'MM月DD日 HH:mm');
              return item;
            });
          }
        });
        this.getListTimer = setTimeout(() => {
          this.getListTimer = null;
        }, 500);
      },
      addNew () {
        this.$router.push('startNewResource');
      },
      checkResource (workId) {
        this.$router.push({path: 'taskStart', query: {pageType: 'checkTemplate', workId: workId}});
      },
      soldOutResource (workId) {
        soldOutBook(workId).then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.getList();
            this.$message.success('资源下架成功');
          } else {
            this.$message.error(data.message);
          }
        });
      },
      editResource (workId) {
        this.$router.push({path: 'taskStart', query: {pageType: 'resourceMakeStart', workId: workId}});
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
