function getInfo() {
   const baseUrl = 'https://judgetests.firebaseio.com/businfo/';
    let stopId = $('#stopId').val();

    $.ajax({
        method: 'GET',
        url: baseUrl + stopId + '.json',
        success: printResult,
        error: somethingElse
    })

    function printResult(data) {
        $('#stopName').text(data.name);
        appendBuses(data.buses);
    }

    function somethingElse() {
        $('#stopName').text("Error");
    }

    function appendBuses(buses) {
        for(const [key, value] of Object.entries(buses)) {
            let $li = $('<li>');
            $li.text(`Bus ${key} arrives in ${value} minutes`);
            $('#buses').append($li);
        }
    }
  }