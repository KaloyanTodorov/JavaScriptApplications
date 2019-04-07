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
            await $.ajax({
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

    async function showTowns(countryId) {
        let id;
        if( typeof countryId === 'string') {
            id = countryId;
        } else {
            id = ($(this).parent().parent()[0]).id;
        }

        const country = $(`#${id} td:nth-child(2)>input`).val();
        
        let divContainer = $(`#towns-${id}`);
        divContainer.empty();
        try {
            const request = await $.ajax({
                method: 'GET',
                url: `${baserUrl}appdata/${appKey}/${townsCollection}`,
                headers
            });

            request
                .filter(t => t.country === country)
                .forEach(town => {
                    const $townInput = $(`
                    <div class="input-group input-group-sm mb-3 m-1">
                        Town: <input class="m-2" id="town-${town._id}" value="${town.name}" />
                    </div>`);

                    const $editTownButton = $(`<button class="btn btn-warning m-1" id="edit-${town._id}">Edit</button>`);
                    const $deleteTownButton = $(`<button class="btn btn-danger m-1" id="delete-${town._id}">Delete</button>`);

                    $editTownButton.click(editTown);
                    $deleteTownButton.click(deleteTown);
                    
                    divContainer
                        .append($townInput
                                .append($editTownButton)
                                .append($deleteTownButton)
                            );
                });
            
                $(`#${id} td:nth-child(2)`).append(divContainer);
            } catch (error) {
                console.log(error);
            }
        }
        

    async function showTownInput() {
        
        const countryId = this.id.replace('add-town-', '');
        showTowns(countryId);

        const countries = await $.ajax({
            method: 'GET',
            url: baserUrl + 'appdata/' + appKey + '/' + countriesCollection,
            headers
        });

        const country = countries.filter(c => c._id === countryId)[0].name;

        const addTownInput = $(`<div>Add town: <input id="townId-${countryId}" type="text" placeholder="Add town" /></div>`);
        const addTownButton = $(`<button class="btn btn-info">Add!</button>`);
        addTownButton.click(addTown);

        $(`#towns-${countryId}`)    
            .prepend(addTownButton)
            .prepend(addTownInput);

        async function addTown() {
            const townName = $(`#townId-${countryId}`).val();

            const data = JSON.stringify({
                country,
                name: townName
            });

            try {
                await $.ajax({
                    method: 'POST',
                    url: baserUrl + 'appdata/' + appKey + '/' + townsCollection,
                    headers,
                    data
                });

                showTowns(countryId);
    
            } catch (error) {
                console.error(error);
            }
        }
        
    }            

    async function editTown() {
        const id = this.id.replace('edit-', '');
        const townName = $(this).parent()[0].children[0].value;
        const countryName = $(this).parent().parent().parent()[0].children[0].value;
        const countryId = $(this).parent().parent().parent().parent()[0].id;
        
        const data = JSON.stringify({
            name: townName,
            country: countryName
        })
        
        try {
            const request = await $.ajax({
                method: 'PUT',
                url: baserUrl + 'appdata/' + appKey + '/' + townsCollection + '/' + id,
                headers,
                data
            });

            console.log(request);
            showTowns(countryId);
        } catch (error) {
            console.error(error)
        }
    }

    async function deleteTown() {
        const id = this.id.replace('delete-', '');
        const countryId = $(this).parent().parent().parent().parent()[0].id;

        try {
            await $.ajax({
                method: 'DELETE',
                url: baserUrl + 'appdata/' + appKey + '/' + townsCollection + '/' + id,
                headers
            });

            showTowns(countryId);
        } catch (error) {
            console.error(error);
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
                <td>
                    <input type="text" value="${country.name}">
                    <div id="towns-${country._id}"></div>
                </td>
            </tr>
            `)
            
            let $showTownsButton = $(`<button class="btn btn-info m-2" type="button">Show Towns</button>`);
            let $addTownButton = $(`<button class="btn btn-primary m-2" type="button" id="add-town-${country._id}">Add Town</button>`);
            let $editButton = $(`<button class="btn btn-warning m-2" type="button" data-toggle="modal" data-target="#${country._id}-modal">Edit country</button>`);
            let $deleteButton = $('<button class="btn btn-danger m-2">Delete country</button>');

            $showTownsButton.on('click', showTowns);

            $addTownButton.on('click', showTownInput);

            $editButton.on('click', editCountry);
            $deleteButton.on('click', deleteCountry);

            $country
            .append($('<td>')
                .append($showTownsButton)
                .append($addTownButton)
                .append($editButton)
                .append($deleteButton));

            $($tbody).append($country);
        });

        $table.append($tbody);

        $countries.append($table);
    }
}
