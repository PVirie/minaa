screen = (function () {
    let stage;
    let work_group;
    let image = null;

    let long_hold_time = 350;
    let long_close_flag = false;
    let long_close_handle = null;
    let long_click_flag = false;
    let long_click_handle = null;

    const image_working_size = 960;
    let work_image_scale = 1.0;
    let ps = 1.0;
    let ox, oy;

    let pointer, grid_x, grid_y;
    let count_moved = 0,
        c_x,
        c_y;
    let pin_x, pin_y, tpx, tpy, pin_s, ts;
    let pap,
        has_moved = true;

    let working_region = null;
    let regions = [];

    const move_pointer = function (px, py) {
        pointer.style.left = px + "%";
        pointer.style.top = py + "%";
        grid_x.style.top = py + "%";
        grid_y.style.left = px + "%";
        has_moved = true;
    };

    const resolve_pointer = function () {
        if (has_moved) {
            const bbox = document.querySelector("#stage-parent").getBoundingClientRect();
            const pointer_bbox = document.querySelector("#pointer>div").getBoundingClientRect();
            const pointer_x = pointer_bbox.left + pointer_bbox.width / 2 - bbox.left;
            const pointer_y = pointer_bbox.top + pointer_bbox.height / 2 - bbox.top;
            pap = [pointer_x, pointer_y];
            has_moved = false;
        }

        const wg_t = work_group.transform();
        const pp = util.inv_transform(wg_t, pap);
        return pp;
    };

    const fitStageIntoParentContainer = function () {
        // now we need to fit stage into parent container
        if (image == null) return;

        const bbox = document.querySelector("#stage-parent").getBoundingClientRect();
        const containerWidth = bbox.width;
        const containerHeight = bbox.height;

        const ps_width = util.compute_scale_to(image_working_size, containerWidth);
        const ps_height = util.compute_scale_to((image_working_size * image.height()) / image.width(), containerHeight);
        if (ps_width < ps_height) {
            ps = ps_width;
            work_group.transform({ scale: ps, origin: { x: 0, y: 0 }, position: { x: 0, y: 0 } });
        } else {
            ps = ps_height;
            work_group.transform({ scale: ps, origin: { x: 0, y: 0 }, position: { x: (containerWidth - ps * image_working_size) / 2, y: 0 } });
        }

        ox = 0;
        oy = 0;
    };

    // adapt the stage on any window resize
    window.addEventListener("resize", fitStageIntoParentContainer);

    const pan = function (x, y) {
        // x \in [-1, 1]
        // y \in [-1, 1]
        const mx = ox + x * image_working_size;
        const my = oy + y * image_working_size;
        work_group.transform({ scale: ps, origin: { x: 0, y: 0 }, position: { x: mx, y: my } });
        if (working_region != null) {
            const pp = resolve_pointer();
            working_region.preview(pp);
        }
    };

    const zoom = function (dscale) {
        const pp = resolve_pointer();
        work_group.scale(dscale, dscale, pp[0], pp[1]);
        ox += pp[0] * ps * (1 - dscale);
        oy += pp[1] * ps * (1 - dscale);
        ps *= dscale;
    };

    const set_draggable = function () {
        const stage_parent = document.querySelector("#stage-parent");
        if (input.check_is_touch_device()) {
            stage_parent.addEventListener("touchstart", function (e) {
                if (e.touches.length > 1) {
                    const c = util.center([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]);
                    pin_x = c[0];
                    pin_y = c[1];
                    pin_s = util.dist([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]);
                } else {
                    pin_x = e.touches[0].clientX;
                    pin_y = e.touches[0].clientY;
                    pin_s = null;
                }

                const tp = work_group.transform();
                tpx = tp.translateX;
                tpy = tp.translateY;
                ts = ps;
                // e.preventDefault();
            });
            stage_parent.addEventListener("touchmove", function (e) {
                if (pin_x == null) return;

                if (e.touches.length > 1) {
                    const c = util.center([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]);
                    const dscale = util.dist([e.touches[0].clientX, e.touches[0].clientY], [e.touches[1].clientX, e.touches[1].clientY]) / pin_s;

                    work_group.transform({
                        scale: ts * dscale,
                        origin: { x: 0, y: 0 },
                        position: {
                            x: c[0] - pin_x + tpx + (pin_x - tpx) * (1 - dscale),
                            y: c[1] - pin_y + tpy + (pin_y - tpy) * (1 - dscale),
                        },
                    });
                    ps = ts * dscale;
                } else {
                    work_group.transform({
                        scale: ps,
                        origin: { x: 0, y: 0 },
                        position: { x: e.touches[0].clientX - pin_x + tpx, y: e.touches[0].clientY - pin_y + tpy },
                    });
                }

                if (working_region != null) {
                    const pp = resolve_pointer();
                    working_region.preview(pp);
                }
                e.preventDefault();
            });
            stage_parent.addEventListener("touchend", function (e) {
                pin_x = null;
                // e.preventDefault();
            });
        }
        {
            stage_parent.addEventListener("mousedown", function (e) {
                pin_x = e.clientX;
                pin_y = e.clientY;
                const tp = work_group.transform();
                tpx = tp.translateX;
                tpy = tp.translateY;
                e.preventDefault();
            });
            stage_parent.addEventListener("mousemove", function (e) {
                if (pin_x == null) return;
                work_group.transform({
                    scale: ps,
                    origin: { x: 0, y: 0 },
                    position: { x: e.clientX - pin_x + tpx, y: e.clientY - pin_y + tpy },
                });

                if (working_region != null) {
                    const pp = resolve_pointer();
                    working_region.preview(pp);
                }
                e.preventDefault();
            });
            stage_parent.addEventListener("mouseup", function (e) {
                pin_x = null;
                e.preventDefault();
            });
            stage_parent.addEventListener("wheel", function (e) {
                if (e.deltaY > 0) {
                    zoom(0.95);
                } else if (e.deltaY < 0) {
                    zoom(1.05);
                }
                e.preventDefault();
            });
        }
    };

    const set_pointer = function () {
        const stage_parent = document.querySelector("#stage-parent");
        const body = document.querySelector("body");
        if (input.check_is_touch_device()) {
            stage_parent.addEventListener("touchstart", function (e) {
                count_moved = 0;
                cx = (e.touches[0].clientX * 100) / stage_parent.clientWidth;
                cy = (e.touches[0].clientY * 100) / stage_parent.clientHeight;
                move_pointer(cx, cy);
                click_down();
                e.preventDefault();
            });
            stage_parent.addEventListener("touchmove", function (e) {
                count_moved += 1;
                cx = (e.touches[0].clientX * 100) / stage_parent.clientWidth;
                cy = (e.touches[0].clientY * 100) / stage_parent.clientHeight;
                move_pointer(cx, cy);
                e.preventDefault();
            });
            stage_parent.addEventListener("touchend", function (e) {
                const cex = (e.clientX * 100) / stage_parent.clientWidth;
                const cey = (e.clientY * 100) / stage_parent.clientHeight;
                const sqr_dist = util.sqr_dist([cx, cy], [cex, cey]);
                // touch is harder so I give more tolerance.
                if (count_moved < 20 || sqr_dist < 25.0) {
                    move_pointer(cx, cy);
                    click_up();
                } else {
                    click_cancel();
                }
                e.preventDefault();
            });
        }
        {
            stage_parent.addEventListener("mousedown", function (e) {
                count_moved = 0;
                cx = (e.clientX * 100) / stage_parent.clientWidth;
                cy = (e.clientY * 100) / stage_parent.clientHeight;
                click_down();
                e.preventDefault();
            });
            stage_parent.addEventListener("mousemove", function (e) {
                count_moved += 1;
                move_pointer((e.clientX * 100) / stage_parent.clientWidth, (e.clientY * 100) / stage_parent.clientHeight);
                if (working_region != null) {
                    const pp = resolve_pointer();
                    working_region.preview(pp);
                }
                e.preventDefault();
            });
            stage_parent.addEventListener("mouseup", function (e) {
                const cex = (e.clientX * 100) / stage_parent.clientWidth;
                const cey = (e.clientY * 100) / stage_parent.clientHeight;
                const sqr_dist = util.sqr_dist([cx, cy], [cex, cey]);
                if (count_moved < 5 || sqr_dist < 4.0) {
                    move_pointer(cex, cey);
                    click_up();
                } else {
                    click_cancel();
                }
            });
        }
    };

    const check_hit = function (force) {
        const pp = resolve_pointer();

        if (working_region != null && working_region._editing) {
            working_region.add(pp);
            return;
        }

        if (working_region != null) {
            working_region.highlight(false);
        }

        if (force) {
            // create new region
            category.fill_data(null);
            const Shape_class = category.get_shape();
            working_region = new Shape_class(work_group, function () {
                // on shape done
                category.hide(false);
            });
            working_region.add(pp);
            regions.push(working_region);
            hide_main_tool(true);
        } else {
            let region = null;
            for (const i in regions) {
                const r = regions[i];
                if (r.hit(pp)) {
                    region = r;
                    regions.push(regions.splice(i, 1)[0]);
                    break;
                }
            }

            if (region == null) {
                working_region = null;
                hide_main_tool(false);
            } else {
                working_region = region;
                working_region.highlight(true);
                category.fill_data(working_region.get_annotation());
                hide_main_tool(true);
            }
        }
    };

    const hide_main_tool = function (hide) {
        document.querySelector("#toolset-0").style.display = hide ? "none" : null;
        category.hide(!hide || (working_region != null && working_region._editing));
    };

    const on_annotated = function (completed) {
        if (working_region != null) {
            working_region.set_annotation(category.get_data(), completed);
            if (completed) {
                if (working_region._box_id == null) {
                    server.add_shape(working_region.compile(work_image_scale)).then(function (box_id) {
                        working_region.set_box_id(box_id);
                    });
                } else {
                    server.edit_shape(working_region._box_id, working_region.compile(work_image_scale));
                }
            }
        }
    };

    const new_image = function (img_meta) {
        cat = img_meta["category"];
        box_meta = img_meta["boxes"];
        const interface = img_meta["interface"];

        for (const i in regions) {
            regions[i].delete();
        }
        regions = [];

        category.build_category(cat);

        return new Promise(function (resolve, reject) {
            if (image != null) image.remove();
            image = work_group.image(img_meta["url"], function (event) {
                const w = event.target.naturalWidth;
                const h = event.target.naturalHeight;
                work_image_scale = util.compute_scale_to(w, image_working_size);

                for (const box_id in box_meta) {
                    const region = new Polygon_shape(work_group, function () {});
                    region.set_box_id(box_id);
                    region.decompile(box_meta[box_id], work_image_scale);
                    region.highlight(false);
                    regions.push(region);
                }

                // rescale group here
                image.scale(work_image_scale, work_image_scale, 0, 0);

                fitStageIntoParentContainer();
                resolve();
            });
            image.on("error", function (e) {
                reject();
            });
        });
    };

    const toggle_loader = function (flag) {
        if (flag) document.querySelector("#loader").classList.remove("hide");
        else document.querySelector("#loader").classList.add("hide");
    };

    const click_down = function () {
        if (long_click_handle != null) {
            clearTimeout(long_click_handle);
            document.querySelector("#click").classList.remove("held");
            long_click_handle = null;
        }
        document.querySelector("#click").classList.add("held");
        long_click_handle = setTimeout(function () {
            long_click_flag = true;
            long_click_handle = null;
        }, long_hold_time);
    };

    const click_up = function () {
        if (long_click_handle != null) {
            clearTimeout(long_click_handle);
            long_click_handle = null;
        }
        document.querySelector("#click").classList.remove("held");
        check_hit(long_click_flag);
        long_click_flag = false;
    };

    const click_cancel = function () {
        if (long_click_handle != null) {
            clearTimeout(long_click_handle);
            long_click_handle = null;
        }
        count_moved = 0;
        document.querySelector("#click").classList.remove("held");
    };

    const initialize = function () {
        pointer = document.querySelector("#pointer");
        grid_x = document.querySelector("#grid_x");
        grid_y = document.querySelector("#grid_y");
        stage = SVG().addTo("#stage-parent").size("100%", "100%");
        work_group = stage.group();

        fitStageIntoParentContainer();

        document.querySelector("#click").addEventListener("mousedown", function (e) {
            e.stopPropagation();
            click_down();
            e.preventDefault();
        });
        document.querySelector("#click").addEventListener("mouseup", function (e) {
            e.stopPropagation();
            click_up();
            e.preventDefault();
        });
        document.querySelector("#click").addEventListener("touchstart", function (e) {
            e.stopPropagation();
            click_down();
            e.preventDefault();
        });
        document.querySelector("#click").addEventListener("touchend", function (e) {
            e.stopPropagation();
            click_up();
            e.preventDefault();
        });

        document.querySelector("#zoom-in").addEventListener("click", function (e) {
            e.stopPropagation();
            zoom(1.1);
            e.preventDefault();
        });
        document.querySelector("#zoom-out").addEventListener("click", function (e) {
            e.stopPropagation();
            zoom(0.9);
            e.preventDefault();
        });
        document.querySelector("#back").addEventListener("click", function (e) {
            e.stopPropagation();
            toggle_loader(true);
            server
                .prev_image()
                .then(new_image)
                .then(function () {
                    toggle_loader(false);
                });
            e.preventDefault();
        });
        document.querySelector("#forward").addEventListener("click", function (e) {
            e.stopPropagation();
            toggle_loader(true);
            server
                .next_image()
                .then(new_image)
                .then(function () {
                    toggle_loader(false);
                });
            e.preventDefault();
        });
        document.querySelector("#redo").addEventListener("click", function (e) {
            e.stopPropagation();
            if (working_region != null) {
                working_region.redo();
            }
            e.preventDefault();
        });
        document.querySelector("#undo").addEventListener("click", function (e) {
            e.stopPropagation();
            if (working_region != null) {
                working_region.undo();
            }
            e.preventDefault();
        });

        document.querySelector("#close").addEventListener(input.check_is_touch_device() ? "touchstart" : "mousedown", function (e) {
            e.stopPropagation();
            if (long_close_handle != null) {
                clearTimeout(long_close_handle);
                document.querySelector("#close").classList.remove("held");
                long_close_handle = null;
            }
            document.querySelector("#close").classList.add("held");
            long_close_handle = setTimeout(function () {
                long_close_flag = true;
                long_close_handle = null;
            }, long_hold_time);
            e.preventDefault();
        });

        document.querySelector("#close").addEventListener(input.check_is_touch_device() ? "touchend" : "mouseup", function (e) {
            e.stopPropagation();
            if (long_close_handle != null) {
                clearTimeout(long_close_handle);
                long_close_handle = null;
            }
            document.querySelector("#close").classList.remove("held");
            if (working_region != null) {
                working_region.highlight(false);
                if (long_close_flag || working_region._editing) {
                    // destroy when hold or it's in edit mode to prevent wrong state
                    const temp_id = working_region._id;
                    server.delete_shape(working_region._box_id).then(function () {
                        for (const i in regions) {
                            if (regions[i]._id === temp_id) {
                                const deleted = regions.splice(i, 1);
                                deleted[0].delete();
                                break;
                            }
                        }
                    });
                    long_close_flag = false;
                }
                working_region = null;
                hide_main_tool(false);
            }
            e.preventDefault();
        });

        return new Promise(function (resolve, reject) {
            server
                .get_image()
                .then(new_image)
                .then(function () {
                    toggle_loader(false);
                    resolve();
                })
                .catch(function (error) {
                    server
                        .get_image(true)
                        .then(new_image)
                        .then(function () {
                            toggle_loader(false);
                            resolve();
                        })
                        .catch(function (error) {
                            reject();
                        });
                });
        });
    };

    return {
        initialize: initialize,
        get_stage: function () {
            return stage;
        },
        pan: pan,
        set_draggable: set_draggable,
        set_pointer: set_pointer,
        on_annotated: on_annotated,
    };
})();
