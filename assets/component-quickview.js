class SHTProductQuickVIewVariantSelector extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        radio_elms: this.$$(".js-variant-radio-item"),
        form: SHTHelper.qs("#productQuickViewForm-" + this.dataset.section),
        price: SHTHelper.qs("#productQuickViewPrice-" + this.dataset.section),
        selected_variant: SHTHelper.qs(
          "#productQuickViewSelectedVariant-" + this.dataset.section
        ),
        product_quick_view_form: SHTHelper.qs("sht-prd-qck-vw-frm"),
        inventory_tracking: SHTHelper.qs(
          "#productQuickViewInventoryTracking-" + this.dataset.section
        ),
        variant_picker: SHTHelper.qs(
          "#productQuickViewVariantPicker-" + this.dataset.section
        ),
        quantity_input: SHTHelper.qs(
          "#productQuickViewQuantity-" + this.dataset.section
        ),
        product_quick_view_media_gallery: SHTHelper.qs(
          "sht-prd-qck-vw-media-gallery"
        ),
        variant_options: this.$$(".js-variant-option-value"),
      }),
      (this.price_selector = "#productQuickViewPrice-" + this.dataset.section),
      (this.inventory_tracking_selector =
        "#productQuickViewInventoryTracking-" + this.dataset.section),
      (this.variant_picker_selector =
        "#productQuickViewVariantPicker-" + this.dataset.section),
      (this.quantity_input_selector =
        "#productQuickViewQuantity-" + this.dataset.section),
      (this.selected_variants = null),
      (this.variant_data = null),
      this.setSelectedVariants(),
      this.setCurrentVariant(),
      this.bindEventHandlers(),
      this.setUnavailableOptions(),
      "dropdown" == this.select_type
        ? this.updateSelectedVariantsOnOptionNameByDropDown()
        : this.updateSelectedVariantsOnOptionName();
  }
  connectedCallback() {
    this.init();
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
      n = [...this.querySelectorAll(".js-selectbox-wrapper")];
    n.forEach((t, e) => {
      if (0 !== e) {
        var i = [...t.querySelectorAll("option")];
        const a = n[e - 1].querySelector(":checked").value;
        var s = r
            .filter((t) => t.available && t["option" + e] === a)
            .map((t) => t["option" + (e + 1)]),
          i =
            (this.setSelectOptionAvailability(i, s),
            [...t.querySelectorAll('input[type="radio"]')]);
        0 < i.length && this.setColorSwatchSelectOptionAvailability(i, s);
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
  setColorSwatchSelectOptionAvailability(t, i) {
    t.forEach((t) => {
      var e = this.querySelector(
        `div.js-variant-option-value[data-value="${t
          .getAttribute("data-variant-value")
          .replace(/"/g, '\\"')}"]`
      );
      i.includes(t.getAttribute("value"))
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
    let i = [];
    this.selected_variants.forEach((t, e) => {
      var e = t + "-" + e,
        e = this.$(
          `.js-variant-item[data-variant-value="${e.replace(/"/g, '\\"')}"]`
        );
      console.log(e),
        e &&
          ((e = e.getAttribute("name")),
          (e = this.$(
            `.js-variant-radio-option-name[data-option-name="${e.replace(
              /"/g,
              '\\"'
            )}"]`
          ))) &&
          ((e.innerHTML = t), i.push(t));
    }),
      0 < i.length && (this.elms.selected_variant.innerHTML = i.join(" / "));
  }
  removeErrorMessage() {
    this.elms.product_quick_view_form &&
      this.elms.product_quick_view_form.handleErrorMessage();
  }
  setUnavailable() {
    var t,
      e = this.elms.form;
    e &&
      ((t = (e = e.querySelector(".js-product-form-submit-btn")).querySelector(
        ".js-product-form-submit-btn-text"
      )),
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
      this.variant_data.map((i) => {
        (i.my_options = []),
          i.options.forEach((t, e) => {
            i.my_options.push(t + "-" + e);
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
  toggleAddButton(t = !0, e, i) {
    var s,
      a = this.elms.form;
    a &&
      ((s = (a = a.querySelector(".js-product-form-submit-btn")).querySelector(
        ".js-product-form-submit-btn-text"
      )),
      a) &&
      (t
        ? (a.setAttribute("disabled", "disabled"), e && (s.textContent = e))
        : (a.removeAttribute("disabled"),
          (s.textContent = SHTLanguage.product.PRODUCT_ADD_TO_CART)));
  }
  updateVariantInput() {
    [this.elms.form].forEach((t) => {
      t &&
        (((t = t.querySelector('input[name="id"]')).value =
          this.currentVariant.id),
        t.dispatchEvent(new Event("change", { bubbles: !0 })));
    });
  }
  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=` +
        this.dataset.section
    )
      .then((t) => t.text())
      .then((t) => {
        var t = new DOMParser().parseFromString(t, "text/html"),
          e = this.elms.inventory_tracking,
          i = t.querySelector(this.inventory_tracking_selector),
          e =
            (e && ((e.innerHTML = ""), i) && (e.innerHTML = i.innerHTML),
            this.elms.price),
          i = t.querySelector(this.price_selector),
          e =
            (i && e && (e.innerHTML = i.innerHTML),
            this.elms.price &&
              this.elms.price.classList.remove("visibility-hidden"),
            this.elms.quantity_input),
          i = t.querySelector(this.quantity_input_selector);
        e && i && (e.innerHTML = i.innerHTML),
          "dropdown" == this.select_type
            ? this.updateSelectedVariantsOnOptionNameByDropDown()
            : this.updateSelectedVariantsOnOptionName(),
          this.toggleAddButton(
            !this.currentVariant.available,
            SHTLanguage.product.PRODUCT_SOLD_OUT
          );
      });
  }
  setActiveMedia() {
    var t = this.dataset.section + "-" + this.currentVariant.id;
    this.elms.product_quick_view_media_gallery.setActiveItem(t);
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
        options: n,
        my_options: o,
        options: { length: l },
      } = this.current_variant;
      if (2 < l) {
        let s = Object.keys(n),
          t = [];
        for (let i = 0; i < l; i++)
          for (let e = i + 1; e < l; e++) {
            var a;
            s[i] &&
              s[e] &&
              ((a = this.variant_data.filter(
                (t) =>
                  t.my_options[s[i]] ===
                    this.current_variant.my_options[s[i]] &&
                  t.my_options[s[e]] ===
                    this.current_variant.my_options[s[e]] &&
                  1 == t.available
              )),
              (t = [...t, ...a]));
          }
        let e = [],
          i = [];
        t.length &&
          ((t = [...t, this.current_variant]).forEach((t) => {
            t = t.my_options;
            e = [...e, ...t];
          }),
          (i = [...new Set(e)]),
          0 == r) &&
          (i = i.filter((t) => !o.includes(t))),
          this.toggleUnavailableOptions(!0),
          i.length &&
            i.forEach((t) => {
              this.$(`[data-value="${t.replace(/"/g, '\\"')}"]`) &&
                this.$(
                  `[data-value="${t.replace(/"/g, '\\"')}"]`
                ).classList.toggle("product-option--unavailable", !1);
            });
      } else if (1 < l) {
        let t = [],
          e = [],
          i = [];
        for (let e = 0; e < l; e++) {
          var s = this.variant_data.filter(
            (t) =>
              t.my_options[e] === this.current_variant.my_options[e] &&
              1 == t.available
          );
          t = [...t, ...s];
        }
        t.length &&
          ((t = [...t, this.current_variant]).forEach((t) => {
            t = t.my_options;
            e = [...e, ...t];
          }),
          (i = [...new Set(e)]),
          0 == r) &&
          (i = i.filter((t) => !o.includes(t))),
          this.toggleUnavailableOptions(!0),
          i.length &&
            i.forEach((t) => {
              this.$(`[data-value="${t.replace(/"/g, '\\"')}"]`) &&
                this.$(
                  `[data-value="${t.replace(/"/g, '\\"')}"]`
                ).classList.toggle("product-option--unavailable", !1);
            });
      } else {
        let e = [],
          t = [],
          i = this.variant_data.filter((t) => 1 == t.available);
        (i = i.length ? [...i, this.current_variant] : i).forEach((t) => {
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
class SHTProductQuickVIewVariantRadios extends SHTProductQuickVIewVariantSelector {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.select_type = "button");
  }
  setSelectedVariants() {
    var t = Array.from(this.$$(".js-variant-radio-container"));
    this.selected_variants = t.map(
      (t) =>
        Array.from(t.querySelectorAll(".js-variant-radio-item")).find(
          (t) => t.checked
        ).value
    );
  }
}
customElements.define(
  "sht-prd-qck-vw-variant-radios",
  SHTProductQuickVIewVariantRadios
);
class SHTProductQuickVIewVariantSelects extends SHTProductQuickVIewVariantSelector {
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
  "sht-prd-qck-vw-variant-selects",
  SHTProductQuickVIewVariantSelects
);
class SHTQuickViewVariantSwatchSelect extends HTMLElement {
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
  "sht-quick-view-variant-swatch-select",
  SHTQuickViewVariantSwatchSelect
);
class SHTProductQuickViewForm extends HTMLElement {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        form: this.$("form"),
        submit_btn: this.$('[type="submit"]'),
        error_wrapper: this.$(".js-product-form-error-wrapper"),
        error_message: this.$(".js-product-form-error-message"),
        spinner: this.$(".js-product-form-spinner"),
        sticky_header: SHTHelper.qs("sht-sticky-header"),
        header: SHTHelper.qs("sht-header"),
        announcement_bar: SHTHelper.qs("sht-ann-bar"),
      }),
      (this.elms.form.querySelector("[name=id]").disabled = !1),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      (this.cartDrawer = SHTHelper.qs("sht-cart-drwr")),
      (this.cartDrawerForm = SHTHelper.qs("sht-cart-drwr-frm")),
      (this.quickShopDialog = SHTHelper.qs("sht-dialog-quickshop")),
      this.bindEventHandlers();
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
        this.elms.submit_btn.classList.add("loading"),
        this.elms.spinner.classList.remove("hidden");
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
                this.elms.header ||
                  window.location.assign(window.routes.cart_url),
                this.quickShopDialog && this.quickShopDialog.closeModal());
          })
          .catch((t) => {
            console.error(t);
          })
          .finally(() => {
            this.elms.submit_btn.classList.remove("loading"),
              this.elms.submit_btn.removeAttribute("aria-disabled"),
              this.elms.spinner.classList.add("hidden");
          });
    }
  }
  handleErrorMessage(t = !1) {
    this.elms.error_wrapper.toggleAttribute("hidden", !t),
      t && (this.elms.error_message.textContent = t);
  }
}
customElements.define("sht-prd-qck-vw-frm", SHTProductQuickViewForm);
class SHTProductQuickViewLoadDynamicCheckoutButton extends HTMLElement {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.template = this.$("template")),
      (this.json = JSON.parse(
        SHTHelper.qs('#shopify-features[type="application/json"]').textContent
      )),
      this.loadDynamicCheckoutButton();
  }
  loadDynamicCheckoutButton() {
    new IntersectionObserver((t, i) => {
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
          i.unobserve(this));
      });
    }).observe(this);
  }
  bindEventHandlers() {}
}
customElements.define(
  "sht-prd-qck-vw-load-dyn-co-btn",
  SHTProductQuickViewLoadDynamicCheckoutButton
);
class SHTProductQuickViewMediaGallery extends HTMLElement {
  constructor() {
    super(),
      (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.items = this.$$(".js-product-quick-view-media-item"));
  }
  setActiveItem(t) {
    t = this.$(`[data-product-quick-view-media-id="${t}"]`);
    t &&
      (this.items.forEach((t) => {
        t.classList.remove("d-block"), t.classList.add("d-none");
      }),
      t.classList.add("d-block"),
      t.classList.remove("d-none"));
  }
}
customElements.define(
  "sht-prd-qck-vw-media-gallery",
  SHTProductQuickViewMediaGallery
);
