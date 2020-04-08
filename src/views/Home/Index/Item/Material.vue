<template>
  <div class="material_container">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" style="font-size:16px;">课程资料</el-menu-item>
    </el-menu>
    <div class="material_box">
      <header>
        <div class="search">
          <el-input placeholder="请输入关键字" clearable size="mini" style="width:200px;"></el-input>
          <el-button type="primary" size="mini" style="margin-left:5px;">
            <i class="el-icon-search"></i>
          </el-button>
        </div>
        <div class="options">
          <el-button type="primary" size="mini" @click="upload">
            <i class="el-icon-plus" style="font-weight:900;"></i>添加资料
          </el-button>
          <el-button type="primary" size="mini" @click="mkdir">新建文件夹</el-button>
        </div>
        <input type="file" ref="uploadFile" hidden />
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:10px;">
          <el-breadcrumb-item>根目录</el-breadcrumb-item>
        </el-breadcrumb>
      </header>
      <main>
        <el-table
          :data="tableData"
          border
          height="400"
          style="width: 100%;margin-top: 10px;"
          :header-cell-style="{background:'#f4f4f4'}"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="文件名/文件夹名" >
            <template slot-scope="scope">
              <div class="material_filename">
                <i
                class="el-icon-bank-card"
                style="margin-right:10px;font-size:20px;vertical-align:middle;color:#666;"
              ></i>
              <span>{{ scope.row.filename }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上传者">
            <template>{{profileInfo.name}}</template>
          </el-table-column>
          <el-table-column label="大小">
            <template slot-scope="scope">{{ scope.row.size | sizeFormat }}</template>
          </el-table-column>
          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.birthtime | timeFormat }}</template>
          </el-table-column>
          <el-table-column label="操作" width="173">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="singleDownload(scope.row.filename)">
                <i class="el-icon-download" style="font-weight:900;"></i>
              </el-button>
              <el-tooltip effect="dark" content="重命名" placement="top" :enterable="false">
                <el-button type="primary" size="mini" @click="singleRename(scope.row.filename)">
                  <i class="el-icon-edit" style="font-weight:900;"></i>
                </el-button>
              </el-tooltip>
              <el-button type="danger" size="mini" @click="singleDel(scope.row.filename)">
                <i class="el-icon-delete" style="font-weight:900;"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom">
          <span @click="multipleDownload">批量下载</span>
          <span @click="multipleDel">批量删除</span>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getResource,
  upload,
  multipleDownload,
  multipleDel,
  singleRename
} from "@/network/api";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      selectedArr: [],
      filename: "",
      dialogVisible: false
    };
  },
  computed: {
    ...mapState(["profileInfo"])
  },
  created() {
    this.getResourceHandler();
  },
  methods: {
    // 新建文件夹
    async mkdir() {
      const confirmResult = await this.$confirm("该功能未开发", "提示", {
        cancelButtonClass: "btn-cancel"
      }).catch(err => err);
      return;
    },
    async getResourceHandler() {
      let res = await getResource(this.profileInfo.username);
      if (res.meta.code !== 200) return;
      this.tableData = res.data;
    },
    upload() {
      this.$refs.uploadFile.click();
      this.$refs.uploadFile.onchange = async () => {
        let file = this.$refs.uploadFile.files[0];
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].filename === file.name) {
            this.$message.error("上传失败 存在同名的文件");
            this.$refs.uploadFile.value = "";
            return;
          }
        }
        // 通过FormData类创建一个空对象
        let formData = new FormData();
        // 默认Content-Type: multipart/form-data
        // 通过append()方法来追加数据
        formData.append("chunk", file);
        formData.append("username", this.profileInfo.username);
        let res = await upload(formData);
        if (res.meta.code !== 200) this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getResourceHandler();
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedArr = this.multipleSelection.map(item => {
        return item.filename;
      });
    },
    async multipleDownload() {
      if (!this.selectedArr.length) return this.$message.warning("未选择文件");
      if (this.selectedArr.length === 1) {
        this.singleDown();
      } else {
        let res = await multipleDownload({
          username: this.profileInfo.username,
          data: this.selectedArr
        });
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.href = res.data;
        a.dispatchEvent(event);
      }
    },
    singleDownload(filename) {
      this.selectedArr.push(filename);
      this.singleDown();
    },
    singleDown() {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.href = `http://localhost:7000/api/resource/download?username=${
        this.profileInfo.username
      }&data=${JSON.stringify(this.selectedArr)}`;
      a.dispatchEvent(event);
    },
    async multipleDel() {
      if (!this.selectedArr.length) return this.$message.warning("未选择文件");
      const confirmResult = await this.$confirm("确定要删除文件吗?", "提示", {
        cancelButtonClass: "btn-cancel"
      }).catch(err => err);
      if (confirmResult !== "confirm") return;
      let res = await multipleDel({
        username: this.profileInfo.username,
        data: this.selectedArr
      });
      if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getResourceHandler();
    },
    singleDel(filename) {
      this.selectedArr.push(filename);
      this.multipleDel();
    },
    async singleRename(filename) {
      this.$prompt("重命名", {
        inputValue: filename,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async ({ value }) => {
          let res = await singleRename({
            value,
            filename,
            username: this.profileInfo.username
          });
          if (res.meta.code !== 200) return this.$message.warning(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.getResourceHandler();
        })
        .catch(() => {
          return;
        });
    },
    async testDownload() {
      if (this.selectedArr.length === 1) {
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.href = `http://localhost:7000/api/resource/download?username=${
          this.profileInfo.username
        }&data=${JSON.stringify(this.selectedArr)}`;
        a.dispatchEvent(event);
      } else {
        let res = await multipleDownload({
          username: this.profileInfo.username,
          data: this.selectedArr
        });
        if (res.meta.code !== 200) return this.$message.error(res.meta.msg);
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.href = res.data;
        a.dispatchEvent(event);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.material_container {
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
  .material_filename {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bottom {
    margin-top: 10px;
    font-size: 14px;
    color: #09f;
    span {
      cursor: pointer;
      margin-right: 10px;
    }
  }
}
</style>