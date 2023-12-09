if (!customElements.get("sht-password-modal")) {
  class a extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.$$ = this.querySelectorAll.bind(this)),
        (this.elms = {
          detailsElm: this.$("details"),
          summaryElm: this.$("summary"),
          modalElm: this.$(".js-modal"),
        }),
        (this.onBodyClickEventHandle = null),
        this.bindEventHandlers(),
        this.elms.summaryElm.setAttribute("role", "button"),
        this.$('input[aria-invalid="true"]') &&
          this.open({ target: this.$("details") });
    }
    bindEventHandlers() {
      this.elms.detailsElm.addEventListener(
        "keyup",
        (t) => "ESCAPE" === t.code.toUpperCase() && this.close()
      ),
        this.elms.summaryElm.addEventListener(
          "click",
          this.onSummaryClickHandle.bind(this)
        ),
        (this.closeBtn = this.$$(".js-modal-btn-close")),
        this.closeBtn.forEach((t) => {
          t.addEventListener("click", (t) => {
            this.close();
          });
        }),
        this.addEventListener("click", (t) => {
          t.target.classList.contains("js-password-modal-content") &&
            this.close();
        });
    }
    isOpen() {
      return this.elms.detailsElm.hasAttribute("open");
    }
    onSummaryClickHandle(t) {
      t.preventDefault(),
        t.target.closest("details").hasAttribute("open")
          ? this.close()
          : this.open(t);
    }
    onBodyClickHandle(t) {
      this.contains(t.target) || this.close();
    }
    open(t) {
      (this.onBodyClickEventHandle =
        this.onBodyClickEventHandle || this.onBodyClickHandle.bind(this)),
        t.target.closest("details").setAttribute("open", !0),
        document.body.addEventListener("click", this.onBodyClickEventHandle),
        document.body.classList.add("o-hidden"),
        setTimeout(() => {
          SHTHelper.trapFocus(this.elms.modalElm, this.$("#mainPasswordInput"));
        }, 50);
    }
    close() {
      this.elms.summaryElm.focus(),
        this.elms.detailsElm.removeAttribute("open"),
        document.body.removeEventListener("click", this.onBodyClickEventHandle),
        document.body.classList.remove("o-hidden"),
        SHTHelper.removeTrapFocus();
    }
  }
  customElements.define("sht-password-modal", a);
}
