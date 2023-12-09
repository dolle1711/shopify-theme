if (!customElements.get("sht-predictive-srch")) {
  class a extends SHTCustomComponent {
    constructor() {
      super(),
        (this.cachedRequests = new Map()),
        (this.resultsPanelMaxHeight = 0),
        (this.elms = {
          predictive_search_form: this.$(".js-predictive-search-form"),
          predictive_search_input: this.$(".js-predictive-search-input"),
          predictive_search_results: this.$(".js-predictive-search-results"),
          predictive_search_result_panel: this.$(
            ".js-predictive-search-results-panel"
          ),
          predictive_search_message_placeholder: this.$(
            ".js-predictive-search-message-placeholder"
          ),
          predictive_search_loading: this.$(".js-predictive-search-loading"),
          predictive_close_button: this.$(
            ".js-predictive-search-close-trigger"
          ),
          header: this.closest("sht-header"),
          header_search_open_trigger: this.closest("sht-header")?.querySelector(
            ".js-search-open-trigger"
          ),
          body: document.body,
        }),
        (this.url = {
          searchUrl: routes.predictive_search_url,
          queryParameters: {
            section_id: "sht-predictive-srch",
            resources: {
              type: this.getAttribute("data-search-type") || "product",
              limit: 10,
              options: { unavailable_products: "last", fields: "" },
            },
          },
        }),
        (this.shopifyFeaturesJson = JSON.parse(
          SHTHelper.qs('#shopify-features[type="application/json"]').textContent
        )),
        (this.code = ""),
        this.bindEventHandlers();
    }
    bindEventHandlers() {
      this.elms.predictive_search_form.addEventListener(
        "submit",
        this.onSubmitHandle.bind(this)
      ),
        this.elms.predictive_search_input.addEventListener(
          "input",
          SHTHelper.debounce((e) => {
            this.onInputHandle(e);
          }, 300).bind(this)
        ),
        this.elms.predictive_search_input.addEventListener(
          "focus",
          this.onInputFocusHandle.bind(this)
        ),
        this.addEventListener("focusout", this.onFocusOutHandle.bind(this)),
        this.elms.predictive_close_button.addEventListener(
          "click",
          this.closeSearchResults.bind(this)
        ),
        this.addEventListener("keyup", (e) => {
          (this.code = e.code.toUpperCase()),
            "ESCAPE" === e.code.toUpperCase() && this.closeSearchResults();
        });
    }
    onSubmitHandle(e) {
      this.getSearchTerm() || e.preventDefault();
    }
    onInputFocusHandle(e) {
      var t = this.getSearchTerm();
      this.openSearchResults(t);
    }
    getSearchTerm() {
      return this.elms.predictive_search_input.value.trim();
    }
    openSearchResults(e) {
      e.length
        ? this.togglePlaceHolderMessage(!1)
        : (this.resetSearchResultPanel(),
          this.togglePlaceHolderMessage(!0),
          this.toggleLoading(!1),
          this.toggleLoadingContainer(!1),
          this.toggleResults(!1)),
        this.toggleOpen(!0),
        this.toggleSearchResults(!0),
        this.elms.predictive_search_input.setAttribute("aria-expanded", !0);
    }
    resetSearchResultPanel() {
      this.elms.predictive_search_result_panel.innerHTML = "";
    }
    toggleResults(e) {
      e
        ? (this.setAttribute("results", !0),
          setTimeout(
            function () {
              this.classList.add("is-result-show");
            }.bind(this),
            300
          ))
        : (this.removeAttribute("results"),
          this.classList.remove("is-result-show"));
    }
    toggleOpen(e) {
      e
        ? (this.setAttribute("open", !0),
          this.elms.header.classList.add("header--predictive-search-open"),
          this.elms.body.classList.add("o-hidden"))
        : (this.removeAttribute("open"),
          this.elms.header.classList.remove("header--predictive-search-open"),
          this.elms.body.classList.remove("o-hidden"));
    }
    async onInputHandle(e) {
      var t;
      this.shopifyFeaturesJson.predictiveSearch &&
        "ESCAPE" !== this.code &&
        ((t = this.getSearchTerm()),
        this.openSearchResults(t),
        this.resetSearchResultPanel(),
        t.length) &&
        ((t = await this.getSearchResults(t)), this.renderSearchResultPanel(t));
    }
    renderSearchResultPanel(e) {
      (this.elms.predictive_search_result_panel.innerHTML = e),
        this.toggleResults(!0),
        this.toggleLoading(!1),
        this.toggleLoadingContainer(!1),
        SHTHelper.trapFocus(this);
    }
    async getSearchResults(e) {
      var t = e.replace(/\s/g, "-").toLowerCase(),
        s = this.cachedRequests.get(t);
      return (
        s ||
        ((s = await this.fetchResults(e)), this.cachedRequests.set(t, s), s)
      );
    }
    onSubmitHandle(e) {
      this.getSearchTerm() || e.preventDefault();
    }
    async fetchResults(e) {
      (e = `${this.url.searchUrl}?q=${encodeURIComponent(e)}&resources[type]=${
        this.url.queryParameters.resources.type
      }&section_id=predictive-search`),
        this.toggleLoading(!0),
        this.toggleLoadingContainer(!0),
        (e = await fetch(e)
          .then((e) => {
            if (e.ok) return e.text();
            throw ((e = new Error(e.status)), this.closeSearchResults(), e);
          })
          .then((e) => {
            return (
              this.toggleLoading(!1),
              this.toggleLoadingContainer(!1),
              new DOMParser()
                .parseFromString(e, "text/html")
                .querySelector("#shopify-section-predictive-search").innerHTML
            );
          })
          .catch((e) => (this.closeSearchResults(), console.error(e), "")));
      return e;
    }
    toggleSearchResults(e) {
      (e = this.shopifyFeaturesJson.predictiveSearch ? e : !1)
        ? this.elms.predictive_search_results.toggleAttribute("hidden", !1)
        : this.elms.predictive_search_results.setAttribute("hidden", !0);
    }
    toggleLoading(e) {
      e
        ? this.elms.predictive_search_loading.toggleAttribute("hidden", !1)
        : this.elms.predictive_search_loading.setAttribute("hidden", !0);
    }
    togglePlaceHolderMessage(e) {
      e
        ? this.elms.predictive_search_message_placeholder.toggleAttribute(
            "hidden",
            !1
          )
        : this.elms.predictive_search_message_placeholder.setAttribute(
            "hidden",
            !0
          );
    }
    onFocusOutHandle(e) {
      this.getSearchTerm();
      setTimeout(() => {
        this.contains(document.activeElement) || this.closeSearchResults(!0);
      });
    }
    toggleLoadingContainer(e) {
      e ? this.setAttribute("loading", !0) : this.removeAttribute("loading");
    }
    closeSearchResults(e = !1) {
      this.toggleOpen(!1),
        this.toggleLoading(!1),
        this.toggleLoadingContainer(!1),
        this.togglePlaceHolderMessage(!1),
        this.toggleResults(!1),
        this.resetSearchResultPanel(),
        this.toggleSearchResults(!1),
        this.elms.header_search_open_trigger &&
          !e &&
          SHTHelper.removeTrapFocus(this.elms.header_search_open_trigger),
        (this.resultsPanelMaxHeight = 0),
        this.elms.predictive_search_result_panel.removeAttribute("style"),
        (this.elms.predictive_search_input.value = ""),
        this.elms.predictive_search_input.setAttribute("aria-expanded", !1);
    }
    calculateResultsPanelMaxHeight() {
      return (
        (this.resultsPanelMaxHeight =
          window.innerHeight -
          SHTHelper.qid("shopify-section-header").getBoundingClientRect()
            .bottom),
        this.resultsPanelMaxHeight
      );
    }
  }
  customElements.define("sht-predictive-srch", a);
}
