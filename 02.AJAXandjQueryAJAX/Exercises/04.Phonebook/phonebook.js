function attachEvents() {
    const baseUrl = 'https://phonebook-860c7.firebaseio.com/phonebook';

    $('#btnLoad').on('click', loadContacts);
    $('#btnCreate').on('click', createContact);

    function loadContacts() {
        $('#phonebook').empty();

        $.ajax({
            method: 'GET',
            url: baseUrl + '.json',
            success: appendContactsToList
        })
    }

    function createContact() {

        const person = $('#person').val();
        const phone = $('#phone').val();

        $.ajax({
            method: 'POST',
            url: baseUrl + '.json',
            data: JSON.stringify({
                person,
                phone
            }),
            success: loadContacts
        })
        $('#person').val('');
        $('#phone').val('');
    }

    function deleteContact(e) {
        const id = $(e.target).parent().attr('id') 
        $.ajax({
            method: 'DELETE',
            url: baseUrl + '/' + id + '.json'
        })
    }

    function appendContactsToList(data) {
        let $ul = $('#phonebook');
        for(const id in data) {

            let $li = $(`<li>${data[id].person}: ${data[id].phone}</li>`);
            $li.attr('id', id);
            let $deleteButton = $('<button>Delete</button>');
            $deleteButton.on('click', deleteContact);

            $li.append($deleteButton);
            $ul.append($li);
        }
    }
}