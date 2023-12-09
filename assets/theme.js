var SHTHelper = window.SHTHelper || {},
  TRAP_FOCUS_HANDLERS = {};
(SHTHelper.fetchConfigHTTP = {
  method: "POST",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/javascript",
  },
}),
  (SHTHelper.fetchConfigJSON = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  }),
  (SHTHelper.debounce = function (e, s) {
    let i = null;
    return function (t) {
      clearTimeout(i),
        (i = null),
        (i = setTimeout(function () {
          e.call(this, t);
        }, s));
    };
  }),
  (SHTHelper.removeTrapFocus = function (t = null) {
    document.removeEventListener("focusin", TRAP_FOCUS_HANDLERS.focusin),
      document.removeEventListener("focusout", TRAP_FOCUS_HANDLERS.focusout),
      document.removeEventListener("keydown", TRAP_FOCUS_HANDLERS.keydown),
      t && t.focus();
  }),
  (SHTHelper.trapFocus = function (e, t = e) {
    var s = SHTHelper.qs(".js-header-logo-link"),
      i = e.querySelectorAll(
        `a[href]:not([disabled]), [tabindex]:not([tabindex^='-']), summary, button:not([disabled]), textarea:not([disabled]), input:not([type=hidden]):enabled, input[type="text"]:not([disabled]), object, iframe, input[type="search"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])`
      );
    let n = i[0],
      r = i[i.length - 1];
    1 === i.length && s && (r = s);
    SHTHelper.removeTrapFocus(),
      (TRAP_FOCUS_HANDLERS.focusin = (t) => {
        (t.target !== e && t.target !== r && t.target !== n) ||
          document.addEventListener("keydown", TRAP_FOCUS_HANDLERS.keydown);
      }),
      (TRAP_FOCUS_HANDLERS.focusout = function () {
        document.removeEventListener("keydown", TRAP_FOCUS_HANDLERS.keydown);
      }),
      (TRAP_FOCUS_HANDLERS.keydown = function (t) {
        ("Tab" !== t.key && 9 !== t.keyCode) ||
          (t.shiftKey
            ? (t.target !== e && t.target !== n) ||
              (r.focus(), t.preventDefault())
            : t.target === r && (n.focus(), t.preventDefault()));
      }),
      document.addEventListener("focusout", TRAP_FOCUS_HANDLERS.focusout),
      document.addEventListener("focusin", TRAP_FOCUS_HANDLERS.focusin),
      t.focus();
  }),
  (SHTHelper.isColor = function (t) {
    var e = new Option().style;
    return (e.color = t), e.color == t;
  }),
  (SHTHelper.isHexColor = function (t) {
    return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(t);
  }),
  (SHTHelper.isImage = function (t) {
    return /(\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?/gi.test(
      t
    );
  }),
  (SHTHelper.preventStickyHeaderReveal = function () {
    var t = SHTHelper.qs("sht-sticky-header");
    t && t.dispatchEvent(new Event("preventStickyHeaderReveal"));
  }),
  (SHTHelper.formatMoney = function (t, e = "") {
    "string" == typeof t && (t = t.replace(".", ""));
    var s = /\{\{\s*(\w+)\s*\}\}/,
      e = e || window.theme_variables.settings.money_format;
    let i = "";
    switch (e.match(s)[1]) {
      case "amount":
        i = SHTHelper.formatWithDelimiters(t, 2);
        break;
      case "amount_no_decimals":
        i = SHTHelper.formatWithDelimiters(t, 0);
        break;
      case "amount_with_space_separator":
        i = SHTHelper.formatWithDelimiters(t, 2, " ", ".");
        break;
      case "amount_with_comma_separator":
        i = SHTHelper.formatWithDelimiters(t, 2, ".", ",");
        break;
      case "amount_with_apostrophe_separator":
        i = SHTHelper.formatWithDelimiters(t, 2, "'", ".");
        break;
      case "amount_no_decimals_with_comma_separator":
        i = SHTHelper.formatWithDelimiters(t, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        i = SHTHelper.formatWithDelimiters(t, 0, " ");
        break;
      case "amount_no_decimals_with_apostrophe_separator":
        i = SHTHelper.formatWithDelimiters(t, 0, "'");
    }
    return e.indexOf("with_comma_separator"), e.replace(s, i);
  }),
  (SHTHelper.defaultTo = function (t, e) {
    return null == t || t != t ? e : t;
  }),
  (SHTHelper.formatWithDelimiters = function (t, e, s, i) {
    return (
      (e = SHTHelper.defaultTo(e, 2)),
      (s = SHTHelper.defaultTo(s, ",")),
      (i = SHTHelper.defaultTo(i, ".")),
      isNaN(t) || null == t
        ? 0
        : (e = (t = (t / 100).toFixed(e)).split("."))[0].replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g,
            "$1" + s
          ) + (e[1] ? i + e[1] : "")
    );
  }),
  (SHTHelper.loadScript = function (t, e, s) {
    var i;
    SHTHelper.qs("#" + t)
      ? s()
      : ((i = document.createElement("script")).setAttribute("src", "" + e),
        i.setAttribute("id", "" + t),
        (i.onload = function () {
          s();
        }),
        (i.onreadystatechange = function () {
          ("complete" != this.readyState && "loaded" != this.readyState) || s();
        }),
        (i.onerror = function (t) {
          console.log("Failed to load script file " + e, t), s();
        }),
        document.body.appendChild(i));
  }),
  (SHTHelper.forceUpdateCartStatus = function (t) {
    let e = [
        {
          section: "cart-drawer",
          selector: ".js-cart-drawer-wrapper",
          space_selector: ".js-cart-drawer-wrapper",
        },
        {
          section: "header-cart-status",
          space_selector: ".shopify-section",
          selector: "#headerCartStatus",
          cart_notification: !1,
        },
        {
          section: "main-cart",
          space_selector: "#mainCartContainer",
          selector: "#mainCartContainer",
          cart_notification: !1,
        },
        {
          section: "cart-notification-panel-product",
          space_selector: ".js-cart-notification-panel-item-count",
          selector: ".js-cart-notification-panel-item-count-content",
          cart_notification: !1,
        },
        {
          section: "cart-notification-panel-product",
          space_selector: ".js-cart-notification-panel-product-" + t?.id,
          selector: ".js-cart-notification-panel-content",
          cart_notification: !0,
        },
      ],
      n = SHTHelper.qs("sht-cart-noti"),
      s = SHTHelper.qs("sht-sticky-header");
    t = e.map((t) => t.section).join(",");
    fetch(window.location.pathname + "?sections=" + t)
      .then((t) => t.json())
      .then((i) => {
        s && s.dataset.isEnabled && s.reveal(),
          e.forEach((t) => {
            var e = i[t.section],
              s = SHTHelper.qs(t.selector);
            e &&
              s &&
              ((e = new DOMParser()
                .parseFromString(e, "text/html")
                .querySelector(t.space_selector)) &&
                (s.innerHTML = e.innerHTML),
              t.cart_notification) &&
              n &&
              n.open();
          });
      })
      .catch((t) => {
        console.log("Cannot force Update Cart Status");
      });
  });
class SHTElementLazyLoad {
  constructor() {
    (this.elements = SHTHelper.qsa(".js-main-body .js-animate")),
      (this.sequential_elements = SHTHelper.qsa(
        ".js-main-body .js-seq-animate"
      )),
      this.setupEventListeners();
  }
  setupEventListeners() {
    var s = new IntersectionObserver((s, i) => {
      for (let t = 0, e = s.length; t < e; t++)
        s[t].isIntersecting &&
          (s[t].target.classList.add("animated"), i.unobserve(s[t].target));
    });
    for (let t = 0, e = this.elements.length; t < e; t++)
      s.observe(this.elements[t]);
    var i = new IntersectionObserver(
      (s, i) => {
        for (let t = 0, e = s.length; t < e; t++) {
          var n = 100 * t;
          s[t].isIntersecting &&
            (setTimeout(() => {
              s[t].target.classList.add("animated");
            }, n),
            i.unobserve(s[t].target));
        }
      },
      { threshold: 0.2 }
    );
    for (let t = 0, e = this.sequential_elements.length; t < e; t++)
      i.observe(this.sequential_elements[t]);
  }
}
setTimeout(() => {
  void 0 !== SHTElementLazyLoad && new SHTElementLazyLoad();
}),
  Shopify.designMode &&
    document.addEventListener("shopify:section:load", function (t) {
      void 0 !== SHTElementLazyLoad && new SHTElementLazyLoad();
    });
class SHTCustomComponent extends HTMLElement {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this));
  }
}
class SHTHeader extends SHTCustomComponent {
  constructor() {
    super(),
      (this.searchHeaderOpenBtn = this.$(".js-search-open-trigger")),
      (this.predictiveSearchElm = this.$(".js-predictive-search")),
      (this.predictiveSearchInputElm = this.$(".js-predictive-search-input")),
      (this.headerNavigation = this.$(".js-header-navigation")),
      (this.bodyElement = document.body),
      (this.toggleNavItemBtn = this.$$(".js-toggle-nav-item")),
      (this.headerBounds = {}),
      this.searchHeaderOpenBtn.addEventListener(
        "click",
        this.openPredictiveSearch.bind(this)
      );
  }
  openPredictiveSearch(t) {
    SHTHelper.loadScript(
      t.currentTarget.dataset.jsFileId,
      t.currentTarget.dataset.jsFile,
      function () {
        this.classList.add("header--predictive-search-open"),
          this.bodyElement.classList.add("o-hidden"),
          setTimeout(() => {
            SHTHelper.trapFocus(
              this.predictiveSearchElm,
              this.predictiveSearchInputElm
            );
          }, 650);
      }.bind(this)
    );
  }
}
customElements.define("sht-header", SHTHeader);
class SHTMenuHeader extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.header = SHTHelper.qs("sht-header")),
      (this.details = this.$("details")),
      (this.summaries = this.$$("summary")),
      (this.summary = this.details.querySelector("summary")),
      (this.content = this.summary.nextElementSibling),
      (this.content_animations = null),
      this.details.addEventListener(
        "focusout",
        this.onFocusOutEvent.bind(this)
      );
    for (let t = 0, e = this.summaries.length; t < e; t++) {
      var s = this.summaries[t];
      s.addEventListener("click", (t) => {
        let e = t.currentTarget.closest("details");
        t.currentTarget.setAttribute("aria-expanded", !e.open),
          e.classList.toggle("is-open", !e.open),
          t.preventDefault(),
          e.hasAttribute("open")
            ? (setTimeout(() => {
                e.open = !1;
              }, 300),
              "1" == e.dataset.level &&
                this.header.classList.remove("header-menu--open"))
            : ((e.open = !0),
              "1" == e.dataset.level &&
                this.header.classList.add("header-menu--open"));
      }),
        s.addEventListener("keyup", this.onKeyUpEscEvent.bind(this));
    }
  }
  onKeyUpEscEvent(t) {
    if ("ESCAPE" === t.code.toUpperCase()) {
      let e = t.target.closest("details[open]");
      if (e) {
        let t = e.querySelector("summary");
        "1" == e.dataset.level &&
          (e.hasAttribute("open")
            ? this.header.classList.remove("header-menu--open")
            : this.header.classList.add("header-menu--open")),
          setTimeout(() => {
            e.removeAttribute("open"), t.setAttribute("aria-expanded", !1);
          }, 300),
          e.classList.remove("is-open"),
          t.focus();
      }
    }
  }
  onFocusOutEvent() {
    setTimeout(() => {
      this.contains(document.activeElement) || this.close();
    });
  }
  close() {
    "1" == this.details.dataset.level &&
      this.details.hasAttribute("open") &&
      this.header.classList.remove("header-menu--open");
    for (let s = 0, t = this.summaries.length; s < t; s++) {
      let t = this.summaries[s],
        e = t.closest("details");
      setTimeout(() => {
        e.removeAttribute("open"), t.setAttribute("aria-expanded", !1);
      }, 300),
        e.classList.remove("is-open");
    }
  }
}
customElements.define("sht-menu-header", SHTMenuHeader);
class SHTStickyHeader extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    if (
      ((this.is_enabled = this.dataset.isEnabled),
      (this.prevent_reveal = !1),
      (this.css_ary = ["top-0", "zi-4", "header--sticky", "is-header-hide"]),
      (this.header = SHTHelper.qs(".js-section-header")),
      (this.currentScrollTop = 0),
      (this.headerBounds = {}),
      this.bindEventHandlers(),
      "false" == this.is_enabled)
    )
      return !1;
    this.createObserver();
  }
  bindEventHandlers() {
    if ("false" == this.is_enabled) return !1;
    (this.preventStickyHeaderReveal = () => (this.prevent_reveal = !0)),
      this.addEventListener(
        "preventStickyHeaderReveal",
        this.preventStickyHeaderReveal
      ),
      window.addEventListener("scroll", this.onScrollHandle.bind(this), !1);
  }
  createObserver() {
    new IntersectionObserver((t, e) => {
      (this.header_bounds = t[0].intersectionRect), e.disconnect();
    }).observe(this.header);
  }
  onScrollHandle() {
    if (this.header_bounds) {
      var t = window.pageYOffset || SHTHelper.qde.scrollTop;
      if (t > this.currentScrollTop && t > this.header_bounds.bottom) {
        if (this.prevent_reveal)
          return (
            window.clearTimeout(this.is_scrolling),
            void (this.is_scrolling = setTimeout(() => {
              this.prevent_reveal = !1;
            }, 20))
          );
        requestAnimationFrame(this.hide.bind(this));
      } else if (t < this.currentScrollTop && t > this.header_bounds.bottom) {
        if (this.prevent_reveal)
          return (
            requestAnimationFrame(this.hide.bind(this)),
            window.clearTimeout(this.is_scrolling),
            void (this.is_scrolling = setTimeout(() => {
              this.prevent_reveal = !1;
            }, 20))
          );
        requestAnimationFrame(this.reveal.bind(this));
      } else
        t <= this.header_bounds.top &&
          requestAnimationFrame(this.reset.bind(this));
      this.currentScrollTop = t;
    }
  }
  hide() {
    this.header.classList.add(
      "is-header-hide",
      "p-sticky",
      "top-0",
      "zi-4",
      "header--sticky"
    ),
      this.closeMenu();
  }
  reveal() {
    this.header.classList.add(
      "top-0",
      "animate",
      "zi-4",
      "p-sticky",
      "header--sticky"
    ),
      this.header.classList.remove("is-header-hide");
  }
  reset() {
    this.header.classList.remove(
      "is-header-hide",
      "top-0",
      "animate",
      "header--sticky",
      "p-sticky"
    );
  }
  closeMenu() {
    this.menus = this.header.querySelectorAll("sht-menu-header");
    for (let t = 0, e = this.menus.length; t < e; t++) this.menus[t].close();
  }
  disconnectedCallback() {
    this.removeEventListener(
      "preventStickyHeaderReveal",
      this.preventStickyHeaderReveal
    ),
      window.removeEventListener("scroll", this.onScrollHandle.bind(this));
  }
}
customElements.define("sht-sticky-header", SHTStickyHeader);
class SHTCartNotificationPanel extends SHTCustomComponent {
  constructor() {
    super(),
      (this.elms = {
        notification_wrapper: this.$(".js-cart-notification-panel-wrapper"),
        notification_container: this.$(".js-cart-notification-panel-container"),
        close_buttons: this.$$(".js-cart-notification-panel-close-btn"),
      }),
      (this.dismiss_timeout = null);
    for (let t = 0, e = this.elms.close_buttons.length; t < e; t++)
      this.elms.close_buttons[t].addEventListener(
        "click",
        this.close.bind(this)
      );
  }
  open() {
    this.togglePanel(!0),
      this.elms.notification_container.focus(),
      this.addEventListener("mouseover", this.onMouseOverHandle.bind(this)),
      this.addEventListener("mouseout", this.onMouseOutHandle.bind(this)),
      this.setDismissTimeout(),
      SHTHelper.trapFocus(this);
  }
  close() {
    this.clearDismissTimeout(),
      this.togglePanel(!1),
      this.dispatchEvent(new Event("closed")),
      SHTHelper.removeTrapFocus();
  }
  clearDismissTimeout() {
    clearTimeout(this.dismiss_timeout);
  }
  renderContents(s) {
    this.productId = s.id;
    var i = this.getSectionsToRender();
    for (let t = 0, e = i.length; t < e; t++) {
      var n = SHTHelper.qs(i[t].space_selector);
      n &&
        ("#headerCartStatus" == i[t].space_selector &&
          n.classList.add("header-cart-status--animate"),
        (n.innerHTML = this.getSectionInnerHTML(
          s.sections[i[t].id],
          i[t].selector
        )));
    }
    this.open();
  }
  getSectionsToRender() {
    return [
      {
        id: "cart-notification-panel-product",
        selector: ".js-cart-notification-panel-product-" + this.productId,
        space_selector: ".js-cart-notification-panel-content",
      },
      {
        id: "free-shipping-notification",
        selector: ".js-free-shipping-notification",
        space_selector: ".js-cart-notification-free-shipping",
      },
      {
        id: "header-cart-status",
        section: "header-cart-status",
        space_selector: "#headerCartStatus",
      },
      {
        id: "cart-notification-panel-product",
        selector: ".js-cart-notification-panel-item-count",
        space_selector: ".js-cart-notification-panel-item-count-content",
      },
    ];
  }
  getSectionInnerHTML(t, e = ".shopify-section") {
    return new DOMParser().parseFromString(t, "text/html").querySelector(e)
      .innerHTML;
  }
  onMouseOverHandle(t) {
    this.clearDismissTimeout();
  }
  onMouseOutHandle(t) {
    this.setDismissTimeout();
  }
  togglePanel(t) {
    t ? this.toggleAttribute("hidden", !1) : this.setAttribute("hidden", !0);
  }
  setDismissTimeout() {
    this.dismiss_timeout = setTimeout(
      function () {
        this.close();
      }.bind(this),
      5e3
    );
  }
}
customElements.define("sht-cart-noti", SHTCartNotificationPanel);
class SHTCarousel extends SHTCustomComponent {
  constructor() {
    super(),
      (this.carousels = this.$$(".js-carousel-item")),
      (this.container = this.$(".js-carousel-items")),
      (this.totalItems = this.carousels.length),
      (this.prevBtnElement = this.$(".js-carousel-prev-btn")),
      (this.nextBtnElement = this.$(".js-carousel-next-btn")),
      (this.currentElement = this.$(".js-carousel-counter-current")),
      (this.totalElement = this.$(".js-carousel-counter-total")),
      (this.paginationElement = this.$(".js-carousel-pagination")),
      this.init(),
      this.bindEventHandlers();
  }
  init() {
    "false" != this.dataset.enable &&
      ((this.itemsToShow = Array.from(this.carousels).filter(
        (t) => 0 < t.clientWidth
      )),
      this.itemsToShow.length < 2
        ? this.togglePagination(!1)
        : ((this.gutter =
            parseFloat(
              window
                .getComputedStyle(this.itemsToShow[1], null)
                .getPropertyValue("padding-left")
            ) +
            parseFloat(
              window
                .getComputedStyle(this.itemsToShow[1], null)
                .getPropertyValue("padding-right")
            )),
          (this.itemOffset =
            this.itemsToShow[1].offsetLeft - this.itemsToShow[0].offsetLeft),
          (this.itemsPerPage = Math.floor(
            (this.container.clientWidth - this.itemsToShow[0].offsetLeft) /
              this.itemOffset
          )),
          (this.totalPages = this.itemsToShow.length - this.itemsPerPage + 1),
          this.updateCarousel()));
  }
  updateCarousel() {
    var t = this.currentPage;
    (this.currentPage =
      Math.round(this.container.scrollLeft / this.itemOffset) + 1),
      0 < this.currentPage &&
        0 < this.totalPages &&
        (this.totalElement && (this.totalElement.textContent = this.totalPages),
        this.currentElement) &&
        (this.currentElement.innerHTML = this.currentPage),
      this.currentPage != t &&
        this.dispatchEvent(
          new CustomEvent("itemChanged", {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.itemsToShow[this.currentPage - 1],
              container: this,
            },
          })
        ),
      this.isItemVisible(this.itemsToShow[0]) && 0 === this.container.scrollLeft
        ? this.prevBtnElement.setAttribute("disabled", "disabled")
        : this.prevBtnElement.removeAttribute("disabled"),
      this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])
        ? this.nextBtnElement.setAttribute("disabled", "disabled")
        : this.nextBtnElement.removeAttribute("disabled"),
      1 < this.totalPages && this.togglePagination(!0),
      this.totalPages <= 1 && this.togglePagination(!1);
  }
  togglePagination(t) {
    t
      ? this.paginationElement?.classList.remove("d-none-important")
      : this.paginationElement?.classList.add("d-none-important");
  }
  isItemVisible(t, e = 0) {
    e = this.container.clientWidth + this.container.scrollLeft - e + 1;
    return (
      t.offsetLeft + t.clientWidth <= e &&
      t.offsetLeft >= this.container.scrollLeft - 1
    );
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = 1,
      s = 0;
    window.matchMedia("(min-width: 459px)").matches &&
      (e = t.currentTarget.dataset.step),
      (0 != this.container.scrollLeft &&
        !this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])) ||
        (s = this.gutter),
      (this.itemScrollPosition =
        "next" === t.currentTarget.name
          ? this.container.scrollLeft - s + e * this.itemOffset
          : this.container.scrollLeft + s - e * this.itemOffset),
      window.requestAnimationFrame(() =>
        this.container.scrollTo({
          left: this.itemScrollPosition,
          behavior: "smooth",
        })
      );
  }
  bindEventHandlers() {
    "false" != this.dataset.enable &&
      (new ResizeObserver((t) => this.init()).observe(this.container),
      new IntersectionObserver(
        ((t, e) => {
          t[0].isIntersecting && (this.init(), e.unobserve(this));
        }).bind(this)
      ).observe(this),
      this.prevBtnElement.addEventListener(
        "click",
        this.onButtonClick.bind(this)
      ),
      this.nextBtnElement.addEventListener(
        "click",
        this.onButtonClick.bind(this)
      ),
      this.container.addEventListener(
        "scroll",
        SHTHelper.debounce(this.updateCarousel.bind(this), 100)
      ));
  }
}
customElements.define("sht-carousel", SHTCarousel);
class SHTCarouselTrigger extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    Shopify.designMode
      ? setTimeout(() => {
          this.init();
        }, 1e3)
      : this.init();
  }
  init() {
    (this.trigger = this.$$(".js-carousel-trigger")),
      (this.carouselWebElement = SHTHelper.qs(
        "#" + this.dataset.carouselTarget
      )),
      (this.carousel =
        this.carouselWebElement.querySelector(".js-carousel-items")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    for (let t = 0, e = this.trigger.length; t < e; t++)
      this.trigger[t].addEventListener("click", (t) => {
        this.setActiveCarouselElement(t.currentTarget);
      });
    this.carouselWebElement.addEventListener("itemChanged", (t) => {
      this.setButtonVisibility(!1);
      t = this.$(`[aria-describedby="${t.detail.currentElement.id}"]`);
      t.setAttribute("aria-current", "true"),
        t.classList.add("hotspot-item--active");
    });
  }
  setActiveCarouselElement(t) {
    t = this.carousel.querySelector(
      "#" + t.getAttribute("aria-describedby", "")
    );
    t && this.carousel.scrollTo({ left: t.offsetLeft, behavior: "smooth" });
  }
  setButtonVisibility(s) {
    if (this.trigger)
      for (let t = 0, e = this.trigger.length; t < e; t++)
        s
          ? (this.trigger[t].setAttribute("aria-current", "true"),
            this.trigger[t].classList.add("hotspot-item--active"))
          : (this.trigger[t].removeAttribute("aria-current"),
            this.trigger[t].classList.remove("hotspot-item--active"));
  }
}
customElements.define("sht-carousel-trig", SHTCarouselTrigger);
class SHTCoreDrawer extends SHTCustomComponent {
  constructor() {
    super(),
      (this.drawerWrapperElement = this.$(".js-drawer-wrapper")),
      (this.drawerOverlayElement = this.$(".js-drawer-overlay")),
      (this.closeBtnElement = this.$(".js-drawer-btn-close")),
      (this.opener = null),
      (this.bodyElement = document.body),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.drawerOverlayElement.addEventListener(
      "click",
      this.closeDrawer.bind(this)
    ),
      this.closeBtnElement.addEventListener(
        "click",
        this.closeDrawer.bind(this)
      ),
      window.addEventListener("load", () => {
        this.removeAttribute("hidden");
      }),
      this.addEventListener(
        "keyup",
        (t) => "ESCAPE" === t.code.toUpperCase() && this.closeDrawer()
      ),
      this.drawerAttrObserve();
  }
  drawerAttrObserve() {
    new MutationObserver((t, e) => {
      t.forEach(async (t) => {
        "open" == t.attributeName &&
          (this.hasAttribute("open")
            ? (this.opener?.removeAttribute("disabled"),
              this.opener?.setAttribute("aria-expanded", "true"),
              this.setAttribute("aria-hidden", "false"),
              this.dispatchEvent(new Event("opening")),
              this.bodyElement.classList.add("o-hidden"),
              this.classList.add("active"),
              await this.animationsComplete(),
              this.dispatchEvent(new Event("opened")),
              SHTHelper.trapFocus(this))
            : (SHTHelper.removeTrapFocus(this.opener),
              this.setAttribute("aria-hidden", "true"),
              this.opener?.setAttribute("aria-expanded", "false"),
              this.opener?.removeAttribute("disabled"),
              this.dispatchEvent(new Event("closing")),
              this.bodyElement.classList.remove("o-hidden"),
              this.classList.remove("active"),
              await this.animationsComplete(),
              this.dispatchEvent(new Event("closed"))));
      });
    }).observe(this, { attributes: !0 });
  }
  animationsComplete() {
    return Promise.allSettled(
      this.drawerWrapperElement.getAnimations().map((t) => t.finished)
    );
  }
  openDrawer(t) {
    SHTHelper.preventStickyHeaderReveal(),
      (this.opener = t),
      this.removeAttribute("hidden"),
      this.toggleAttribute("open", !0);
  }
  closeDrawer() {
    this.toggleAttribute("open", !1);
  }
}
class SHTDrawer extends SHTCoreDrawer {}
customElements.define("sht-drwr", SHTDrawer);
class SHTDrawerTrigger extends SHTCustomComponent {
  constructor() {
    super();
  }
  init() {
    (this.triggerBtnElement = this.$(".js-drawer-trigger")),
      (this.drawerElement = SHTHelper.qs("sht-drwr#" + this.dataset.drawerId)),
      this.triggerBtnElement &&
        this.drawerElement &&
        ((this.mediaElement = this.$(".js-drawer-trigger-media")),
        (this.headingElement = this.$(".js-drawer-trigger-heading")),
        (this.contentElements = this.$$(".js-drawer-trigger-content")),
        (this.footerElement = this.$(".js-drawer-trigger-footer")),
        this.bindEventHandlers());
  }
  bindDataToDrawer() {
    let e = "";
    (this.drawerElement.querySelector(".js-drawer-media").innerHTML =
      this.mediaElement.innerHTML),
      (this.drawerElement.querySelector(".js-drawer-heading").innerHTML =
        this.headingElement.innerHTML),
      this.drawerElement
        .querySelector(".js-drawer-wrapper")
        .setAttribute("aria-label", this.headingElement.innerHTML),
      this.contentElements.forEach((t) => {
        e += t.innerHTML;
      }),
      (this.drawerElement.querySelector(".js-drawer-content").innerHTML = e),
      this.footerElement &&
        ((this.drawerElement.querySelector(".js-drawer-footer").innerHTML =
          this.footerElement.innerHTML),
        this.drawerElement
          .querySelector(".js-drawer-footer")
          .querySelectorAll(".js-drawer-trigger-footer-btn")
          .forEach((t) => {
            t.classList.add("btn-drawer");
          }));
  }
  bindEventHandlers() {
    this.triggerBtnElement.addEventListener("click", (t) => {
      setTimeout(() => {
        this.bindDataToDrawer(), this.drawerElement.openDrawer(t.target);
      }, 100);
    });
  }
  connectedCallback() {
    Shopify.designMode
      ? setTimeout(() => {
          this.init();
        }, 1e3)
      : this.init();
  }
}
customElements.define("sht-drwr-trg", SHTDrawerTrigger);
class SHTCartDrawer extends SHTCoreDrawer {
  getSectionsToRender() {
    return [
      {
        id: "cart-drawer",
        section: "cart-drawer",
        space_selector: "#cartDrawer",
      },
    ];
  }
}
customElements.define("sht-cart-drwr", SHTCartDrawer);
class SHTCartDrawerCartNote extends SHTCustomComponent {
  constructor() {
    super(),
      this.addEventListener(
        "change",
        SHTHelper.debounce((t) => {
          t = JSON.stringify({ note: t.target.value });
          fetch("" + window.routes.cart_update_url, {
            ...SHTHelper.fetchConfigJSON,
            body: t,
          });
        }, 300)
      );
  }
}
customElements.define("sht-cart-drwr-note", SHTCartDrawerCartNote);
class SHTCartDrawerQuantityInput extends SHTCustomComponent {
  constructor() {
    super(),
      (this.input = this.$(".js-cart-drawer-quantity-input")),
      (this.changeEvent = new Event("change", { bubbles: !0 })),
      (this.button = this.$$(".js-cart-drawer-quantity-btn"));
    for (let t = 0, e = this.button.length; t < e; t++)
      this.button[t].addEventListener(
        "click",
        this.onButtonClickHandler.bind(this)
      );
  }
  onButtonClickHandler(t) {
    t.preventDefault();
    var e = this.input.value;
    "plus" === t.currentTarget.dataset.name
      ? this.input.stepUp()
      : this.input.stepDown(),
      e !== this.input.value && this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define("sht-cart-drwr-qty-inp", SHTCartDrawerQuantityInput);
class SHTCartDrawerRemoveButton extends SHTCustomComponent {
  constructor() {
    super(),
      this.addEventListener("click", (t) => {
        t.preventDefault(),
          this.closest("sht-cart-drwr-frm").updateQuantity(
            this.dataset.index,
            0
          );
      });
  }
}
customElements.define("sht-cart-drwr-rmv-btn", SHTCartDrawerRemoveButton);
class SHTCartDrawerForm extends SHTCustomComponent {
  constructor() {
    super(),
      (this.totalItems = Array.from(
        this.$$(".js-cart-drawer-quantity-input")
      ).reduce((t, e) => t + parseInt(e.value), 0)),
      (this.drawerCartElement = SHTHelper.qs("sht-cart-drwr")),
      (this.wrapperElement = this.drawerCartElement.querySelector(
        ".js-cart-drawer-wrapper"
      )),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      this.addEventListener(
        "change",
        SHTHelper.debounce((t) => {
          this.onChange(t);
        }, 300)
      );
  }
  onChange(t) {
    this.updateQuantity(
      t.target.dataset.index,
      t.target.value,
      document.activeElement.dataset.name
    );
  }
  renderContents(i) {
    this.wrapperElement.classList.contains("is-empty") &&
      this.wrapperElement.classList.remove("is-empty"),
      this.getSectionsToRender().forEach((s) => {
        s.selectors?.forEach((t) => {
          var e = SHTHelper.qid(s.id);
          e &&
            i.sections[s.section] &&
            ((e.querySelector(t) || e).innerHTML = this.getSectionInnerHTML(
              i.sections[s.section],
              t
            ));
        });
      });
  }
  getSectionsToRender() {
    return [
      {
        id: "cartDrawer",
        section: "cart-drawer",
        selectors: [".js-cart-drawer-wrapper"],
      },
      {
        id: "mainCart",
        section: "main-cart",
        selectors: ["#mainCartContainer"],
      },
    ];
  }
  updateQuantity(e, t, s) {
    let i = this.getSectionsToRender(),
      n;
    this.cartNotification &&
      (i = [...i, ...this.cartNotification.getSectionsToRender()]);
    t = JSON.stringify({
      line: e,
      quantity: t,
      sections: i.map((t) => t.section),
      sections_url: window.location.pathname,
    });
    this.updateButtonState(!0),
      fetch("" + window.routes.cart_change_url, {
        ...SHTHelper.fetchConfigJSON,
        body: t,
      })
        .then((t) => t.text())
        .then((t) => {
          (n = JSON.parse(t)).errors
            ? setTimeout(() => {
                this.updateErrorRegions(e, n.errors);
              }, 100)
            : (this.closest(".js-cart-drawer-wrapper").classList.toggle(
                "is-empty",
                0 === n.item_count
              ),
              this.getSectionsToRender().forEach((s) => {
                s.selectors.forEach((t) => {
                  var e = SHTHelper.qid(s.id);
                  e &&
                    ((e.querySelector(t) || e).innerHTML =
                      this.getSectionInnerHTML(n.sections[s.section], t));
                });
              }),
              (t = SHTHelper.qid("cartDrawerItem-" + e)) &&
                (t = t.querySelector(".js-cart-drawer-quantity-btn-" + s)) &&
                t.focus(),
              this.cartNotification &&
                this.cartNotification.getSectionsToRender().forEach((t) => {
                  "header-cart-status" == t.id &&
                    (SHTHelper.qs(t.space_selector).innerHTML =
                      this.cartNotification.getSectionInnerHTML(
                        n.sections[t.id],
                        t.selector
                      ));
                }));
        })
        .catch((t) => {
          (this.$(".js-cart-drawer-errors").textContent =
            SHTLanguage.cart.ERROR),
            console.log(t.message, t.stack);
        })
        .finally(() => {
          this.updateButtonState(!1);
        });
  }
  updateErrorRegions(t, e) {
    t = SHTHelper.qs("#cart-drawer-line-item-error-" + t);
    (t.querySelector(".js-cart-drawer-form-item-error-message").innerHTML = e),
      t.classList.remove("d-none-important");
  }
  getSectionInnerHTML(t, e) {
    return new DOMParser().parseFromString(t, "text/html").querySelector(e)
      .innerHTML;
  }
  updateButtonState(t) {
    var s = this.$$(".js-cart-drawer-btn"),
      e = this.drawerCartElement.querySelector(".js-cart-drawer-submit-btn");
    if (t) {
      for (let t = 0, e = s.length; t < e; t++)
        s[t].setAttribute("disabled", "disabled");
      e && e.setAttribute("disabled", "disabled");
    } else {
      for (let t = 0, e = s.length; t < e; t++)
        s[t].removeAttribute("disabled", "disabled");
      e && e.removeAttribute("disabled");
    }
  }
}
customElements.define("sht-cart-drwr-frm", SHTCartDrawerForm);
class SHTMenuDrawer extends SHTCoreDrawer {}
customElements.define("sht-menu-drwer", SHTMenuDrawer);
class SHTMenuDrawerOpener extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.triggerBtnElement = this.$(".js-menu-drawer-trigger")),
      (this.menuDrawerElement = SHTHelper.qs("sht-menu-drwer")),
      (this.menuDrawerBodyElement = this.menuDrawerElement.querySelector(
        ".js-menu-drawer-body"
      )),
      (this.menuDrawerContentElement = SHTHelper.qs(".js-menu-drawer-content")),
      this.triggerBtnElement.addEventListener("click", (t) => {
        (this.menuDrawerBodyElement.innerHTML =
          this.menuDrawerContentElement.innerHTML),
          setTimeout(() => {
            this.menuDrawerElement.openDrawer(t.target);
          }, 0);
      });
  }
}
customElements.define("sht-menu-drwer-opner", SHTMenuDrawerOpener);
class SHTColorSwatch extends SHTCustomComponent {
  constructor() {
    super(),
      (this.json = null),
      (this.jsonDataElement =
        SHTHelper.qs('#colorSwatchData[type="application/json"]') || null),
      (this.variantSwatchItems = this.$$(".js-variant-swatch-item") || []),
      this.jsonDataElement &&
        0 != this.variantSwatchItems.length &&
        this.bindEventHandlers();
  }
  onObserverHandler() {
    new IntersectionObserver((t, e) => {
      t.forEach((t) => {
        t.isIntersecting && (this.init(), e.unobserve(this));
      });
    }).observe(this);
  }
  init() {
    (this.json = JSON.parse(this.jsonDataElement.textContent)),
      this.processJsonData();
    for (let t = 0, e = this.variantSwatchItems.length; t < e; t++) {
      var s,
        i,
        n = this.variantSwatchItems[t];
      null != this.json["" + n.dataset.optionValue]
        ? ((s = SHTHelper.isImage(this.json["" + n.dataset.optionValue])),
          (i = SHTHelper.isHexColor(this.json["" + n.dataset.optionValue])),
          s &&
            (n.classList.add("clr-swh__type--image"),
            (n.style.backgroundImage = `url("${
              this.json["" + n.dataset.optionValue]
            }")`),
            (n.style.backgroundSize = "cover"),
            (n.style.backgroundRepeat = "no-repeat")),
          i &&
            ((n.style.backgroundColor = this.json["" + n.dataset.optionValue]),
            n.classList.add("clr-swh__type--color")))
        : SHTHelper.isColor(n.dataset.optionValue) &&
          ((n.style.backgroundColor = n.dataset.optionValue),
          n.classList.add("clr-swh__type--color"));
    }
  }
  processJsonData() {
    this.json &&
      (this.json = Object.assign.apply(
        {},
        this.json.color_swatch_name.map((t, e) => ({
          [t]: this.json.color_swatch_value[e],
        }))
      ));
  }
  bindEventHandlers() {
    this.onObserverHandler();
  }
}
class SHTMainProductVariantSwatch extends SHTColorSwatch {}
customElements.define("sht-prd-variant-swtch", SHTMainProductVariantSwatch);
class SHTMainProductVariantSwatchWSelect extends SHTColorSwatch {}
customElements.define(
  "sht-prd-variant-swtch-w-select",
  SHTMainProductVariantSwatchWSelect
);
class SHTProductQuickViewVariantSwatch extends SHTColorSwatch {}
customElements.define(
  "sht-prd-qck-vw-variant-swtch",
  SHTProductQuickViewVariantSwatch
);
class SHTMainCollectionProductVariantSwatch extends SHTColorSwatch {}
customElements.define(
  "sht-coll-prd-variant-swtch",
  SHTMainCollectionProductVariantSwatch
);
class SHTFeaturedProductVariantSwatch extends SHTColorSwatch {}
customElements.define(
  "sht-featured-prd-variant-swtch",
  SHTFeaturedProductVariantSwatch
);
class SHTMainSearchVariantSwatch extends SHTColorSwatch {}
customElements.define("sht-srch-variant-swtch", SHTMainSearchVariantSwatch);
class SHTVariantSwatch extends SHTColorSwatch {
  bindEventHandlers() {
    this.onObserverHandler(),
      this.variantSwatchItems.forEach((t) => {
        t.addEventListener("click", (t) => {
          this.changeVariantImage(t.currentTarget);
        });
      });
  }
  changeVariantImage(t) {
    var s = SHTHelper.qs("#" + t.dataset.productImageId),
      i = SHTHelper.qsa("." + t.dataset.productLinkClass),
      n = t.querySelector("template");
    if (s && n) {
      this.setButtonVisibility(!1);
      let e = n.content.firstElementChild.cloneNode(!0);
      s.src && (s.src = e.src),
        s.srcset && (n.srcset ? (s.srcset = e.srcset) : (s.srcset = e.src)),
        i &&
          i.forEach((t) => {
            t.href = e.getAttribute("data_url");
          }),
        t.setAttribute("aria-current", "true"),
        t.classList.add("btn-active"),
        t.focus();
    }
  }
  setButtonVisibility(e) {
    this.variantSwatchItems &&
      this.variantSwatchItems.forEach((t) => {
        e
          ? (t.setAttribute("aria-current", "true"),
            t.classList.add("btn-active"))
          : (t.removeAttribute("aria-current"),
            t.classList.remove("btn-active"));
      });
  }
}
customElements.define("sht-variant-swtch", SHTVariantSwatch);
class SHTDialogCore extends SHTCustomComponent {
  constructor() {
    super(),
      (this.dialog = this.$(".dialog")),
      (this.closeBtn = this.$$(".js-dialog-close-btn")),
      (this.body = this.$(".js-dialog-body")),
      (this.closeModalOnOverlayClick =
        this.dataset.closeModalOnOverlay || "true"),
      (this.opener = null),
      (this.bodyElement = document.body),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.closeBtn.forEach((t) => {
      t.addEventListener("click", (t) => {
        this.closeModal();
      });
    }),
      this.addEventListener("click", (t) => {
        t.target.nodeName === this.tagName &&
          "true" === this.closeModalOnOverlayClick &&
          this.closeModal();
      }),
      this.addEventListener(
        "keyup",
        (t) => "ESCAPE" === t.code.toUpperCase() && this.closeModal()
      ),
      this.dialogAttrObserve();
  }
  dialogAttrObserve() {
    new MutationObserver((t, e) => {
      t.forEach(async (t) => {
        "hidden" == t.attributeName &&
          (!this.hasAttribute("hidden")
            ? (this.dispatchEvent(
                new CustomEvent("opening", {
                  detail: { opener: this.opener, dialog: this },
                })
              ),
              await this.animationsComplete(),
              this.dispatchEvent(
                new CustomEvent("opened", {
                  detail: { opener: this.opener, dialog: this },
                })
              ),
              SHTHelper.trapFocus(this),
              this.bodyElement.classList.add("o-hidden"))
            : (SHTHelper.removeTrapFocus(this.opener),
              this.dispatchEvent(
                new CustomEvent("closing", {
                  detail: { opener: this.opener, dialog: this },
                })
              ),
              await this.animationsComplete(),
              this.dispatchEvent(
                new CustomEvent("closed", {
                  detail: { opener: this.opener, dialog: this },
                })
              ),
              this.bodyElement.classList.remove("o-hidden")));
      });
    }).observe(this, { attributes: !0 });
  }
  animationsComplete() {
    return Promise.allSettled(
      this.dialog.getAnimations({ subtree: !0 }).map((t) => t.finished)
    );
  }
  processBodyContent() {
    var t;
    (this.template = this.$("template")),
      this.template && ((t = this.template.content), this.body.appendChild(t));
  }
  showModal(t, e = !1) {
    SHTHelper.preventStickyHeaderReveal(),
      e && this.processBodyContent(),
      (this.opener = t),
      this.toggleAttribute("hidden", !1);
  }
  closeModal() {
    this.setAttribute("hidden", !0);
  }
}
class SHTDialog extends SHTDialogCore {
  constructor() {
    super();
  }
}
customElements.define("sht-dialog", SHTDialog);
class SHTDialogQuickShop extends SHTDialogCore {
  constructor() {
    super();
  }
  showModal(t) {
    SHTHelper.preventStickyHeaderReveal(),
      (this.opener = t),
      this.opener?.setAttribute("disabled", "disabled"),
      this.processData(t);
  }
  processData(t) {
    (this.productElement = null),
      fetch(t.getAttribute("data-product-url"))
        .then((t) => t.text())
        .then((t) => {
          t = new DOMParser().parseFromString(t, "text/html");
          (this.productElement = t.querySelector(
            ".section-product-quick-view"
          )),
            window.Shopify &&
              Shopify.PaymentButton &&
              Shopify.PaymentButton.init(),
            (this.body.innerHTML = this.productElement.innerHTML),
            this.executeScriptElements(this.body);
        })
        .finally(() => {
          this.toggleAttribute("hidden", !1),
            this.opener?.removeAttribute("disabled");
        });
  }
  closeModal() {
    this.setAttribute("hidden", !0),
      setTimeout(() => {
        this.body.innerHTML = "";
      }, 300);
  }
  executeScriptElements(t) {
    t = t.querySelectorAll("script");
    Array.from(t).forEach((t) => {
      const e = document.createElement("script");
      Array.from(t.attributes).forEach((t) => {
        e.setAttribute(t.name, t.value);
      }),
        e.appendChild(document.createTextNode(t.innerHTML)),
        t.parentNode.replaceChild(e, t);
    });
  }
}
customElements.define("sht-dialog-quickshop", SHTDialogQuickShop);
class SHTDetailsExposal extends SHTCustomComponent {
  constructor() {
    super(),
      (this.detailsElm = this.$("details")),
      (this.content =
        this.detailsElm.querySelector("summary").nextElementSibling),
      this.detailsElm.addEventListener(
        "focusout",
        this.onFocusOutHandler.bind(this)
      ),
      this.detailsElm.addEventListener(
        "toggle",
        this.onToggleHandler.bind(this)
      );
  }
  onFocusOutHandler() {
    setTimeout(() => {
      this.contains(document.activeElement) || this.close();
    });
  }
  onToggleHandler() {
    this.detailsElm.hasAttribute("open")
      ? this.detailsElm
          .querySelector("summary")
          .setAttribute("aria-expanded", !0)
      : this.detailsElm
          .querySelector("summary")
          .setAttribute("aria-expanded", !1);
  }
  close() {
    this.detailsElm.removeAttribute("open"),
      this.detailsElm
        .querySelector("summary")
        .setAttribute("aria-expanded", !1);
  }
}
customElements.define("sht-dtl-exposal", SHTDetailsExposal);
class SHTShareProductButton extends SHTCustomComponent {
  constructor() {
    super(),
      (this.webShareApiContainer = this.$(".js-web-share-api-container")),
      (this.webShareApiButton = this.$(".js-web-share-api-btn")),
      (this.noneWebShareApiContainer = this.$(
        ".js-none-web-share-api-container"
      )),
      (this.noneWebShareApiButton = this.$(".js-none-web-share-api-btn")),
      (this.copyLinkButton = this.$(".js-social-share-copy-link")),
      this.init();
  }
  init() {
    navigator.share
      ? (this.webShareApiContainer.removeAttribute("hidden"),
        this.noneWebShareApiContainer.setAttribute("hidden", !0),
        this.webShareApiButton.addEventListener("click", () => {
          navigator
            .share({ url: this.dataset.productUrl, title: document.title })
            .then(() => {
              console.log("Thanks for sharing!");
            })
            .catch(console.error);
        }))
      : (this.noneWebShareApiContainer.removeAttribute("hidden"),
        this.webShareApiContainer.setAttribute("hidden", !0),
        this.copyLinkButton.addEventListener("click", (t) => {
          this.copyToClipboard(t.currentTarget);
        }));
  }
  copyToClipboard(t) {
    navigator.clipboard.writeText(this.dataset.productUrl).then(() => {
      t.querySelector(".js-social-share-copy-link-label").textContent =
        t.dataset.linkCopiedToClipboard;
    });
  }
}
customElements.define("sht-share-prd-btn", SHTShareProductButton);
class SHTCollapsibleRegion extends SHTCustomComponent {
  constructor() {
    super(),
      (this.properties = this.dataset.properties
        ? JSON.parse(this.dataset.properties)
        : {}),
      (this.triggers = this.$$(".js-collapsible-region-trigger")),
      (this.contents = this.$$(".js-collapsible-region-content")),
      (this.bodyWidth = document.body.clientWidth),
      (this.isCollapsibleOnDesktop = this.properties.isCollapsibleOnDesktop),
      (this.isCollapsibleOnMobile = this.properties.isCollapsibleOnMobile),
      this.init(),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    (this.isCollapsibleOnDesktop && this.isCollapsibleOnMobile) ||
      window.addEventListener("resize", (t) => {
        (this.bodyWidth = Math.floor(document.body.clientWidth)), this.init();
      }),
      this.triggers.forEach((t) => {
        t.addEventListener("click", (t) => {
          this.onTriggerClick(t.currentTarget);
        });
      });
  }
  init() {
    ((!this.isCollapsibleOnDesktop && 769 < this.bodyWidth) ||
      (!this.isCollapsibleOnMobile && this.bodyWidth <= 769)) &&
      this.removeAriaProps(),
      ((this.isCollapsibleOnDesktop && 769 < this.bodyWidth) ||
        (this.isCollapsibleOnMobile && this.bodyWidth <= 769)) &&
        this.restoreAriaProps();
  }
  removeAriaProps() {
    this.triggers.forEach((t) => {
      (t.style.pointerEvents = "none"),
        t.setAttribute("tabindex", -1),
        t.removeAttribute("aria-controls"),
        t.removeAttribute("aria-expanded");
    }),
      this.contents.forEach((t) => {
        t.removeAttribute("aria-describedby"),
          t.removeAttribute("role"),
          t.removeAttribute("hidden");
      });
  }
  restoreAriaProps() {
    this.triggers.forEach((t) => {
      (t.style.pointerEvents = "auto"),
        t.setAttribute("aria-controls", this.properties.ariaControls),
        t.setAttribute("aria-expanded", "false"),
        t.removeAttribute("tabindex");
    }),
      this.contents.forEach((t) => {
        t.setAttribute("aria-describedby", this.properties.ariaDescribedby),
          t.setAttribute("role", "region"),
          t.setAttribute("hidden", "");
      });
  }
  onTriggerClick(t) {
    var e = "true" === t.getAttribute("aria-expanded");
    this.toggle(!e, t);
  }
  toggle(t, e) {
    e.setAttribute("aria-expanded", "" + t);
    var s = this.$("#" + e.getAttribute("aria-controls"));
    t
      ? (e.classList.add("open"), s.removeAttribute("hidden"))
      : (e.classList.remove("open"), s.setAttribute("hidden", ""));
  }
  open() {
    this.toggle(!0);
  }
  close() {
    this.toggle(!1);
  }
}
customElements.define("sht-clps-rgn", SHTCollapsibleRegion);
class SHTQuantityInput extends SHTCustomComponent {
  constructor() {
    super(),
      (this.input = this.$(".js-quantity-input")),
      (this.changeEvent = new Event("change", { bubbles: !0 })),
      this.$$(".js-quantity-btn").forEach((t) =>
        t.addEventListener("click", this.onButtonClickHandler.bind(this))
      );
  }
  onButtonClickHandler(t) {
    t.preventDefault();
    var e = this.input.value;
    "plus" === t.currentTarget.dataset.name
      ? this.input.stepUp()
      : this.input.stepDown(),
      e !== this.input.value && this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define("sht-qty-inp", SHTQuantityInput);
class SHTAccordion extends SHTCustomComponent {
  constructor() {
    super(),
      (this.properties = this.dataset.properties
        ? JSON.parse(this.dataset.properties)
        : {}),
      (this.accordionItems = this.$$(".js-accordion-item")),
      (this.accordionTriggers = this.$$(".js-accordion-trigger")),
      (this.accordionTrigger = this.$(".js-accordion-trigger")),
      (this.accordionContents = this.$$(".js-accordion-content")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.accordionTriggers.forEach((t) => {
      t.addEventListener("click", (t) => {
        t.preventDefault(), this.onTriggerClick(t.currentTarget);
      });
    });
  }
  onTriggerClick(t) {
    var e = "true" === t.getAttribute("aria-expanded");
    this.properties.multiple || this.toggleAll(), this.toggle(!e, t);
  }
  toggle(t, e) {
    e.setAttribute("aria-expanded", "" + t),
      t ? e.classList.add("open") : e.classList.remove("open");
    e = this.$("#" + e.getAttribute("aria-controls"));
    t
      ? (e.classList.add("open"),
        (e.style.maxHeight = this.calculateMaxHeightContent(e) + "px"))
      : (e.classList.remove("open"), (e.style.maxHeight = "0px"));
  }
  open() {
    this.toggle(!0);
  }
  close() {
    this.toggle(!1);
  }
  toggleAll() {
    this.accordionTriggers.forEach((t) => {
      t.setAttribute("aria-expanded", "false"), t.classList.remove("open");
    }),
      this.accordionContents.forEach((t) => {
        t.classList.remove("open"), (t.style.maxHeight = "0px");
      });
  }
  calculateMaxHeightContent(t) {
    return t.scrollHeight;
  }
}
customElements.define("sht-accordion", SHTAccordion);
class SHTLazyLoadingVideo extends SHTCustomComponent {
  constructor() {
    super(), (this.video = this.$("iframe")), (this.isMouseenter = !1);
  }
  loadVideo() {
    var t;
    this.video &&
      (this.video.setAttribute("src", this.video.getAttribute("data-src")),
      this.video.addEventListener(
        "load",
        function () {
          this.dispatchEvent(
            new CustomEvent("loadingEnd", {
              detail: { ele: this.video, parent: this },
            })
          ),
            "youtube" == this.dataVideoType &&
              this.video.contentWindow.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                "*"
              ),
            "vimeo" == this.dataVideoType &&
              this.video.contentWindow.postMessage('{"method":"play"}', "*");
        }.bind(this)
      )),
      "local_video" == this.dataVideoType &&
        ((this.local_video = this.$("video")),
        (t = this.local_video.querySelector("source").getAttribute("data-src")),
        (this.local_video.src = t));
  }
  execute() {
    Shopify.designMode
      ? this.loadVideo()
      : (["mouseenter", "touchstart"].forEach(
          function (t) {
            SHTHelper.qs("body").addEventListener(
              t,
              function (t) {
                this.isMouseenter || this.loadVideo(), (this.isMouseenter = !0);
              }.bind(this),
              { once: !0 }
            );
          }.bind(this)
        ),
        window.addEventListener(
          "scroll",
          function (t) {
            this.isMouseenter || this.loadVideo(), (this.isMouseenter = !0);
          }.bind(this),
          { once: !0 }
        ));
  }
  static get observedAttributes() {
    return ["data-video-type", "data-video-id"];
  }
  set dataVideoType(t) {
    this.setAttribute("data-video-type", t);
  }
  get dataVideoType() {
    return this.getAttribute("data-video-type");
  }
  set dataVideoId(t) {
    this.setAttribute("data-video-id", t);
  }
  get dataVideoId() {
    return this.getAttribute("data-video-id");
  }
  attributeChangedCallback(t, e, s) {
    e !== s && this.execute();
  }
  connectedCallback() {
    this.execute();
  }
  disconnectedCallback() {}
}
customElements.define("sht-load-video", SHTLazyLoadingVideo);
class SHTTabs extends SHTCustomComponent {
  constructor() {
    super(),
      (this.tabLinks = this.$$(".js-tab-link")),
      (this.tabPanels = this.$$(".js-tab-panel")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.tabLinks.forEach(
      function (t, e, s) {
        t.addEventListener(
          "click",
          function (t) {
            t.preventDefault(), this.tabLinkEventHandler(t.target);
          }.bind(this)
        );
      }.bind(this)
    );
  }
  tabLinkEventHandler(t) {
    var e = t.getAttribute("href").replace("#", ""),
      e =
        (this.tabPanels.forEach(
          function (t) {
            t.classList.remove("d-block", "tab__panel--active"),
              t.classList.add("d-none");
          }.bind(this)
        ),
        this.tabLinks.forEach(
          function (t) {
            t.classList.remove("tab__link--active");
          }.bind(this)
        ),
        this.$(`[data-tab-content-id=${e}]`));
    e.classList.remove("d-none"),
      e.classList.add("d-block", "tab__panel--active"),
      t.classList.add("tab__link--active");
  }
  connectedCallback() {}
  disconnectedCallback() {}
}
customElements.define("sht-tabs", SHTTabs);
class SHTLoadMedia extends SHTCustomComponent {
  constructor() {
    super(),
      (this.trigger = this.$(".js-load-media-trigger")),
      this.trigger.addEventListener("click", (t) => this.loadMedia());
  }
  loadMedia(t = !0, e = !0) {
    var s;
    this.pauseAllVideo(),
      this.getAttribute("loaded") ||
        ((s = document.createElement("div")).appendChild(
          this.$("template").content.firstElementChild.cloneNode(!0)
        ),
        this.setAttribute("loaded", !0),
        (s = this.appendChild(s.querySelector("video, iframe"))),
        t && s.focus(),
        e && this.trigger.classList.add("d-none"));
  }
  pauseAllVideo() {
    SHTHelper.qsa(".js-media-item-youtube").forEach((t) => {
      t.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }),
      SHTHelper.qsa(".js-media-item-vimeo").forEach((t) => {
        t.contentWindow.postMessage('{"method":"pause"}', "*");
      }),
      SHTHelper.qsa(".js-media-item-video").forEach((t) => t.pause());
  }
}
customElements.define("sht-load-media", SHTLoadMedia);
class SHTAnnouncementBar extends SHTCustomComponent {
  constructor() {
    super();
  }
  init() {
    (this.items = this.$$(".js-anmb-item")),
      (this.container = this.$(".js-anmb-items")),
      (this.linkItems = this.$$(".js-anmb-link-items")),
      (this.totalItems = this.items.length),
      (this.previousButton = this.$(".js-anmb-control-prev")),
      (this.nextButton = this.$(".js-anmb-control-next")),
      (this.props = JSON.parse(this.dataset.props)),
      (this.delayTime = this.props.duration),
      (this.interval = null),
      (this.currentItemIndex = 1),
      (this.lastScrollTimeout = null),
      (this.messages = this.container.children),
      (this.isScrolling = !1),
      this.bindEventHandlers(),
      this.updateSort(),
      this.autoPlay();
  }
  connectedCallback() {
    this.init();
  }
  updateSort() {
    var t, e, s, i;
    this.totalItems <= 1 ||
      ((this.isScrolling = !0),
      (t = this.container.scrollLeft),
      (e = Math.round(t)),
      (s = this.container.offsetWidth),
      (i = this.container.scrollWidth),
      e < s &&
        (this.container.prepend(this.messages[this.totalItems - 1]),
        (this.container.scrollLeft = e + s)),
      Math.floor(i - t) <= s &&
        (this.container.append(this.messages[0]),
        (this.container.scrollLeft = e - s)),
      (this.isScrolling = !1));
  }
  onScrollEventHandle(t) {
    this.lastScrollTimeout && clearTimeout(this.lastScrollTimeout),
      (this.lastScrollTimeout = setTimeout(
        function () {
          this.updateSort();
        }.bind(this),
        100
      ));
  }
  bindEventHandlers() {
    this.previousButton.addEventListener(
      "click",
      SHTHelper.debounce(this.onPrevButtonClickHandler.bind(this), 300)
    ),
      this.nextButton.addEventListener(
        "click",
        SHTHelper.debounce(this.onNextButtonClickHandler.bind(this), 300)
      ),
      this.onObserverHandler(),
      this.container.addEventListener(
        "scroll",
        SHTHelper.debounce(this.onScrollEventHandle.bind(this), 100)
      ),
      this.container.addEventListener(
        "wheel",
        function (t) {
          SHTHelper.debounce(this.resetAutoPlay.bind(this), 0);
        }.bind(this),
        { passive: !0 }
      );
  }
  onPrevButtonClickHandler() {
    if (!this.isScrolling) {
      (this.isScrolling = !0), this.resetAutoPlay();
      let t = this.currentItemIndex - 1;
      1 == this.currentItemIndex && (t = this.totalItems);
      var e = this.$(`div[data-item-index="${t}"]`);
      this.container.scrollTo({ left: e.offsetLeft, behavior: "smooth" });
    }
  }
  onNextButtonClickHandler() {
    if (!this.isScrolling) {
      (this.isScrolling = !0), this.resetAutoPlay();
      let t = this.currentItemIndex + 1;
      this.currentItemIndex == this.totalItems && (t = 1);
      var e = this.$(`div[data-item-index="${t}"]`);
      this.container.scrollTo({ left: e.offsetLeft, behavior: "smooth" });
    }
  }
  onMouseOverHandle(t) {
    this.clearDismissInterval();
  }
  onMouseOutHandle(t) {
    this.setDismissInterval();
  }
  clearDismissInterval() {
    this.interval && clearInterval(this.interval);
  }
  setDismissInterval() {
    this.interval = setInterval(
      function () {
        this.onNextButtonClickHandler();
      }.bind(this),
      this.delayTime
    );
  }
  resetAutoPlay() {
    !this.props.autoPlay ||
      this.totalItems < 2 ||
      (this.clearDismissInterval(),
      setTimeout(() => {
        this.setDismissInterval();
      }));
  }
  autoPlay() {
    !this.props.autoPlay || this.totalItems < 2
      ? (this.clearDismissInterval(),
        this.container.setAttribute("aria-live", "polite"))
      : (this.container.addEventListener(
          "mouseover",
          this.onMouseOverHandle.bind(this)
        ),
        this.container.addEventListener(
          "mouseout",
          this.onMouseOutHandle.bind(this)
        ),
        this.container.setAttribute("aria-live", "off"),
        this.setDismissInterval());
  }
  onObserverHandler() {
    let e = new IntersectionObserver(
      (t, e) => {
        t.forEach((e) => {
          if (e.isIntersecting) {
            let t = e.target;
            this.linkItems.forEach((t) => {
              t.setAttribute("tabindex", "-1");
            }),
              window.requestAnimationFrame(() => {
                var t = this.$(".anmb-item--active");
                t &&
                  (t.classList.remove("anmb-item--active"),
                  t.setAttribute("aria-hidden", "true"));
              }),
              (this.currentItemIndex = parseInt(t.dataset.itemIndex)),
              t.setAttribute("aria-hidden", "false"),
              window.requestAnimationFrame(() =>
                t.classList.add("anmb-item--active")
              );
            e = t.querySelector(".js-anmb-link-items");
            e && e.removeAttribute("tabindex");
          }
        });
      },
      { root: this.container, rootMargin: "0px", threshold: 0.5 }
    );
    this.items.forEach((t) => {
      e.observe(t);
    });
  }
}
customElements.define("sht-ann-bar", SHTAnnouncementBar);
class SHTPopup extends SHTCustomComponent {
  constructor() {
    super(),
      (this.properties = JSON.parse(this.dataset.props)),
      (this.myStorage = window.sessionStorage),
      (this.sessionStorageName =
        Shopify.theme.name.toLowerCase() + "-popup-display"),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      (this.isOpen = !1),
      (this.buffer = 100),
      (this.myScrollHeight =
        document.body.scrollHeight || SHTHelper.qde.scrollHeight || 0),
      (this.myWindowHeight =
        window.innerHeight || SHTHelper.qde.clientHeight || 0),
      (this.elms = {
        close_btn: this.$(".js-popup-close-btn"),
        body: SHTHelper.qs("body"),
      }),
      (this.triggerOn = this.properties.triggerOn),
      (this.scrollEventHandle = this.onScrollEventHandle.bind(this)),
      (this.onLoadUserAction = this.onUserAction.bind(this)),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.elms.close_btn.addEventListener(
      "click",
      this.onCloseBtnClickHandle.bind(this)
    ),
      window.addEventListener("scroll", this.scrollEventHandle),
      this.cartNotification &&
        "after-closing-cart-notification" === this.triggerOn &&
        this.cartNotification.addEventListener("closed", (t) => {
          this.getPopupStatus() || this.togglePopup(!0);
        }),
      ["mouseover"].forEach(
        function (t) {
          SHTHelper.qs("body").addEventListener(t, this.onLoadUserAction);
        }.bind(this)
      ),
      this.popupAttrObserve();
  }
  onUserAction(t) {
    this.classList.contains("d-none") && this.classList.remove("d-none"),
      t.currentTarget.removeEventListener(t.type, this.onLoadUserAction);
  }
  onScrollEventHandle(t) {
    var e, s;
    "reaching-to-footer" !== this.triggerOn
      ? window.removeEventListener("scroll", this.scrollEventHandle)
      : ((this.myScrollHeight =
          document.body.scrollHeight || SHTHelper.qde.scrollHeight || 0),
        (e =
          (window.pageYOffset ||
            SHTHelper.qde.scrollTop ||
            document.body.scrollTop ||
            0) +
            this.buffer +
            this.myWindowHeight >=
          this.myScrollHeight),
        (s = this.getPopupStatus()),
        "reaching-to-footer" !== this.triggerOn ||
          !e ||
          (null !== this.getAttribute("open") &&
            "" !== this.getAttribute("open")) ||
          s ||
          this.togglePopup(!0));
  }
  togglePopup(t) {
    var e = this.$(".js-success");
    t && !e
      ? this.toggleOpen(!0)
      : (this.toggleOpen(!1), this.setPopupStatus());
  }
  toggleOpen(t) {
    t
      ? (this.elms.body.classList.add("is-popup-show"),
        this.setAttribute("open", !0))
      : (this.elms.body.classList.remove("is-popup-show"),
        this.removeAttribute("open"),
        SHTHelper.removeTrapFocus());
  }
  onCloseBtnClickHandle(t) {
    t.preventDefault(), this.togglePopup(!1);
  }
  setPopupStatus() {
    this.myStorage.setItem(this.sessionStorageName, !1);
  }
  getPopupStatus() {
    return Shopify.designMode
      ? ""
      : this.myStorage.getItem(this.sessionStorageName);
  }
  popupAttrObserve() {
    new MutationObserver((t, e) => {
      t.forEach(async (t) => {
        "open" == t.attributeName &&
          (this.hasAttribute("open")
            ? (await this.animationsComplete(),
              this.dispatchEvent(new Event("opened")),
              SHTHelper.trapFocus(this))
            : (SHTHelper.removeTrapFocus(),
              await this.animationsComplete(),
              this.dispatchEvent(new Event("closed"))));
      });
    }).observe(this, { attributes: !0 });
  }
  animationsComplete() {
    return Promise.allSettled(this.getAnimations().map((t) => t.finished));
  }
}
customElements.define("sht-popup", SHTPopup);
class SHTSlideShow extends SHTCustomComponent {
  constructor() {
    super(),
      (this.slideshow = this.$(".js-slideshow")),
      (this.slideshowItems = this.$(".js-slideshow-items")),
      (this.totalElm = this.$(".js-slideshow-total")),
      (this.currentElm = this.$(".js-slideshow-current")),
      (this.separatorElm = this.$(".js-slideshow-separator")),
      (this.prevBtn = this.$(".js-slideshow-prev-btn")),
      (this.nextBtn = this.$(".js-slideshow-next-btn")),
      (this.startNStopBtn = this.$(".js-slideshow-start-n-stop-btn")),
      (this.imageItems = this.$$(".js-slideshow-image")),
      (this.pauseIcon = this.startNStopBtn.querySelector(
        ".js-slideshow-pause-icon"
      )),
      (this.playIcon = this.startNStopBtn.querySelector(
        ".js-slideshow-play-icon"
      )),
      (this.properties = JSON.parse(this.dataset.slideshowProperties)),
      (this.autoplay = this.properties.autoplay || !1),
      (this.image = null),
      (this.template = null),
      (this.current = 1),
      (this.anchors = []),
      (this.lastScrollTimeout = null),
      (this.autoplayInterval = null),
      (this.images = this.slideshowItems.children),
      (this.total = this.images.length),
      (this.slideshowItems.scrollLeft = 0),
      (this.observer = null),
      (this.isPaused = !1);
  }
  cloneSlideItem() {
    var t, e;
    2 == this.total &&
      ((t = this.slideshowItems.querySelector(
        ".js-slideshow-item:first-of-type"
      )),
      (e = this.slideshowItems.querySelector(
        ".js-slideshow-item:last-of-type"
      )) &&
        ((e = e.cloneNode(!0)).classList.add("slider-slide--clone"),
        this.slideshowItems.append(e)),
      t) &&
      ((e = t.cloneNode(!0)).classList.add("slider-slide--clone"),
      this.slideshowItems.append(e));
  }
  execute() {
    this.cloneSlideItem(),
      this.prepare(),
      this.bindEventHandlers(),
      this.init();
  }
  connectedCallback() {
    this.execute();
  }
  init() {
    this.autoplay && (this.resumeAutoPlay(), (this.isPaused = !0)),
      this.updateSort();
  }
  updateSort() {
    var t, e, s, i;
    this.total <= 1 ||
      ((t = this.slideshowItems.scrollLeft),
      (e = Math.round(t)),
      (s = this.slideshowItems.offsetWidth),
      (i = this.slideshowItems.scrollWidth),
      e < s &&
        (this.slideshowItems.prepend(this.images[this.total - 1]),
        (this.slideshowItems.scrollLeft = e + s)),
      Math.floor(i - t) <= s &&
        (this.slideshowItems.append(this.images[0]),
        (this.slideshowItems.scrollLeft = e - s)));
  }
  startAutoPlay() {
    this.autoplay &&
      (this.autoplayInterval = setInterval(
        function () {
          this.nextSlide();
        }.bind(this),
        this.properties.duration
      ));
  }
  bindEventHandlers() {
    this.slideshowItems.addEventListener(
      "wheel",
      function (t) {
        5 == Math.abs(t.deltaX) && this.stopAutoPlay();
      }.bind(this),
      { passive: !0 }
    ),
      this.slideshowItems.addEventListener(
        "scroll",
        SHTHelper.debounce(this.onScrollEventHandle.bind(this), 100)
      ),
      this.nextBtn.addEventListener(
        "click",
        function () {
          this.nextSlide(), this.stopAutoPlay();
        }.bind(this)
      ),
      this.prevBtn.addEventListener(
        "click",
        function () {
          this.prevSlide(), this.stopAutoPlay();
        }.bind(this)
      ),
      this.startNStopBtn.addEventListener(
        "click",
        this.onStartNStopEventHandle.bind(this)
      );
  }
  onStartNStopEventHandle(t) {
    t.preventDefault(),
      this.autoplay ? this.stopAutoPlay() : this.resumeAutoPlay();
  }
  stopAutoPlay() {
    clearInterval(this.autoplayInterval),
      this.pauseIcon.classList.add("d-none"),
      this.playIcon.classList.remove("d-none"),
      this.startNStopBtn.setAttribute(
        "aria-label",
        this.properties.autoplayAccessibilityText[0]
      ),
      this.slideshowItems.setAttribute("aria-live", "polite"),
      (this.autoplay = !1);
  }
  resumeAutoPlay() {
    (this.autoplay = !0),
      this.pauseIcon.classList.remove("d-none"),
      this.playIcon.classList.add("d-none"),
      this.startNStopBtn.setAttribute(
        "aria-label",
        this.properties.autoplayAccessibilityText[1]
      ),
      this.slideshowItems.setAttribute("aria-live", "off"),
      this.startAutoPlay();
  }
  onScrollEventHandle(t) {
    t.preventDefault(),
      this.lastScrollTimeout && clearTimeout(this.lastScrollTimeout),
      (this.lastScrollTimeout = setTimeout(
        function () {
          this.updateSort();
        }.bind(this),
        100
      )),
      this.updateCurrent();
  }
  prepare() {
    (this.totalElm.textContent = this.total),
      (this.currentElm.textContent = this.current),
      (this.separatorElm.textContent = this.properties.separatorText),
      this.autoplay &&
        (this.startNStopBtn.toggleAttribute("hidden", !1),
        this.startNStopBtn
          .querySelector(".js-slideshow-pause-icon")
          .classList.remove("d-none"),
        this.startNStopBtn.setAttribute(
          "aria-label",
          this.properties.autoplayAccessibilityText[0]
        ),
        this.slideshowItems.setAttribute("aria-live", "off"));
  }
  updateCurrent() {
    var t = this.$(".js-slideshow-image--current");
    t && (this.current = t.dataset.slideshowIndex),
      (this.currentElm.textContent = this.current);
  }
  prevSlide() {
    if (Shopify.designMode)
      this.slideshowItems.scrollLeft =
        this.slideshowItems.scrollLeft - this.slideshow.scrollWidth;
    else {
      let t = this.$(".js-slideshow-image--current").closest(
        ".slider-slide--active"
      );
      t && t.classList.add("slider-slide--active-blur"),
        setTimeout(() => {
          (this.slideshowItems.scrollLeft =
            this.slideshowItems.scrollLeft - this.slideshow.scrollWidth),
            t.classList.remove("slider-slide--active-blur");
        }, 400);
    }
  }
  nextSlide() {
    if (Shopify.designMode)
      this.slideshowItems.scrollLeft =
        this.slideshowItems.scrollLeft + this.slideshow.scrollWidth;
    else {
      let t = this.$(".js-slideshow-image--current").closest(
        ".slider-slide--active"
      );
      t && t.classList.add("slider-slide--active-blur"),
        setTimeout(() => {
          (this.slideshowItems.scrollLeft =
            this.slideshowItems.scrollLeft + this.slideshow.scrollWidth),
            t.classList.remove("slider-slide--active-blur");
        }, 400);
    }
  }
  observerSlideShow() {
    (this.observer = new IntersectionObserver(
      (t, e) => {
        t.forEach((t) => {
          t.isIntersecting && (this.dataset.viewport = 1),
            this.observer.unobserve(this);
        });
      },
      { threshold: 0.15 }
    )),
      this.observer.observe(this);
  }
}
customElements.define("sht-slideshow", SHTSlideShow);
class SHTSlideshowLazyLoadingImage extends SHTCustomComponent {
  constructor() {
    super(),
      (this.image = this.$(".js-image-lazy")),
      (this.imageMobile = this.$(".js-image-lazy-mobile")),
      (this.spinner = this.$(".js-image-lazy-spinner")),
      (this.container = this.closest(".js-slideshow-items")),
      (this.currentItemClass = "js-slideshow-image--current"),
      (this.slideItem = this.closest(".js-slideshow-item")),
      (this.sectionId = this.dataset.sectionId),
      (this.section = SHTHelper.qs("#shopify-section-" + this.sectionId)),
      this.bindEventHandlers();
  }
  setSlideItemVisibility(t) {
    t
      ? (this.slideItem.setAttribute("aria-hidden", "false"),
        this.slideItem.removeAttribute("tabindex"),
        this.slideItem.classList.add("slider-slide--active"))
      : (this.slideItem.setAttribute("aria-hidden", "true"),
        this.slideItem.setAttribute("tabindex", "-1"),
        this.slideItem.classList.remove("slider-slide--active"));
  }
  observeImage(s, i) {
    var t = new IntersectionObserver(
      (t, e) => {
        t.forEach((t) => {
          t.target;
          var e = this.parentNode;
          t.isIntersecting && !this.getAttribute("loaded")
            ? (s && s.removeAttribute("loading"),
              i && i.removeAttribute("loading"),
              this.setAttribute("loaded", !0),
              e.classList.add(this.currentItemClass),
              this.setSlideItemVisibility(!0))
            : 0 == t.intersectionRatio
            ? (e.classList.remove(this.currentItemClass),
              this.setSlideItemVisibility(!1))
            : this.getAttribute("loaded") &&
              (e.classList.add(this.currentItemClass),
              this.setSlideItemVisibility(!0));
        });
      },
      {
        root: this.container,
        rootMargin: "100px -2px 100px -2px",
        threshold: 0,
      }
    );
    s && t.observe(s);
  }
  loadImage() {
    new ResizeObserver((t) => {
      window.matchMedia("(max-width: 767px)").matches && this.imageMobile
        ? this.observeImage(this.imageMobile, this.image)
        : this.image && this.observeImage(this.image, this.imageMobile);
    }).observe(document.body),
      window.matchMedia("(max-width: 767px)").matches && this.imageMobile
        ? this.observeImage(this.imageMobile, this.image)
        : this.image && this.observeImage(this.image, this.imageMobile);
  }
  bindEventHandlers() {}
  execute() {
    this.loadImage();
  }
  connectedCallback() {
    this.execute();
  }
  disconnectedCallback() {}
}
customElements.define("sht-slideshow-load-img", SHTSlideshowLazyLoadingImage);
class SHTSlideshowCTA extends SHTCustomComponent {
  constructor() {
    super(),
      (this.ctaButton = this.$$(".js-slideshow-cta")),
      (this.container = this.closest(".js-slideshow-items")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.observeItem();
  }
  observeItem() {
    new IntersectionObserver(
      (t, e) => {
        t.forEach((t) => {
          t.isIntersecting
            ? this.setCTAVisibility(!0)
            : this.setCTAVisibility(!1);
        });
      },
      { threshold: 0.25 }
    ).observe(this);
  }
  setCTAVisibility(s) {
    this.ctaButton.forEach((t, e) => {
      s
        ? (t.removeAttribute("tabindex"),
          t.setAttribute("aria-hidden", "false"))
        : (t.setAttribute("tabindex", "-1"),
          t.setAttribute("aria-hidden", "true"));
    });
  }
}
customElements.define("sht-slideshow-cta", SHTSlideshowCTA);
class SHTHotSpotTooltip extends SHTCustomComponent {
  constructor() {
    super();
  }
  init() {
    (this.tooltip_content = this.$(".js-tooltip-content")),
      (this.tooltip_contents = this.$$(".js-tooltip-content")),
      (this.tooltip_placeholders = this.$$(".js-tooltip-placeholder")),
      (this.tooltip_container = SHTHelper.qs("#" + this.dataset.containerId)),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    for (let t = 0, e = this.tooltip_placeholders.length; t < e; t++) {
      var s = this.tooltip_placeholders[t];
      s.addEventListener("mouseover", (t) => {
        this.handleToolTipContentPosition(t);
      }),
        s.addEventListener("mouseout", (t) => {
          for (let t = 0, e = this.tooltip_contents.length; t < e; t++)
            this.tooltip_contents[t].classList.remove(
              "hotspot-content--right",
              "hotspot-content--left",
              "hotspot-content--top",
              "hotspot-content--bottom",
              "hotspot-content--show"
            );
        });
    }
  }
  handleToolTipContentPosition(t) {
    var t = t.currentTarget,
      e = t.querySelector(".js-tooltip-content"),
      s = Math.round(t.offsetLeft + e.offsetWidth + t.offsetWidth),
      i = Math.round(t.offsetTop + e.offsetHeight + t.offsetHeight);
    0 <= t.offsetLeft &&
    t.offsetLeft < this.tooltip_container.offsetWidth &&
    s < this.tooltip_container.offsetWidth
      ? e.classList.add("hotspot-content--right", "hotspot-content--show")
      : 0 <= t.offsetLeft &&
        t.offsetLeft < this.tooltip_container.offsetWidth &&
        s >= this.tooltip_container.offsetWidth &&
        e.classList.add("hotspot-content--left", "hotspot-content--show"),
      0 <= t.offsetTop &&
      t.offsetTop < this.tooltip_container.offsetHeight &&
      i < this.tooltip_container.offsetHeight
        ? e.classList.add("hotspot-content--bottom")
        : 0 <= t.offsetTop &&
          t.offsetTop < this.tooltip_container.offsetHeight &&
          i >= this.tooltip_container.offsetHeight &&
          e.classList.add("hotspot-content--top");
  }
  connectedCallback() {
    Shopify.designMode
      ? setTimeout(() => {
          this.init();
        }, 1e3)
      : this.init();
  }
}
customElements.define("sht-hotspot", SHTHotSpotTooltip);
class SHTMarquee extends SHTCustomComponent {
  constructor() {
    super(),
      (this.playNPauseBtn = this.$(".js-marquee-pause-n-play-btn")),
      (this.pauseIcon = this.$(".js-marqueen-pause-btn")),
      (this.playIcon = this.$(".js-marqueen-play-btn")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.playNPauseBtn.addEventListener("click", (t) => {
      var e = "false" === t.currentTarget.getAttribute("aria-pressed");
      this.classList.toggle("marquee--animation-pause", e),
        this.playIcon.classList.toggle("d-none", !e),
        this.pauseIcon.classList.toggle("d-none", e),
        t.currentTarget.setAttribute("aria-pressed", e.toString());
    });
  }
}
customElements.define("sht-marquee", SHTMarquee);
class SHTMap extends SHTCustomComponent {
  constructor() {
    super(), (this.iframe = this.$(".js-map-iframe")), this.bindEventHandlers();
  }
  loadIframeContent() {
    new IntersectionObserver(
      (t, e) => {
        t.forEach((t) => {
          t.isIntersecting &&
            (this.dispatchEvent(
              new CustomEvent("loadingStart", {
                detail: { ele: this.iframe, parent: this },
              })
            ),
            this.execute(),
            e.unobserve(t.target));
        });
      },
      { rootMargin: "0px 0px -100px 0px" }
    ).observe(this);
  }
  bindEventHandlers() {
    this.iframe.addEventListener(
      "load",
      function () {
        this.dispatchEvent(
          new CustomEvent("loadingEnd", {
            detail: { ele: this.iframe, parent: this },
          })
        ),
          this.setAttribute("loaded", !0);
      }.bind(this)
    );
  }
  execute() {
    this.setIframeSrc();
  }
  setIframeSrc() {
    var t = `https://maps.google.com/maps?z=${this.dataZoom}&t=${
      this.dataType
    }&q=${this.dataLocation.replace(/"/g, "")}&ie=UTF8&&output=embed`;
    (this.iframe.src = t), this.iframe.removeAttribute("srcdoc");
  }
  static get observedAttributes() {
    return ["data-zoom", "data-type", "data-location"];
  }
  attributeChangedCallback(t, e, s) {
    e !== s && (Shopify.designMode ? this.execute() : this.loadIframeContent());
  }
  connectedCallback() {}
  disconnectedCallback() {}
  get dataZoom() {
    return this.getAttribute("data-zoom");
  }
  get dataType() {
    return this.getAttribute("data-type");
  }
  get dataLocation() {
    return this.getAttribute("data-location");
  }
  set dataZoom(t) {
    this.setAttribute("data-zoom", t);
  }
  set dataType(t) {
    this.setAttribute("data-type", t);
  }
  set dataLocation(t) {
    this.setAttribute("data-location", t);
  }
}
customElements.define("sht-map", SHTMap);
class SHTLoadDynamicCheckoutButtonDynamicCheckoutButton extends SHTCustomComponent {
  constructor() {
    super(),
      (this.template = this.$("template")),
      (this.onLoadDynamicCheckoutButton =
        this.onHandleLoadDynamicCheckoutButton.bind(this)),
      this.bindEventHandlers(),
      (this.isMouseenter = !1),
      (this.json = JSON.parse(
        SHTHelper.qs('#shopify-features[type="application/json"]').textContent
      )),
      Shopify.designMode
        ? this.loadDynamicCheckoutButton()
        : (window.addEventListener(
            "scroll",
            this.onLoadDynamicCheckoutButton,
            !1
          ),
          window.addEventListener(
            "load",
            function (t) {
              let e = setTimeout(
                function () {
                  this.isMouseenter ||
                    (this.loadDynamicCheckoutButton(), clearTimeout(e)),
                    (this.isMouseenter = !0);
                }.bind(this),
                3e3
              );
            }.bind(this)
          ),
          ["mouseover"].forEach(
            function (t) {
              SHTHelper.qs("body").addEventListener(
                t,
                this.onLoadDynamicCheckoutButton
              );
            }.bind(this)
          ));
  }
  onHandleLoadDynamicCheckoutButton(t) {
    this.isMouseenter || this.loadDynamicCheckoutButton(),
      t.currentTarget.removeEventListener(
        t.type,
        this.onLoadDynamicCheckoutButton
      ),
      (this.isMouseenter = !0);
  }
  loadDynamicCheckoutButton() {
    new IntersectionObserver(
      (t, s) => {
        t.forEach((t) => {
          var e;
          1 !== t.intersectionRatio ||
            this.getAttribute("loaded") ||
            ((t = this.template.content.firstElementChild.cloneNode(!0)),
            ((e = document.createElement("script")).src =
              this.json.smart_payment_buttons_url),
            e.setAttribute(
              "data-source-attribute",
              "shopify.dynamic_checkout.product.init"
            ),
            this.parentNode.insertBefore(t, this.nextSibling),
            this.parentNode.insertBefore(e, this.nextSibling),
            this.setAttribute("loaded", !0),
            s.unobserve(this));
        });
      },
      { root: null, rootMargin: "50px 0px", threshold: 0 }
    ).observe(this);
  }
  bindEventHandlers() {}
}
customElements.define(
  "sht-load-dyn-co-btn",
  SHTLoadDynamicCheckoutButtonDynamicCheckoutButton
);
class SHTVerticalCarousel extends SHTCustomComponent {
  constructor() {
    super(),
      (this.sectionID = this.dataset.sectionId),
      (this.carousels = this.$$(".js-carousel-item")),
      (this.container = this.$(".js-carousel-items")),
      (this.totalItems = this.carousels.length),
      (this.prevBtnElement = this.$(".js-carousel-prev-btn")),
      (this.nextBtnElement = this.$(".js-carousel-next-btn")),
      (this.currentElement = this.$(".js-carousel-counter-current")),
      (this.totalElement = this.$(".js-carousel-counter-total")),
      (this.paginationElement = this.$(".js-carousel-pagination")),
      this.init(),
      this.bindEventHandlers();
  }
  init() {
    (this.itemsToShow = Array.from(this.carousels).filter(
      (t) => 0 < t.clientWidth
    )),
      this.itemsToShow.length < 2
        ? this.togglePagination(!1)
        : ((this.gutter =
            parseFloat(
              window
                .getComputedStyle(this.itemsToShow[1], null)
                .getPropertyValue("padding-top")
            ) +
            parseFloat(
              window
                .getComputedStyle(this.itemsToShow[1], null)
                .getPropertyValue("padding-bottom")
            )),
          (this.itemOffset =
            this.itemsToShow[1].offsetTop - this.itemsToShow[0].offsetTop),
          (this.itemsPerPage = Math.floor(
            (this.container.clientHeight - this.itemsToShow[0].offsetTop) /
              this.itemOffset
          )),
          (this.totalPages = this.itemsToShow.length - this.itemsPerPage + 1),
          this.updateCarousel());
  }
  updateCarousel() {
    var t = this.currentPage;
    (this.currentPage =
      Math.round(this.container.scrollTop / this.itemOffset) + 1),
      0 < this.currentPage &&
        0 < this.totalPages &&
        (this.totalElement && (this.totalElement.textContent = this.totalPages),
        this.currentElement) &&
        (this.currentElement.innerHTML =
          this.currentPage +
          `<span class="visually-hidden">${this.currentElement.dataset.accessibilityMessage}</span>`),
      this.currentPage != t &&
        this.dispatchEvent(
          new CustomEvent("itemChanged", {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.itemsToShow[this.currentPage - 1],
              container: this,
            },
          })
        ),
      this.isItemVisible(this.itemsToShow[0]) && 0 === this.container.scrollTop
        ? this.prevBtnElement.setAttribute("disabled", "disabled")
        : this.prevBtnElement.removeAttribute("disabled"),
      this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])
        ? this.nextBtnElement.setAttribute("disabled", "disabled")
        : this.nextBtnElement.removeAttribute("disabled"),
      1 < this.totalPages && this.togglePagination(!0),
      this.totalPages <= 1 && this.togglePagination(!1);
  }
  togglePagination(t) {
    t
      ? (this.paginationElement?.classList.remove("d-none"),
        this.paginationElement?.classList.add("d-flex"))
      : (this.paginationElement?.classList.remove("d-flex"),
        this.paginationElement?.classList.add("d-none"));
  }
  isItemVisible(t, e = 0) {
    e = this.container.clientHeight + this.container.scrollTop - e;
    return (
      t.offsetTop + t.clientHeight - 1 <= Math.ceil(e) &&
      t.offsetTop >= this.container.scrollTop
    );
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = 1,
      s = 0;
    window.matchMedia("(min-width: 769px)").matches &&
      (e = t.currentTarget.dataset.step),
      (0 != this.container.scrollTop &&
        !this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])) ||
        (s = this.gutter),
      (this.itemScrollPosition =
        "next" === t.currentTarget.name
          ? this.container.scrollTop - s + e * this.itemOffset
          : this.container.scrollTop + s - e * this.itemOffset),
      window.requestAnimationFrame(() =>
        this.container.scrollTo({
          top: this.itemScrollPosition,
          behavior: "smooth",
        })
      );
  }
  bindEventHandlers() {
    new ResizeObserver((t) => this.init()).observe(this.container);
    new IntersectionObserver(
      ((t, e) => {
        t[0].isIntersecting && (this.init(), e.unobserve(this));
      }).bind(this)
    ).observe(this),
      this.prevBtnElement.addEventListener(
        "click",
        this.onButtonClick.bind(this)
      ),
      this.nextBtnElement.addEventListener(
        "click",
        this.onButtonClick.bind(this)
      ),
      this.container.addEventListener(
        "scroll",
        SHTHelper.debounce(this.updateCarousel.bind(this), 100)
      );
  }
}
customElements.define("sht-vert-carousel", SHTVerticalCarousel);
class SHTHorizontalCarousel extends SHTCustomComponent {
  constructor() {
    super(),
      (this.sectionID = this.dataset.sectionId),
      (this.carousels = this.$$(".js-carousel-item")),
      (this.container = this.$(".js-carousel-items")),
      (this.totalItems = this.carousels.length),
      (this.prevBtnElement = this.$(".js-carousel-prev-btn")),
      (this.nextBtnElement = this.$(".js-carousel-next-btn")),
      (this.currentElement = this.$(".js-carousel-counter-current")),
      (this.totalElement = this.$(".js-carousel-counter-total")),
      this.init(),
      this.bindEventHandlers();
  }
  init() {
    (this.itemsToShow = Array.from(this.carousels).filter(
      (t) => 0 < t.clientWidth
    )),
      this.itemsToShow.length < 2 ||
        ((this.gutter =
          parseFloat(
            window
              .getComputedStyle(this.itemsToShow[1], null)
              .getPropertyValue("padding-left")
          ) +
          parseFloat(
            window
              .getComputedStyle(this.itemsToShow[1], null)
              .getPropertyValue("padding-right")
          )),
        (this.itemOffset =
          this.itemsToShow[1].offsetLeft - this.itemsToShow[0].offsetLeft),
        (this.itemsPerPage = Math.floor(
          (this.container.clientWidth - this.itemsToShow[0].offsetLeft) /
            this.itemOffset
        )),
        (this.totalPages = this.itemsToShow.length - this.itemsPerPage + 1),
        this.updateCarousel());
  }
  updateCarousel() {
    var t = this.currentPage;
    (this.currentPage =
      Math.round(this.container.scrollLeft / this.itemOffset) + 1),
      0 < this.currentPage &&
        0 < this.totalPages &&
        (this.totalElement && (this.totalElement.textContent = this.totalPages),
        this.currentElement) &&
        (this.currentElement.innerHTML =
          this.currentPage +
          `<span class="visually-hidden">${this.currentElement.dataset.accessibilityMessage}</span>`),
      this.currentPage != t &&
        this.dispatchEvent(
          new CustomEvent("itemChanged", {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.itemsToShow[this.currentPage - 1],
              container: this,
            },
          })
        ),
      this.isItemVisible(this.itemsToShow[0]) && 0 === this.container.scrollLeft
        ? this.prevBtnElement.setAttribute("disabled", "disabled")
        : this.prevBtnElement.removeAttribute("disabled"),
      this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])
        ? this.nextBtnElement.setAttribute("disabled", "disabled")
        : this.nextBtnElement.removeAttribute("disabled");
  }
  isItemVisible(t, e = 0) {
    e = this.container.clientWidth + this.container.scrollLeft - e;
    return (
      t.offsetLeft + t.clientWidth <= e &&
      t.offsetLeft >= this.container.scrollLeft
    );
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = 1,
      s = 0;
    window.matchMedia("(min-width: 769px)").matches &&
      (e = t.currentTarget.dataset.step),
      (0 != this.container.scrollLeft &&
        !this.isItemVisible(this.itemsToShow[this.itemsToShow.length - 1])) ||
        (s = this.gutter),
      (this.itemScrollPosition =
        "next" === t.currentTarget.name
          ? this.container.scrollLeft - s + e * this.itemOffset
          : this.container.scrollLeft + s - e * this.itemOffset),
      window.requestAnimationFrame(() =>
        this.container.scrollTo({
          left: this.itemScrollPosition,
          behavior: "smooth",
        })
      );
  }
  bindEventHandlers() {
    new ResizeObserver((t) => this.init()).observe(this.container);
    new IntersectionObserver(
      ((t, e) => {
        t[0].isIntersecting && (this.init(), e.unobserve(this));
      }).bind(this)
    ).observe(this),
      this.prevBtnElement &&
        this.prevBtnElement.addEventListener(
          "click",
          this.onButtonClick.bind(this)
        ),
      this.nextBtnElement &&
        this.nextBtnElement.addEventListener(
          "click",
          this.onButtonClick.bind(this)
        ),
      this.container.addEventListener(
        "scroll",
        SHTHelper.debounce(this.updateCarousel.bind(this), 100)
      );
  }
}
customElements.define("sht-horiz-carousel", SHTHorizontalCarousel);
class SHTProductSlideShowItem extends SHTCustomComponent {
  constructor() {
    super(),
      (this.openGalleryButton = this.$(".js-product-media-open-gallery-btn")),
      this.openGalleryButton &&
        this.openGalleryButton.addEventListener("click", (t) => {
          this.openDialogGallery(t);
        }),
      (this.slideshow = this.closest("sht-prd-slideshow")),
      (this.parent = this.closest("sht-carousel-itm")),
      this.prepare();
  }
  openDialogGallery(t) {
    var e = SHTHelper.qs("#" + t.currentTarget.dataset.galleryDialogId);
    e && (e.showModal(t.currentTarget, !0), this.slideshow.pauseAllVideo());
  }
  prepare() {
    window.matchMedia("(max-width: 459px)").matches
      ? "true" == this.slideshow.hide_variant &&
        this.parent.classList.remove("d-none")
      : this.parent.classList.contains("d-block") ||
        ("true" == this.slideshow.hide_variant &&
          this.parent.classList.add("d-none")),
      new ResizeObserver((t) => {
        window.matchMedia("(max-width: 459px)").matches
          ? "true" == this.slideshow.hide_variant &&
            this.parent.classList.remove("d-none")
          : this.parent.classList.contains("d-block") ||
            ("true" == this.slideshow.hide_variant &&
              this.parent.classList.add("d-none"));
      }).observe(document.body);
  }
}
customElements.define("sht-prd-slideshow-itm", SHTProductSlideShowItem);
class SHTProductSlideShow extends SHTCustomComponent {
  constructor() {
    super(),
      this.$$(".js-slideshow-btn-thumb").forEach((t, e) => {
        0 === e &&
          t
            .closest(".js-product-slideshow-thumb")
            .classList.add("is-active-item"),
          t.addEventListener("click", this.setActiveMedia.bind(this, t));
      }),
      (this.hide_variant = this.dataset.hideVariantImage);
  }
  setActiveMedia(t) {
    var e = this.$(`[data-media-id="${t.dataset.target}"]`),
      t = t.closest("sht-vert-carousel-itm");
    this.$$(".js-product-slideshow-item").forEach((t) => {
      t.classList.remove("d-block"),
        "true" == this.hide_variant && t.classList.add("d-none");
    }),
      this.$$(".js-product-slideshow-thumb").forEach((t) => {
        t.classList.remove("is-active-item");
      }),
      e.classList.add("d-block"),
      "true" == this.hide_variant && e.classList.remove("d-none"),
      t.classList.add("is-active-item"),
      this.playActiveVideo(e),
      this.playActiveModel(e);
  }
  pauseAllModel() {
    SHTHelper.qsa("sht-prd-media-itm-model").forEach((t) => {
      t.modelViewerUI && t.modelViewerUI.pause();
    });
  }
  pauseAllVideo() {
    this.$$(".js-media-item-youtube").forEach((t) => {
      t.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }),
      this.$$(".js-media-item-vimeo").forEach((t) => {
        t.contentWindow.postMessage('{"method":"pause"}', "*");
      }),
      this.$$(".js-media-item-video").forEach((t) => t.pause());
  }
  playActiveVideo(t) {
    this.pauseAllVideo();
    t = t.querySelector(".js-product-media-deferred-video");
    t && t.loadContent();
  }
  playActiveModel(t) {
    t = t.querySelector(".js-product-media-deferred-model");
    t && t.loadContent();
  }
}
customElements.define("sht-prd-slideshow", SHTProductSlideShow);
class SHTProductMediaItemDeferredVideo extends SHTCustomComponent {
  constructor() {
    super(),
      (this.itemDeferredVideoImageElem = this.$(
        ".js-product-media-item-deferred-video-image"
      )),
      this.itemDeferredVideoImageElem &&
        this.itemDeferredVideoImageElem.addEventListener("click", (t) => {
          this.loadContent();
        });
  }
  loadContent() {
    var t;
    if (!this.getAttribute("loaded"))
      return (
        (t = this.$("template").content.firstElementChild.cloneNode(!0)),
        this.appendChild(t),
        this.isLoaded(!0),
        this.itemDeferredVideoImageElem &&
          this.itemDeferredVideoImageElem.remove(),
        !0
      );
  }
  isLoaded(t) {
    t ? this.setAttribute("loaded", !0) : this.removeAttribute("loaded");
  }
}
customElements.define(
  "sht-prd-media-itm-deferred-video",
  SHTProductMediaItemDeferredVideo
);
class SHTProductMediaItemModel extends SHTCustomComponent {
  constructor() {
    super(),
      (this.itemModelImageElem = this.$(".js-product-media-item-model-image")),
      this.itemModelImageElem &&
        this.itemModelImageElem.addEventListener("click", (t) => {
          this.loadContent();
        });
  }
  loadModelViewerUICss() {
    var t;
    SHTHelper.qs("#model-viewer-ui") ||
      ((t = document.createElement("link")).setAttribute(
        "href",
        "https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css"
      ),
      t.setAttribute("rel", "stylesheet"),
      t.setAttribute("media", "all"),
      t.setAttribute("id", "model-viewer-ui"),
      document.getElementsByTagName("head")[0].appendChild(t));
  }
  loadContent() {
    var t;
    this.getAttribute("loaded") ||
      ((t = document.createElement("div")).appendChild(
        this.$("template").content.firstElementChild.cloneNode(!0)
      ),
      this.setAttribute("loaded", !0),
      this.itemModelImageElem && this.itemModelImageElem.remove(),
      this.appendChild(t.querySelector("model-viewer")).focus(),
      this.loadModelViewerUICss(),
      Shopify.loadFeatures([
        {
          name: "model-viewer-ui",
          version: "1.0",
          onLoad: this.setupModelViewerUI.bind(this),
        },
      ]));
  }
  setupModelViewerUI(t) {
    t ||
      (this.modelViewerUI = new Shopify.ModelViewerUI(this.$("model-viewer")));
  }
}
customElements.define("sht-prd-media-itm-model", SHTProductMediaItemModel),
  (window.SHTProductMediaItemModel = {
    isMouseenter: !1,
    loadShopifyXR() {
      Shopify.loadFeatures([
        {
          name: "shopify-xr",
          version: "1.0",
          onLoad: this.setupShopifyXR.bind(this),
        },
      ]);
    },
    setupShopifyXR(t) {
      t ||
        (window.ShopifyXR
          ? (SHTHelper.qsa('[id^="ProductJSON-"]').forEach((t) => {
              window.ShopifyXR.addModels(JSON.parse(t.textContent)), t.remove();
            }),
            window.ShopifyXR.setupXRElements())
          : document.addEventListener("shopify_xr_initialized", () =>
              this.setupShopifyXR()
            ));
    },
  }),
  Shopify.designMode
    ? (SHTHelper.qsa("[data-shopify-xr-hidden]").forEach((t) =>
        t.classList.add("hidden")
      ),
      window.SHTProductMediaItemModel &&
        window.SHTProductMediaItemModel.loadShopifyXR())
    : window.SHTProductMediaItemModel &&
      (window.addEventListener(
        "scroll",
        function (t) {
          window.SHTProductMediaItemModel.isMouseenter ||
            window.SHTProductMediaItemModel.loadShopifyXR(),
            (window.SHTProductMediaItemModel.isMouseenter = !0);
        },
        !1
      ),
      ["mouseenter", "touchstart", "mouseover"].forEach(function (t) {
        SHTHelper.qs("body").addEventListener(t, function (t) {
          window.SHTProductMediaItemModel.isMouseenter ||
            window.SHTProductMediaItemModel.loadShopifyXR(),
            (window.SHTProductMediaItemModel.isMouseenter = !0);
        });
      }));
class SHTFeaturedVariantSelector extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.elms = {
      radio_elms: this.$$(".js-featured-variant-radio-item"),
      form: SHTHelper.qs("#featuredProductForm-" + this.dataset.section),
      price: SHTHelper.qs("#featuredProductPrice-" + this.dataset.section),
      product_form: SHTHelper.qs(
        `sht-featured-prd-frm[data-section="${this.dataset.section}"]`
      ),
      inventory_tracking: SHTHelper.qs(
        "#featuredInventoryTracking-" + this.dataset.section
      ),
      variant_picker: SHTHelper.qs(
        "#featuredVariantPicker-" + this.dataset.section
      ),
      quantity_input: SHTHelper.qs(
        "#featuredProductQuantity-" + this.dataset.section
      ),
      slideshow: SHTHelper.qs(
        `sht-prd-slideshow[data-section="${this.dataset.section}"]`
      ),
      thumb_carousel: SHTHelper.qs(
        `sht-vert-carousel[data-section="${this.dataset.section}"]`
      ),
      carousel: SHTHelper.qs(
        `sht-carousel[data-section-id="${this.dataset.section}"]`
      ),
      variant_options: this.$$(".js-variant-option-value"),
      sku: SHTHelper.qs("#featuredSku-" + this.dataset.section),
    }),
      (this.price_selector = "#featuredProductPrice-" + this.dataset.section),
      (this.inventory_tracking_selector =
        "#featuredInventoryTracking-" + this.dataset.section),
      (this.variant_picker_selector =
        "#featuredVariantPicker-" + this.dataset.section),
      (this.quantity_input_selector =
        "#featuredProductQuantity-" + this.dataset.section),
      (this.slideshow_selector = `sht-prd-slideshow[data-section="${this.dataset.section}"]`),
      (this.sku_selector = "#featuredSku-" + this.dataset.section),
      (this.selected_variants = null),
      (this.variant_data = null),
      this.elms.form &&
        (this.setSelectedVariants(),
        this.setCurrentVariant(),
        this.bindEventHandlers(),
        "dropdown" == this.select_type
          ? this.updateSelectedVariantsOnOptionNameByDropDown()
          : this.updateSelectedVariantsOnOptionName(),
        this.setUnavailableOptions());
  }
  bindEventHandlers() {
    this.addEventListener("change", this.onVariantChangeHandle.bind(this));
  }
  onVariantChangeHandle() {
    this.setSelectedVariants(),
      this.setCurrentVariant(),
      this.toggleAddButton(!0, "", !1),
      this.removeErrorMessage(),
      "dropdown" == this.select_type && this.updateVariantStatuses(),
      this.currentVariant
        ? (this.updateVariantInput(),
          this.renderProductInfo(),
          this.setActiveMedia(),
          this.setUnavailableOptions())
        : (this.toggleAddButton(!0, "", !0),
          this.setUnavailable(),
          "dropdown" == this.select_type
            ? this.updateSelectedVariantsOnOptionNameByDropDown()
            : this.updateSelectedVariantsOnOptionName());
  }
  updateVariantStatuses() {
    const r = this.variant_data.filter(
        (t) => this.querySelector(":checked").value === t.option1
      ),
      a = [...this.querySelectorAll(".js-selectbox-wrapper")];
    a.forEach((t, e) => {
      if (0 !== e) {
        var s = [...t.querySelectorAll("option")];
        const n = a[e - 1].querySelector(":checked").value;
        var i = r
            .filter((t) => t.available && t["option" + e] === n)
            .map((t) => t["option" + (e + 1)]),
          s =
            (this.setSelectOptionAvailability(s, i),
            [...t.querySelectorAll('input[type="radio"]')]);
        0 < s.length && this.setColorSwatchSelectOptionAvailability(s, i);
      }
    });
  }
  setSelectOptionAvailability(t, e) {
    t.forEach((t) => {
      e.includes(t.getAttribute("value"))
        ? (t.innerText = t.getAttribute("value"))
        : (t.innerText =
            SHTLanguage.product.PRODUCT_UNAVAILABLE_WITH_OPTION.replace(
              "[value]",
              t.getAttribute("value")
            ));
    });
  }
  setColorSwatchSelectOptionAvailability(t, s) {
    t.forEach((t) => {
      var e = this.querySelector(
        `div.js-variant-option-value[data-value="${t
          .getAttribute("data-variant-value")
          .replace(/"/g, '\\"')}"]`
      );
      s.includes(t.getAttribute("value"))
        ? e && e.classList.remove("product-option--unavailable")
        : e && e.classList.add("product-option--unavailable");
    });
  }
  updateSelectedVariantsOnOptionNameByDropDown() {
    this.selected_variants.forEach((t, e) => {
      var e = t + "-" + e,
        e = this.$(
          `.js-variant-select-item .js-variant-item[data-variant-value="${e.replace(
            /"/g,
            '\\"'
          )}"]`
        );
      e &&
        ((e = e.getAttribute("data-variant-name")),
        (e = this.$(
          `.js-variant-select-option-name[data-option-name="${e.replace(
            /"/g,
            '\\"'
          )}"]`
        ))) &&
        (e.innerHTML = t);
    });
  }
  updateSelectedVariantsOnOptionName() {
    this.selected_variants.forEach((t, e) => {
      var e = t + "-" + e,
        e = this.$(
          `.js-variant-item[data-variant-value="${e.replace(/"/g, '\\"')}"]`
        );
      e &&
        ((e = e.getAttribute("name")),
        (e = this.$(
          `.js-variant-radio-option-name[data-option-name="${e.replace(
            /"/g,
            '\\"'
          )}"]`
        ))) &&
        (e.innerHTML = t);
    });
  }
  removeErrorMessage() {
    this.elms.product_form && this.elms.product_form.handleErrorMessage();
  }
  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=` +
        this.dataset.section
    )
      .then((t) => t.text())
      .then((t) => {
        var t = new DOMParser().parseFromString(t, "text/html"),
          e = this.elms.sku,
          s = t.querySelector(this.sku_selector),
          e =
            (e && ((e.innerHTML = ""), s) && (e.innerHTML = s.innerHTML),
            this.elms.inventory_tracking),
          s = t.querySelector(this.inventory_tracking_selector),
          e =
            (e && ((e.innerHTML = ""), s) && (e.innerHTML = s.innerHTML),
            this.elms.price),
          s = t.querySelector(this.price_selector),
          e =
            (s && e && (e.innerHTML = s.innerHTML),
            this.elms.price &&
              this.elms.price.classList.remove("visibility-hidden"),
            this.elms.quantity_input),
          s = t.querySelector(this.quantity_input_selector);
        e && s && (e.innerHTML = s.innerHTML),
          "false" == this.elms.slideshow.hide_variant &&
            ((e = this.elms.slideshow),
            (s = t.querySelector(this.slideshow_selector)),
            e) &&
            s &&
            (e.innerHTML = s.innerHTML),
          this.toggleAddButton(
            !this.currentVariant.available,
            SHTLanguage.product.PRODUCT_SOLD_OUT
          ),
          "dropdown" == this.select_type
            ? this.updateSelectedVariantsOnOptionNameByDropDown()
            : this.updateSelectedVariantsOnOptionName();
      });
  }
  updateVariantInput() {
    [this.elms.form, this.elms.installment_form].forEach((t) => {
      t &&
        (((t = t.querySelector('input[name="id"]')).value =
          this.currentVariant.id),
        t.dispatchEvent(new Event("change", { bubbles: !0 })));
    });
  }
  setActiveMedia() {
    var t, e;
    this.currentVariant.featured_media &&
      ((e = this.currentVariant.featured_media.id),
      (t = this.elms.slideshow.querySelector(
        `sht-carousel-itm[data-media-id="${this.dataset.section}-${e}"]`
      )),
      (e = this.elms.slideshow.querySelector(
        `sht-vert-carousel-itm[data-media-target-id="${this.dataset.section}-${e}"]`
      )),
      window.matchMedia("(max-width: 768px)").matches
        ? this.elms.carousel
            .querySelector(".js-carousel-items")
            .scrollTo({ left: t.offsetLeft, behavior: "smooth" })
        : (this.elms.slideshow
            .querySelectorAll(".js-product-slideshow-item")
            .forEach((t) => {
              t.classList.remove("d-block"),
                "true" == this.elms.slideshow.hide_variant &&
                  t.classList.add("d-none");
            }),
          this.elms.slideshow
            .querySelectorAll(".js-product-slideshow-thumb")
            .forEach((t) => {
              t.classList.remove("is-active-item");
            }),
          t.classList.add("d-block"),
          "true" == this.elms.slideshow.hide_variant &&
            t.classList.remove("d-none")),
      e &&
        (e.classList.add("is-active-item"),
        this.elms.thumb_carousel
          .querySelector(".js-carousel-items")
          .scrollTo({ top: e.offsetTop, behavior: "auto" })),
      this.elms.slideshow.pauseAllVideo());
  }
  setUnavailable() {
    var t,
      e = this.elms.form;
    e &&
      ((t = (e = e.querySelector(
        ".js-featured-product-form-submit-btn"
      )).querySelector(".js-featured-product-form-submit-btn-text")),
      e) &&
      ((t.textContent = SHTLanguage.product.PRODUCT_UNAVAILABLE),
      this.elms.price) &&
      this.elms.price.classList.add("visibility-hidden");
  }
  getVariantData() {
    return (
      (this.variant_data =
        this.variant_data ||
        JSON.parse(this.$('[type="application/json"]').textContent)),
      this.variant_data.map((s) => {
        (s.my_options = []),
          s.options.forEach((t, e) => {
            s.my_options.push(t + "-" + e);
          });
      }),
      this.variant_data
    );
  }
  setCurrentVariant() {
    this.currentVariant = this.getVariantData().find(
      (t) =>
        !t.options.map((t, e) => this.selected_variants[e] === t).includes(!1)
    );
  }
  toggleAddButton(t = !0, e, s) {
    var i,
      n = this.elms.form;
    n &&
      ((i = (n = n.querySelector(
        ".js-featured-product-form-submit-btn"
      )).querySelector(".js-featured-product-form-submit-btn-text")),
      n) &&
      (t
        ? (n.setAttribute("disabled", "disabled"), e && (i.textContent = e))
        : (n.removeAttribute("disabled"),
          (i.textContent = SHTLanguage.product.PRODUCT_ADD_TO_CART)));
  }
  toggleUnavailableOptions(e = !1) {
    this.elms.variant_options.forEach((t) => {
      t.classList.toggle("product-option--unavailable", e);
    });
  }
  setUnavailableOptions() {
    if ("dropdown" != this.select_type) {
      this.toggleUnavailableOptions(!1),
        (this.variant_data = this.variant_data || this.getVariantData()),
        (this.selected_variant_id =
          this.elms.form.querySelector('input[name="id"]').value),
        (this.current_variant = this.variant_data.find(
          (t) => t.id === Number(this.selected_variant_id)
        ));
      const {
        available: r,
        options: a,
        my_options: o,
        options: { length: l },
      } = this.current_variant;
      if (2 < l) {
        let i = Object.keys(a),
          t = [];
        for (let s = 0; s < l; s++)
          for (let e = s + 1; e < l; e++) {
            var n;
            i[s] &&
              i[e] &&
              ((n = this.variant_data.filter(
                (t) =>
                  t.my_options[i[s]] ===
                    this.current_variant.my_options[i[s]] &&
                  t.my_options[i[e]] ===
                    this.current_variant.my_options[i[e]] &&
                  1 == t.available
              )),
              (t = [...t, ...n]));
          }
        let e = [],
          s = [];
        t.length &&
          ((t = [...t, this.current_variant]).forEach((t) => {
            t = t.my_options;
            e = [...e, ...t];
          }),
          (s = [...new Set(e)]),
          0 == r) &&
          (s = s.filter((t) => !o.includes(t))),
          this.toggleUnavailableOptions(!0),
          s.length &&
            s.forEach((t) => {
              this.$(`[data-value="${t.replace(/"/g, '\\"')}"]`) &&
                this.$(
                  `[data-value="${t.replace(/"/g, '\\"')}"]`
                ).classList.toggle("product-option--unavailable", !1);
            });
      } else if (1 < l) {
        let t = [],
          e = [],
          s = [];
        for (let e = 0; e < l; e++) {
          var i = this.variant_data.filter(
            (t) =>
              t.my_options[e] === this.current_variant.my_options[e] &&
              1 == t.available
          );
          t = [...t, ...i];
        }
        t.length &&
          ((t = [...t, this.current_variant]).forEach((t) => {
            t = t.my_options;
            e = [...e, ...t];
          }),
          (s = [...new Set(e)]),
          0 == r) &&
          (s = s.filter((t) => !o.includes(t))),
          this.toggleUnavailableOptions(!0),
          s.length &&
            s.forEach((t) => {
              this.$(`[data-value="${t.replace(/"/g, '\\"')}"]`) &&
                this.$(
                  `[data-value="${t.replace(/"/g, '\\"')}"]`
                ).classList.toggle("product-option--unavailable", !1);
            });
      } else {
        let e = [],
          t = [],
          s = this.variant_data.filter((t) => 1 == t.available);
        (s = s.length ? [...s, this.current_variant] : s).forEach((t) => {
          t = t.my_options;
          e = [...e, ...t];
        }),
          (t = [...new Set(e)]),
          0 == r && (t = t.filter((t) => !o.includes(t))),
          this.toggleUnavailableOptions(!0),
          t.length &&
            t.forEach((t) => {
              this.$(`[data-value="${t.replace(/"/g, '\\"')}"]`) &&
                this.$(
                  `[data-value="${t.replace(/"/g, '\\"')}"]`
                ).classList.toggle("product-option--unavailable", !1);
            });
      }
      return !0;
    }
  }
}
class SHTFeaturedVariantRadios extends SHTFeaturedVariantSelector {
  constructor() {
    super(), (this.select_type = "button");
  }
  setSelectedVariants() {
    var t = Array.from(this.$$(".js-featured-variant-radio-container"));
    this.selected_variants = t.map(
      (t) =>
        Array.from(t.querySelectorAll(".js-featured-variant-radio-item")).find(
          (t) => t.checked
        ).value
    );
  }
}
customElements.define("sht-featured-variant-radios", SHTFeaturedVariantRadios);
class SHTFeaturedVariantSelects extends SHTFeaturedVariantSelector {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.select_type = "dropdown");
  }
  setSelectedVariants() {
    this.selected_variants = Array.from(
      this.$$(".js-variant-select-item"),
      (t) => t.value
    );
  }
}
customElements.define(
  "sht-featured-variant-selects",
  SHTFeaturedVariantSelects
);
class SHTFeaturedVariantSwatchSelect extends HTMLElement {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this));
  }
  init() {
    (this.radios = this.$$(".js-variant-radio-item")),
      (this.select_id = this.dataset.selectId),
      (this.select_element = document.querySelector("#" + this.select_id)),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.radios.forEach((t) => {
      t.addEventListener("click", (t) => {
        t.preventDefault(),
          Array.from(this.radios, (t) => {
            t.checked = !1;
          }),
          setTimeout(() => {
            t.target.checked = !0;
          }),
          this.select_element &&
            ((this.select_element.querySelector(
              `option[value="${t.target.value.replace(/"/g, '\\"')}"]`
            ).selected = !0),
            this.select_element.dispatchEvent(
              new Event("change", { bubbles: !0 })
            ));
      });
    });
  }
  connectedCallback() {
    this.init();
  }
}
customElements.define(
  "sht-featured-variant-swatch-select",
  SHTFeaturedVariantSwatchSelect
);
class SHTFeaturedProductForm extends SHTCustomComponent {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.elms = {
      form: this.$("form"),
      submit_btn: this.$('[type="submit"]'),
      error_wrapper: this.$(".js-featured-product-form-error-wrapper"),
      error_message: this.$(".js-featured-product-form-error-message"),
      spinner: this.$(".js-featured-product-form-spinner"),
      quantity_input_container: SHTHelper.qs(
        "#featuredProductQuantity-" + this.dataset.section
      ),
      sticky_header: SHTHelper.qs("sht-sticky-header"),
      header: SHTHelper.qs("sht-header"),
      announcement_bar: SHTHelper.qs("sht-ann-bar"),
      header_cart_status: SHTHelper.qs("#headerCartStatus"),
    }),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      (this.cartDrawer = SHTHelper.qs("sht-cart-drwr")),
      (this.cartDrawerForm = SHTHelper.qs("sht-cart-drwr-frm")),
      this.elms.form &&
        ((this.elms.form.querySelector("[name=id]").disabled = !1),
        this.bindEventHandlers());
  }
  bindEventHandlers() {
    this.elms.form.addEventListener("submit", this.onSubmitHandler.bind(this));
  }
  onSubmitHandler(e) {
    if (
      (e.preventDefault(), !this.elms.submit_btn.classList.contains("loading"))
    ) {
      this.handleErrorMessage(),
        this.elms.submit_btn.setAttribute("aria-disabled", !0),
        this.elms.submit_btn.setAttribute("disabled", !0),
        this.elms.submit_btn.classList.add("loading"),
        this.elms.spinner.classList.remove("hidden"),
        this.elms.header_cart_status &&
          this.elms.header_cart_status.classList.remove(
            "header-cart-status--animate"
          );
      let t = [];
      this.cartNotification &&
        (t = this.cartNotification.getSectionsToRender()),
        this.cartDrawer &&
          (t = [...t, ...this.cartDrawer.getSectionsToRender()]);
      e = new FormData(this.elms.form);
      t.length &&
        e.append(
          "sections",
          t.map((t) => t.id)
        ),
        e.append("sections_url", window.location.pathname),
        (SHTHelper.fetchConfigHTTP.body = e),
        fetch("" + routes.cart_add_url, SHTHelper.fetchConfigHTTP)
          .then((t) => t.json())
          .then((t) => {
            t.status
              ? this.handleErrorMessage(t.description)
              : (this.elms.sticky_header &&
                  this.elms.sticky_header.dataset.isEnabled &&
                  this.elms.sticky_header.reveal(),
                this.cartNotification &&
                  this.cartNotification.renderContents(t),
                this.cartDrawerForm && this.cartDrawerForm.renderContents(t),
                this.elms.quantity_input_container &&
                  "add-to-cart" ==
                    this.elms.quantity_input_container.dataset.show &&
                  (this.elms.quantity_input_container.classList.remove(
                    "d-none"
                  ),
                  (this.elms.quantity_input_container.querySelector(
                    "input"
                  ).value = 1)),
                this.elms.header ||
                  window.location.assign(window.routes.cart_url));
          })
          .catch((t) => {
            console.error(t);
          })
          .finally(() => {
            this.elms.submit_btn.classList.remove("loading"),
              this.elms.submit_btn.removeAttribute("aria-disabled"),
              this.elms.submit_btn.removeAttribute("disabled"),
              this.elms.spinner.classList.add("hidden");
          });
    }
  }
  handleErrorMessage(t = !1) {
    this.elms.error_wrapper.toggleAttribute("hidden", !t),
      t && (this.elms.error_message.textContent = t);
  }
}
customElements.define("sht-featured-prd-frm", SHTFeaturedProductForm),
  window.addEventListener("load", function () {
    if (!customElements.get("sht-shape-parallax")) {
      class t extends SHTCustomComponent {
        constructor() {
          super(),
            (this.speed = -8),
            (this.shape = this.$(".js-shape-parallax-shape")),
            (this.shape_rotation = this.$(".js-shape-parallax-rotation")),
            (this.content = this.$(".js-shape-parallax-content")),
            (this.bound = {}),
            (this.dataTransformContent = this.dataset.contentTransform),
            (this.dataEnableParallaxScrolling =
              "true" == this.dataset.enableParallaxScrolling),
            (this.inViewport = !1);
        }
        recalculate() {
          var t = SHTHelper.qde.scrollTop;
          (this.top = this.bound.top + t + this.offsetHeight / 2),
            (this.windowH = window.innerHeight),
            (this.maxY = this.windowH / 2),
            (this.cA = this.top - this.windowH);
        }
        recalculateForEditor() {
          var t = SHTHelper.qde.scrollTop,
            e = this.getBoundingClientRect();
          (this.top = e.top + t + this.offsetHeight / 2),
            (this.windowH = window.innerHeight),
            (this.maxY = this.windowH / 2),
            (this.cA = this.top - this.windowH);
        }
        bindEventHandlers() {
          document.addEventListener(
            "scroll",
            () => {
              requestAnimationFrame(this.setAnimation.bind(this));
            },
            !0
          ),
            Shopify.designMode &&
              (document.addEventListener(
                "shopify:inspector:activate",
                function (t) {
                  setTimeout(() => {
                    this.recalculateForEditor(),
                      requestAnimationFrame(this.setAnimation.bind(this));
                  });
                }.bind(this)
              ),
              document.addEventListener(
                "shopify:section:load",
                function (t) {
                  setTimeout(() => {
                    this.recalculateForEditor(),
                      requestAnimationFrame(this.setAnimation.bind(this));
                  });
                }.bind(this)
              ));
        }
        calculatePercentage() {
          var t = SHTHelper.qde.scrollTop,
            e = t - this.cA;
          let s = 0;
          return (s = this.inViewport ? -t / this.top : 1 - e / this.maxY);
        }
        setAnimation() {
          var t = SHTHelper.qde.scrollTop,
            e = this.calculatePercentage(),
            e = (this.windowH / 12) * e;
          this.dataEnableParallaxScrolling &&
            (this.shape.style.transform = `translate3d(0px, ${e}px, 0px)`),
            (this.shape_rotation.style.transform = `rotate(${t / 4}deg)`),
            (this.content.style.transform =
              this.dataTransformContent + ` rotate(-${t / 4}deg)`);
        }
        onObserverHandler() {
          new IntersectionObserver((t, e) => {
            t.forEach((t) => {
              t.isIntersecting &&
                SHTHelper.qde.scrollTop <= 0 &&
                (this.inViewport = !0),
                e.unobserve(this.shape);
            });
          }).observe(this.shape),
            Shopify.designMode ||
              new IntersectionObserver((t, e) => {
                (this.bound = t[0].boundingClientRect),
                  this.recalculate(),
                  requestAnimationFrame(this.setAnimation.bind(this)),
                  e.disconnect();
              }).observe(this);
        }
        connectedCallback() {
          this.bindEventHandlers(), this.onObserverHandler();
        }
        disconnectedCallback() {}
      }
      customElements.define("sht-shape-parallax", t);
    }
  });
var VAR_LOCALIZATION_CACHE = new Map();
class SHTLocalization extends SHTCustomComponent {
  constructor() {
    super();
  }
  async init() {
    Shopify.designMode
      ? await this.getSearchResults()
      : new IntersectionObserver(
          (async (t, e) => {
            t[0].isIntersecting &&
              (await this.getSearchResults(), e.unobserve(this));
          }).bind(this),
          { threshold: 0.25 }
        ).observe(this);
  }
  async getSearchResults() {
    SHTHelper.loadScript(
      this.dataset.jsFileId,
      this.dataset.jsFile,
      async function () {
        var t = this.dataset.url.replace(/\s/g, "-").toLowerCase(),
          e = VAR_LOCALIZATION_CACHE.get(t);
        e
          ? (this.innerHTML = e)
          : ((e = await this.fetchResults()),
            VAR_LOCALIZATION_CACHE.set(t, e),
            (this.innerHTML = e));
      }.bind(this)
    );
  }
  async fetchResults() {
    return fetch(this.dataset.url)
      .then((t) => t.text())
      .then((t) => {
        var e = document.createElement("div"),
          t =
            ((e.innerHTML = t), e.querySelector("#" + this.dataset.sectionId));
        return t && t.innerHTML.trim().length ? t.innerHTML : "";
      })
      .catch((t) => (console.error(t), ""));
  }
  connectedCallback() {
    this.init();
  }
}
customElements.define("sht-localization", SHTLocalization);
class SHTFreeShippingBar extends SHTCustomComponent {
  constructor() {
    super(),
      (this.total_price = this.dataset.totalPrice),
      (this.threshold = 0),
      (this.original_free_shipping_price =
        this.dataset.freeShippingOriginalPrice),
      (this.free_shipping_price = this.dataset.freeShippingPrice),
      (this.free_shipping_progress = this.$(".js-free-shipping-progress")),
      (this.free_shipping_progress_content = this.$(
        ".js-free-shipping-progress-content"
      )),
      (this.free_shipping_progress_message = this.$(
        ".js-free-shipping-message"
      )),
      this.init();
  }
  calculateCurrencyRate() {
    this.threshold = Math.round(
      this.free_shipping_price * (Shopify.currency.rate || 1)
    );
  }
  init() {
    this.calculateCurrencyRate(),
      (this.free_shipping_progress.max = this.threshold),
      (this.free_shipping_progress.value = this.total_price),
      (this.free_shipping_progress_content.innerHTML = SHTHelper.formatMoney(
        this.threshold,
        window.theme_variables.settings.money_with_currency_format
      ));
    var t = this.threshold - this.total_price;
    this.free_shipping_progress_message.innerHTML =
      t <= 0
        ? SHTLanguage.free_shipping_bar.FULFILLED
        : SHTLanguage.free_shipping_bar.UNFULFILLED.replace(
            "[remaining_amount]",
            SHTHelper.formatMoney(
              t,
              window.theme_variables.settings.money_with_currency_format
            )
          );
  }
}
customElements.define("sht-free-shipping-bar", SHTFreeShippingBar);
class SHTCountDown extends SHTCustomComponent {
  constructor() {
    super();
  }
  init() {
    if (((this.isExpired = JSON.parse(this.dataset.isExpired)), this.isExpired))
      return !0;
    (this.timeZoneName = this.dataset.timeZoneName),
      (this.timeZoneOffset = this.dataset.timeZoneOffset),
      (this.endTime = this.dataset.endTime),
      (this.endDate = this.dataset.endDate),
      (this.hideOnEnd = JSON.parse(this.dataset.hideOnEnd)),
      this.validateDateValue(this.endDate) ||
        (this.endDate = this.getCurrentDateTime(!0)),
      this.validateTimeValue(this.endTime) || (this.endTime = "23:59:59"),
      (this.expiredAt = new Date(
        this.convertDateStringToISOString(this.endDate + ":" + this.endTime)
      ).getTime()),
      (this.currentTime = this.convertDateTimeToSpecificTimeZone(
        this.getCurrentDateTime()
      )),
      (this.daysElement = this.$(".js-counter-days")),
      (this.hoursElement = this.$(".js-counter-hours")),
      (this.minutesElement = this.$(".js-counter-minutes")),
      (this.secondsElement = this.$(".js-counter-seconds")),
      (this.messageElement = this.$(".js-counter-message")),
      (this.counterElement = this.$(".js-counter"));
    const n = setInterval(() => {
      var t,
        e,
        s,
        i = this.expiredAt - this.currentTime;
      i <= 0
        ? (clearInterval(n),
          this.setCounter({ days: 0, hours: 0, minutes: 0, seconds: 0 }),
          "" != this.messageElement.innerHTML &&
            this.messageElement.classList.remove("d-none"),
          this.hideOnEnd &&
            this.counterElement.classList.add("d-none-important"))
        : ((t = Math.floor(i / 864e5)),
          (e = Math.floor((i % 864e5) / 36e5)),
          (s = Math.floor((i % 36e5) / 6e4)),
          (i = Math.floor((i % 6e4) / 1e3)),
          this.setCounter({ days: t, hours: e, minutes: s, seconds: i }),
          (this.currentTime = this.currentTime + 1e3));
    }, 1e3);
  }
  connectedCallback() {
    this.init();
  }
  getCurrentDateTime(t = !1) {
    var e = new Date(),
      s = e.getFullYear(),
      i = String(e.getMonth() + 1).padStart(2, "0"),
      n = String(e.getDate()).padStart(2, "0"),
      r = String(e.getHours()).padStart(2, "0"),
      a = String(e.getMinutes()).padStart(2, "0"),
      e = String(e.getSeconds()).padStart(2, "0");
    return t ? s + `-${i}-` + n : s + `-${i}-${n} ${r}:${a}:` + e;
  }
  convertDateTimeToSpecificTimeZone(t, e = !0) {
    var t = new Date(t),
      s = "-" === this.timeZoneOffset[0];
    let i =
      60 *
      (60 * parseInt(this.timeZoneOffset.substring(1, 3)) +
        parseInt(this.timeZoneOffset.substring(3, 5))) *
      1e3;
    s && (i = -i);
    s = new Date(t.getTime() + i);
    return e ? s.getTime() : s.toISOString();
  }
  setCounter({ days: t, hours: e, minutes: s, seconds: i }) {
    (this.daysElement.textContent = t < 10 ? "0" + t : t),
      (this.hoursElement.textContent = e < 10 ? "0" + e : e),
      (this.minutesElement.textContent = s < 10 ? "0" + s : s),
      (this.secondsElement.textContent = i < 10 ? "0" + i : i);
  }
  convertDateStringToISOString(t) {
    return t.replace(/:/, "T") + ".000Z";
  }
  validateDateValue(t) {
    return !!/^\d{4}-\d{2}-\d{2}$/.test(t);
  }
  validateTimeValue(t) {
    return !!/^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(t);
  }
}
customElements.define("sht-countdown", SHTCountDown);
