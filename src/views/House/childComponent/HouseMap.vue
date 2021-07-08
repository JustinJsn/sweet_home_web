<template>
  <div id="house-map">
    <el-row :gutter="20" class="search-box">
      <el-col :span="12" style="display: flex">
        <el-autocomplete
          v-model="search.text"
          :fetch-suggestions="querySearch"
          placeholder="请输入详细地址"
          :trigger-on-focus="false"
          @select="handleSelect"
          style="width: 100%;"
        />
      </el-col>
    </el-row>

    <baidu-map class="map" :zoom="map.zoom" @ready="handler">
      <!--缩放-->
      <bm-navigation :anchor="map.navigateAnchor" />
      <!--定位-->
      <bm-geolocation
        :autoLocation="true"
        :showAddressBar="true"
        :anchor="map.geolocationAnchor"
      />
    </baidu-map>
  </div>
</template>

<script>
export default {
  name: "HouseMap",
  data: () => ({
    search: {
      text: "",
      point: {
        // 详细地址经纬度
        lng: 0,
        lat: 0
      }
    },
    map: {
      zoom: 15,
      show: true,
      dragging: true,
      location: "广州市",
      keyword: "从化区广州软件学院",
      navigateAnchor: "BMAP_ANCHOR_TOP_LEFT",
      geolocationAnchor: "BMAP_ANCHOR_BOTTOM_RIGHT"
    }
  }),
  methods: {
    handler({ BMap, map }) {
      this.$nextTick(() => {
        this.BMap = BMap;
        this.mapOpt = map;

        map.enableScrollWheelZoom(true);
        map.centerAndZoom("广州市从化区广州软件学院", 18);
      });
    },

    querySearch(queryString, cb) {
      const options = {
        onSearchComplete(res) {
          if (local.getStatus() === 0) {
            // 判断状态是否正确
            const s = [];
            for (let i = 0; i < res.getCurrentNumPois(); i++) {
              const x = res.getPoi(i);
              const item = { value: x.address + x.title, point: x.point };
              s.push(item);
              cb(s);
            }
          } else {
            cb();
          }
        }
      };
      const local = new this.BMap.LocalSearch(this.mapOpt, options); // 创建LocalSearch构造函数
      local.search(queryString); // 调用search方法，根据检索词str发起检索
    },

    handleSelect(item) {
      const { value, point } = item;
      this.search.text = value; // 记录详细地址，含建筑物名
      this.search.point = point; // 记录当前选中地址坐标
      this.mapOpt.clearOverlays(); // 清除地图上所有覆盖物
      this.mk = new this.BMap.Marker(point); // 根据所选坐标重新创建Marker
      this.mapOpt.addOverlay(this.mk); // 将覆盖物重新添加到地图中
      this.mapOpt.panTo(point); // 将地图的中心点更改为选定坐标点
      this.map.zoom = 19;

      this.$emit('handleSelect', { value, point });
    },

    handleConfirm() {
      this.$emit("handleConfirm", {
        value: this.search.text,
        point: this.search.point
      });
    }
  }
};
</script>

<style scoped lang="scss">
#house-map {
  height: 100%;
}

.map {
  height: 90%;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
