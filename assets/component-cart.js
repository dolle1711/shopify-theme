class SHTCartNote extends SHTCustomComponent {
  constructor() {
    super(), this.bindEventHandlers();
  }
  bindEventHandlers() {
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
customElements.define("sht-cart-note", SHTCartNote);
class SHTCartRemoveButton extends SHTCustomComponent {
  constructor() {
    super(),
      this.addEventListener("click", (t) => {
        t.preventDefault(),
          this.closest("sht-cart-frm").updateQuantity(this.dataset.index, 0);
      });
  }
}
customElements.define("sht-cart-rmv-btn", SHTCartRemoveButton);
class SHTCartForm extends SHTCustomComponent {
  constructor() {
    super(),
      (this.cartDrawer = SHTHelper.qs("sht-cart-drwr")),
      (this.cartDrawerForm = SHTHelper.qs("sht-cart-drwr-frm")),
      (this.cartNotification = SHTHelper.qs("sht-cart-noti")),
      (this.totalItems = Array.from(this.$$(".js-quantity-input")).reduce(
        (t, e) => t + parseInt(e.value),
        0
      )),
      this.bindEventHandlers();
  }
  bindEventHandlers() {
    this.addEventListener(
      "change",
      SHTHelper.debounce((t) => {
        this.onChange(t);
      }, 300)
    );
  }
  onChange(t) {
    "note" !== t.target.name &&
      this.updateQuantity(
        t.target.dataset.index,
        t.target.value,
        document.activeElement.dataset.name
      );
  }
  getSectionsToRender() {
    return [
      {
        id: "cartForm",
        section: this.$(".js-cart-form-wrapper").dataset.sectionId,
        selectors: [
          ".js-cart-form-content-cart-items",
          ".js-cart-form-content-cart-total",
          ".js-cart-form-item_count",
        ],
      },
    ];
  }
  updateQuantity(e, t, n) {
    let r = this.getSectionsToRender();
    this.cartDrawer && (r = [...r, ...this.cartDrawer.getSectionsToRender()]),
      this.cartNotification &&
        (r = [...r, ...this.cartNotification.getSectionsToRender()]);
    t = JSON.stringify({
      line: e,
      quantity: t,
      sections: r.map((t) => t.section),
      sections_url: window.location.pathname,
    });
    fetch("" + window.routes.cart_change_url, {
      ...SHTHelper.fetchConfigJSON,
      body: t,
    })
      .then((t) => t.text())
      .then((t) => {
        let r = JSON.parse(t);
        r.errors
          ? this.updateErrorRegions(e, r.errors)
          : ((t = this.$(".js-cart-form-footer")),
            this.classList.toggle("cart-content--is-empty", 0 === r.item_count),
            t && t.classList.toggle("d-none", 0 === r.item_count),
            this.getSectionsToRender().forEach((e) => {
              e.selectors.forEach((t) => {
                (SHTHelper.qid(e.id).querySelector(t) || this.$(t)).innerHTML =
                  this.getSectionInnerHTML(r.sections[e.section], t);
              });
            }),
            this.updateFreeShipNotifications(r),
            (t = SHTHelper.qid("cartItem-" + e)) &&
              (t = t.querySelector(".js-quantity-btn-" + n)) &&
              t.focus(),
            this.cartDrawerForm && this.cartDrawerForm.renderContents(r),
            this.cartNotification &&
              this.cartNotification.getSectionsToRender().forEach((t) => {
                "header-cart-status" == t.id &&
                  (SHTHelper.qs(t.space_selector).innerHTML =
                    this.cartNotification.getSectionInnerHTML(
                      r.sections[t.id],
                      t.selector
                    ));
              }));
      })
      .catch((t) => {
        this.$(".js-cart-form-errors").textContent = SHTLanguage.cart.ERROR;
      });
  }
  updateFreeShipNotifications(t) {
    var t = t.sections[SHTHelper.qid("mainCartForm").dataset.sectionId],
      t = new DOMParser().parseFromString(t, "text/html"),
      e = this.$(".js-free-shipping-notification-message"),
      t = t.querySelector(".js-free-shipping-notification-value");
    e && t && (e.innerHTML = t.innerHTML);
  }
  updateErrorRegions(t, e) {
    var r = this.$("#line-item-error-" + t),
      t = this.$(`.js-quantity-input[data-index="${t}"]`);
    r &&
      ((r.querySelector(".js-cart-form-item-error-message").innerHTML = e),
      r.classList.remove("d-none-important")),
      t && (t.value = t.dataset.cartQuantity);
  }
  getSectionInnerHTML(t, e) {
    return new DOMParser().parseFromString(t, "text/html").querySelector(e)
      .innerHTML;
  }
}
customElements.define("sht-cart-frm", SHTCartForm);
