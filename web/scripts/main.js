(function () {
    const container = document.querySelector("#container");

    const scroll_update = function (my) {
        // set background color, at ground my = 0 #102a85, at zenith my = 2000 #000005, else clip
        my = util.clip(my / 2000, 0, 1.0);
        container.style.setProperty("background-color", `rgb(${(1 - my) * 16}, ${(1 - my) * 45}, ${my * 5 + (1 - my) * 133})`);
    };

    window.addEventListener("load", async function () {
        for (const dom of document.querySelectorAll("#aurora")) {
            const aurora = new Aurora(dom);
        }

        for (const dom of document.querySelectorAll("#contract")) {
            const contract = new Contract(dom);
        }

        for (const dom of document.querySelectorAll("#equation")) {
            const equation = new Equation(dom);
        }

        // add on scroll handler
        window.addEventListener("scroll", function () {
            // reverse my to height - scroll position
            const my = document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop;
            scroll_update(my);
            console.log(my);
        });
    });
})();
