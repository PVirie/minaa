(function () {
    const container = document.querySelector("#container");

    const star_layers = [];
    const mountain_layers = [];
    const field_layers = [];

    const scroll_update = function (my) {
        // set background color, at zenith my = 0.0 #000005, at ground my = 1.0 #102a85, else clip
        container.style.setProperty("background-color", `rgb(${my * 16}, ${my * 45}, ${(1 - my) * 5 + my * 133})`);

        // parallax star layers
        for (let i = 0; i < star_layers.length; i++) {
            star_layers[i].style.setProperty("transform", `translateY(${-my * (i + 1) * 200 * (1 + my) * (1 + my)}px)`);
        }

        // parallax mountain layers
        for (let i = 0; i < mountain_layers.length; i++) {
            mountain_layers[i].style.setProperty("transform", `translateY(${(1 - my) * (i * 0.5 + 1) * 4000}px)`);
        }

        // parallax field layers
        for (let i = 0; i < field_layers.length; i++) {
            field_layers[i].style.setProperty("transform", `translateY(${(1 - my) * (i * 0.5 + 1) * 5000}px)`);
        }
    };

    // add on scroll handler
    window.addEventListener("scroll", function () {
        // reverse my to height - scroll position
        let my = document.documentElement.scrollTop;
        // scale to the range 0.0 to 1.0
        my = my / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        my = util.clip(my, 0, 1.0);
        scroll_update(my);
    });

    window.addEventListener("load", async function () {
        for (const dom of document.querySelectorAll("#aurora")) {
            const aurora = new Aurora(dom);
        }

        for (let i = 0; i < 6; i++) {
            const starry = create_star_plane(i);
            star_layers.push(starry);
            container.appendChild(starry);
        }

        const peak = [25, 85, 50];
        for (let i = 0; i < peak.length; i++) {
            const mountain_range = document.createElement("div");
            mountain_range.classList.add("mountain-container");
            mountain_layers.push(mountain_range);
            container.appendChild(mountain_range);

            // get current style height
            const style = window.getComputedStyle(mountain_range);
            let height = parseInt(style.getPropertyValue("height"));
            // reduce the height for consecutive mountain ranges
            height = height * (1 - i * 0.2);
            mountain_range.style.setProperty("height", `${height}px`);

            fill_mountain_range(mountain_range, peak[i]);
        }

        const count_field = 3;
        for (let i = 0; i < count_field; i++) {
            const field = document.createElement("div");
            field.classList.add("rose-container");
            field_layers.push(field);
            container.appendChild(field);

            // get current style height
            const style = window.getComputedStyle(field);
            let height = parseInt(style.getPropertyValue("height"));
            let bottom = height * (count_field - i - 1) * 0.5;
            field.style.setProperty("bottom", `${bottom}px`);

            fill_rosen_field(field, i);
        }

        renderMathInElement(document.body, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true },
            ],
            throwOnError: true,
        });

        for (const dom of document.querySelectorAll(".katex span")) {
            dom.classList.add("tao");
        }
    });
})();
