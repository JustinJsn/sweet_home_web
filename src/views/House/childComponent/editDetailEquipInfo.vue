<template>
  <el-card style="margin-top: 20px;height: 379px;">
    <div slot="header" class="card-header">
      <span>配备设施</span>
      <el-button
        circle
        class="add-button"
        icon="el-icon-plus"
        size="medium"
        type="primary"
        @click="addEquipInfo"
      />
    </div>
    <el-form ref="ruleForm" :model.sync="detailInfo" class="equip">
      <el-form-item
        style="margin: 6px 8px"
        v-for="(value, name) of detailInfo.equipe_facility"
        :key="name"
      >
        <figure style="margin-bottom: 14px;">
          <img :src="value.icon" alt="pic" />
          <figcaption>
            {{ name }}
          </figcaption>
        </figure>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      center
      title="添加配备设施"
      width="700px"
    >
      <el-row style="display: flex; align-items: center" :gutter="20">
        <el-col :span="8">
          <el-select v-model="equipmentInfo.equip_name">
            <el-option
              v-for="item in equipmentInfo.equipmentName"
              :key="item._id"
              :label="item.equip_name"
              :value="item.equip_name"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-switch
            v-model="equipmentInfo.facility"
            active-color="#13ce66"
            active-text="已配备"
            inactive-color="#ff4949"
            inactive-text="暂无"
            style="display: block"
          >
          </el-switch>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button type="primary" @click="addEquip">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'editDetailEquipInfo',
  props: {
    detailInfo: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
      equipmentInfo: {
        equipmentName: [],
        equip_name: '',
        facility: false,
      },
    };
  },
  created() {
    this.getEquipment();
  },
  methods: {
    addEquipInfo() {
      this.dialogVisible = true;
      this.$emit('addEquipInfo');
    },
    addEquip() {

      axios.get('http://api.justinjsn.cn/admin/equipment', {
        params: {
          equip_name: this.equipmentInfo.equip_name,
          facility: this.equipmentInfo.facility,
        }
      })
        .then((res) => {
          if (res.data.errno === 0) {
            const name = res.data.data[0].equip_name;
            if (this.detailInfo.equipe_facility) {
              this.$set(this.detailInfo.equipe_facility, name, {
                icon: this.equipmentInfo.facility
                  ? res.data.data[0].equip_have
                  : res.data.data[0].equip_none,
                facility: this.equipmentInfo.facility,
              });
            } else {
              // 添加不存在属性时需要通过 $set 添加才能实现页面实时响应
              this.$set(this.detailInfo, 'equipe_facility', {
                [name]: {
                  icon: this.equipmentInfo.facility
                    ? res.data.data[0].equip_have
                    : res.data.data[0].equip_none,
                  facility: this.equipmentInfo.facility,
                },
              });
            }
          }
        })
        .catch((ex) => {
          this.$message({
            message: ex,
            type: 'error',
          });
        });
      this.dialogVisible = false;
    },
    getEquipment() {

      axios.get('http://api.justinjsn.cn/admin/equipment', {
        params: {
          equip_name: this.equipmentInfo.equip_name,
          facility: this.equipmentInfo.facility,
        }
      })
        .then((res) => {
          if (res.data.errno === 0) {
            this.equipmentInfo.equipmentName = res.data.data;
          } else {
            this.$message({
              message: res.message,
              type: 'error',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.equip {
  display: flex;
  flex-wrap: wrap;

  figure {
    margin: 0 10px;
    text-align: center;
  }

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
