import hover from "../behaviors/hover";
Component({
    behaviors: [hover],
    relations: {
        "../list/index": {
            type: "parent",
            linked() {},
            linkChanged() {},
            unlinked() {}
        }
    },
    options: {
        multipleSlots: !0
    },
    externalClasses: ["l-class", "l-class-icon", "l-icon-class", "l-class-image", "l-image-class", "l-class-right", "l-right-class", "l-class-content", "l-content-class", "l-class-desc", "l-desc-class", "l-link-icon-class"],
    properties: {
        icon: String,
        iconColor: {
            type: String,
            value: "#3963BC"
        },
        iconSize: {
            type: String,
            value: "28"
        },
        image: String,
        title: String,
        desc: String,
        tagPosition: {
            type: String,
            value: "left"
        },
        tagContent: String,
        tagShape: {
            type: String,
            value: "square"
        },
        tagColor: String,
        tagPlain: Boolean,
        badgePosition: {
            type: String,
            value: "left"
        },
        dotBadge: Boolean,
        badgeCount: Number,
        badgeMaxCount: {
            type: Number,
            value: 99
        },
        badgeCountType: {
            type: String,
            value: "overflow"
        },
        rightDesc: String,
        gap: Number,
        leftGap: Number,
        rightGap: Number,
        isLink: {
            type: Boolean,
            value: !0
        },
        linkType: {
            type: String,
            value: "navigateTo"
        },
        url: String
    },
    methods: {
        tapcell: function (e) {
            const {
                linkType: t,
                url: l
            } = e.currentTarget.dataset;
            l && wx[t]({
                url: l
            }), this.triggerEvent("lintap", {
                e: e
            }, {
                bubbles: !0,
                composed: !0
            })
        }
    }
});