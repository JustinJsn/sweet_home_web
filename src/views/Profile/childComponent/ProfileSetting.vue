<template>
  <div id="profile-setting">
    <div class="setting-header">
      <span class="point"></span>
      <span class="title">我的信息</span>
      <el-divider />
    </div>

    <el-form
      :model="userInfo"
      :rules="rules"
      ref="infoForm"
      label-width="100px"
      class="setting-form"
    >
      <el-form-item label="昵称:" prop="nickName">
        <el-input v-model="userInfo.nickName" />
      </el-form-item>

      <el-form-item label="邮箱:" prop="_id">
        <span class="id">{{ userInfo.email }}</span>
      </el-form-item>

      <el-form-item label="性别:">
        <el-radio-group v-model="userInfo.gender" size="mini">
          <el-radio-button label="1">男</el-radio-button>
          <el-radio-button label="0">女</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="用户名:" prop="_id">
        <span class="id">{{ userInfo._id }}</span>
      </el-form-item>

      <el-form-item label="手机号:" prop="_id">
        <span class="id">{{ userInfo.phone }}</span>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :disabled="disabled"
          @click="onSubmit('infoForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { update_info, check_nickName } from "@/api/user";

import { mapGetters } from "vuex";

import { cloneDeep, debounce } from "lodash";

export default {
  name: "ProfileSetting",
  data() {
    const that = this;
    const nickNameValidate = debounce(function(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入昵称"));
      } else {
        check_nickName(
          {
            nickName: that.userInfo.nickName,
            _id: that.userInfo._id
          },
          JSON.parse(window.localStorage.getItem("SH_token"))
        )
          .then(res => {
            if (res.errno === 0) {
              that.nickError = res.data.isExists ? "用户名已存在" : "";
              if (res.data.isExists) {
                that.disabled = true;
                callback(new Error("昵称已存在"));
              } else {
                that.disabled = false;
                callback();
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }, 360);
    return {
      userInfo: {},
      nickError: "",
      rules: {
        nickName: [{ validator: nickNameValidate, trigger: "change" }]
      },
      disabled: false
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  watch: {
    $route(to, from) {
      this.userInfo = cloneDeep(
        JSON.parse(window.localStorage.getItem("SH_userInfo"))
      );
    }
  },
  created() {
    this.userInfo = cloneDeep(
      JSON.parse(window.localStorage.getItem("SH_userInfo"))
    );
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          update_info(
            {
              _id: this.userInfo._id,
              nickName: this.userInfo.nickName,
              gender: Number(this.userInfo.gender)
            },
            JSON.parse(localStorage.getItem("SH_token"))
          )
            .then(res => {
              if (res.errno === 0) {
                window.localStorage.setItem(
                  "SH_userInfo",
                  JSON.stringify(res.data)
                );
                window.location.reload();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-form {
  width: 50%;
}

.setting-header {
  padding-left: 10px;
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

.id {
  font-size: 14px;
  color: #898989;
}
</style>
