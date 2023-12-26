<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useTemplateStore } from "@/stores/template";

const store = useTemplateStore();
const route = useRoute();

const props = defineProps({
  nodes: {
    type: Array,
    description: "The nodes of the navigation",
  },
  subMenu: {
    type: Boolean,
    default: false,
    description: "If true, a submenu will be rendered",
  },
  dark: {
    type: Boolean,
    default: false,
    description: "Dark mode for menu",
  },
  horizontal: {
    type: Boolean,
    default: false,
    description: "Horizontal menu in large screen width",
  },
  horizontalHover: {
    type: Boolean,
    default: false,
    description: "Hover mode for horizontal menu",
  },
  horizontalCenter: {
    type: Boolean,
    default: false,
    description: "Center mode for horizontal menu",
  },
  horizontalJustify: {
    type: Boolean,
    default: false,
    description: "Justify mode for horizontal menu",
  },
  disableClick: {
    type: Boolean,
    default: false,
    description:
      "Disables submenu click on 2+ level when we are in horizontal and hover mode",
  },
});

const classContainer = computed(() => {
  return {
    "nav-main": !props.subMenu,
    "nav-main-submenu": props.subMenu,
    "nav-main-dark": props.dark,
    "nav-main-horizontal": props.horizontal,
    "nav-main-hover": props.horizontalHover,
    "nav-main-horizontal-center": props.horizontalCenter,
    "nav-main-horizontal-justify": props.horizontalJustify,
  };
});

function subIsActive(paths) {
  const activePaths = Array.isArray(paths) ? paths : [paths];

  return activePaths.some((path) => {
    return route.path.indexOf(path) === 0;
  });
}

function linkClicked(e, submenu) {
  if (submenu) {
    let el = e.target.closest("li");
    if (
      !(
        window.innerWidth > 991 &&
        ((props.horizontal && props.horizontalHover) || props.disableClick)
      )
    ) {
      if (el.classList.contains("open")) {
        el.classList.remove("open");
      } else {
        Array.from(el.closest("ul").children).forEach((element) => {
          element.classList.remove("open");
        });

        el.classList.add("open");
      }
    }
  } else {
    if (window.innerWidth < 992) {
      store.sidebar({ mode: "close" });
    }
  }
}
</script>

<template>
  <ul :class="classContainer">
    <li
      v-for="(node, index) in nodes"
      :key="`node-${index}`"
      :class="{
        'nav-main-heading': node.heading,
        'nav-main-item': !node.heading,
        open:
          node.sub && node.subActivePaths
            ? subIsActive(node.subActivePaths)
            : false,
      }"
    >
      {{ node.heading ? node.name : "" }}
      <div v-if="!node.heading && !node.sub" @click="linkClicked($event)">
        <RouterLink
          v-if="
            !node.to.startsWith('http://') && !node.to.startsWith('https://')
          "
          :to="node.to && node.to !== '#' ? { name: node.to } : '#'"
          class="nav-main-link"
          :active-class="node.to && node.to !== '#' ? 'active' : ''"
        >
          <i v-if="node.icon" :class="`nav-main-link-icon ${node.icon}`"></i>
          <span v-if="node.name" class="nav-main-link-name">
            {{ node.name }}
          </span>
          <span
            v-if="node.badge"
            class="nav-main-link-badge badge rounded-pill"
            :class="
              node['badge-variant']
                ? `bg-${node['badge-variant']}`
                : 'bg-primary'
            "
            >{{ node.badge }}</span
          >
        </RouterLink>
        <a
          v-else
          :href="node.to"
          class="nav-main-link"
          :target="node.target || null"
        >
          <i v-if="node.icon" :class="`nav-main-link-icon ${node.icon}`"></i>
          <span v-if="node.name" class="nav-main-link-name">
            {{ node.name }}
          </span>
          <span
            v-if="node.badge"
            class="nav-main-link-badge badge rounded-pill"
            :class="
              node['badge-variant']
                ? `bg-${node['badge-variant']}`
                : 'bg-primary'
            "
            >{{ node.badge }}</span
          >
        </a>
      </div>

      <a
        v-else-if="!node.heading && node.sub"
        href="#"
        class="nav-main-link nav-main-link-submenu"
        @click.prevent="linkClicked($event, true)"
      >
        <i v-if="node.icon" :class="`nav-main-link-icon ${node.icon}`"></i>
        <span v-if="node.name" class="nav-main-link-name">{{ node.name }}</span>
        <span
          v-if="node.badge"
          class="nav-main-link-badge badge rounded-pill"
          :class="
            node['badge-variant'] ? `bg-${node['badge-variant']}` : 'bg-primary'
          "
          >{{ node.badge }}</span
        >
      </a>

      <BaseNavigation
        v-if="node.sub"
        :nodes="node.sub"
        sub-menu
        :disable-click="props.horizontal && props.horizontalHover"
      />
    </li>
  </ul>
</template>
