if (!!window.EventSource) {
    var eventSource = new EventSource("/api/plannings/generate");
    eventSource.onmessage = function (event) {
        var container = document.getElementById("container");
        var paragraph = document.createElement("p");
        paragraph.innerHTML = event.data;
        container.appendChild(paragraph);
        eventSource.close();
    };
} else {
    window.alert("EventSource not available on this browser.");
}
