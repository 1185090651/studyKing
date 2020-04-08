<template>
  <div class="manage_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:16px;">班级管理</el-menu-item>
    </el-menu>
    <div class="material_box">
      <header>
        <div class="search">
          <el-input
            placeholder="请输入关键字"
            clearable
            size="mini"
            style="width:200px;"
            v-model="searchName"
          ></el-input>
          <el-button type="primary" size="mini" style="margin-left:5px;" @click="searchStu">
            <i class="el-icon-search"></i>
          </el-button>
        </div>
        <div class="options">
          <el-button type="primary" size="mini" @click="dialogVisible = true">添加学生</el-button>
          <el-button type="primary" size="mini" @click="outPut">导出名单</el-button>
        </div>
      </header>
      <main>
        <el-table
          :data="tableData"
          border
          stripe
          highlight-current-row
          height="540"
          style="width: 100%;margin-top: 10px;"
          :header-cell-style="{background:'#f4f4f4'}"
          ref="multipleTable"
        >
          <el-table-column type="index" width="55" label="#" align="center"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="学号" prop="id"></el-table-column>
          <el-table-column label="院系" prop="yuanxi"></el-table-column>
          <el-table-column label="专业" prop="zhuanye"></el-table-column>
          <el-table-column label="班级" prop="class"></el-table-column>
          <el-table-column label="加入时间">
            <template slot-scope="scope">{{ scope.row.time | timeFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delStu(scope.row)">
                <i class="el-icon-delete" style="font-weight:900;"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加学生" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
          <el-form
            :model="form"
            label-width="70px"
            :rules="rules"
            hide-required-asterisk
            ref="form"
          >
            <el-form-item label="学生姓名" prop="name">
              <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="学生账号" prop="username">
              <el-input placeholder="初始密码为123456" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="所属学院" prop="yueyuan">
              <el-select v-model="form.yueyuan" placeholder="请选择学院" style="width:100%;">
                <el-option label="公安政治工作学院" value="0"></el-option>
                <el-option label="法学与犯罪学院" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业">
              <el-input :value="form.yueyuan?selectList[form.yueyuan].classname:''" disabled></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input :value="form.yueyuan?selectList[form.yueyuan].zhuanye:''" disabled></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </main>
    </div>
  </div>
</template>

<script>
import { getStu, searchStu, addStu, delStu } from "@/network/api.js";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["activeSubject"])
  },
  data() {
    return {
      tableData: [],
      searchName: "",
      dialogVisible: false,
      form: {
        name: "",
        username: ""
      },
      yueyuan: "",
      selectList: [
        {
          yueyuan: "公安政治工作学院",
          zhuanye: "行政管理专科",
          classname: "2020行政管理专科"
        },
        {
          yueyuan: "法学与犯罪学院",
          zhuanye: "法律文秘专科",
          classname: "2020法律文秘专科"
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        username: [{ required: true, message: "请输入学号", trigger: "blur" }],
        yueyuan: [{ required: true, message: "请选择学院", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getStu();
  },
  methods: {
    async getStu() {
      let res = await getStu({ sub: this.activeSubject.id });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data;
    },
    async searchStu() {
      let res = await searchStu({
        name: this.searchName,
        sub: this.activeSubject.id
      });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data;
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        let res = await addStu({
          ...this.form,
          ...this.selectList[this.form.yueyuan],
          id: this.activeSubject.id
        });
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.dialogVisible = false;
        this.getStu();
      });
    },
    dialogClose() {
      this.$refs.form.resetFields();
    },
    async delStu(data) {
      const confirmResult = await this.$confirm(
        "确定要删除该名学生吗?",
        "提示",
        {
          cancelButtonClass: "btn-cancel"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") return;
      let res = await delStu({ subject: data.subject, id: data.id });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getStu();
    },
    async outPut() {
      const confirmResult = await this.$confirm("该功能未开发", "提示", {
        cancelButtonClass: "btn-cancel"
      }).catch(err => err);
      return;
    }
  }
};
</script>

<style lang="scss" scoped>
.manage_container {
  width: 70%;
  margin: 0 auto;
  .material_box {
    header {
      margin-top: 15px;
      position: relative;
      .options {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>