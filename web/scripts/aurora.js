class Aurora {
    constructor(parent) {
        this._id = Date.now();
        this._parent = parent;

        const group = document.createElement("div");
        group.classList.add("aurora-container");

        for (let i = 0; i < 100; i++) {
            const aurora = document.createElement("div");
            aurora.classList.add("aurora");

            let state = 0;
            const at = function () {
                if (state === 0) {
                    if (Math.random() > 0.5) {
                        state = 1;
                        aurora.style.setProperty("left", Math.random() * 2 + i + "%");
                        aurora.style.setProperty("bottom", Math.random() * 20 + 20 + "%");
                        aurora.style.setProperty("height", Math.random() * 40 + 20 + "%");
                        aurora.style.setProperty("width", Math.random() * 40 + 20 + "px");
                    }
                    setTimeout(at, Math.random() * 500 + 500);
                } else if (state === 1) {
                    if (Math.random() > 0.5) {
                        state = 0;
                        aurora.style.setProperty("width", "0");
                        setTimeout(at, 1000);
                    } else {
                        if (Math.random() > 0.5) {
                            aurora.classList.toggle("alt");
                        }
                        aurora.style.setProperty("bottom", Math.random() * 20 + 20 + "%");
                        aurora.style.setProperty("height", Math.random() * 40 + 20 + "%");
                        aurora.style.setProperty("width", Math.random() * 40 + 20 + "px");
                        setTimeout(at, Math.random() * 500 + 500);
                    }
                }
            };
            at();

            group.appendChild(aurora);
        }

        parent.appendChild(group);
    }
}
