const fill_rosen_field = function (plane, layer) {
    // container width and height
    const width = plane.clientWidth;
    const height = plane.clientHeight;

    const templates = ["rose1", "rose2", "rose3", "rose4", "rose5", "rose6", "rose7"];
    const total = width / 100 / (layer + 1);
    for (let i = 0; i < total; i++) {
        const rose = document.createElement("img");
        rose.src = `../resources/${templates[util.rand_int(0, templates.length - 1)]}.svg`;

        rose.style.setProperty("transform", `translateY(${(Math.random() - 0.5) * 20 + 50}%)`);
        rose.style.setProperty("left", i * (100 / total) + "%");
        rose.style.setProperty("height", Math.random() * 20 + 80 * (layer * 0.5 + 1) + "%");

        plane.appendChild(rose);
    }
};
