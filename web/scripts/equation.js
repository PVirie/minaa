class Equation {
    constructor(parent, x, y, width, height) {
        this._id = Date.now();
        this._parent = parent;

        this.group = parent.group();

        const container = this.group.foreignObject(width, height).move(x, y).addClass("equation-container");

        const content = document.createElement("div");
        content.classList.add("math");
        katex.render("c = \\pm\\sqrt{a^2 + b^2}", content, {
            throwOnError: false,
        });
        container.add(SVG(content));
    }
}
