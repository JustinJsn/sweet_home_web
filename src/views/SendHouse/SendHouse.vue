<template>
  <div id="send-house">
    <house-detail-nav-bar />
    <div class="send-main">
      <div class="send-header">
        <el-divider>
          <h1>发布出售房源</h1>
        </el-divider>
        <div class="prompt">
          <span>！提示: 用户需先通过实名认证后才可发布房源</span>
        </div>
      </div>
      <div class="send-body">
        <el-form
          :model="houseForm"
          :rules="rules"
          ref="houseForm"
          label-width="120px"
        >
          <el-form-item label="小区所在城市" prop="district">
            <div class="address-container">
              <p class="city">{{ houseForm.city }}</p>
              <el-select v-model="houseForm.district" placeholder="请选择">
                <el-option
                  v-for="item in city"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="小区" prop="village">
            <el-input
              class="input-border"
              v-model="houseForm.village"
              placeholder="请输入小区名"
            />
          </el-form-item>
          <el-form-item label="房屋地址" prop="floor">
            <div class="input-address">
              <el-input placeholder="楼层，如(高楼层 32层)" v-model="houseForm.floor" />
              <el-input placeholder="单元号" v-model="houseForm.unit" />
              <el-input placeholder="门牌号" v-model="houseForm.house" />
            </div>
          </el-form-item>
          <el-form-item label="期望租金" prop="rent">
            <el-input
              class="input-border"
              placeholder="请输入你期望租出的价格"
              v-model="houseForm.rent"
            >
              <span slot="append">元/月</span>
            </el-input>
          </el-form-item>
          <el-form-item label="出租方式" prop="type">
            <el-select v-model="houseForm.type">
              <el-option
                v-for="item in rentalMethod"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="称呼" prop="nickName">
            <el-input
              v-model="houseForm.nickName"
              class="input-border"
              placeholder="我们应该如何称呼您"
            />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input
              v-model="houseForm.phone"
              class="input-border"
              placeholder="您的联系方式，方便我们及时联系您"
            />
          </el-form-item>
          <el-form-item prop="code" label="验证码">
            <div class="code-box">
              <el-input
                class="input-border"
                placeholder="验证码"
                v-model="houseForm.code"
              />
              <img
                :src="imgSrc"
                @click="handleChangeCode"
                alt="验证码"
                style="cursor: pointer"
              />
            </div>
          </el-form-item>
          <el-form-item class="form-footer">
            <el-button type="primary" @click="handleSubmit('houseForm')"
              >提交委托</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import city from "@/utils/city";
import { VerifyImgCode } from "@/api/user";
import { createEntrusted } from "@/api/entrusted_rental";
import HouseDetailNavBar from "../HouseDetail/childComponent/HouseDetailNavBar.vue";

export default {
  components: { HouseDetailNavBar },
  name: "SendHouse",
  data() {
    const validateRent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入期望租金"));
      } else {
        if (/^[1-9].*[0-9]$/.test(value)) {
          callback();
        } else {
          callback(new Error("格式错误"));
        }
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请告知您的联系方式"));
      } else {
        if (/^1[3456789]\d{9}$/.test(value)) {
          callback();
        } else {
          callback(new Error("手机号码格式有误"));
        }
      }
    };
    const validateDistrict = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择所在城市"));
      } else {
        callback();
      }
    };
    const validateVillage = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入小区所在位置"));
      } else {
        callback();
      }
    };
    const validateFloor = (rule, value, callback) => {
      if (value && this.houseForm.unit && this.houseForm.house) {
        callback();
      } else {
        callback(new Error("请输入房屋地址"));
      }
    };
    const validateNick = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请告知我们您的称呼"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else {
        VerifyImgCode({
          code: value,
          email: this.imgSrc.split("?email=")[1]
        })
          .then(res => {
            switch (res.errno) {
              case 0:
                callback();
                break;
              case 10409:
                callback(new Error("验证码过期，请重新获取"));
                break;
              case 10400:
                callback(new Error("验证码错误，请重新输入"));
                break;
            }
          })
          .then(err => err);
      }
    };
    return {
      houseForm: {
        city: "广州市",
        district: "",
        village: "",
        floor: "",
        unit: "",
        house: "",
        rent: "",
        type: "整租",
        nickName: "",
        phone: "",
        code: ""
      },
      rules: {
        district: [{ validator: validateDistrict, trigger: "blur" }],
        village: [{ validator: validateVillage, trigger: "blur" }],
        floor: [{ validator: validateFloor, trigger: "blur" }],
        rent: [{ validator: validateRent, trigger: "blur" }],
        nickName: [{ validator: validateNick, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      },
      rentalMethod: [
        { label: "整租", value: "整租" },
        { label: "合租", value: "合租" }
      ],
      city,
      imgSrc: "http://api.justinjsn.cn/api/v1/code/imgCode"
    };
  },
  created() {
    const { email } = JSON.parse(localStorage.getItem("SH_userInfo"));
    this.imgSrc += `?email=${email}${Date.now()}`;
  },
  methods: {
    handleSubmit(formName) {
      let postData = cloneDeep(this.houseForm);
      delete postData.code;
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
          const token = JSON.parse(localStorage.getItem("SH_token"));
          postData.user_id = userInfo._id;
          postData.rent = Number(postData.rent);
          if (userInfo.landlord) {
            createEntrusted(postData, token)
              .then(res => {
                switch (res.errno) {
                  case 0:
                    this.$notify({
                      type: "success",
                      message: "请耐心等待审核信息",
                      title: "委托成功",
                      duration: 1000
                    });
                    break;
                  case 10500:
                    this.$message({
                      type: "error",
                      message: res.message,
                      duration: 1000
                    });
                    break;
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message({
              message: "请先前往个人中心完成实名认证,再进行委托出租",
              type: "error",
              duration: 1000
            });
          }
        } else {
          return false;
        }
      });
    },
    handleChangeCode() {
      const { email } = JSON.parse(localStorage.getItem("SH_userInfo"));
      this.imgSrc = `http://api.justinjsn.cn/api/v1/code/imgCode?email=${email}${Date.now()}`;
    }
  }
};
</script>

<style scoped lang="scss">
.send-main {
  width: 1065px;
  margin: 80px auto;
}
.send-body {
  width: 70%;
  margin: 50px auto;
  padding-bottom: 40px;
}
.address-container {
  display: flex;
  align-items: center;
  .city {
    width: 80px;
    text-align: center;
    color: #c2c2c2;
  }
}

.input-border {
  ::v-deep .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #c2c2c2;
  }
  ::v-deep .el-input-group__append {
    border: none;
    border-bottom: 1px solid #c2c2c2;
    background-color: transparent;
    span {
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}
.input-address {
  display: flex;
  width: 100%;
  ::v-deep .el-input__inner {
    width: 90%;
  }
}
.el-form-item {
  margin-bottom: 34px;
}
.form-footer {
  display: flex;
  justify-content: center;
}
.code-box {
  display: flex;
  align-items: center;
}
.prompt {
  padding-left: 40px;
  span {
    color: red;
  }
}
</style>
