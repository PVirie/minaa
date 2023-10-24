const mountain_ranges = [
    `
    <svg viewBox="0 300 500 200" width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <path style="" d="M 0 500 C 0 500 127.211 360.554 128.607 360.554 C 129.834 360.554 142.638 374.292 144.949 374.292 C 147.571 374.292 228.101 300 235.505 300 C 242.855 300 381.61 428.785 383.349 428.785 C 384.909 428.785 401.065 408.006 402.669 408.006 C 404.209 408.006 500 500 500 500"/>
    </svg>
    `,
    `
    <svg viewBox="0 0 500 200" width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <path style="" d="M 0 200 C 0 200 69.745 137.19 112.297 100 C 148.732 68.157 228.101 0 235.505 0 C 242.855 0 283.51 33.468 285.18 33.954 C 287.014 34.487 297.357 25.47 300 25.47 C 302.842 25.47 322.891 44.029 342.129 61.703 C 368.505 85.935 484.876 184.876 500 200"/>
    </svg>
    `,
];

const fill_mountain_range = function (plane, left_position_percent = 50) {
    plane.innerHTML = mountain_ranges[util.rand_int(0, mountain_ranges.length - 1)];

    // transform svg to fit the container, plane
    const svg = plane.querySelector("svg");

    // container width and height
    const width = plane.clientWidth;
    const height = plane.clientHeight;

    // svg width and height
    const svg_width = svg.getAttribute("width");
    const svg_height = svg.getAttribute("height");

    // scale svg to fit container
    const scale = height / svg_height;
    svg.setAttribute("width", svg_width * scale);
    svg.setAttribute("height", svg_height * scale);

    svg.style.left = `${left_position_percent}%`;

    // add class to inner path
    const range = plane.querySelector("path");

    // random fill class
    const all_classes = ["mountain", "mountain-2"];
    range.classList.add(all_classes[util.rand_int(0, all_classes.length - 1)]);
};
