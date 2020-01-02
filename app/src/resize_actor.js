import ResizeObserver from 'resize-observer-polyfill';
import { throttle } from './helpers';

export default class ResizeActor {

    constructor (app) {
        this.app = app;
        this.observer = null;
    }

    start () {
        if (this.observer) return;
        const { wh_base, size_mod, font_size, icon_size } = this.app.options;

        const callback = throttle(
            200, false,
            () => {
                const [ width, height ] = this.computeSize();
                const max_height = wh_base[1] * size_mod;
                const modifier = height / max_height;
                this.app.resized({
                    width,
                    height,
                    modifier,
                    font: modifier * font_size,
                    icon: modifier * icon_size,
                });
            }
        );

        this.observer = new ResizeObserver(callback);
        this.observer.observe(this.app.root);
        callback();
    }

    computeSize () {
        const [w, h] = [
            this.app.root.clientWidth,
            this.app.root.clientHeight
        ];
        const { wh_base, size_mod } = this.app.options;

        const [mw, mh] = wh_base.map(v => v * size_mod);
        if (w > mw && h > mh) {
            return [mw, mh];

        } else {
            const wh_ratio = wh_base[0] / wh_base[1];
            let new_w = w, new_h = w / wh_ratio;
            if (new_h > h) {
                new_h = h;
                new_w = h * wh_ratio;
            }
            return [
                Math.round(new_w),
                Math.round(new_h)
            ];

        }
    }

}
