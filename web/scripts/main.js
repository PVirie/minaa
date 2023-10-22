(function () {
    const container = document.querySelector("#container");

    const star_layers = [];

    const scroll_update = function (my) {
        // set background color, at ground my = 1.0 #102a85, at zenith my = 0.0 #000005, else clip
        container.style.setProperty("background-color", `rgb(${my * 16}, ${my * 45}, ${(1 - my) * 5 + my * 133})`);

        // parallax star layers
        for (let i = 0; i < star_layers.length; i++) {
            star_layers[i].style.setProperty("transform", `translateY(${-my * (i + 1) * 200 * (1 + my) * (1 + my)}px)`);
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

        renderMathInElement(document.body, {
            // customised options
            // • auto-render specific keys, e.g.:
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true },
            ],
            // • rendering keys, e.g.:
            throwOnError: true,
        });
    });
})();
