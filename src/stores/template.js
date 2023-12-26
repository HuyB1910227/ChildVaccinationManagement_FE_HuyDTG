import { defineStore } from "pinia";

export const useTemplateStore = defineStore({
  id: "template",
  state: () => ({
    app: {
      name: "Immnuzation-system",
      version: "1.0.0",
      copyright: new Date().getFullYear(),
    },

    layout: {
      header: true,
      sidebar: true,
      sideOverlay: true,
      footer: true,
    },

    settings: {
      colorTheme: "",
      darkMode: false,
      darkModeSystem: false,
      sidebarLeft: true,
      sidebarMini: false,
      sidebarDark: true,
      sidebarVisibleDesktop: true,
      sidebarVisibleMobile: false,
      sideOverlayVisible: false,
      sideOverlayHoverable: false,
      pageOverlay: true,
      headerFixed: true,
      headerDark: false,
      headerSearch: false,
      headerLoader: false,
      pageLoader: false,
      rtlSupport: false,
      sideTransitions: true,
      mainContent: "",
    },
  }),
  actions: {
    setLayout(payload) {
      this.layout.header = payload.header;
      this.layout.sidebar = payload.sidebar;
      this.layout.sideOverlay = payload.sideOverlay;
      this.layout.footer = payload.footer;
    },
    sidebar(payload) {
      if (window.innerWidth > 991) {
        if (payload.mode === "open") {
          this.settings.sidebarVisibleDesktop = true;
        } else if (payload.mode === "close") {
          this.settings.sidebarVisibleDesktop = false;
        } else if (payload.mode === "toggle") {
          this.settings.sidebarVisibleDesktop =
            !this.settings.sidebarVisibleDesktop;
        }
      } else {
        if (payload.mode === "open") {
          this.settings.sidebarVisibleMobile = true;
        } else if (payload.mode === "close") {
          this.settings.sidebarVisibleMobile = false;
        } else if (payload.mode === "toggle") {
          this.settings.sidebarVisibleMobile =
            !this.settings.sidebarVisibleMobile;
        }
      }
    },
    sidebarMini(payload) {
      if (window.innerWidth > 991) {
        if (payload.mode === "on") {
          this.settings.sidebarMini = true;
        } else if (payload.mode === "off") {
          this.settings.sidebarMini = false;
        } else if (payload.mode === "toggle") {
          this.settings.sidebarMini = !this.settings.sidebarMini;
        }
      }
    },
    sidebarPosition(payload) {
      if (payload.mode === "left") {
        this.settings.sidebarLeft = true;
      } else if (payload.mode === "right") {
        this.settings.sidebarLeft = false;
      } else if (payload.mode === "toggle") {
        this.settings.sidebarLeft = !this.settings.sidebarLeft;
      }
    },
    sidebarStyle(payload) {
      if (payload.mode === "dark") {
        this.settings.sidebarDark = true;
      } else if (payload.mode === "light") {
        this.settings.sidebarDark = false;
      } else if (payload.mode === "toggle") {
        this.settings.sidebarDark = !this.settings.sidebarDark;
      }
    },
    sideOverlay(payload) {
      if (payload.mode === "open") {
        this.settings.sideOverlayVisible = true;
      } else if (payload.mode === "close") {
        this.settings.sideOverlayVisible = false;
      } else if (payload.mode === "toggle") {
        this.settings.sideOverlayVisible = !this.settings.sideOverlayVisible;
      }
    },
    sideOverlayHover(payload) {
      if (payload.mode === "on") {
        this.settings.sideOverlayHoverable = true;
      } else if (payload.mode === "off") {
        this.settings.sideOverlayHoverable = false;
      } else if (payload.mode === "toggle") {
        this.settings.sideOverlayHoverable =
          !this.settings.sideOverlayHoverable;
      }
    },
    pageOverlay(payload) {
      if (payload.mode === "on") {
        this.settings.pageOverlay = true;
      } else if (payload.mode === "off") {
        this.settings.pageOverlay = false;
      } else if (payload.mode === "toggle") {
        this.settings.pageOverlay = !this.settings.pageOverlay;
      }
    },
    header(payload) {
      if (payload.mode === "fixed") {
        this.settings.headerFixed = true;
      } else if (payload.mode === "static") {
        this.settings.headerFixed = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerFixed = !this.settings.headerFixed;
      }
    },
    headerStyle(payload) {
      if (payload.mode === "dark") {
        this.settings.headerDark = true;
      } else if (payload.mode === "light") {
        this.settings.headerDark = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerDark = !this.settings.headerDark;
      }
    },
    headerSearch(payload) {
      if (payload.mode === "on") {
        this.settings.headerSearch = true;
      } else if (payload.mode === "off") {
        this.settings.headerSearch = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerSearch = !this.settings.headerSearch;
      }
    },
    headerLoader(payload) {
      if (payload.mode === "on") {
        this.settings.headerLoader = true;
      } else if (payload.mode === "off") {
        this.settings.headerLoader = false;
      } else if (payload.mode === "toggle") {
        this.settings.headerLoader = !this.settings.headerLoader;
      }
    },
    pageLoader(payload) {
      if (payload.mode === "on") {
        this.settings.pageLoader = true;
      } else if (payload.mode === "off") {
        this.settings.pageLoader = false;
      } else if (payload.mode === "toggle") {
        this.settings.pageLoader = !this.settings.pageLoader;
      }
    },
    mainContent(payload) {
      if (payload.mode === "full") {
        this.settings.mainContent = "";
      } else if (payload.mode === "boxed") {
        this.settings.mainContent = "boxed";
      } else if (payload.mode === "narrow") {
        this.settings.mainContent = "narrow";
      }
    },
    darkMode(payload) {
      if (payload.mode === "on") {
        this.settings.darkMode = true;
      } else if (payload.mode === "off") {
        this.settings.darkMode = false;
      } else if (payload.mode === "toggle") {
        this.settings.darkMode = !this.settings.darkMode;
      }
    },
    darkModeSystem(payload) {
      if (payload.mode === "on") {
        this.settings.darkModeSystem = true;

        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          this.settings.darkMode = true;
        } else {
          this.settings.darkMode = false;
        }
      } else if (payload.mode === "off") {
        this.settings.darkModeSystem = false;
      }
    },
    setColorTheme(payload) {
      let regx = new RegExp("\\btheme-[^ ]*[ ]?\\b", "g");

      this.settings.colorTheme = payload.theme || "";

      document.body.className = document.body.className.replace(regx, "");

      if (payload.theme) {
        document.body.classList.add("theme-" + payload.theme);
      }
    },
    setSideTransitions(payload) {
      this.settings.sideTransitions = payload.transitions;
    },
  },
});
