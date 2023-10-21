class Equation {
    constructor(parent, x, y, width, height) {
        this._id = Date.now();
        this._parent = parent;

        const group = document.createElement("div");
        group.classList.add("equation-container");

        const content_2 = document.createElement("div");
        content_2.classList.add("math");
        katex.render("f = k p^+ a_T a_M", content_2, {
            throwOnError: false,
            display: false,
        });
        group.appendChild(content_2);

        const content_0 = document.createElement("div");
        content_0.classList.add("math");
        katex.render("\\frac{d L_M}{d t} = f(t) - \\lambda L_M ", content_0, {
            throwOnError: false,
            display: false,
        });
        group.appendChild(content_0);

        const content_1 = document.createElement("div");
        content_1.classList.add("math");
        katex.render("L_M = \\int_0^t e^{-\\lambda(t - t')}  f(t') \\, d t' ", content_1, {
            throwOnError: false,
            display: false,
        });
        group.appendChild(content_1);

        parent.appendChild(group);
    }
}
