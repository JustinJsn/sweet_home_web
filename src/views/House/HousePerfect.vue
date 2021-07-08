<template>
  <div id="house-perfect">
    <house-detail-nav-bar />

    <div class="perfect-title">
      <h2>完善房源信息</h2>
    </div>

    <div class="main">
      <el-form :model="houseInfo" :inline="true" :rules="rules" ref="houseForm">
        <el-form-item label="所在城市：">
          <el-input disabled v-model="houseInfo.city" />
        </el-form-item>

        <el-form-item label="所在县区：" prop="district">
          <el-select v-model="houseInfo.district" placeholder="请选择">
            <el-option
              v-for="item in city"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所在小镇：" prop="town">
          <el-input
            style="width: 240px;"
            v-model="houseInfo.town"
            placeholder="请输入所在小镇(如太平镇)"
          />
        </el-form-item>

        <el-form-item label="详细地址：" prop="village" class="detail_addr">
          <el-input
            disabled
            v-model="houseInfo.village"
            placeholder="请输入详细地址(例如富力天朗明居)"
          />
        </el-form-item>

        <el-form-item label="房屋类型：" prop="type">
          <el-select v-model="houseInfo.type" placeholder="请选择">
            <el-option label="整租" value="整租" />
            <el-option label="合租" value="合租" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签信息：" prop="tags">
          <el-select v-model="houseInfo.tags" placeholder="请选择标签信息">
            <el-option
              v-for="item in tagList"
              :key="item._id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="租金：" prop="price">
          <el-tooltip
            effect="dark"
            content="元/月"
            :enterable="false"
            placement="right"
          >
            <el-input v-model="houseInfo.rent" placeholder="月租价格" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="押金：" prop="deposit">
          <el-tooltip
            effect="dark"
            content="元/月"
            :enterable="false"
            placement="right"
          >
            <el-input v-model="houseInfo.deposit" placeholder="押金价格" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="楼层：" prop="floor">
          <el-input
            v-model="houseInfo.floor"
            placeholder="楼层(如中楼层 7层)"
          />
        </el-form-item>

        <el-form-item label="面积：" prop="area">
          <el-tooltip effect="dark" content="㎡" placement="right">
            <el-input v-model="houseInfo.area" placeholder="房屋面积，单位m²" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="用水：" prop="water">
          <el-input v-model="houseInfo.water" placeholder="如：民水" />
        </el-form-item>

        <el-form-item label="用电：" prop="electricity">
          <el-input v-model="houseInfo.electricity" placeholder="如：民电" />
        </el-form-item>

        <el-form-item label="电梯：" prop="elevator">
          <el-input v-model="houseInfo.elevator" placeholder="如：有" />
        </el-form-item>

        <el-form-item label="车位：" prop="parkingSpace">
          <el-input
            v-model="houseInfo.parkingSpace"
            placeholder="如：有。无则暂无数据"
          />
        </el-form-item>

        <el-form-item label="户型：" prop="unit_type">
          <el-input
            v-model="houseInfo.unit_type"
            placeholder="房间类型(如3室2厅1卫)"
          />
        </el-form-item>

        <el-form-item label="朝向：" prop="towards">
          <el-input placeholder="如：南 北" v-model="houseInfo.towards" />
        </el-form-item>

        <el-form-item label="采暖：" prop="heating">
          <el-input
            v-model="houseInfo.heating"
            placeholder="如：有。无则暂无数据"
          />
        </el-form-item>

        <el-form-item label="租期：" prop="leaseTerm">
          <el-input v-model="houseInfo.leaseTerm" placeholder="如：1年以内" />
        </el-form-item>

        <el-form-item label="维护时间：" prop="brand_time">
          <el-date-picker
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            v-model="houseInfo.brand_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="完整地址：" prop="fullAddr">
          <el-input
            @focus="map = true"
            style="width: 520px"
            placeholder="聚焦获取地图信息"
            v-model="houseInfo.fullAddr.value"
            prefix-icon="el-icon-position"
          />
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="map" top="2vh" title="百度地图" width="850px">
        <div class="map">
          <house-map @handleSelect="handleSelect" />
        </div>
      </el-dialog>

      <el-row :gutter="20" type="flex">
        <el-col :span="11">
          <edit-detail-equip-info :detail-info="houseInfo" />
        </el-col>
        <el-col :span="13">
          <!-- 描述信息 -->
          <el-card style="margin-top: 20px;height: 379px;">
            <template slot="header">
              <span>描述信息</span>
            </template>

            <quill-editor
              style="height: 210px;font-size: 18px;"
              :options="editorOption"
              @change="onEditorChange($event)"
              :content="houseInfo.description"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-card style="margin-top: 20px">
        <div slot="header" class="card-header">
          <span>首页展示图</span>
        </div>

        <upload
          ref="uploadFile"
          :file-list="file_list"
          :limit="1"
          @set_currentURL="set_currentURL"
        />
      </el-card>

      <!-- 轮播图-大图 -->
      <el-card style="margin-top: 20px">
        <div slot="header" class="card-header">
          <span>轮播图</span>
        </div>

        <upload
          ref="big"
          :limit="10"
          :file-list="slide_big"
          @set_currentURL="set_currentBig"
        />
      </el-card>

      <!-- 详情展示图 -->
      <el-card style="margin-top: 20px">
        <div slot="header" class="card-header">
          <span>详情图</span>
        </div>

        <upload
          ref="pic"
          :limit="10"
          :file-list="detail_pic"
          @set_currentURL="set_currentPic"
        />
      </el-card>

      <div class="footer">
        <el-button type="primary" @click="handleSubmit('houseForm')">
          完善信息
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import HouseDetailNavBar from "../HouseDetail/childComponent/HouseDetailNavBar.vue";
import editDetailEquipInfo from "@/views/House/childComponent/editDetailEquipInfo";
import HouseMap from "@/views/House/childComponent/HouseMap";
import upload from "@/components/content/upload";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

import { getRental, createHouse } from "@/api/house";
import city from "@/utils/city";
import { cloneDeep } from "lodash";

export default {
  name: "HousePerfect",
  components: {
    upload,
    HouseMap,
    quillEditor,
    HouseDetailNavBar,
    editDetailEquipInfo
  },
  data() {
    const commonValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };

    const addrValidate = (rule, value, callback) => {
      if (value.value === "") {
        callback(new Error("不能为空"))
      } else {
        callback();
      }
    };

    const priceValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        if (Number.isNaN(value)) {
          callback(new Error("请输入数字"))
        } else {
          callback();
        }
      }
    };

    const depositValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        if (isNaN(value)) {
          callback(new Error("请输入数字"))
        } else {
          callback();
        }
      }
    }
    return {
      houseInfo: {
        tags: "",
        town: "",
        area: "",
        water: "",
        towards: "",
        heating: "",
        img_src: "",
        deposit: "",
        elevator: "",
        unit_type: "",
        leaseTerm: "",
        detail_pic: [],
        brand_time: "",
        electricity: "",
        description: "",
        parkingSpace: "",
        equipe_facility: {},
        fullAddr: {
          value: "",
          point: {}
        },
      },
      rules: {
        town: [{ validator: commonValidate, trigger: "blur" }],
        tags: [{ validator: commonValidate, trigger: "blur" }],
        type: [{ validator: commonValidate, trigger: "blur" }],
        area: [{ validator: commonValidate, trigger: "blur" }],
        price: [{ validator: priceValidate, trigger: "blur" }],
        water: [{ validator: commonValidate, trigger: "blur" }],
        floor: [{ validator: commonValidate, trigger: "blur" }],
        fullAddr: [{ validator: addrValidate, trigger: "change" }],
        towards: [{ validator: commonValidate, trigger: "blur" }],
        heating: [{ validator: commonValidate, trigger: "blur" }],
        village: [{ validator: commonValidate, trigger: "blur" }],
        deposit: [{ validator: depositValidate, trigger: "blur" }],
        district: [{ validator: commonValidate, trigger: "blur" }],
        elevator: [{ validator: commonValidate, trigger: "blur" }],
        leaseTerm: [{ validator: commonValidate, trigger: "blur" }],
        unit_type: [{ validator: commonValidate, trigger: "blur" }],
        brand_time: [{ validator: commonValidate, trigger: "blur" }],
        electricity: [{ validator: commonValidate, trigger: "blur" }],
        parkingSpace: [{ validator: commonValidate, trigger: "blur" }]
      },
      city,
      map: false,
      tagList: [
        { value: "双卫生间", _id: 2 },
        { value: "随时看房", _id: 3 },
        { value: "开放厨房", _id: 6 },
        { value: "精装", _id: 1 },
        { value: "独栋", _id: 4 },
        { value: "月租", _id: 5 }
      ],
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }]
          ]
        },
        placeholder: "Insert text here ..."
      },
      post_img_src: "",
      slide: {
        slide_big: []
      },
      storeBig: [],
      storePic: [],
      slide_big: [],
      detail_pic: []
    };
  },
  created() {
    this.token = JSON.parse(localStorage.getItem("SH_token"));
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

    this.rental_id = this.$route.params.id;

    console.log(this.rental_id);

    this.getRentalInfo();
  },
  computed: {
    file_list() {
      return cloneDeep([{ url: this.houseInfo.house_pic }]);
    }
  },
  methods: {
    // 获取委托信息
    getRentalInfo() {
      getRental({ id: this.rental_id }, this.token)
        .then(res => {
          for (let item in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, item)) {
              this.$set(this.houseInfo, item, res.data[item]);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 富文本修改触发绑定数据
     * @param quill
     * @param html
     * @param text
     */
    onEditorChange({ quill, html, text }) {
      this.houseInfo.description = html;
    },

    set_currentURL(img_src) {
      this.post_img_src = img_src;

      if (this.post_img_src === "") {
        this.$message({ message: "展示图不能为空", type: "error" });
      } else {
        this.houseInfo.img_src = img_src;
        // this.houseInfo.house_pic;
      }
    },

    set_currentBig(img_src) {
      // 存入临时
      this.storeBig.push(img_src);
    },

    set_currentPic(img_src) {
      // 存入临时
      this.storePic.push(img_src);
    },

    handleSelect(detail) {
      [this.houseInfo.fullAddr.value, this.houseInfo.fullAddr.point] = [
        detail.value,
        detail.point
      ];
    },

    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          createHouse({
            owner: this.userInfo._id,
            tags: this.houseInfo.tags,
            type: this.houseInfo.type,
            town: this.houseInfo.town,
            area: this.houseInfo.area,
            detail_pic: this.storePic,
            floor: this.houseInfo.floor,
            village: this.houseInfo.village,
            img_src: this.houseInfo.img_src,
            towards: this.houseInfo.towards,
            fullAddr: this.houseInfo.fullAddr,
            district: this.houseInfo.district,
            price: Number(this.houseInfo.rent),
            unit_type: this.houseInfo.unit_type,
            brand_time: this.houseInfo.brand_time,
            deposit: Number(this.houseInfo.deposit),
            description: this.houseInfo.description,
            equipe_facility: this.houseInfo.equipe_facility,
            slide: {
              slide_big: this.storeBig,
              slide_small: this.storeBig
            },
            base_info: [
              `面积：${this.houseInfo.area}㎡`,
              `朝向：${this.houseInfo.towards}`,
              `维护：${this.houseInfo.brand_time}`,
              `电梯：${this.houseInfo.elevator}`,
              `楼层：${this.houseInfo.floor.split(' ').join('/')}`,
              `用水：${this.houseInfo.water}`,
              `用电：${this.houseInfo.electricity}`,
              `采暖：${this.houseInfo.heating}`,
              `租期：${this.houseInfo.leaseTerm}`,
              `车位：${this.houseInfo.parkingSpace}`,
            ],
          }, this.token).then(res => {
            console.log(res);

            switch(res.errno) {
              case 0:
                this.$notify({
                  title: "信息已提交",
                  message: "信息提交成功",
                  type: "success",
                  duration: 1000
                })
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.$message({
            message: '信息有误',
            type: 'warning',
            duration: 1000
          })
          return false;
        }
      })
    },
  }
};
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.perfect-title,
.main {
  width: 1065px;
  margin: 40px auto 0;
}

.perfect-title {
  text-align: center;
}

#house-perfect {
  padding-bottom: 40px;
}

::v-deep .ql-editor {
  font-size: 16px !important;
  letter-spacing: 2px;
}

.el-form-item {
  margin: 0 24px 32px 0;
}

.footer {
  margin-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
}

.map {
  width: 100%;
  height: 550px;
}
</style>
