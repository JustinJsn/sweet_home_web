<template>
  <div id="verified">
    <div class="setting-header">
      <span class="point"></span>
      <span class="title">实名认证</span>
      <el-divider  v-show="!userInfo.is_auth" />
    </div>

    <div v-if="!userInfo.is_auth">
      <div class="precautions">
        <h1>实名认证成功后,可以进行房源委托出租服务!</h1>
        <div class="tips-box">
          <p><i class="el-icon-warning-outline" />注意事项</p>
          <p>1.每个证件只能绑定一个账号</p>
          <p>2.证件照不清晰或与输入的信息不匹配,将导致实名认证被驳回</p>
          <p>
            3.您提供的证件信息将受到严格保护，仅用于身份验证,未经本人许可不会用于其他用途
          </p>
          <p>
            4.除原证件无效（如：改名、移民）等特殊情况外，实名认证审核通过后将不能修改
          </p>
        </div>
        <div class="tips-box">
          <p><i class="el-icon-warning-outline" />证件要求</p>
          <p>
            1.需上传本人露脸手持二代身份证背面照＋身份证正反面照片（不需手持）
          </p>
          <p>2.证件必须在有效期内，有效期需在一个月以上</p>
        </div>

        <div class="tips-box">
          <p><i class="el-icon-warning-outline" />照片要求</p>
          <p>
            1.证件照上信息需完整且清晰可辨（无反光、遮挡、水印、证件套、logo等）
          </p>
          <p>2.申请人填写的“真实姓名”和“证件号码”需和提交证件照片信息一致</p>
          <p>3.证件必须真实拍摄，不能使用复印件</p>
          <p>
            4.确保照片完整（不缺边角），证件周围不允许加上边角框（如：加上红框等）
          </p>
        </div>
      </div>

      <div class="form-main">
        <el-form
          :model="verified"
          :rules="rules"
          ref="verifiedForm"
          label-width="120px"
        >
          <el-form-item>
            <template slot="label">
              <h4>填写信息</h4>
            </template>
          </el-form-item>

          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="verified.realName" />
          </el-form-item>

          <el-form-item label="证号类型" prop="cardType">
            <el-input disabled v-model="verified.cardType" />
          </el-form-item>

          <el-form-item label="证号号码" prop="ID_card">
            <el-input v-model="verified.ID_card" />
          </el-form-item>

          <el-form-item>
            <div class="upload-box">
              <figure>
                <label
                  :style="
                  'background: center / cover no-repeat url(' + frontSrc + ');'
                "
                  class="outer-box1"
                  for="upload-front"
                >
                  <input
                    @change="handleUploadFront($event)"
                    type="file"
                    class="inner-box"
                    id="upload-front"
                  />
                </label>
                <figcaption>
                  <span>上传证件正面照（2M以内）</span>
                  <el-button size="mini" @click="handleClickUploadFront"
                  >点击上传</el-button
                  >
                </figcaption>
              </figure>
              <figure>
                <label
                  :style="
                  'background: center / cover no-repeat url(' + backSrc + ');'
                "
                  class="outer-box2"
                  for="upload-back"
                >
                  <input
                    @change="handleUploadBack($event)"
                    type="file"
                    class="inner-box"
                    id="upload-back"
                  />
                </label>
                <figcaption>
                  <span>上传证件背面照（2M以内）</span>
                  <el-button size="mini" @click="handleClickUploadBack"
                  >点击上传</el-button
                  >
                </figcaption>
              </figure>
            </div>
          </el-form-item>

          <el-form-item>
            <template slot="label">
              <h4>验证手机</h4>
            </template>
          </el-form-item>

          <el-form-item label="手机号码">
            <span>{{ secretPhone }}</span>
          </el-form-item>

          <el-form-item label="手机验证码">
            <div class="code-box">
              <el-input class="input-box" v-model="verified.code" />
              <el-button
                type="primary"
                @click="handleGetCode"
                :disabled="code_disabled"
              >{{ code_txt }}</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-divider />
      <div class="footer">
        <el-button type="primary" @click="handleSubmit('verifiedForm')"
        >提交认证</el-button
        >
      </div>
    </div>
    <div v-else class="is_auth">
      <div class="card">
        <div class="card-head">
          <i class="el-icon-success"></i>
          <h1>您已通过了实名认证</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, uploadFile } from "@/api/upload";
import axios from "axios";
import { checkVerifyCode, getVerifyCode, authentication } from "@/api/user";

export default {
  name: "ProfileVerified",
  data() {
    const validateRealName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("输入真实姓名"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入接收到的验证码"));
      } else {
        checkVerifyCode({
          code: value,
          phone: this.verified.phone
        })
          .then(res => {
            switch (res.errno) {
              case 0:
                callback();
                break;
              case 10400:
                callback(new Error(res.message));
                break;
              case 10409:
                callback(new Error(res.message));
                break;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    const validateID_card = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("输入身份证号码"));
      } else {
        const reg = new RegExp(
          "(^\\d{8}(0\\d|10|11|12)([0-2]\\d|30|31)\\d{3}$)|(^\\d{6}(18|19|20)\\d{2}(0[1-9]|10|11|12)([0-2]\\d|30|31)\\d{3}(\\d|X|x)$)"
        );
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("身份证有误，请重新输入"));
        }
      }
    };
    return {
      verified: {
        realName: "",
        cardType: "身份证",
        ID_card: "",
        phone: "",
        code: "",
        frontImg: "",
        backImg: ""
      },
      rules: {
        realName: [{ validator: validateRealName, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        ID_card: [{ validator: validateID_card, trigger: "blur" }]
      },
      userInfo: {},
      token: "",
      frontSrc: "http://imgapi.justinjsn.cn/img3.png",
      backSrc: "http://imgapi.justinjsn.cn/img2.png",
      domain: "https://upload-z2.qiniup.com",
      qiniuAddress: "imgapi.justinjsn.cn",
      timing: 120,
      code_disabled: false,
      code_txt: "发送验证码"
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

    this.verified.phone = this.userInfo.phone;

    this.token = JSON.parse(localStorage.getItem("SH_token"));
  },
  watch: {
    $route(to, from) {
      this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

      this.verified.phone = this.userInfo.phone;

      this.token = JSON.parse(localStorage.getItem("SH_token"));
    }
  },
  computed: {
    secretPhone() {
      return this.verified.phone.replace(
        this.verified.phone.substring(3, 8),
        "*****"
      );
    }
  },
  methods: {
    /**
     * 上传身份证正面照
     * @param e
     * @returns {Promise<void>}
     */
    async handleUploadFront(e) {
      const fileList = e.target.files;
      let formData = new FormData();

      formData.append("name", fileList[0].name);
      formData.append("file", fileList[0]);

      try {
        uploadFile(formData)
          .then(res => {
            if (res.errno === 0) {
              this.frontSrc = res.data.url;
              this.verified.frontImg = res.data.url;
            }
          })
          .catch(err => {
            console.log(err);
          });
        // const qiniuRes = await this.upload(fileList);
        // this.verified.frontImg = `http://${this.qiniuAddress}/${qiniuRes.data.key}`;
        // this.frontSrc = `http://${this.qiniuAddress}/${qiniuRes.data.key}`;
      } catch (err) {
        console.log(err);
      }
    },
    /**
     * 上传身份证背面
     * @param e
     * @returns {Promise<void>}
     */
    async handleUploadBack(e) {
      const fileList = e.target.files;

      let formData = new FormData();

      formData.append("name", fileList[0].name);
      formData.append("file", fileList[0]);

      try {
        uploadFile(formData)
          .then(res => {
            if (res.errno === 0) {
              this.backSrc = res.data.url;
              this.verified.backImg = res.data.url;
            }
          })
          .catch(err => {
            console.log(err);
          });

        // const qiniuRes = await this.upload(fileList);
        // this.verified.backImg = `http://${this.qiniuAddress}/${qiniuRes.data.key}`;
        // this.backSrc = `http://${this.qiniuAddress}/${qiniuRes.data.key}`;
      } catch (err) {
        console.log(err);
      }
    },

    handleClickUploadBack() {
      const uploadDOM = document.querySelector("#upload-back");
      uploadDOM.click();
    },
    handleClickUploadFront() {
      const uploadDOM = document.querySelector("#upload-front");
      uploadDOM.click();
    },

    // 获取手机验证码
    handleGetCode() {
      getVerifyCode({
        phone: this.verified.phone
      })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              type: "success",
              title: "发送成功",
              message: "验证码已发送，5分钟内有效"
            });
          }
          switch (res.errno) {
            case 10400:
              this.$message({
                message: "发送失败",
                type: "error"
              });
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
      let timer = setInterval(() => {
        this.timing--;
        this.code_disabled = true;
        this.code_txt = `${this.timing}s后重试`;
        if (this.timing <= 0) {
          clearInterval(timer);
          this.code_disabled = false;
          this.timing = 120;
          this.code_txt = "重新获取";
        }
      }, 1000);
    },

    /**
     * 提交验证
     * @param formName 表单名
     */
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.verified.frontImg && this.verified.backImg) {
            authentication(
              {
                frontImg: this.verified.frontImg,
                backImg: this.verified.backImg,
                ID_card: this.verified.ID_card,
                realName: this.verified.realName,
                user_id: this.userInfo._id
              },
              this.token
            )
              .then(res => {
                if (res.errno === 0) {
                  localStorage.setItem('SH_userInfo', JSON.stringify(res.data));
                  this.userInfo = res.data;
                  this.$message({
                    message: '认证成功',
                    type: 'success'
                  });
                  window.location.reload();
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  })
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$notify({
              title: "上传错误",
              message: "请上传身份证正反面照片",
              type: "error"
            });
          }
        } else {
          return false;
        }
      });
    },

    /**
     * 上传图片至七牛云
     * @param fileList
     */
    async upload(fileList) {
      const SH_token = JSON.parse(window.localStorage.getItem("SH_token"));
      const headers = {
        "Content-Type": "multipart/form-data"
      };
      const fileType = fileList[0].name.split(".")[1];
      const fileName = fileList[0].name.split(".")[0];
      // 上传图片的名字
      const uploadName = `web-imgList_${this.formatDate(
        new Date()
      )}_${fileName}.${fileType}`;
      try {
        // 获取上传凭证
        const tokenRet = await getToken(SH_token);
        // 上传数据
        const formData = new FormData();
        formData.append("file", fileList[0]);
        formData.append("token", tokenRet.data.QiniuToken);
        formData.append("key", uploadName);
        // 上传至七牛云
        return await axios.post(this.domain, formData, headers);
      } catch (ex) {
        console.log(ex);
      }
    },

    formatDate(date) {
      let baseTime = date.toLocaleDateString();
      let Hours =
        date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
      let Minutes =
        date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
      let Seconds =
        date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;
      return `${baseTime}-${Hours}:${Minutes}:${Seconds}`;
    }
  }
};
</script>

<style scoped lang="scss">
.setting-header {
  padding: 10px 0 20px 10px;
  .point {
    float: left;
    width: 4px;
    height: 16px;
    background-color: #00a1d6;
    border-radius: 4px;
  }
  .title {
    padding-left: 8px;
    color: #00a1d6;
  }
}
.precautions {
  background-color: #f4f4f4;
  padding: 10px 20px;
  h1 {
    font-size: 18px;
    color: #00a1d6;
    font-weight: 400;
  }
  .tips-box {
    p {
      line-height: 1.8;
    }
    p > i {
      padding-right: 8px;
      color: #ff5777;
    }
    p:first-child {
      padding: 12px 0;
    }
  }
}
.form-main {
  width: 80%;
  margin: 20px auto;
  padding-bottom: 20px;
}
.code-box {
  display: flex;
  .input-box {
    width: 50%;
    margin-right: 20px;
  }
}
.footer {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.upload-box {
  display: flex;
  justify-content: space-between;
  figure {
    width: 250px;
    .outer-box1,
    .outer-box2 {
      display: inline-block;
      position: relative;
      height: 130px;
      width: 227px;
      cursor: pointer;
      border-radius: 14px;
      input {
        display: none;
      }
      &:hover {
        &:before {
          content: "";
          display: inline-block;
          position: absolute;
          height: 130px;
          width: 227px;
          top: 50%;
          left: 50%;
          z-index: 3;
          background-color: rgba(0, 0, 0, 0.4);
          transform: translate(-50%, -50%);
          border-radius: 14px;
        }
        &:after {
          content: "";
          display: inline-block;
          position: absolute;
          width: 50px;
          height: 50px;
          top: 50%;
          left: 50%;
          z-index: 4;
          background: url("~@/assets/images/upload.svg") no-repeat;
          background-size: contain;
          transform: translate(-50%, -50%);
        }
      }
    }
    .outer-box1 {
      background-size: cover;
      &:before {
        content: "";
        display: inline-block;
        height: 130px;
        width: 227px;
      }
    }
    .outer-box2 {
      background-size: cover;
    }
    figcaption {
      span {
        color: #717171;
        font-size: 12px;
      }
    }
  }
}
.is_auth {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.card {
  width: 50%;
  padding: 10px 0;
  .card-head {
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 24px;
      color: #86ee7e;
      margin-right: 10px;
    }
  }
}
</style>
