function solve() {
    const baseUrl = "https://judgetests.firebaseio.com/schedule/";
    let currentStopId = 'depot';
    let currentStop = {};

    function depart() {
        $.ajax({
            method: 'GET',
            url: baseUrl + currentStopId + '.json',
            success: printDepartTo
        })

        disableAndEnableButtons('depart', 'arrive');
        
    }

    function arrive() {

        $('.info').text(`Arriving at ${currentStop.name}`);
        disableAndEnableButtons('arrive', 'depart');
        currentStopId = currentStop.next;
    }

    function printDepartTo(data) {
        $('.info').text(`Next stop ${data.name}`);
        currentStop = data;
    }

    function disableAndEnableButtons(disable, enable) {
        $(`#${disable}`).attr('disabled', true);
        $(`#${enable}`).attr('disabled', false);
    }

    return {
      depart,
      arrive
    };
  }