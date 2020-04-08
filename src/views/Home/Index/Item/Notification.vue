<template>
  <div class="not_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:16px;">我的通知</el-menu-item>
    </el-menu>
    <div class="notifacation_box">
      <el-card
        shadow="hover"
        class="card animated fadeIn"
        v-for="item in notifyList"
        :key="item.id"
      >
        <div class="box">
          <span style="font-size:20px;">{{item.title}}</span>
          <span style="margin-top:14px;">发布时间：{{item.create_time | timeFormats}}</span>
          <span>所属课程：{{activeSubject.sub_name}}</span>
          <span>发送人：{{profileInfo.name}}</span>
          <el-popover placement="bottom" trigger="hover" :content="item.content" width="400">
            <span slot="reference" class="content">内容：{{item.content}}</span>
          </el-popover>
          <div class="bottom">
            <div class="options">
              <i class="el-icon-edit-outline" style="font-size: 22px;" @click="editNotify(item)"></i>
              <i class="el-icon-delete" style="font-size: 22px;" @click="delNotify(item.id)"></i>
            </div>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="card animated fadeIn" @click.native="dialogVisible = true">
        <div class="add">
          <i class="el-icon-circle-plus icon_add"></i>
        </div>
      </el-card>
      <el-dialog title="通知" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
        <el-form :model="form" label-width="70px" :rules="rules" hide-required-asterisk ref="form">
          <el-form-item label="发送人">
            <el-input :value="profileInfo.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属课程">
            <el-input :value="activeSubject.sub_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 6, maxRows: 20}"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addNotify, getNotify, delNotify, editNotify } from "@/network/api";
export default {
  computed: {
    ...mapState(["profileInfo", "activeSubject"])
  },
  data() {
    return {
      notifyList: [],
      dialogVisible: false,
      form: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入通知内容", trigger: "blur" }
        ]
      },
      type: true
    };
  },
  created() {
    this.getNotify();
  },
  methods: {
    async getNotify() {
      let res = await getNotify({sub_id:this.activeSubject.id});
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.notifyList = res.data;
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form={
        title: "",
        content: ""
      }
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        let res;
        if (!valid) return;
        if (this.type) {
          res = await addNotify({
          sub_id: this.activeSubject.id,
          ...this.form
        });
        }else {
          res = await editNotify(this.form)
        }
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.dialogVisible = false;
        this.getNotify();
      });
    },
    async delNotify(id) {
      const confirmResult = await this.$confirm("确定要删除该通知吗?", "提示", {
        cancelButtonClass: "btn-cancel"
      }).catch(err => err);
      if (confirmResult !== "confirm") return;
      let res = await delNotify(id);
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getNotify()
    },
    editNotify(item) {
      this.form = item
      this.dialogVisible = true
      this.type = false
    },

  }
};
</script>

<style lang="scss" scoped>
.not_container {
  width: 70%;
  margin: 0 auto;
  .notifacation_box {
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
    }
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px 20px;
      span {
        margin-bottom: 8px;
        font-size: 12px;
      }
      .content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        /*控制在3行*/
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 40px;
        width: 100%;
        background-color: #b3d8ff;
        .options {
          font-weight: 600;
          position: absolute;
          right: 0;
          line-height: 40px;
          i {
            margin-right: 14px;
          }
          i:hover {
            color: #666;
          }
        }
      }
    }
  }
}
</style>