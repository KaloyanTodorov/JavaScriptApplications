function app() {
    const baserUrl = "https://baas.kinvey.com/";
    const appKey = "kid_Hyzke_GOE";
    const username = "guest";
    const password = "guest";
    const auth = btoa(`${username}:${password}`);
    const countriesCollection = 'countries';
    const townsCollection = 'towns';

    const headers = {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    }
    
    $('#loadCountries').on('click', loadCountries);
    $('#addCountry').on('click', addCountry);

    async function loadCountries() {

        try {
            const request = await $.ajax({
                method: 'GET',
                url: `${baserUrl}appdata/${appKey}/${countriesCollection}`,
                headers
            });

            listCountriesTable(request);
        } catch (error) {
            console.error(error);
        }
    }

    async function addCountry() {
        let countryName = $('#add-country').val();

        if(!countryName) {
            return;
        }

        const data = JSON.stringify({
            "name": countryName
        });
        
        try {
            const req = await $.ajax({
                method: "POST",
                url: `${baserUrl}appdata/${appKey}/${countriesCollection}`,
                headers,
                data
            })

            loadCountries();

            $('#add-country').val('');            
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteCountry(e) {
        const id = ($(e.target).parent().parent()[0]).id;

        try {
            await $.ajax({
                method: 'DELETE',
                url: `${baserUrl}appdata/${appKey}/${countriesCollection}/${id}`,
                headers
            });

            loadCountries();
        } catch (error) {
            console.error(error);
        }
    }    

    async function editCountry(e) {
        const id = ($(e.target).parent().parent()[0]).id;
        const countryInputElement = $(`#${id} td:nth-child(2)>input`).val();

        const data = JSON.stringify({
            name: countryInputElement
        })
        try {
            await $.ajax({
                method: 'PUT',
                url: `${baserUrl}appdata/${appKey}/${countriesCollection}/${id}`,
                headers,
                data
            });

            loadCountries();
        } catch (error) {
            console.error(error);
        }
    }

    async function showTowns(e) {
        const id = ($(e.target).parent().parent()[0]).id;
        const country = $(`#${id} td:nth-child(2)>input`).val();

        try {
            const request = await $.ajax({
                method: 'GET',
                url: `${baserUrl}appdata/${appKey}/${townsCollection}`,
                headers
            });

            let divContainer = $(`<div class="collapse-show" id="showTowns"></div>`);
            request
                .filter(t => t.country === country)
                .forEach(town => {
                    const div = $(`<div class="card card-body">${town.name}</div>`);
                    divContainer.append(div);
                });
            
                $(`#${id} td:nth-child(2)`).append(divContainer);

            
        } catch (error) {
            console.log(error);
        }
    }

    function listCountriesTable(request){
        $('#countries-div').empty();
        let $countries = $('#countries-div');
        let $table = $(`
            <table id="countries-table" class="table table-striped table-dark mt-2">
                <thead>
                    <th>ID</th>
                    <th>Country</th>
                    <th>Actions</th>
                </thead>
            </table>
        `);

        let $tbody = $('<tbody>');

        request.forEach((country, id) => {
            let $country = $(`
            <tr id="${country._id}">
                <td>${id + 1}</td>
                <td><input type="text" value="${country.name}"></td>
            </tr>
            `)
            
            let $showTownsButton = $(`<button class="btn btn-info m-2" type="button">Show Towns</button>`);
            let $editButton = $(`<button class="btn btn-warning m-2" type="button" data-toggle="modal" data-target="#${country._id}-modal">Edit</button>`);
            let $deleteButton = $('<button class="btn btn-danger m-2">Delete</button>');

            $showTownsButton.on('click', showTowns);
            // $addTownButton.on('click', addTown);

            $editButton.on('click', editCountry);
            $deleteButton.on('click', deleteCountry);

            let $modal = appendModal(country._id);

            $country
            .append($('<td>')
                .append($showTownsButton)
                .append($editButton)
                .append($deleteButton));

            $($tbody).append($country);

            $('#countries-div').append($modal);
        });

        $table.append($tbody);

        $countries.append($table);
    }

    function appendModal(id) {
        return (
            `<!-- Modal -->
            <div id="${id}-modal" class="modal fade" role="dialog">
              <div class="modal-dialog">
            
                <!-- Modal content-->
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Modal Header</h4>
                  </div>
                  <div class="modal-body">
                    <p>Some text in the modal.</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>
            
              </div>
            </div>
            `)
    }
}
