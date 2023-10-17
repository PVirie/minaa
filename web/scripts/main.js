(function () {
    let work_group;
    let ps = 1.0;
    let ox, oy;

    let stage = null;
    const image_working_size = 960;

    const fitStageIntoParentContainer = function () {
        // now we need to fit stage into parent container

        const bbox = document.querySelector("#stage-parent").getBoundingClientRect();
        const containerWidth = bbox.width;
        const containerHeight = bbox.height;

        const ps_width = util.compute_scale_to(image_working_size, containerWidth);
        ps = ps_width;
        work_group.transform({ scale: ps, origin: { x: 0, y: 0 }, position: { x: 0, y: 0 } });

        ox = 0;
        oy = 0;
    };

    const pan = function (x, y) {
        // x \in [-1, 1]
        // y \in [-1, 1]
        const mx = ox + x * image_working_size;
        const my = oy + y * image_working_size;
        work_group.transform({ scale: ps, origin: { x: 0, y: 0 }, position: { x: mx, y: my } });

        scroll_update(my);
    };

    const zoom = function (dscale) {
        const pp = resolve_pointer();
        work_group.scale(dscale, dscale, pp[0], pp[1]);
        ox += pp[0] * ps * (1 - dscale);
        oy += pp[1] * ps * (1 - dscale);
        ps *= dscale;
    };

    const get_translation = function () {
        const tp = work_group.transform();
        return [tp.translateX, tp.translateY];
    };

    const transform = function (dscale, origin, position) {
        work_group.transform({
            scale: ps * dscale,
            origin: origin,
            position: position,
        });
        ps = ps * dscale;

        scroll_update(position.y);
    };

    const scroll_update = function (my) {
        // set background color, at ground my = 0 #102a85, at zenith my = 2000 #000005, else clip
        my = util.clip(my / 2000, 0, 1.0);

        stage.style.setProperty("background-color", `rgb(${(1 - my) * 16}, ${(1 - my) * 45}, ${my * 5 + (1 - my) * 133})`);
    };

    // adapt the stage on any window resize
    window.addEventListener("resize", fitStageIntoParentContainer);

    window.addEventListener("load", async function () {
        stage = document.querySelector("#stage-parent");
        work_group = SVG().addTo("#stage-parent").size("100%", "100%").group();
        fitStageIntoParentContainer();

        const aurora = new Aurora(work_group, 0, -2000, 960, 480);
        const contract = new Contract(work_group, 0, -1000, 960, 480);

        await input.initialize(stage, pan, zoom, get_translation, transform);
    });
})();
