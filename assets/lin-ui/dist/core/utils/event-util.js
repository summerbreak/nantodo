class EventUtil {
    emit(e, t, l) {
        e.triggerEvent(t, l, {
            bubbles: !0,
            composed: !0,
            capturePhase: !0
        })
    }
}
const eventUtil = new EventUtil;
export default eventUtil;