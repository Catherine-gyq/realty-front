<template>
<div>
  <ul class="ep-pager-list" @click="handleClick" v-loading="loading" ep-loading-custom-class="ep-pager-loading">
    <li class="ep-pager-icon ion-chevron-left"
        :class="{ 'is-disabled': leftDisabled }"></li>
    <li v-if="pageCount > 0"
        :class="{ active: 1 === nowPage  }">1</li>
    <li v-if="showLeftMore" class="ep-pager-more">...</li>

    <li v-for="(page, index) in pagers"
        :key="index"
        :class="{ 'active': page === nowPage }">{{ page }}</li>
    <li v-if="showRightMore" class="ep-pager-more">...</li>
    <li v-if="pageCount > 1"
        :class="{ active: nowPage === pageCount }">{{ pageCount }}</li>
    <li class="ep-pager-icon ion-chevron-right"
        :class="{ 'is-disabled': rightDisabled }"></li>
  </ul>

</div>
</template>

<script>
export default {
  name: "dataPager",

  props: {
    nowPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default () { return [10, 20, 50, 100] }
    },
    totalNum: Number,
    pageCount: Number,
    layout: {
      type: String,
      default: 'total, sizeChange, pager, jump'
    },
    right: Boolean,
    dataSize: {
      type: Number,
      default: 0
    },
    loading: Boolean,
  },
  data() {
    return {
      currentPageSize: this.pageSize,
      internalNowPage: 1
    }
  },

  computed: {
    internalPageCount() {
      if (typeof this.totalNum === 'number') {
        return Math.ceil(this.totalNum / this.currentPageSize) || 1
      } else if (typeof this.pageCount === 'number') {
        return this.pageCount;
      }
      return null;
    }
  },

  render(h) {
    let style = this.right
        ? { textAlign: 'right' }
        : {};
    let template = <div class="ep-page" style={ style }></div>
    const TEMPLATE_HTML = {
      total: <total></total>,
      sizeChange: <size-change pageSizes={ this.pageSizes }></size-change>,
      pager: <Pager
          loading={ this.loading }
          now-page={ this.internalNowPage }
          page-count={ this.internalPageCount }
          on-change={ this.handleChange }
      ></Pager>,
      pagerSimple: <PagerSimple
          loading={ this.loading }
          dataSize={ this.dataSize }
          now-page={ this.internalNowPage }
          on-change={ this.handleChange }
          pageSize={ this.pageSize }
      ></PagerSimple>,
      jump: <jump now-page={ this.internalNowPage } on-trigger={ this.jumpTrigger }></jump>,
      slot: this.$slots.default ? this.$slots.default[0] : ''
    };
    template.children = template.children || []
    let components = []
    if (this.layout) {
      components = this.layout.split(',').map((item) => item.trim())
    }
    components.forEach(item => {
      template.children.push(TEMPLATE_HTML[item])
    });

    return template;
  },






}
</script>

<style scoped>

</style>
