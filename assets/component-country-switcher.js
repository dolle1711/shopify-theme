if (!customElements.get("sht-country-switcher")) {
  class a extends SHTCustomComponent {
    constructor() {
      super(),
        (this.sub_elms = {
          country_code_field: this.$(".js-country-switcher-country-code-field"),
          country_btn: this.$(".js-country-switcher-btn"),
          country_list: this.$(".js-country-switcher-country-list"),
          country_link_items: this.$$(".js-country-switcher-country-item-link"),
          country_form: this.$(".js-country-switcher-form"),
        }),
        this.sub_elms.country_btn.addEventListener(
          "click",
          this.toggleCountrySwitcher.bind(this)
        ),
        this.sub_elms.country_btn.addEventListener("focusout", (t) => {
          this.contains(t.relatedTarget) || this.hideCountryListPanel();
        }),
        this.sub_elms.country_link_items.forEach((t) => {
          t.addEventListener("click", this.onLinkItemClickHandler.bind(this));
        }),
        this.addEventListener(
          "keyup",
          this.onKeyUpCountrySwitcherHandler.bind(this)
        );
    }
    toggleCountrySwitcher(t) {
      this.sub_elms.country_btn.focus(), this.toggleCountryList();
    }
    hideCountryListPanel() {
      this.sub_elms.country_btn.setAttribute("aria-expanded", "false"),
        this.sub_elms.country_list.setAttribute("hidden", !0);
    }
    toggleCountryList() {
      this.sub_elms.country_btn.focus(),
        this.sub_elms.country_list.toggleAttribute("hidden"),
        this.sub_elms.country_btn.setAttribute(
          "aria-expanded",
          (
            "false" === this.sub_elms.country_btn.getAttribute("aria-expanded")
          ).toString()
        );
    }
    onKeyUpCountrySwitcherHandler(t) {
      void 0 !== t.code &&
        "ESCAPE" === t.code.toUpperCase() &&
        (this.sub_elms.country_btn.focus(), this.hideCountryListPanel());
    }
    onLinkItemClickHandler(t) {
      t.preventDefault(),
        (this.sub_elms.country_code_field.value =
          t.currentTarget.dataset.value);
      t = this.sub_elms.country_form.querySelector('[name="return_to"]');
      t && (t.value = window.location.pathname),
        this.sub_elms.country_form.submit();
    }
  }
  customElements.define("sht-country-switcher", a);
}
