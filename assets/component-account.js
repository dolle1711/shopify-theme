class SHTAccountAddresses {
  constructor() {
    (this.toggle_address_btn = SHTHelper.qsa(
      ".js-account-address-toggle-address-btn"
    )),
      (this.cancel_address_btn = SHTHelper.qsa(
        ".js-account-address-cancel-address-btn"
      )),
      (this.delete_address_btn = SHTHelper.qsa(
        ".js-account-address-delete-address-btn"
      )),
      (this.country_select_element = SHTHelper.qsa(
        ".js-account-address-country-select"
      )),
      this.setupEventListeners(),
      this.setupCountries();
  }
  setupEventListeners() {
    this.toggle_address_btn.forEach((e) => {
      e.addEventListener("click", this.handleAddEditButtonClick.bind(this));
    }),
      this.cancel_address_btn.forEach((e) => {
        e.addEventListener("click", this.handleCancelButtonClick.bind(this));
      }),
      this.delete_address_btn.forEach((e) => {
        e.addEventListener("click", this.handleDeleteButtonClick.bind(this));
      });
  }
  setupCountries() {
    Shopify &&
      Shopify.CountryProvinceSelector &&
      (new Shopify.CountryProvinceSelector(
        "addressCountryNew",
        "addressProvinceNew",
        { hideElement: "addressProvinceContainerNew" }
      ),
      this.country_select_element.forEach((e) => {
        e = e.dataset.formId;
        new Shopify.CountryProvinceSelector(
          "addressCountry_" + e,
          "addressProvince_" + e,
          { hideElement: "addressProvinceContainer_" + e }
        );
      }));
  }
  handleDeleteButtonClick(e) {
    e.preventDefault(),
      confirm(e.currentTarget.getAttribute("data-confirm-message")) &&
        Shopify.postLink(e.currentTarget.dataset.target, {
          parameters: { _method: "delete" },
        });
  }
  handleCancelButtonClick(e) {
    e = SHTHelper.qs(
      "#editFormButton_" + e.currentTarget.getAttribute("data-address-id")
    );
    e && this.toggleForm(e);
  }
  handleAddEditButtonClick(e) {
    e.preventDefault(), this.toggleForm(e.currentTarget);
  }
  toggleForm(e) {
    e.setAttribute(
      "aria-expanded",
      ("false" === e.getAttribute("aria-expanded")).toString()
    );
    e = SHTHelper.qs("#" + e.getAttribute("data-address-id"));
    e && e.classList.toggle("d-none");
  }
}
void 0 !== SHTAccountAddresses && new SHTAccountAddresses();
