// Date search for the country flag pages.
// Each flag entry has data-years="start-end,start-end" (BC years are negative, e.g. -336--323).
// Typing a From and/or To year hides every flag that was not in use at any point in that period.
// Entries with no date at all are always shown.

var fromBox = document.getElementById("year-from");
var toBox = document.getElementById("year-to");
var message = document.getElementById("year-message");
var entries = document.querySelectorAll(".flag-entry");

// turns "1340-1395,1399-1406" into [[1340,1395],[1399,1406]]
function readRanges(text) {
    return text.split(",").map(function (part) {
        var m = part.match(/^(-?\d+)-(-?\d+)$/);
        return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : null;
    }).filter(Boolean);
}

function filterFlags() {
    var from = fromBox.value === "" ? -Infinity : parseInt(fromBox.value, 10);
    var to = toBox.value === "" ? Infinity : parseInt(toBox.value, 10);
    if (from > to) { var swap = from; from = to; to = swap; }   // allow the boxes to be filled in either order

    var filtering = (fromBox.value !== "" || toBox.value !== "");
    var shown = 0;

    entries.forEach(function (entry) {
        var data = entry.dataset.years;
        var visible = true;
        if (filtering && data) {
            // visible if any of its date ranges overlaps the searched period
            visible = readRanges(data).some(function (r) { return r[0] <= to && r[1] >= from; });
        }
        entry.hidden = !visible;
        if (visible) { shown++; }
    });

    if (!filtering) {
        message.textContent = "";
    } else if (shown === 0) {
        message.textContent = "No flags found for that period.";
    } else {
        message.textContent = "Showing " + shown + " of " + entries.length + " flags.";
    }
}

fromBox.addEventListener("input", filterFlags);
toBox.addEventListener("input", filterFlags);
document.getElementById("year-clear").addEventListener("click", function () {
    fromBox.value = "";
    toBox.value = "";
    filterFlags();
});
