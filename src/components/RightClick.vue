<template>
  <div @contextmenu.prevent.stop="contextMenuHandler" v-click-outside="clickOutsideConfig" @blur="blurHandler">
    <slot></slot>
    <transition name="fade">
      <ul v-show="openMenu" :style="{top: top, left: left }" class="menu">
        <li v-for="item in items" @click.prevent="handleClick(item)" :key="item.id">
          <span v-if="item.template" v-html="item.template"></span>
          <span v-else>{{ item.name }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  // @ts-ignore
  import vClickOutside from 'v-click-outside'

  export type RightClickItem = {
    id: Number,
    template?: String,
    name?: String,
    action: String
  }

  @Component({
    directives: {
      clickOutside: vClickOutside.directive
    },
  })
  export default class RightClick extends Vue {
    @Prop({
      required: true
    })
    private items!: Array<Object>;

    private openMenu = false;
    private top = "0";
    private left = "0";
    public handleEvent!: (evt: Event) => void;

    public clickOutsideConfig = {
      handler: this.onClickOutside,
      middleware: this.middleware,
      events: ["dblclick", "click", "contextmenu"]
    };

    mounted() {
      this.handleEvent = function () {
        this.openMenu = false;
      };
      window!.document!.querySelector("html")!.addEventListener("click", this);
    }

    beforeDestroy() {
      window!.document!.querySelector("html")!.removeEventListener("click", this);
    }

    contextMenuHandler(e: MouseEvent) {
		window.document.querySelectorAll("ul .menu").forEach((x)=>x.style.display = "none");
		 this.openMenu = false;
		 this.$nextTick(()=>{
		   this.$emit("close");
		   this.top = "".concat(e.clientY - e.layerY + e.offsetY, "px");
		   this.left = "".concat(e.clientX - e.layerX + e.offsetX, "px");
		   this.openMenu = true;
		 })
    }

    handleClick(item: RightClickItem) {
      this.$emit("action", item.action);
      this.openMenu = false;
    }

    onClickOutside() {
      this.openMenu = false;
    }

    blurHandler() {
      this.openMenu = false;
    }

    middleware(e: any, el: any) {
      return true;
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    position: fixed;
    z-index: 1000;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    margin: 0;
    padding: 0;
    cursor: pointer;

    li {
      list-style-type: none;
      padding: 5px;

      &:hover {
        background-color: #ededed;
      }
    }

    li:not(:last-child) {
      border-bottom: 1px solid #e6e6e6;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
