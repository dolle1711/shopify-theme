class SHTMainSearchFilterForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.pathname = window.location.pathname),
      (this.search_grid_container_selector = "mainSearchContainer"),
      (this.search_count_selector = ".js-search-count"),
      (this.search_product_count_selector =
        '.js-search-count .js-main-search-tab-link[data-type="product"]'),
      (this.search_count_heading_selector = ".js-search-count-heading"),
      (this.active_search_terms_selector = ".js-active-filters"),
      (this.sort_by_field_selector = ".js-filter-form-sorting"),
      (this.cached_results = []),
      (this.onActiveFilterClick = this.onActiveFilterClick.bind(this)),
      (this.debouncedOnSubmit = SHTHelper.debounce((e) => {
        this.onSubmitHandler(e);
      }, 500)),
      this.querySelector("form").addEventListener(
        "input",
        this.debouncedOnSubmit.bind(this)
      );
  }
  onActiveFilterClick(e) {
    e.preventDefault();
    e =
      -1 == e.currentTarget.href.indexOf("?")
        ? ""
        : e.currentTarget.href.slice(e.currentTarget.href.indexOf("?") + 1);
    this.renderPage(e);
  }
  onSubmitHandler(e) {
    e.preventDefault();
    var t = new FormData(e.target.closest("form")),
      t = new URLSearchParams(t).toString();
    this.renderPage(t, e);
  }
  renderPage(r, s, e = 0) {
    let i = this.buildURL(r);
    var t,
      l = this.getReturnedResultsFromCache(i);
    l
      ? ((t = this.refineReturnedResults(l)),
        this.renderFilters(l, s),
        this.renderReturnedResults(t, r),
        this.renderProductCount(l),
        this.renderSortByField(l),
        "undefined" != typeof SHTElementLazyLoad && new SHTElementLazyLoad())
      : fetch(i)
          .then((e) => {
            if (e.ok) return e.text();
            throw new Error(e.status);
          })
          .then((e) => {
            var t = this.refineReturnedResults(e);
            this.renderFilters(e, s),
              this.renderReturnedResults(t, r),
              this.addReturnedResultsToCache(i, e),
              this.renderProductCount(e),
              this.renderSortByField(e);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            "undefined" != typeof SHTElementLazyLoad &&
              new SHTElementLazyLoad();
          });
  }
  renderActiveSearchTerms(e, r) {
    var e = new DOMParser().parseFromString(e, "text/html"),
      s = e.querySelector(this.active_search_terms_selector);
    if (s) {
      e = e.querySelectorAll(this.details_selector);
      let t = (e) => {
        var t = r ? r.target.closest(this.details_selector) : void 0;
        return !!t && e.dataset.index === t.dataset.index;
      };
      Array.from(e)
        .filter((e) => !t(e))
        .forEach((e) => {
          SHTHelper.qs(
            `[data-index="${e.dataset.index}"]` + this.details_selector
          ).innerHTML = e.innerHTML;
        }),
        (SHTHelper.qs(this.active_search_terms_selector).innerHTML =
          s.innerHTML);
    }
  }
  renderFilters(e, r) {
    var e = new DOMParser().parseFromString(e, "text/html"),
      t = e.querySelectorAll("#mainSearchFiltersForm .js-details-filter");
    Array.from(t)
      .filter((e) => {
        return (
          (e = e),
          !(
            !!(t = r ? r.target.closest(".js-details-filter") : void 0) &&
            e.dataset.index === t.dataset.index
          )
        );
        var t;
      })
      .forEach((e) => {
        SHTHelper.qs(
          `.js-details-filter[data-index="${e.dataset.index}"]`
        ).innerHTML = e.innerHTML;
      }),
      this.renderActiveSearchTerms(e);
  }
  renderReturnedResults(e, t) {
    (SHTHelper.qid(this.search_grid_container_selector).innerHTML = e),
      this.updateURL(t);
  }
  updateURL(e) {
    history.pushState(
      { searchParams: e },
      "",
      `${this.pathname}${e && "?".concat(e)}&type=product`
    );
  }
  refineReturnedResults(e) {
    return new DOMParser()
      .parseFromString(e, "text/html")
      .getElementById(this.search_grid_container_selector).innerHTML;
  }
  buildURL(t) {
    var e = this.getSections();
    let r = null;
    return (
      e.forEach((e) => {
        r = `${this.pathname}?section_id=${e.section}&${t}&type=product`;
      }),
      r
    );
  }
  getReturnedResultsFromCache(t) {
    var e = (e) => e.url === t;
    return !!this.cached_results.some(e) && this.cached_results.find(e).html;
  }
  renderProductCount(e) {
    var e = new DOMParser()
        .parseFromString(e, "text/html")
        .querySelector(this.search_count_selector),
      t = SHTHelper.qs(this.search_product_count_selector);
    t.innerHTML = t.innerHTML.replace(/\(.*\)/, `(${e.dataset.resultsCount})`);
  }
  addReturnedResultsToCache(e, t) {
    this.cached_results = [...this.cached_results, { html: t, url: e }];
  }
  getSections() {
    return [
      { section: SHTHelper.qs(".js-main-search-result-grid").dataset.id },
    ];
  }
  renderActiveSearchTerms(e) {
    e = e.querySelector(this.active_search_terms_selector);
    e &&
      (SHTHelper.qs(this.active_search_terms_selector).innerHTML = e.innerHTML);
  }
  renderSortByField(e) {
    var e = new DOMParser().parseFromString(e, "text/html"),
      t = e.querySelector(this.sort_by_field_selector).innerHTML,
      t =
        ((SHTHelper.qs(this.sort_by_field_selector).innerHTML = t),
        e.querySelector(".js-main-search-sort-by-field-hidden"));
    SHTHelper.qs(".js-main-search-sort-by-field-hidden").value = t.value;
  }
}
customElements.define("sht-srch-fltr-frm", SHTMainSearchFilterForm);
class SHTMainSearchFilterFormReset extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    this.querySelector(".js-reset-form-btn").addEventListener("click", (e) => {
      e.preventDefault(),
        (
          this.closest("sht-srch-fltr-frm") || SHTHelper.qs("sht-srch-fltr-frm")
        ).onActiveFilterClick(e);
    });
  }
  connectedCallback() {
    this.init();
  }
}
customElements.define("sht-srch-fltr-frm-rst", SHTMainSearchFilterFormReset);
class SHTMainSearchFilterFormPriceRange extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.filterPriceElms = this.querySelectorAll(".js-filter-price")),
      (this.priceGTEElm = this.querySelector(".js-price-gte")),
      (this.priceLTEElm = this.querySelector(".js-price-lte")),
      this.bindEventHandlers(),
      this.setMinAndMaxValues();
  }
  connectedCallback() {
    this.init();
  }
  bindEventHandlers() {
    this.filterPriceElms.forEach((e) =>
      e.addEventListener("keyup", (e) => {
        this.adjustToValidValues(e.currentTarget), this.setMinAndMaxValues();
      })
    ),
      this.filterPriceElms.forEach((e) =>
        e.addEventListener("input", (e) => {
          this.adjustToValidValues(e.currentTarget), this.setMinAndMaxValues();
        })
      ),
      this.filterPriceElms.forEach((e) =>
        e.addEventListener("change", this.onRangeChangeHandle.bind(this))
      );
  }
  onRangeChangeHandle(e) {
    setTimeout((e) => {
      this.bindDataToPriceSlider();
    });
  }
  setMinAndMaxValues() {
    this.priceLTEElm.value &&
      this.priceGTEElm.setAttribute("max", this.priceLTEElm.value),
      this.priceGTEElm.value &&
        this.priceLTEElm.setAttribute("min", this.priceGTEElm.value),
      "" === this.priceGTEElm.value && this.priceLTEElm.setAttribute("min", 0),
      "" === this.priceLTEElm.value &&
        this.priceGTEElm.setAttribute(
          "max",
          this.priceLTEElm.getAttribute("max")
        );
  }
  adjustToValidValues(e) {
    var t = Number(e.value),
      r = Number(e.getAttribute("min")),
      s = Number(e.getAttribute("max"));
    t < r && (e.value = r), s < t && (e.value = s);
  }
  setValues(e, t) {
    (this.priceGTEElm.value = e), (this.priceLTEElm.value = t);
  }
  bindDataToPriceSlider() {
    var e = SHTHelper.qs(".js-slider-gte"),
      t = SHTHelper.qs(".js-slider-lte"),
      r = SHTHelper.qs("sht-adv-fltr-price-rgn-slider");
    e && (e.value = this.priceGTEElm.value),
      t && (t.value = this.priceLTEElm.value),
      r && r.fillBgColor();
  }
}
customElements.define(
  "sht-srch-fltr-frm-rgn",
  SHTMainSearchFilterFormPriceRange
);
class SHTAdvancedFilterPriceRangeSlider extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.elms = {
      input_elms: this.querySelectorAll(".js-price-range-slider-input"),
      lte_slider_elm: this.querySelector(".js-slider-lte"),
      gte_slider_elm: this.querySelector(".js-slider-gte"),
      min_gap: 0,
      slider_track: this.querySelector(".js-range-slider-bar"),
      lte_elm: SHTHelper.qs(".js-price-lte"),
      gte_elm: SHTHelper.qs(".js-price-gte"),
    }),
      (this.reverse = !1),
      (this.color = this.dataset.sliderColor),
      (this.color_shadow = this.dataset.sliderColorShadow),
      this.bindEventHandlers(),
      this.fillBgColor(this.reverse);
  }
  connectedCallback() {
    this.init();
  }
  bindEventHandlers() {
    this.elms.input_elms.forEach((e) =>
      e.addEventListener("input", this.onRangeSliderChangeHandle.bind(this))
    );
  }
  onRangeSliderChangeHandle(e) {
    this.adjustToValidValues(e);
  }
  adjustToValidValues(e) {
    let t = this.elms.gte_slider_elm.value,
      r = this.elms.lte_slider_elm.value;
    var s;
    Number(t) > Number(r) && ((s = r), (r = t), (t = s), (this.reverse = !0)),
      this.fillBgColor(),
      this.closest("sht-srch-fltr-frm-rgn").setValues(t, r);
  }
  fillBgColor() {
    let e =
        (this.elms.gte_slider_elm.value / this.elms.gte_slider_elm.max) * 100,
      t = (this.elms.lte_slider_elm.value / this.elms.lte_slider_elm.max) * 100;
    this.reverse &&
      ((e =
        (this.elms.lte_slider_elm.value / this.elms.lte_slider_elm.max) * 100),
      (t =
        (this.elms.gte_slider_elm.value / this.elms.gte_slider_elm.max) * 100),
      (this.reverse = !1)),
      (this.elms.slider_track.style.background = `linear-gradient(to right, ${this.color_shadow} ${e}%, ${this.color} ${e}%, ${this.color} ${t}%, ${this.color_shadow} ${t}%)`);
  }
}
customElements.define(
  "sht-adv-fltr-price-rgn-slider",
  SHTAdvancedFilterPriceRangeSlider
);
class SHTMainCollectionProductSortByField extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.selectElement = this.querySelector(
      ".js-main-search-sort-by-field-select"
    )),
      (this.sortByFieldHidden = SHTHelper.qs(
        ".js-main-search-sort-by-field-hidden"
      )),
      this.selectElement.removeAttribute("form"),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.selectElement.addEventListener("change", (e) => {
      this.sortByFieldHidden &&
        ((this.sortByFieldHidden.value = e.currentTarget.value),
        this.sortByFieldHidden.dispatchEvent(
          new Event("input", { bubbles: !0 })
        ));
    });
  }
  connectedCallback() {
    this.init();
  }
}
customElements.define(
  "sht-srch-sort-by-field",
  SHTMainCollectionProductSortByField
);
class SHTMainSearch extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.searchGridContainer = this.querySelector("#mainSearchContainer")),
      (this.productTab = this.querySelector(".js-main-search-product-tab")),
      (this.productArticle = this.querySelector(
        ".js-main-search-product-article"
      )),
      (this.productPage = this.querySelector(".js-main-search-product-page")),
      (this.sectionId = this.dataset.sectionId),
      (this.filterFormContainer = this.querySelector(
        ".js-filter-form-container"
      )),
      this.productTab && this.getResultsCount(this.productTab),
      this.productArticle && this.getResultsCount(this.productArticle),
      this.productPage && this.getResultsCount(this.productPage);
    var e = this.getQueryByName("type");
    this.querySelector(
      ".js-main-search-tab-link.tab__link--active"
    )?.classList.remove("tab__link--active"),
      (
        this.querySelector(`.js-main-search-tab-link[data-type="${e}"]`) ||
        this.querySelector('.js-main-search-tab-link[data-type="product"]')
      )?.classList.add("tab__link--active");
  }
  getQueryByName(e) {
    (e = new RegExp(`[?&]${e}=([^&]*)(&|$)`)),
      (e = window.location.search.match(e));
    return e ? decodeURIComponent(e[1]) : "";
  }
  getResultsCount(e) {
    let t = e.querySelector("a");
    e = t.href;
    this.fetchResults(e).then((e) => {
      e = e.querySelector(".js-search-count");
      e &&
        (t.innerHTML = t.innerHTML.replace(
          "(0)",
          `(${e.dataset.resultsCount})`
        ));
    });
  }
  async fetchResults(e) {
    return await fetch(e + ("&section_id=" + this.sectionId))
      .then((e) => {
        if (e.ok) return e.text();
        throw new Error(e.status);
      })
      .then((e) => {
        return new DOMParser().parseFromString(e, "text/html");
      })
      .catch((e) => (console.error(e), ""))
      .finally(() => {
        "undefined" != typeof SHTElementLazyLoad && new SHTElementLazyLoad();
      });
  }
}
customElements.define("sht-srch", SHTMainSearch);
class SHTMainSearchDrawer extends SHTCoreDrawer {
  clearFormFilters(e) {
    e.preventDefault(),
      SHTHelper.qs("sht-srch-fltr-frm").onActiveFilterClick(e);
  }
}
customElements.define("sht-srch-drwer", SHTMainSearchDrawer);
class SHTMainSearchDrawerOpener extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.triggerBtnElement = this.$(".js-main-search-drawer-trigger")),
      (this.mainSearchDrawerElement = SHTHelper.qs("sht-srch-drwer")),
      this.bindEventHandlers();
  }
  connectedCallback() {
    this.init();
  }
  bindEventHandlers() {
    this.triggerBtnElement.addEventListener("click", (e) => {
      this.mainSearchDrawerElement.openDrawer(e.target);
    });
  }
}
customElements.define("sht-srch-drwer-opner", SHTMainSearchDrawerOpener);
