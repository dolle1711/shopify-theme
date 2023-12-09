class SHTVariantSelector extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        radio_elms: this.$$(".js-variant-radio-item"),
        radio_container_elms: this.$$(".js-variant-radio-container"),
        form: SHTHelper.qs("#productForm-" + this.dataset.section),
        price: SHTHelper.qs("#productPrice-" + this.dataset.section),
        installment_form: SHTHelper.qs(
          "#productFormInstallment-" + this.dataset.section
        ),
        product_form: SHTHelper.qs(
          `sht-prd-frm[data-section="${this.dataset.section}"]`
        ),
        inventory_tracking: SHTHelper.qs(
          "#inventoryTracking-" + this.dataset.section
        ),
        variant_picker: SHTHelper.qs("#variantPicker-" + this.dataset.section),
        quantity_input: SHTHelper.qs(
          "#productQuantity-" + this.dataset.section
        ),
        slideshow: SHTHelper.qs(
          `sht-prd-slideshow[data-section="${this.dataset.section}"]`
        ),
        thumb_carousel: SHTHelper.qs(
          `sht-vert-carousel[data-section="${this.dataset.section}"]`
        ),
        product_sticky_info: SHTHelper.qs(
          "#productStickyInfo-" + this.dataset.section
        ),
        carousel: SHTHelper.qs(
          `sht-carousel[data-section-id="${this.dataset.section}"]`
        ),
        variant_options: this.$$(".js-variant-option-value"),
        sku: SHTHelper.qs("#sku-" + this.dataset.section),
      }),
      (this.price_selector = "#productPrice-" + this.dataset.section),
      (this.inventory_tracking_selector =
        "#inventoryTracking-" + this.dataset.section),
      (this.variant_picker_selector = "#variantPicker-" + this.dataset.section),
      (this.quantity_input_selector =
        "#productQuantity-" + this.dataset.section),
      (this.slideshow_selector = `sht-prd-slideshow[data-section="${this.dataset.section}"]`),
      (this.sku_selector = "#sku-" + this.dataset.section),
      (this.selected_variants = null),
      (this.variant_data = null),
      this.setSelectedVariants(),
      this.setCurrentVariant(),
      this.updateProductStickyInfo(),
      "dropdown" == this.select_type
        ? this.updateSelectedVariantsOnOptionNameByDropDown()
        : this.updateSelectedVariantsOnOptionName(),
      this.bindEventHandlers(),
      this.setUnavailableOptions();
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
      this.toggleAddButtonSticky(!0, "", !1),
      this.updatePickupAvailability(),
      this.removeErrorMessage(),
      "dropdown" == this.select_type && this.updateVariantStatuses(),
      this.currentVariant
        ? (this.updateURL(),
          this.updateVariantInput(),
          this.renderProductInfo(),
          this.setActiveMedia(),
          this.setUnavailableOptions())
        : (this.toggleAddButton(!0, "", !0),
          this.toggleAddButtonSticky(!0, "", !0),
          this.setUnavailable(),
          "dropdown" == this.select_type
            ? this.updateSelectedVariantsOnOptionNameByDropDown()
            : this.updateSelectedVariantsOnOptionName());
  }
  updateVariantStatuses() {
    const a = this.variant_data.filter(
        (t) => this.querySelector(":checked").value === t.option1
      ),
      n = [...this.querySelectorAll(".js-selectbox-wrapper")];
    n.forEach((t, e) => {
      if (0 !== e) {
        var i = [...t.querySelectorAll("option")];
        const r = n[e - 1].querySelector(":checked").value;
        var s = a
            .filter((t) => t.available && t["option" + e] === r)
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
  updateOptionState(t) {
    this.$$(".product-option--sold-out").forEach((t) => {
      t.classList.remove("product-option--sold-out");
    }),
      t ||
        this.selected_variants.forEach((t) => {
          t = this.$(
            `.js-variant-item[data-variant-value="${t.replace(/"/g, '\\"')}"]`
          );
          t &&
            t
              .closest(".js-variant-option-value")
              ?.classList.add("product-option--sold-out");
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
  updateProductStickyInfo() {
    this.elms.product_sticky_info &&
      ((this.elms.product_sticky_info.querySelector(
        ".js-product-sticky-info-variant"
      ).innerHTML = this.currentVariant.title),
      this.elms.price &&
        (this.elms.product_sticky_info.querySelector(
          ".js-product-sticky-info-price"
        ).innerHTML = this.elms.price.innerHTML),
      (this.elms.product_sticky_info.querySelector(
        ".js-quantity-input"
      ).value = 1),
      (this.elms.product_sticky_info.querySelector('[name="id"]').value =
        this.currentVariant.id));
  }
  removeErrorMessage() {
    this.elms.product_form && this.elms.product_form.handleErrorMessage();
  }
  updatePickupAvailability() {
    var t = SHTHelper.qs("sht-pickup-avail");
    t &&
      (this.currentVariant && this.currentVariant.available
        ? t.fetchAvailability(this.currentVariant.id)
        : (t.removeAttribute("available"),
          t.classList.remove("d-block"),
          t.classList.add("d-none"),
          (t.innerHTML = "")));
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
            this.elms.sku),
          i = t.querySelector(this.sku_selector);
        e && ((e.innerHTML = ""), i) && (e.innerHTML = i.innerHTML),
          (this.elms.quantity_input.querySelector(
            ".js-quantity-input"
          ).value = 1),
          this.updateProductStickyInfo(),
          "dropdown" == this.select_type
            ? this.updateSelectedVariantsOnOptionNameByDropDown()
            : this.updateSelectedVariantsOnOptionName(),
          "false" == this.elms.slideshow.hide_variant &&
            ((e = this.elms.slideshow),
            (i = t.querySelector(this.slideshow_selector)),
            e) &&
            i &&
            (e.innerHTML = i.innerHTML),
          this.toggleAddButton(
            !this.currentVariant.available,
            SHTLanguage.product.PRODUCT_SOLD_OUT
          ),
          this.toggleAddButtonSticky(
            !this.currentVariant.available,
            SHTLanguage.product.PRODUCT_SOLD_OUT
          );
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
  updateURL() {
    this.currentVariant &&
      "false" !== this.dataset.updateUrl &&
      window.history.replaceState(
        {},
        "",
        this.dataset.url + "?variant=" + this.currentVariant.id
      );
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
      r = this.elms.form;
    r &&
      ((s = (r = r.querySelector(".js-product-form-submit-btn")).querySelector(
        ".js-product-form-submit-btn-text"
      )),
      r) &&
      (t
        ? (r.setAttribute("disabled", "disabled"), e && (s.textContent = e))
        : (r.removeAttribute("disabled"),
          (s.textContent = SHTLanguage.product.PRODUCT_ADD_TO_CART)));
  }
  toggleAddButtonSticky(t = !0, e, i) {
    var s,
      r = SHTHelper.qs("#productStickyForm-" + this.dataset.section);
    r &&
      ((s = (r = r.querySelector(".js-product-form-submit-btn")).querySelector(
        ".js-product-form-submit-btn-text"
      )),
      r) &&
      (t
        ? (r.setAttribute("disabled", "disabled"), e && (s.textContent = e))
        : (r.removeAttribute("disabled"),
          (s.textContent = SHTLanguage.product.PRODUCT_ADD_TO_CART)));
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
        available: a,
        options: n,
        my_options: o,
        options: { length: l },
      } = this.current_variant;
      if (2 < l) {
        let s = Object.keys(n),
          t = [];
        for (let i = 0; i < l; i++)
          for (let e = i + 1; e < l; e++) {
            var r;
            s[i] &&
              s[e] &&
              ((r = this.variant_data.filter(
                (t) =>
                  t.my_options[s[i]] ===
                    this.current_variant.my_options[s[i]] &&
                  t.my_options[s[e]] ===
                    this.current_variant.my_options[s[e]] &&
                  1 == t.available
              )),
              (t = [...t, ...r]));
          }
        let e = [],
          i = [];
        t.length &&
          ((t = [...t, this.current_variant]).forEach((t) => {
            t = t.my_options;
            e = [...e, ...t];
          }),
          (i = [...new Set(e)]),
          0 == a) &&
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
          0 == a) &&
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
          0 == a && (t = t.filter((t) => !o.includes(t))),
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
class SHTVariantRadios extends SHTVariantSelector {
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
customElements.define("sht-variant-radios", SHTVariantRadios);
class SHTVariantSelects extends SHTVariantSelector {
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
customElements.define("sht-variant-selects", SHTVariantSelects);
class SHTVariantSwatchSelect extends HTMLElement {
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
customElements.define("sht-variant-swatch-select", SHTVariantSwatchSelect);
class SHTProductForm extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        form: this.$("form"),
        submit_btn: this.$('[type="submit"]'),
        error_wrapper: this.$(".js-product-form-error-wrapper"),
        error_message: this.$(".js-product-form-error-message"),
        spinner: this.$(".js-product-form-spinner"),
        quantity_input_container: SHTHelper.qs(
          "#productQuantity-" + this.dataset.section
        ),
        submit_btn_sticky: SHTHelper.qs(
          "sht-prd-frm-sticky .js-product-form-submit-btn"
        ),
        error_wrapper_sticky: SHTHelper.qs(
          "sht-prd-frm-sticky .js-product-form-error-wrapper"
        ),
        error_message_sticky: SHTHelper.qs(
          "sht-prd-frm-sticky .js-product-form-error-message"
        ),
        spinner_sticky: SHTHelper.qs(
          "sht-prd-frm-sticky .js-product-form-spinner"
        ),
        sticky_header: SHTHelper.qs("sht-sticky-header"),
        header: SHTHelper.qs("sht-header"),
        announcement_bar: SHTHelper.qs("sht-ann-bar"),
        header_cart_status: SHTHelper.qs("#headerCartStatus"),
      }),
      (this.elms.form.querySelector("[name=id]").disabled = !1),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      (this.cartDrawer = SHTHelper.qs("sht-cart-drwr")),
      (this.cartDrawerForm = SHTHelper.qs("sht-cart-drwr-frm")),
      (this.cardRecipientForm = SHTHelper.qs("sht-gift-card-recipient-form")),
      this.bindEventHandlers();
  }
  connectedCallback() {
    this.init();
  }
  bindEventHandlers() {
    this.elms.form.addEventListener("submit", this.onSubmitHandler.bind(this));
  }
  onSubmitHandler(e) {
    if (
      (e.preventDefault(), !this.elms.submit_btn.classList.contains("loading"))
    ) {
      this.hideErrorMessage(),
        this.elms.submit_btn.setAttribute("aria-disabled", !0),
        this.elms.submit_btn.setAttribute("disabled", !0),
        this.elms.submit_btn.classList.add("loading"),
        this.elms.submit_btn_sticky &&
          (this.elms.submit_btn_sticky.setAttribute("aria-disabled", !0),
          this.elms.submit_btn_sticky.setAttribute("disabled", !0),
          this.elms.submit_btn_sticky.classList.add("loading")),
        this.elms.spinner.classList.remove("hidden"),
        this.elms.spinner_sticky &&
          this.elms.spinner_sticky.classList.remove("hidden"),
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
              ? this.handleErrorMessage(t.description, t?.message)
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
                this.cardRecipientForm &&
                  this.cardRecipientForm.resetRecipientForm(),
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
              this.elms.submit_btn_sticky &&
                (this.elms.submit_btn_sticky.classList.remove("loading"),
                this.elms.submit_btn_sticky.removeAttribute("aria-disabled"),
                this.elms.submit_btn_sticky.removeAttribute("disabled")),
              this.elms.spinner.classList.add("hidden"),
              this.elms.spinner_sticky &&
                this.elms.spinner_sticky.classList.add("hidden");
          });
    }
  }
  hideErrorMessage() {
    this.elms.error_wrapper.toggleAttribute("hidden", !0),
      this.elms.error_wrapper_sticky &&
        this.elms.error_message_sticky &&
        this.elms.error_wrapper_sticky.toggleAttribute("hidden", !0);
  }
  handleErrorMessage(t = !1, e = "") {
    t &&
      ("string" == typeof t &&
        (this.elms.error_wrapper.toggleAttribute("hidden", !t),
        this.elms.error_wrapper_sticky &&
          this.elms.error_message_sticky &&
          this.elms.error_wrapper_sticky.toggleAttribute("hidden", !t),
        (this.elms.error_message.textContent = t),
        this.elms.error_wrapper_sticky) &&
        this.elms.error_message_sticky &&
        (this.elms.error_message_sticky.textContent = t),
      this.cardRecipientForm) &&
      "object" == typeof t &&
      this.cardRecipientForm.handleErrorMessage(t, e);
  }
}
customElements.define("sht-prd-frm", SHTProductForm);
class SHTStickyProductInfo extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.is_enabled = this.dataset.isEnabled),
      (this.section_id = this.dataset.sectionId),
      (this.sticky = this.$(".js-sticky-product-info")),
      (this.sticky_element = SHTHelper.qs(
        "#productStickyInfo-" + this.section_id
      )),
      (this.current_scroll_top = 0),
      (this.container_height = 0),
      (this.sticky_bounds = {}),
      (this.style_sticky = window.getComputedStyle(this.sticky)),
      (this.style_sticky_margin_bottom = parseInt(
        this.style_sticky.marginBottom,
        0
      )),
      (this.container = SHTHelper.qs("#" + this.section_id)),
      (this.footer_element = document.querySelector(".js-footer")),
      (this.container_padding_top = parseInt(
        window.getComputedStyle(this.container).getPropertyValue("padding-top")
      )),
      this.bindEventHandlers();
  }
  createObserver() {
    this.sticky_bounds = this.sticky.getBoundingClientRect();
  }
  bindEventHandlers() {
    if ("false" == this.is_enabled) return !1;
    window.addEventListener("scroll", this.onScrollHandle.bind(this), !1);
  }
  onScrollHandle() {
    var t =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight,
      t =
        null !== this.footer_element
          ? t - this.footer_element.offsetHeight
          : 10 + t,
      e =
        this.sticky.offsetTop +
        this.sticky.offsetHeight +
        this.style_sticky_margin_bottom +
        this.container.offsetTop +
        this.container_padding_top,
      i = window.pageYOffset || document.documentElement.scrollTop || 0,
      t = Math.ceil(i) >= t,
      e = 1 - e / i;
    i > this.current_scroll_top && 0 <= e && !t
      ? requestAnimationFrame(this.reveal.bind(this))
      : i > this.current_scroll_top && 0 <= e && t
      ? requestAnimationFrame(this.hide.bind(this))
      : i < this.current_scroll_top && 0 <= e && !t
      ? requestAnimationFrame(this.reveal.bind(this))
      : e < 0 && !t && requestAnimationFrame(this.reset.bind(this)),
      (this.current_scroll_top = i);
  }
  connectedCallback() {
    this.init();
  }
  hide() {
    this.sticky_element.classList.remove("opacity-1"),
      this.sticky_element.classList.add("hidden-xs", "opacity-0");
  }
  reveal() {
    this.sticky_element.classList.add("opacity-1"),
      this.sticky_element.classList.remove("hidden-xs", "opacity-0");
  }
  reset() {
    this.sticky_element.classList.remove("opacity-1"),
      this.sticky_element.classList.add("hidden-xs", "opacity-0");
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this.onScrollHandle.bind(this));
  }
}
customElements.define("sht-sticky-prd-info", SHTStickyProductInfo);
class SHTQuantityInputSticky extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.input = this.$('[name="quantity"]')),
      (this.orgInput = SHTHelper.qs(
        "sht-qty-inp #" + this.dataset.srcInputSelector
      )),
      (this.changeEvent = new Event("change", { bubbles: !0 })),
      this.$$("button").forEach((t) =>
        t.addEventListener("click", this.onButtonClickHandle.bind(this))
      ),
      this.orgInput.addEventListener("change", () => {
        this.input.value = this.orgInput.value;
      });
  }
  connectedCallback() {
    this.init();
  }
  onButtonClickHandle(t) {
    t.preventDefault();
    var e = this.input.value;
    "plus" === t.currentTarget.dataset.name
      ? this.input.stepUp()
      : this.input.stepDown(),
      e !== this.input.value &&
        (this.input.dispatchEvent(this.changeEvent),
        (this.orgInput.value = this.input.value));
  }
}
customElements.define("sht-qty-inp-sticky", SHTQuantityInputSticky);
class SHTProductFormSticky extends HTMLElement {
  constructor() {
    super();
  }
  init() {
    (this.$ = this.querySelector.bind(this)),
      (this.$$ = this.querySelectorAll.bind(this)),
      (this.elms = {
        form: this.$("form"),
        submit_btn: this.$('[type="submit"]'),
        error_wrapper: this.$(".js-product-form-error-wrapper"),
        error_message: this.$(".js-product-form-error-message"),
        spinner: this.$(".js-product-form-spinner"),
        org_form: SHTHelper.qs("sht-prd-frm #" + this.dataset.srcFrmSelector),
      }),
      this.bindEventHandlers();
  }
  connectedCallback() {
    this.init();
  }
  bindEventHandlers() {
    this.elms.submit_btn.addEventListener(
      "click",
      this.onClickSubmitButtonHandle.bind(this)
    ),
      this.elms.form.addEventListener(
        "submit",
        this.onSubmitHandler.bind(this)
      );
  }
  onSubmitHandler(t) {
    t.preventDefault();
  }
  onClickSubmitButtonHandle() {
    this.elms.org_form.dispatchEvent(new Event("submit", { bubble: !0 }));
  }
}
if (
  (customElements.define("sht-prd-frm-sticky", SHTProductFormSticky),
  !customElements.get("sht-zoom"))
) {
  class F0 extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.$$ = this.querySelectorAll.bind(this)),
        (this.image = this.$(".js-zoom-item")),
        (this.container = SHTHelper.qs("#" + this.dataset.containerId)),
        (this.image_natural_dimension = {}),
        (this.container_dimension = {}),
        (this.rendered_aspect_ratio = {}),
        (this.image_dimension = {}),
        (this.is_able_to_zoom = !0),
        this.bindEventHandlers();
    }
    init() {
      this.getImageDimension(), this.getContainerDimension();
      var t = this.image.src,
        e = this.image.srcset;
      (this.image.scr = t), (this.image.srcset = e);
    }
    ableToZoom() {
      return !(
        this.rendered_aspect_ratio.container <=
          this.rendered_aspect_ratio.image ||
        (this.image_natural_dimension.width <= this.container_dimension.width &&
          this.image_natural_dimension.height <=
            this.container_dimension.height)
      );
    }
    bindEventHandlers() {
      this.image.addEventListener("click", (t) => {
        t.preventDefault(),
          this.image.hasAttribute("zoomed") ? this.zoomOut() : this.zoomIn();
      });
    }
    zoomIn() {
      var t = window.matchMedia("(max-width: 459px)");
      (this.image.style.height = "auto"),
        (this.image.style.objectFit = "unset"),
        this.image.setAttribute("zoomed", !0),
        (this.image.style.cursor = "zoom-out"),
        t.matches
          ? ((this.image.style.width = "150%"),
            (this.image.style.maxWidth = "unset"))
          : (this.image.style.width = "100%"),
        this.image.offsetHeight <= this.container_dimension.height &&
          this.classList.add("d-flex", "fd-column", "center-xs"),
        this.container.classList.add("o-scroll"),
        this.container.scrollTo({
          top:
            this.container.scrollHeight / 2 - this.container.offsetHeight / 2,
          behavior: "auto",
        }),
        t.matches &&
          this.container.scrollTo({
            left:
              this.container.scrollWidth / 2 - this.container.offsetWidth / 2,
            behavior: "auto",
          });
    }
    zoomOut() {
      (this.image.style.width = "100%"),
        (this.image.style.height = "100%"),
        (this.image.style.objectFit = "contain"),
        this.image.removeAttribute("zoomed"),
        (this.image.style.cursor = "zoom-in"),
        this.classList.remove("d-flex", "fd-column", "center-xs"),
        this.container.classList.remove("o-scroll"),
        (this.image.style.maxWidth = null);
    }
    reset() {
      this.zoomOut();
    }
    calculateRenderedAspectRatio() {
      this.rendered_aspect_ratio = {
        image:
          this.image_natural_dimension.width /
          this.image_natural_dimension.height,
        container:
          this.container_dimension.width / this.container_dimension.height,
      };
    }
    getImageNaturalDimension() {
      this.image_natural_dimension = {
        width: parseInt(this.image.getAttribute("width")),
        height: parseInt(this.image.getAttribute("height")),
      };
    }
    getImageDimension() {
      this.image_dimension = {
        width: this.image.offsetWidth,
        height: this.image.offsetHeight,
      };
    }
    getContainerDimension() {
      this.container_dimension = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      };
    }
  }
  customElements.define("sht-zoom", F0);
}
if (!customElements.get("sht-gallery-slide")) {
  class L0 extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.$$ = this.querySelectorAll.bind(this)),
        (this.dialog = SHTHelper.qs(
          "sht-dialog#" + this.dataset.galleryDialogId
        )),
        (this.mediaId = this.dataset.mediaId),
        (this.zoomElement = this.$("sht-zoom")),
        (this.gallery = this.closest("sht-gallery"));
    }
    init() {
      this.dialog.addEventListener("closing", (t) => {
        this.classList.add("d-none"),
          this.classList.remove("is-active-gallery-slide", "d-flex"),
          this.zoomElement && this.zoomElement.reset(),
          this.gallery.pauseAllVideo();
      });
    }
    connectedCallback() {
      this.init();
    }
    disconnectedCallback() {}
  }
  customElements.define("sht-gallery-slide", L0);
}
if (!customElements.get("sht-gallery-slides")) {
  class N0 extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.$$ = this.querySelectorAll.bind(this)),
        (this.gallery = this.closest("sht-gallery")),
        (this.dialog = SHTHelper.qs(
          "sht-dialog#" + this.gallery.dataset.galleryDialogId
        )),
        (this.slides = this.$$(".js-gallery-slide")),
        (this.totalSlides = this.slides.length),
        (this.prevBtnElement = this.$(".js-slide-prev-btn")),
        (this.nextBtnElement = this.$(".js-slide-next-btn")),
        (this.currentSlideElement = this.$(".js-slide-current")),
        (this.totalElement = this.$(".js-slide-total")),
        (this.paginationElement = this.$(".js-slide-pagination")),
        (this.currentIndex = 1);
    }
    init() {
      this.dialog.addEventListener("opening", (i) => {
        try {
          this.slides.forEach((t) => {
            var e;
            if (t.dataset.mediaId == i.detail.opener.dataset.dialogMediaId)
              throw (
                (t.classList.remove("d-none"),
                t.classList.add("is-active-gallery-slide", "d-flex"),
                (e = t.querySelector("sht-zoom")) && e.init(),
                (this.currentIndex = t.dataset.itemIndex),
                "done")
              );
          });
        } catch (i) {}
        this.updateNavigation();
      }),
        this.bindEventHandlers();
    }
    updateNavigation() {
      (this.currentSlideElement.textContent = this.currentIndex),
        (this.totalElement.textContent = this.totalSlides),
        this.currentIndex <= 1
          ? this.prevBtnElement.setAttribute("disabled", "disabled")
          : this.prevBtnElement.removeAttribute("disabled"),
        this.currentIndex >= this.totalSlides
          ? this.nextBtnElement.setAttribute("disabled", "disabled")
          : this.nextBtnElement.removeAttribute("disabled"),
        1 < this.totalSlides &&
          (this.paginationElement?.classList.remove("d-none"),
          this.paginationElement?.classList.add("d-flex")),
        this.totalSlides <= 1 &&
          (this.paginationElement?.classList.remove("d-flex"),
          this.paginationElement?.classList.add("d-none"));
    }
    connectedCallback() {
      this.init();
    }
    disconnectedCallback() {}
    bindEventHandlers() {
      this.prevBtnElement.addEventListener(
        "click",
        this.onButtonClick.bind(this)
      ),
        this.nextBtnElement.addEventListener(
          "click",
          this.onButtonClick.bind(this)
        );
    }
    onButtonClick(t) {
      t.preventDefault();
      t = t.currentTarget.name.toLowerCase();
      this.showSlides(t);
    }
    showSlides(t) {
      (this.currentElement = this.$(
        `[data-item-index="${this.currentIndex}"]`
      )),
        this.currentElement &&
          (e = this.currentElement.querySelector("sht-zoom")) &&
          e.reset(),
        this.slides.forEach((t) => {
          t.classList.remove("is-active-gallery-slide", "d-flex"),
            t.classList.add("d-none");
        }),
        "next" === t &&
          ((this.currentIndex = parseInt(this.currentIndex) + 1),
          (this.currentElement = this.$(
            `[data-item-index="${this.currentIndex}"]`
          )),
          this.currentElement.classList.add(
            "is-active-gallery-slide",
            "d-flex"
          ),
          this.currentElement.classList.remove("d-none")),
        "previous" === t &&
          ((this.currentIndex = parseInt(this.currentIndex) - 1),
          (this.currentElement = this.$(
            `[data-item-index="${this.currentIndex}"]`
          )),
          this.currentElement.classList.add(
            "is-active-gallery-slide",
            "d-flex"
          ),
          this.currentElement.classList.remove("d-none")),
        (this.currentSlideElement.textContent = this.currentIndex),
        this.updateNavigation();
      var e = this.currentElement.querySelector("sht-zoom");
      this.gallery.playActiveVideo(this.currentElement),
        this.gallery.playActiveModel(this.currentElement),
        e && e.init();
    }
  }
  customElements.define("sht-gallery-slides", N0);
}
if (!customElements.get("sht-gallery")) {
  class X0 extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.$$ = this.querySelectorAll.bind(this)),
        (this.dialog = SHTHelper.qs(
          "sht-dialog#" + this.dataset.galleryDialogId
        )),
        this.$$(".js-gallery-btn-thumb").forEach((t) => {
          t.addEventListener("click", this.setActiveMedia.bind(this, t));
        }),
        (this.thumbCarousel = this.$("sht-horiz-carousel"));
    }
    init() {
      this.dialog.addEventListener("opening", (e) => {
        try {
          window.SHTProductMediaItemModel &&
            window.SHTProductMediaItemModel.loadShopifyXR(),
            this.$$(".js-gallery-thumb").forEach((t) => {
              if (
                t.dataset.mediaTargetId == e.detail.opener.dataset.dialogMediaId
              )
                throw (
                  (t.classList.add("is-active-gallery-thumb"),
                  this.scrollToThumb(t.dataset.mediaTargetId),
                  "done")
                );
            });
        } catch (e) {}
      }),
        this.dialog.addEventListener("closing", (t) => {
          this.$$(".js-gallery-thumb").forEach((t) => {
            t.classList.remove("is-active-gallery-thumb");
          });
        });
    }
    scrollToThumb(t) {
      t = this.thumbCarousel.querySelector(`[data-media-target-id="${t}"]`);
      t &&
        this.thumbCarousel
          .querySelector(".js-carousel-items")
          .scrollTo({ left: t.offsetLeft, behavior: "auto" });
    }
    setActiveMedia(t) {
      var e = this.$("sht-gallery-slide.is-active-gallery-slide"),
        e =
          (e && (e = e.querySelector("sht-zoom")) && e.reset(),
          this.$(`[data-media-id="${t.dataset.target}"]`)),
        i = e.querySelector("sht-zoom"),
        t = t.closest("sht-horiz-carousel-itm");
      this.$$(".js-gallery-slide").forEach((t) => {
        t.classList.remove("is-active-gallery-slide", "d-flex"),
          t.classList.add("d-none");
      }),
        this.$$(".js-gallery-thumb").forEach((t) => {
          t.classList.remove("is-active-gallery-thumb");
        }),
        e.classList.add("is-active-gallery-slide", "d-flex"),
        e.classList.remove("d-none"),
        t.classList.add("is-active-gallery-thumb"),
        this.playActiveVideo(e),
        this.playActiveModel(e),
        i && i.init();
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
    connectedCallback() {
      this.init();
    }
    disconnectedCallback() {}
  }
  customElements.define("sht-gallery", X0);
}
if (!customElements.get("sht-cont-deferred")) {
  class sb extends HTMLElement {
    constructor() {
      super(), (this.$ = this.querySelector.bind(this));
      new IntersectionObserver(
        ((t, e) => {
          t[0].isIntersecting &&
            (e.unobserve(this),
            (this.template = this.$("template")),
            this.template) &&
            ((t = this.template.content), this.appendChild(t));
        }).bind(this)
      ).observe(this);
    }
  }
  customElements.define("sht-cont-deferred", sb);
}
if (
  (customElements.get("sht-pickup-avail") ||
    customElements.define(
      "sht-pickup-avail",
      class extends HTMLElement {
        constructor() {
          super(),
            (this.$ = this.querySelector.bind(this)),
            this.hasAttribute("available") &&
              ((this.errorHtml = this.$(
                "template"
              ).content.firstElementChild.cloneNode(!0)),
              (this.onClickRefreshListHandleEvent =
                this.onClickRefreshListHandleEvent.bind(this)),
              this.fetchAvailability(this.dataset.variantId));
        }
        fetchAvailability(t) {
          let e = routes.root_url;
          e.endsWith("/") || (e += "/");
          t = e + `variants/${t}/?section_id=pickup-availability`;
          fetch(t)
            .then((t) => t.text())
            .then((t) => {
              t = new DOMParser()
                .parseFromString(t, "text/html")
                .querySelector(".shopify-section");
              this.renderPreview(t);
            })
            .catch((t) => {
              var e = this.$("button");
              e &&
                e.removeEventListener(
                  "click",
                  this.onClickRefreshListHandleEvent
                ),
                this.renderError();
            });
        }
        onClickRefreshListHandleEvent(t) {
          this.fetchAvailability(this.dataset.variantId);
        }
        renderError() {
          (this.innerHTML = ""),
            this.appendChild(this.errorHtml),
            this.$("button").addEventListener(
              "click",
              this.onClickRefreshListHandleEvent
            );
        }
        renderPreview(t) {
          var e = SHTHelper.qs("#drawerPickupAvailability"),
            i = t.querySelector("sht-pickup-avail-prwv");
          e && e.remove(),
            i
              ? ((this.innerHTML = i.outerHTML),
                this.setAttribute("available", ""),
                this.classList.add("d-block"),
                this.classList.remove("d-none"),
                document.body.appendChild(
                  t.querySelector("#drawerPickupAvailability")
                ),
                (e = this.$("button")) &&
                  e.addEventListener("click", (t) => {
                    SHTHelper.qs("#drawerPickupAvailability").openDrawer(
                      t.target
                    );
                  }))
              : ((this.innerHTML = ""),
                this.removeAttribute("available"),
                this.classList.remove("d-block"),
                this.classList.add("d-none"));
        }
      }
    ),
  !customElements.get("sht-prd-recom"))
) {
  class Mb extends HTMLElement {
    constructor() {
      super();
      new IntersectionObserver(
        ((t, e) => {
          t[0].isIntersecting &&
            (e.unobserve(this),
            fetch(this.dataset.url)
              .then((t) => t.text())
              .then((t) => {
                var e = document.createElement("div"),
                  t = ((e.innerHTML = t), e.querySelector("sht-prd-recom"));
                t &&
                  t.innerHTML.trim().length &&
                  ((this.innerHTML = t.innerHTML),
                  this.executeScriptElements(this));
              })
              .catch((t) => {
                console.error(t);
              })
              .finally(() => {
                "undefined" != typeof SHTElementLazyLoad &&
                  new SHTElementLazyLoad();
              }));
        }).bind(this)
      ).observe(this);
    }
    executeScriptElements(t) {
      t = t.querySelectorAll("script");
      for (
        Array.from(t).forEach((t) => {
          const e = document.createElement("script");
          Array.from(t.attributes).forEach((t) => {
            e.setAttribute(t.name, t.value);
          }),
            e.appendChild(document.createTextNode(t.innerHTML)),
            t.parentNode.replaceChild(e, t);
        });
        SHTDefer.length;

      )
        SHTDefer.shift().call();
    }
  }
  customElements.define("sht-prd-recom", Mb);
}
if (!customElements.get("sht-gift-card-recipient-form")) {
  class $b extends HTMLElement {
    constructor() {
      super(),
        (this.i_want_input = this.querySelector(
          ".js-gift-card-recipient-form-i-want"
        )),
        (this.i_want_input.disabled = !1),
        (this.hidden_i_want_input = this.querySelector(
          ".js-gift-card-recipient-form-i-want-hidden"
        )),
        (this.hidden_i_want_input.disabled = !0),
        (this.email_input = this.querySelector(
          ".js-gift-card-recipient-form-email"
        )),
        (this.name_input = this.querySelector(
          ".js-gift-card-recipient-form-name"
        )),
        (this.message_input = this.querySelector(
          ".js-gift-card-recipient-form-message"
        )),
        (this.email_error = this.querySelector(
          ".js-gift-card-recipient-form-email-error"
        )),
        this.addEventListener("change", this.onChangeHandler.bind(this));
    }
    onChangeHandler() {
      this.i_want_input.checked ||
        (this.clearInputFields(), this.clearErrorMessage());
    }
    clearErrorMessage() {
      this.querySelectorAll(".js-gift-card-recipient-form-error").forEach(
        (t) => {
          t.classList.add("hidden");
          t = t.querySelector(".error-message");
          t && (t.innerText = "");
        }
      ),
        [this.email_input, this.name_input, this.message_input].forEach((t) => {
          t.setAttribute("aria-invalid", !1),
            t.removeAttribute("aria-describedby"),
            t.removeAttribute("tabindex");
        });
    }
    clearInputFields() {
      (this.email_input.value = ""),
        (this.name_input.value = ""),
        (this.message_input.value = "");
    }
    handleErrorMessage(t, e) {
      Object.entries(t).forEach(([t, e]) => {
        var i = this.querySelector(`.js-gift-card-recipient-form-${t}-error`),
          s = `RecipientForm-${t}-error-` + this.dataset.sectionId,
          t = this.querySelector(".js-gift-card-recipient-form-" + t);
        (i.querySelector(".error-message").innerText = e),
          i.classList.remove("hidden"),
          t.setAttribute("aria-invalid", !0),
          t.setAttribute("aria-describedby", s),
          t.focus();
      });
    }
    resetRecipientForm() {
      this.i_want_input.checked &&
        ((this.i_want_input.checked = !1),
        this.clearInputFields(),
        this.clearErrorMessage());
    }
  }
  customElements.define("sht-gift-card-recipient-form", $b);
}
