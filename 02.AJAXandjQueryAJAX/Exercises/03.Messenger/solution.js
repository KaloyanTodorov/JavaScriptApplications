function attachEvents() {
    const baseUrl = 'https://messenger-f7440.firebaseio.com/.json';

    $('#submit').on('click', sendData);

    $('#refresh').on('click', printMessages);

    function sendData() {
        let author = $('#author').val();
        let content = $('#content').val();
        let timestamp = Date.now();

        const data = JSON.stringify({
            author,
            content,
            timestamp
        });

        $.ajax({
            method: 'POST',
            url: baseUrl,
            data: data
        })

        $('#author').val('');
        $('#content').val('');
    }

    function printMessages() {
        

        $.ajax({
            method: 'GET',
            url: baseUrl,
            success: success
        })

    }

    function success(data) {
        let textToPrint = '';
        
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const message = data[key];
                textToPrint += `${message.author}: ${message.content}\n`;
            }
        }

        $('#messages').text(textToPrint);
    }
}