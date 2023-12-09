if (!customElements.get("sht-language-switcher")) {
  class a extends SHTCustomComponent {
    constructor() {
      super(),
        (this.subElms = {
          language_code_field: this.$(
            ".js-language-switcher-language-code-field"
          ),
          language_btn: this.$(".js-language-switcher-btn"),
          language_list: this.$(".js-language-switcher-language-list"),
          language_link_items: this.$$(
            ".js-language-switcher-language-item-link"
          ),
          language_form: this.$(".js-language-switcher-form"),
        }),
        this.subElms.language_btn.addEventListener(
          "click",
          this.toggleLanguageSwitcher.bind(this, { toggle: !0 })
        ),
        this.subElms.language_btn.addEventListener(
          "focusout",
          this.toggleLanguageSwitcher.bind(this, { toggle: !1 })
        ),
        this.subElms.language_link_items.forEach((e) => {
          e.addEventListener("click", this.onLinkItemClickHandler.bind(this));
        }),
        this.addEventListener(
          "keyup",
          this.onKeyUpLanguageSwitcherHandler.bind(this)
        );
    }
    toggleLanguageSwitcher(e, t) {
      e.toggle
        ? (this.subElms.language_btn.focus(), this.toggleLanguageList(!0))
        : this.contains(t.relatedTarget) || this.toggleLanguageList(!1);
    }
    toggleLanguageList(e) {
      e
        ? (this.subElms.language_list.toggleAttribute("hidden"),
          this.subElms.language_btn.setAttribute("aria-expanded", "true"))
        : (this.subElms.language_list.setAttribute("hidden", !0),
          this.subElms.language_btn.setAttribute("aria-expanded", "false"));
    }
    onKeyUpLanguageSwitcherHandler(e) {
      void 0 !== e.code &&
        "ESCAPE" === e.code.toUpperCase() &&
        (this.subElms.language_btn.focus(), this.toggleLanguageList(!1));
    }
    onLinkItemClickHandler(e) {
      e.preventDefault(),
        (this.subElms.language_code_field.value =
          e.currentTarget.dataset.value);
      e = this.subElms.language_form.querySelector('[name="return_to"]');
      e && (e.value = window.location.pathname),
        this.subElms.language_form.submit();
    }
  }
  customElements.define("sht-language-switcher", a);
}
