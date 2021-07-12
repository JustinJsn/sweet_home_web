<template>
  <div class="carousel">
    <!-- swiper1 -->
    <swiper
      class="swiper gallery-top"
      :options="swiperOptionTop"
      v-show="slide.top.length"
      ref="swiperTop"
    >
      <swiper-slide v-for="(item, index) of slide.top" :key="index">
        <img :src="item" alt="轮播图大图" />
        <span class="tip">{{ index + 1 }}/{{ slide.top.length }}</span>
      </swiper-slide>
      <div
        class="swiper-button-next swiper-button-white"
        slot="button-next"
      ></div>
      <div
        class="swiper-button-prev swiper-button-white"
        slot="button-prev"
      ></div>
    </swiper>
    <!-- swiper2 Thumbs -->
    <swiper
      class="swiper gallery-thumbs"
      :options="swiperOptionThumbs"
      v-show="slide.top.length"
      ref="swiperThumbs"
    >
      <swiper-slide v-for="(item, index) of slide.top" :key="index">
        <img :src="item" alt="轮播图缩略图" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css"

export default {
  name: "HouseDetailCarousel",
  data() {
    return {
      swiperOptionTop: {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true
      }
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    slide: {
      type: Object
    }
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper;
      const swiperThumbs = this.$refs.swiperThumbs.$swiper;
      swiperTop.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiperTop;
    });
  }
};
</script>

<style scoped lang="scss">
.carousel {
  width: 565px;
  height: 100%;
  .gallery-top {
    width: 100%;
    height: 80%;
    margin-bottom: 10px;
    border-radius: 4px;
    .swiper-slide {
      position: relative;
      .tip {
        position: absolute;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 4px;
        z-index: 3;
        bottom: 10px;
        right: 20px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    img {
      width: 565px;
      height: 319px;
      border-radius: 4px;
    }
  }
  .gallery-thumbs {
    width: 100%;
    height: 20%;
    .swiper-slide {
      width: 20%;
      opacity: 0.4;
      border-radius: 4px;
    }
    img {
      width: 96px;
      height: 62px;
      cursor: pointer;
      border-radius: 4px;
    }
    .swiper-slide-active {
      opacity: 1;
    }
  }
}
</style>
