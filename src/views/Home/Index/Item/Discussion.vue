<template>
  <div class="discussion_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:16px;">全部话题</el-menu-item>
    </el-menu>
    <el-form :rules="formRules" ref="formRef" :model="form">
        <el-form-item prop="title">
        <el-input placeholder="新建话题" size="medium" @focus="showTextArea" style="margin-top:10px;" v-model="form.title"></el-input>
        </el-form-item>
    <div class="print" v-show="isShowTextArea">
      <el-form-item>
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" style="margin-top:10px;" placeholder="话题内容" v-model="form.content"></el-input>
      </el-form-item>
      <div class="confirm">
        <el-button type="primary" size="mini" @click="confirm">确定</el-button>
        <el-button size="mini" @click="isShowTextArea = false">取消</el-button>
      </div>
    </div>
    </el-form>
    <main>
      <div class="main" v-for="item in discussionList" :key="item.id">
        <section>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </section>
        <div class="list">
          <div class="header">
            <div class="info">
              <span style="color:#09f;font-size:14px;">{{ profileInfo.name }}</span>
              <span
                style="margin-left:10px;font-size:12px;color:#666;"
              >{{ item.create_time | timeFormats }}</span>
              <div class="title">{{ item.dis_title }}</div>
            </div>
            <div class="del" @click="delDiscussion(item.dis_title)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
          <div class="detail">{{ item.dis_content }}</div>
          <div class="answer" v-if="item.children.length">
            <div class="stu" v-for="i in item.children" :key="i.id" >
              <div class="left">
                <div class="avatar_stu">
                  <i class="el-icon-user-solid"></i>
                </div>
              </div>
              <div class="right">
                <div class="header_stu">
                  <span style="color:#09f;font-size:14px;">{{ i.name }}</span>
                  <span
                    style="margin-left:10px;font-size:12px;color:#666;"
                  >{{ i.create_time | timeFormats }}</span>
                </div>
                <div class="detail">{{ i.dis_content }}</div>
              </div>
            </div>
          </div>
          <el-card v-else class="no_answer">暂无回复!</el-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getDiscussion, addDiscussion, delDiscussion } from "@/network/api";
export default {
  computed: {
    ...mapState(["profileInfo", "activeSubject"])
  },
  data() {
    return {
      isShowTextArea: false,
      discussionList: [],
      form: {
          title: '',
          content: ''
      },
      formRules: {
          title: [{ required: true, message: "话题不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getDiscussion();
  },
  methods: {
    showTextArea() {
      this.isShowTextArea = true;
    },
    async getDiscussion() {
      let res = await getDiscussion({
        subject_id: this.activeSubject.id,
        tea_id: this.activeSubject.rid
      });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.discussionList = res.data;
    },
    confirm() {
        this.$refs.formRef.validate(async vaild => {
            if (!vaild) return
            let res = await addDiscussion({subject_id:this.activeSubject.id,tea_id:this.activeSubject.rid,...this.form})
            if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg)
            this.getDiscussion()
            this.isShowTextArea = false
        })
    },
    async delDiscussion(title) {
        const confirmResult = await this.$confirm("确定要删除该话题吗?", "提示", {
        cancelButtonClass: "btn-cancel"
      }).catch(err => err);
      if (confirmResult !== "confirm") return;
      let res = await delDiscussion({subject_id:this.activeSubject.id,tea_id:this.activeSubject.rid,title})
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg)
      this.getDiscussion()
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
    margin-bottom: 10px;
}
.discussion_container {
  width: 70%;
  margin: 0 auto;
  .print {
      transition: 1s ease;
      animation: fadeInLeft .5s;
      .confirm {
          padding: 10px;
          padding-bottom: 2px;
          display: flex;
          justify-content: flex-end;
      }
  }
  main {
    margin-top: 5px;
    .main {
      display: flex;
      section {
        width: 60px;
        display: flex;
        justify-content: center;
      }
      .list {
        flex: 1;
        padding: 6px;
        color: #59657d;
        .header {
          display: flex;
          justify-content: space-between;
          padding-right: 16px;
          .del {
            padding-top: 20px;
            font-size: 20px;
            cursor: pointer;
          }
          .del:hover {
            color: #09f;
          }
        }
        .title {
          margin-top: 6px;
        }
        .detail {
          margin-top: 12px;
          font-size: 12px;
        }
        .answer {
          margin-top: 16px;
          background-color: #f2f2f2;
          padding: 20px 16px;
          border-radius: 5px;
          padding-bottom: 2px;
          .stu {
            display: flex;
            margin-bottom: 20px;
            .left {
              width: 20px;
              .avatar_stu {
                width: 20px;
                height: 20px;
                border: 1px solid #666;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .right {
              flex: 1;
              padding: 0 2px;
            }
          }
        }
        .no_answer {
            margin-top: 16px;
            border-radius: 5px;
            background-color: #f2f2f2;
            padding-bottom: 2px;
            padding: 10px;
            display: flex;
            justify-content: center;
            font-size: 12px;
        }
      }
    }
  }
}
</style>