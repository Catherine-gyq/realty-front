function handleSizeChange(val) {
    if (val) {
        this.ep_page.limit = val
        this.onRefresh()
    }
}
function handleCurrentChange(val) {
    if (val) {
        this.ep_page.offset = val
        this.onRefresh()
    }
}

export default {
    handleSizeChange,handleCurrentChange

}
