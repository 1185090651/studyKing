<template>
  <div class="select_sub_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:18px;">选择课程</el-menu-item>
    </el-menu>
    <div class="select_sub_box">
      <el-card
        shadow="hover"
        class="card animated fadeIn"
        v-for="item in subjectList"
        :key="item.id"
        @click.native="goSubject(item)"
      >
        <img :src="item.cover_img" />
        <div class="bottom">
          <div>
            <div style="font-size:15px;margin-top:3px;">{{item.sub_name}}</div>
            <div style="font-size:12px;margin-top:4px;color:#666;">{{profileInfo.name}}</div>
          </div>
          <div>
            <el-button size="mini" type="primary" @click.stop="delSub(item.id,item.rid)">删除</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="card animated fadeIn" @click.native="isShowAddDialog=true">
        <div class="add">
          <i class="el-icon-circle-plus icon_add"></i>
        </div>
      </el-card>
      <el-dialog title="添加课程" :visible.sync="isShowAddDialog" width="31%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" hide-required-asterisk>
          <el-form-item label="课程名称" prop="subjectName">
            <el-input v-model="addForm.subjectName"></el-input>
          </el-form-item>
          <el-form-item label="课程说明">
            <el-input v-model="addForm.subjectDes"></el-input>
          </el-form-item>
          <el-form-item label="课程封面" class="el-form-bottom">
            <img
              v-for="(item,index) in cover_imgs"
              :key="item"
              :src="item"
              :class="`cover_img ${index===activeIndex?'img_active':''}`"
              @click="changeImgIndex(index)"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSub">确 定</el-button>
          <el-button @click="isShowAddDialog = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getSubjects,addSubject,delSubject } from "@/network/api";
export default {
  computed: {
    ...mapState(["profileInfo"]),
  },
  data() {
    return {
      subjectList: [],
      isShowAddDialog: false,
      cover_imgs: [
        "http://mooc1-1.chaoxing.com/images/img_default.png",
        "https://p.ananas.chaoxing.com/star3/270_160c/53c72f2ba310a822ad8b3319.jpg",
        "https://p.ananas.chaoxing.com/star3/270_160c/3a7c4e2929905646967168696f78ff01.png",
        "https://p.ananas.chaoxing.com/star3/270_160c/1dc770d3faa19e23b0b438ed35ad781b.png",
        "https://p.ananas.chaoxing.com/star3/270_160c/6ce77a10dd3268daa7ba6c93e5e76459.png"
      ],
      activeIndex: 0,
      addForm: {
        subjectName: "",
        subjectDes: "",
      },
      addFormRules: {
        subjectName: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getSubList(this.profileInfo.id);
  },
  methods: {
    async getSubList(id) {
      let res = await getSubjects(id);
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.subjectList = res.data;
    },
    changeImgIndex(index) {
      this.activeIndex = index;
    },
    addSub() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return 
        this.addForm.coverImg = this.cover_imgs[this.activeIndex]
        this.addForm.id = this.profileInfo.id
        let res = await addSubject(this.addForm)
        if (res.meta.code !==200) return this.$message.error(res.meta.msg)
         this.$message.success(res.meta.msg)
         this.getSubList(this.profileInfo.id);
         this.isShowAddDialog = false
      })
    },
    async delSub(id,rid) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          cancelButtonClass: 'btn-cancel'
      }).catch(err => err)
      // 如果用户确认删除，返回值为字符串 confirm
      // 如果用户取消删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return 
      let res = await delSubject(id,rid)
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getSubList(this.profileInfo.id);
    },
    goSubject(subject) {
      this.$store.commit('saveSubject',subject)
      this.$router.push('/home/index/main')
    }
  }
};
</script>

<style lang="scss" scoped>
.select_sub_container {
  width: 840px;
  height: 600px;
  margin: 0 auto;
  .select_sub_box {
    width: 100%;
    max-height: 600px;
    overflow: auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    .add {
      margin: 0 auto;
      height: 200px;
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
      width: 240px;
      padding: 0;
      cursor: pointer;
      margin: 20px;
      img {
        width: 100%;
        height: 150px;
      }
      .bottom {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
.cover_img {
  cursor: pointer;
  width: 150px;
  height: 90px;
  margin-left: 10px;
}
.img_active {
  border: 1px solid #09f;
}
.el-form-bottom {
  margin-bottom: 0;
}
</style>