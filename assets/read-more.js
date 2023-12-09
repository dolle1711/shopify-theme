if (!customElements.get("sht-read-more")) {
  class a extends HTMLElement {
    constructor() {
      super(),
        (this.$ = this.querySelector.bind(this)),
        (this.text = this.textContent),
        (this.modifiedText = ""),
        (this.properties = JSON.parse(this.dataset.readMoreProperties));
    }
    bindEventHandlers() {
      var e;
      this.properties.isEnabled &&
        (e = this.$(".js-read-more-btn")) &&
        e.addEventListener(
          "click",
          function (e) {
            e.preventDefault(),
              (this.innerHTML = this.text),
              this.classList.add("read-more--open"),
              this.classList.remove("read-more--close");
          }.bind(this)
        );
    }
    connectedCallback() {
      this.properties.isEnabled &&
        (this.limitWords(),
        (this.innerHTML = this.modifiedText),
        this.bindEventHandlers()),
        this.toggleAttribute("hidden", !1);
    }
    limitWords() {
      let t = this.text.replace(/<[^>]*>/g, " ").trim(),
        s = t.match(/\S+/g);
      var e = ` <button type="button" class="js-read-more-btn read-more btn btn-link">${this.properties.readMoreText}</button>`;
      if (s && s.length > this.properties.wordLimit) {
        t = t.split(/\s+/, this.properties.wordLimit);
        var i = this.text.replace(/></g, "> <").split(/\s+/);
        s = [];
        for (let e = 0; e < i.length && t.length; e++) {
          var r = i[e],
            a = r
              .replace(/<[^>]*>/g, "")
              .replace(/^[^>]*>/g, "")
              .replace(/<[^>]*$/g, "");
          (0 !== t.indexOf(a) && 0 !== t.indexOf(a.replace(/\W+/g, ""))) ||
            t.splice(0, 1),
            s.push(r);
        }
        var o = (s =
          s.join(" ").replace(/ >/g, ">").replace(/< /g, "<") + "...").match(
          /<[^>]*>/g
        );
        if (o) {
          let i = [];
          o.forEach((t) => {
            if (!t.match(/\/>$/)) {
              let e = t.match(/^<([a-zA-Z0-9\-_]+)/);
              return e
                ? i.push(e[1].toLowerCase())
                : (e = t.match(/^<\/([a-zA-Z0-9\-_]+)>/)) &&
                  e[1].toLowerCase() === i[i.length - 1]
                ? i.pop()
                : void 0;
            }
          }),
            i.length &&
              i.reverse().forEach((e) => {
                s += `</${e}>`;
              });
        }
        this.classList.add("read-more--close"), (this.modifiedText = s + e);
      } else this.modifiedText = this.text;
    }
  }
  customElements.define("sht-read-more", a);
}
