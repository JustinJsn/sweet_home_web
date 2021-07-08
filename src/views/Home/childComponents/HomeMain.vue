<template>
  <div class="main">
    <div class="entire">
      <div class="header">
        <h2>{{ title }}</h2>
        <div class="subtitle">
          <span>{{ subTitle }}</span>
          <a :href="moreUrl">更多</a>
        </div>
      </div>
      <div class="entire-body">
        <figure v-for="item of list" :key="item._id">
          <img
            :src="item.img_src"
            alt="展示图"
            @click="handleLinkToDetail(item.detail_id)"
          />
          <figcaption>
            <h5>{{ item.district }}·{{ item.town }}</h5>
            <h4 @click="handleLinkToDetail(item.detail_id)" :title="item.title">
              {{ item.title }}
            </h4>
            <p class="price">
              <span>{{ item.price }}</span> 元/月
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HomeMain",
  props: {
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    moreUrl: {
      type: String
    },
    list: {
      type: Array
    }
  },
  methods: {
    handleLinkToDetail(id) {
      window.location.href = `/house_detail/${id}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.entire {
  margin-top: 40px;
}
.entire .header .subtitle {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #666;
  }
}

.entire-body {
  display: flex;
  justify-content: space-between;
  line-height: 1.5;
  figure {
    img {
      border-radius: 4px;
      cursor: pointer;
    }
    h4 {
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price {
      span {
        color: red;
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
}
</style>
