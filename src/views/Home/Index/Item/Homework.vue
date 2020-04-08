<template>
  <div class="homework_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:16px;">作业管理</el-menu-item>
    </el-menu>
    <div class="homework_box">
      <el-card shadow="hover" class="card animated fadeIn" v-for="item in homeworkList" :key="item.id">
        <div class="box">
          <span style="font-size:20px;">{{ item.hw_title }}</span>
          <span style="margin-top:10px;">发布时间：{{ item.create_time | timeFormats }}</span>
          <span>题量：{{ item.sum }}道</span>
          <span>截止时间：{{ item.deadline | timeFormats }}</span>
          <span>完成情况：<span style="color:red;">{{ item.doneSum }}</span>/{{ item.allSum }}</span>
          <div class="bottom">
            <div style="color:#09f;font-size:14px;" @click="getTranscript(item.id,item.hw_title)">查看成绩单</div>
            <el-button type="primary" size="mini" @click="delHomework(item.id,item.hw_title)">删除记录</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="card animated fadeIn" @click.native="dialogVisible = true">
        <div class="add">
          <i class="el-icon-circle-plus icon_add"></i>
        </div>
      </el-card>
    </div>
    <el-dialog title="添加作业" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
      <el-form :model="form" label-width="70px" :rules="rules" hide-required-asterisk ref="form">
        <el-form-item label="作业题目" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="题目题量">
          <el-select v-model="form.sum" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker v-model="form.deadline" type="date" placeholder="选择截止日期" style="width:100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="tableDialogVisible" width="50%">
        <el-table
          :data="tableData"
          border
          stripe
          height="520"
          highlight-current-row
          style="width: 100%;margin-top: 10px;"
          :header-cell-style="{background:'#f4f4f4'}"
          ref="multipleTable"
        >
          <el-table-column type="index" width="55" label="#" align="center"></el-table-column>
          <el-table-column label="学号" prop="id"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="班级" prop="class"></el-table-column>
          <el-table-column label="成绩">
              <template slot-scope="scoped">
                  {{ scoped.row.score ? scoped.row.score : "无成绩"}}
              </template>
          </el-table-column>
        </el-table>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini">导出成绩</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { addHomework, getHomework, getTranscript, delHomework } from "@/network/api";
import { mapState } from "vuex";
export default {
    computed: {
    ...mapState(["activeSubject"])
  },
  data() {
    return {
      homeworkList: [],
      dialogVisible: false,
      value1: "",
      form: {
          title: '',
      sum: 20,
          deadline: ''
      },
      rules: {
        title: [{ required: true, message: "请输入题目名称", trigger: "blur" }],
        deadline: [
          { required: true, message: "请选择截止时间", trigger: "blur" }
        ]
      },
      options: [
        {
          value: 20,
          label: "20"
        },
        {
          value: 40,
          label: "40"
        },
        {
          value: 60,
          label: "60"
        },
        {
          value: 80,
          label: "80"
        },
        {
          value: 100,
          label: "100"
        }
      ],
      tableDialogVisible: false,
      tableData: []
    };
  },
  created() {
      this.getHomework()
  },
  methods: {
    dialogClose() {
      this.$refs.form.resetFields();
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const confirmResult = await this.$confirm(
          "作业一旦创建不能撤回，确定要新建吗？",
          "提示",
          {
            cancelButtonClass: "btn-cancel"
          }
        ).catch(err => err);
        if (confirmResult !== "confirm") return;
        let res = await addHomework({...this.form,sub_id:this.activeSubject.id,tea_id:this.activeSubject.rid})
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogVisible = false;
        this.getHomework()
      });
    },
    async getHomework() {
        let res = await getHomework({sub_id:this.activeSubject.id,tea_id:this.activeSubject.rid})
        if (res.meta.code !== 200) return 
        this.homeworkList = res.data
    },
    async getTranscript(id,title) {
        let res = await getTranscript({sub_id: this.activeSubject.id,id,title})
        if (res.meta.code !== 200) return 
        this.tableData = res.data
        this.tableDialogVisible = true
    },
    async delHomework(id,title) {
        const confirmResult = await this.$confirm(
          "删除作业之后无法查看成绩单，确定要继续吗？",
          "提示",
          {
            cancelButtonClass: "btn-cancel"
          }
        ).catch(err => err);
        if (confirmResult !== "confirm") return;
        let res = await delHomework({sub_id:this.activeSubject.id,tea_id:this.activeSubject.rid,id})
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getHomework()
    }
  }
};
</script>

<style lang="scss" scoped>
.homework_container {
  width: 70%;
  margin: 0 auto;
  .homework_box {
    width: 100%;
    max-height: 600px;
    min-height: 500px;
    overflow: auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    .add {
      margin: 0 auto;
      height: 200px;
      width: 295px;
      font-size: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ccc;
    }
    .icon_add:hover {
      color: #09f;
      transition: all 1.5s ease;
    }
    .card {
      height: 200px;
      width: 295px;
      padding: 0;
      cursor: pointer;
      margin: 20px;
      position: relative;
      .box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px 20px;
        span {
          margin-bottom: 10px;
          font-size: 12px;
        }
        .bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 50px;
          width: 100%;
          display: flex;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>