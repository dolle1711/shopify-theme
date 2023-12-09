class SHTCollectionProductDrawer extends SHTCoreDrawer {
  clearFormFilters(e) {
    e.preventDefault(),
      SHTHelper.qs("sht-coll-prd-fltr-frm").onActiveFilterClick(e);
  }
}
customElements.define("sht-coll-prd-drwer", SHTCollectionProductDrawer);
class SHTCollectionProductDrawerOpener extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.triggerBtnElement = this.$(
        ".js-collection-product-drawer-trigger"
      )),
      (this.collectionProductDrawerElement =
        SHTHelper.qs("sht-coll-prd-drwer")),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.triggerBtnElement.addEventListener("click", (e) => {
      this.collectionProductDrawerElement.openDrawer(e.target);
    });
  }
}
customElements.define(
  "sht-coll-prd-drwer-opner",
  SHTCollectionProductDrawerOpener
);
class SHTMainCollectionProductFilterForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.pathname = window.location.pathname),
      (this.product_grid_container_selector = "mainCollectionProductContainer"),
      (this.product_count_selector = ".js-product-count"),
      (this.active_search_terms_selector = ".js-active-filters"),
      (this.sort_by_field_selector = ".js-filter-form-sorting"),
      (this.cached_results = []),
      (this.onActiveFilterClick = this.onActiveFilterClick.bind(this)),
      (this.debouncedOnSubmit = SHTHelper.debounce((e) => {
        this.onSubmitHandler(e);
      }, 500)),
      this.$("form").addEventListener(
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
  renderPage(r, i, e = 0) {
    let s = this.buildURL(r);
    var t,
      l = this.getReturnedResultsFromCache(s);
    l
      ? ((t = this.refineReturnedResults(l)),
        this.renderFilters(l, i),
        this.renderReturnedResults(t, r),
        this.renderProductCount(l),
        this.renderSortByField(l),
        "undefined" != typeof SHTElementLazyLoad && new SHTElementLazyLoad())
      : fetch(s)
          .then((e) => {
            if (e.ok) return e.text();
            throw new Error(e.status);
          })
          .then((e) => {
            var t = this.refineReturnedResults(e);
            this.renderFilters(e, i),
              this.renderReturnedResults(t, r),
              this.addReturnedResultsToCache(s, e),
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
      i = e.querySelector(this.active_search_terms_selector);
    if (i) {
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
          i.innerHTML);
    }
  }
  renderFilters(e, r) {
    var e = new DOMParser().parseFromString(e, "text/html"),
      t = e.querySelectorAll(
        "#mainCollectionProductFiltersForm .js-details-filter"
      );
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
    (SHTHelper.qid(this.product_grid_container_selector).innerHTML = e),
      this.updateURL(t);
  }
  updateURL(e) {
    history.pushState(
      { searchParams: e },
      "",
      "" + this.pathname + (e && "?".concat(e))
    );
  }
  refineReturnedResults(e) {
    return new DOMParser()
      .parseFromString(e, "text/html")
      .getElementById(this.product_grid_container_selector).innerHTML;
  }
  buildURL(t) {
    var e = this.getSections();
    let r = null;
    return (
      e.forEach((e) => {
        r = `${this.pathname}?section_id=${e.section}&` + t;
      }),
      r
    );
  }
  getReturnedResultsFromCache(t) {
    var e = (e) => e.url === t;
    return !!this.cached_results.some(e) && this.cached_results.find(e).html;
  }
  renderProductCount(e) {
    let t = new DOMParser()
      .parseFromString(e, "text/html")
      .querySelector(this.product_count_selector).innerHTML;
    SHTHelper.qsa(this.product_count_selector).forEach((e) => {
      e.innerHTML = t;
    });
  }
  renderSortByField(e) {
    var e = new DOMParser().parseFromString(e, "text/html"),
      t = e.querySelector(this.sort_by_field_selector).innerHTML,
      t =
        ((SHTHelper.qs(this.sort_by_field_selector).innerHTML = t),
        e.querySelector(".js-collection-product-sort-by-field-hidden"));
    SHTHelper.qs(".js-collection-product-sort-by-field-hidden").value = t.value;
  }
  addReturnedResultsToCache(e, t) {
    this.cached_results = [...this.cached_results, { html: t, url: e }];
  }
  getSections() {
    return [{ section: SHTHelper.qs(".js-product-grid").dataset.id }];
  }
  renderActiveSearchTerms(e) {
    e = e.querySelector(this.active_search_terms_selector);
    e &&
      (SHTHelper.qs(this.active_search_terms_selector).innerHTML = e.innerHTML);
  }
}
customElements.define(
  "sht-coll-prd-fltr-frm",
  SHTMainCollectionProductFilterForm
);
class SHTMainCollectionProductFilterFormReset extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      this.$(".js-reset-form-btn").addEventListener("click", (e) => {
        e.preventDefault(),
          (
            this.closest("sht-coll-prd-fltr-frm") ||
            SHTHelper.qs("sht-coll-prd-fltr-frm")
          ).onActiveFilterClick(e);
      });
  }
}
customElements.define(
  "sht-coll-prd-fltr-frm-rst",
  SHTMainCollectionProductFilterFormReset
);
class SHTMainCollectionProductFilterFormPriceRange extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.filterPriceElms = this.$$(".js-filter-price")),
      (this.priceGTEElm = this.$(".js-price-gte")),
      (this.priceLTEElm = this.$(".js-price-lte")),
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
      i = Number(e.getAttribute("max"));
    t < r && (e.value = r), i < t && (e.value = i);
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
  "sht-coll-prd-fltr-frm-rgn",
  SHTMainCollectionProductFilterFormPriceRange
);
class SHTAdvancedFilterPriceRangeSlider extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.init();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        input_elms: this.$$(".js-price-range-slider-input"),
        lte_slider_elm: this.$(".js-slider-lte"),
        gte_slider_elm: this.$(".js-slider-gte"),
        min_gap: 0,
        slider_track: this.$(".js-range-slider-bar"),
        lte_elm: SHTHelper.qs(".js-price-lte"),
        gte_elm: SHTHelper.qs(".js-price-gte"),
      }),
      (this.reverse = !1),
      (this.color = this.dataset.sliderColor),
      (this.color_shadow = this.dataset.sliderColorShadow),
      this.bindEventHandlers(),
      this.fillBgColor(this.reverse);
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
    var i;
    Number(t) > Number(r) && ((i = r), (r = t), (t = i), (this.reverse = !0)),
      this.fillBgColor(),
      this.closest("sht-coll-prd-fltr-frm-rgn").setValues(t, r);
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
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.selectElement = this.$(
        ".js-collection-product-sort-by-field-select"
      )),
      (this.sortByFieldHidden = SHTHelper.qs(
        ".js-collection-product-sort-by-field-hidden"
      )),
      this.selectElement.removeAttribute("form"),
      this.bindEventHandlers();
  }
  connectedCallback() {
    this.init();
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
}
customElements.define(
  "sht-coll-prd-sort-by-field",
  SHTMainCollectionProductSortByField
);
