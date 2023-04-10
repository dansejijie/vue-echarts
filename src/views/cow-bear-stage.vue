<template>
  <div class="fill-container">
    <Button v-for="button in buttonList" :key="button.key" @click="postStage(button.key)">{{
      button.label
    }}</Button>
  </div>
</template>
<script>
import axios from "../utils/http";
/**
 * echart https://echarts.apache.org/examples/en/index.html
 * 牛熊套利，链上喂价
 */
export default {
  data() {
    return {
      buttonList: [
        {
          key: "COW_BEGIN",
          label: "牛初",
        },
        {
          key: "COW_MIDDLE",
          label: "牛中",
        },
        {
          key: "COW_END",
          label: "牛末",
        },
        {
          key: "BEAR_BEGIN",
          label: "熊初",
        },
        {
          key: "BEAR_MIDDLE",
          label: "熊中",
        },
        {
          key: "BEAR_END",
          label: "熊末",
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    async postStage(stage) {
      const res = await axios.post("/task/cow-bear/stage", {stage});
      this.$Message.info(res.data.state ? '操作成功': res.data.message);
    },
  },
};
</script>
<style lang="less" scoped></style>
