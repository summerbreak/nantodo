import hover from "../behaviors/hover";
Component({
    options: {
        multipleSlots: !0
    },
    behaviors: [hover],
    relations: {
        "../grid-item/index": {
            type: "child",
            linked() {
                this.initGrids()
            },
            unlinked() {
                this.initGrids()
            }
        }
    },
    externalClasses: ["l-class", "l-class-grid", "l-grid-class"],
    properties: {
        rowNum: {
            type: String,
            value: 3
        },
        showBorder: Boolean,
        showColBorder: Boolean,
        showRowBorder: Boolean
    },
    data: {
        gridItems: [],
        childNum: 0,
        currentIndex: -1,
        currentCell: -1
    },
    ready() {
        this.initGrids()
    },
    lifetimes: {
        show() {}
    },
    methods: {
        initGrids() {
            let e = this.getRelationNodes("../grid-item/index");
            if (this.data.childNum === e.length) return;
            const t = e.map((e, t) => (e.setData({
                index: t
            }), {
                index: t,
                key: e.data.key,
                cell: e.data.cell
            }));
            this.setData({
                gridItems: t,
                childNum: e.length
            })
        },
        tapGridItem(e) {
            const {
                gridIndex: t
            } = e.target.dataset;
            this.setData({
                currentIndex: t,
                currentCell: this.data.gridItems[t].cell
            })
        },
        tapGrid() {
            this.triggerEvent("lintap", {
                index: this.data.currentIndex,
                cell: this.data.currentCell
            }, {
                bubbles: !0,
                composed: !0
            }), this.setData({
                currentIndex: -1,
                currentCell: -1
            })
        }
    }
});