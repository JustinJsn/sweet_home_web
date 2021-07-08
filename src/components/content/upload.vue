<template>
  <div>
    <el-upload
      multiple
      ref="upload"
      :limit="limit"
      :action="domain"
      :auto-upload="true"
      :file-list="fileList"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :http-request="uploadQiniu"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/api/upload';
import axios from 'axios';

export default {
  name: 'upload',
  props: {
    limit: {
      type: Number,
    },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      domain: 'https://upload-z2.qiniup.com',
      qiniuAddress: 'imgapi.justinjsn.cn',
      dialogImageUrl: '',
      dialogVisible: false,
      img_src: '',
      key: [],
    };
  },
  methods: {
    async uploadQiniu(req) {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const fileType = req.file.type.split('/')[1];
      const reg = new RegExp(`(.*?).${fileType}`, 'i');
      const fileName = reg.exec(req.file.name)[1];
      // 上传图片的名字
      const uploadName = `web_${fileName}_${new Date().getTime()}.${fileType}`;
      try {
        // 获取上传凭证
        const token = JSON.parse(localStorage.getItem("SH_token"));

        const tokenRet = await getToken(token);

        // 上传数据
        const formData = new FormData();
        formData.append('file', req.file);
        formData.append('token', tokenRet.data.QiniuToken);
        formData.append('key', uploadName);

        // 上传至七牛云
        axios.post(this.domain, formData, headers).then((res) => {
          const img_src = `http://${this.qiniuAddress}/${res.data.key}`;
          this.$emit('set_currentURL', img_src);
        });
      } catch (ex) {
        this.$emit('set_currentURL', '');
        this.$message({
          message: ex,
          type: 'error',
        });
      }
    },

    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleExceed() {
      this.$message({
        message: `上传文件个数限制为${this.limit}个`,
        type: 'error',
      });
    },

    handleRemove(file, fileList) {
      this.$emit('handleRemove', { file, fileList });
    },

    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
  },
};
</script>

<style scoped>
</style>
