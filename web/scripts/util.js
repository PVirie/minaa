class Exp_average {
    constructor(start = 0.0, alpha = 0.1) {
        this.pivot = start;
        this.value = start;
        this.alpha = alpha;
    }

    filter(value) {
        if (value != null) this.value = this.alpha * value + (1 - this.alpha) * this.value;
        return this.value - this.pivot;
    }
}

util = (function () {
    const util_obj = {};

    util_obj.add = function (a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    };

    util_obj.sub = function (a, b) {
        return [a[0] - b[0], a[1] - b[1]];
    };

    util_obj.scalar_mul = function (a, s) {
        return [a[0] * s, a[1] * s];
    };

    util_obj.scalar_div = function (a, s) {
        return [a[0] / s, a[1] / s];
    };

    util_obj.sqr_dist = function (a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    };

    util_obj.dist = function (p1, p2) {
        return Math.sqrt(util_obj.sqr_dist(p1, p2));
    };

    util_obj.center = function (p1, p2) {
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    };

    util_obj.compute_scale_to = function (from, to) {
        return (to * 1.0) / from;
    };

    util_obj.dot = function (a, b) {
        return a[0] * b[0] + a[1] * b[1];
    };

    util_obj.clip = function (x, mn, mx) {
        if (x < mn) return mn;
        else if (x > mx) return mx;
        else return x;
    };

    util_obj.tolerant = function (x, tol = 0.5) {
        if (x > tol) return x;
        if (x < -tol) return x;
        return 0;
    };

    util_obj.compute_orientation = function (x, y, z) {
        // left hand system
        const r2d = 180 / Math.PI;
        const ox = Math.atan2(y, z) * r2d;
        const oy = -Math.atan2(x, z) * r2d;
        const oz = -Math.atan2(x, y) * r2d;
        return [ox, oy, oz];
    };

    util_obj.normalize = function (o) {
        while (o > 180) o -= 360;
        while (o < -180) o += 360;
        return o;
    };

    util_obj.transform = function (t, p) {
        const x = p[0];
        const y = p[1];
        return [t.a * x + t.b * y + t.e, t.c * x + t.d * y + t.f];
    };

    util_obj.inv_transform = function (t, p) {
        const x = p[0] - t.e;
        const y = p[1] - t.f;
        const det = t.a * t.d - t.b * t.c;
        return [(t.d * x - t.b * y) / det, (-t.c * x + t.a * y) / det];
    };

    util_obj.build_div_dom = function (text) {
        const root = document.createElement("div");
        const content = document.createTextNode(text);
        root.appendChild(content);
        return root;
    };

    util_obj.build_svg_dom = function (spec, flip = false) {
        const svgns = "http://www.w3.org/2000/svg";
        const root = document.createElementNS(svgns, "svg");
        root.setAttribute("width", spec.width);
        root.setAttribute("height", spec.height);
        root.setAttribute("viewBox", spec.offsetX - spec.width / 2 + " " + (spec.offsetY - spec.height / 2) + " " + spec.width + " " + spec.height);
        if (flip) root.style.transform = "scaleX(-1)";
        const path = document.createElementNS(svgns, "path");
        path.setAttribute("d", spec.data);
        root.appendChild(path);
        return root;
    };

    util_obj.set_svg_dom = function (root, spec, flip = false) {
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        const svgns = "http://www.w3.org/2000/svg";
        root.setAttribute("width", spec.width);
        root.setAttribute("height", spec.height);
        root.setAttribute("viewBox", spec.offsetX - spec.width / 2 + " " + (spec.offsetY - spec.height / 2) + " " + spec.width + " " + spec.height);
        if (flip) root.style.transform = "scaleX(-1)";
        const path = document.createElementNS(svgns, "path");
        path.setAttribute("d", spec.data);
        root.appendChild(path);
        return root;
    };

    util_obj.rand_int = function (min, max) {
        // inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return util_obj;
})();
