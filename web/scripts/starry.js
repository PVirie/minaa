const create_star_plane = function (star_size) {
    const plane = document.createElement("div");
    plane.classList.add("star-container");

    star_size = star_size * 0.5 + 1;
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        star.style.setProperty("left", Math.random() * 100 + "%");
        star.style.setProperty("top", Math.random() * 100 + "%");
        star.style.setProperty("width", star_size + "px");
        star.style.setProperty("height", star_size + "px");

        plane.appendChild(star);
    }

    return plane;
};
