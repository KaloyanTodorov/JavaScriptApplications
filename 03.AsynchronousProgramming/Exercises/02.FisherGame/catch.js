function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appId = 'kid_SyD0OS9_4';
    const username = 'guest';
    const password = 'guest';
    const endpoint = 'biggestCatches';
    const headers = {
        'Authorization': `Basic ${btoa(username + ":" + password)}`,
        'Content-Type': 'application/json'
    }
    
    handleButtons();
    
    function handleButtons() {
        $('.load').on('click', loadData);
        $('.add').on('click', addCatch);
        
    }
    
    async function loadData() {
        
        try {
            const request = await $.ajax({
                method: 'GET',
                url: baseUrl + 'appdata/' + appId + '/' + endpoint,
                headers
            });
            
            $('#catches').empty();
            printCatchData(request);
        } catch (error) {
            console.error(error);
        }
    }

    async function addCatch() {
        try {
            const angler = $('#addForm .angler').val();
            const weight = Number($('#addForm .weight').val());
            const species = $('#addForm .species').val();
            const location = $('#addForm .location').val();
            const bait = $('#addForm .bait').val();
            const captureTime = Number($('#addForm .captureTime').val());

            const catchData = {
                angler,
                weight,
                species,
                location,
                bait,
                captureTime
            };
            
            await $.ajax({
                method: 'POST',
                url: baseUrl + 'appdata/' + appId + '/' + endpoint,
                data: JSON.stringify(catchData),
                headers
            })

            loadData();

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteCatch() {
        const id = $(this).parent().data('id');
        try {
            await $.ajax({
                method: 'DELETE',
                url: baseUrl + 'appdata/' + appId + '/' + endpoint + '/' + id,
                headers
            });

            loadData();
        } catch (error) {
            console.error(error);
        }
        

    }

    async function updateCatch() {
        const id = $(this).parent().data('id');

        const angler = $(`.angler`).data('id', id).val();
        const weight = Number($(`.weight`).data('id', id).val());
        const species = $(`.species`).data('id', id).val();
        const location = $(`.location`).data('id', id).val();
        const bait = $(`.bait`).data('id', id).val();
        const captureTime = Number($(`.captureTime`).data('id', id).val());

        const updatedData = {
            angler,
            weight,
            species,
            location,
            bait,
            captureTime
        };
        
        try {
            await $.ajax({
                method: 'PUT',
                url: baseUrl + 'appdata/' + appId + '/' + endpoint + '/' + id,
                headers,
                data: JSON.stringify(updatedData)
            })

            loadData();
        } catch (error) {
            console.error(error);
        }
    }

    function printCatchData(catches) {
        const $catches = $('#catches');

        for (const currentCatch of catches) {
            const $appendCatch = $(`
            <div class="catch" data-id="${currentCatch._id}">
                <label>Angler</label>
                <input type="text" class="angler" value="${currentCatch.angler}"/>
                <label>Weight</label>
                <input type="number" class="weight" value="${currentCatch.weight}"/>
                <label>Species</label>
                <input type="text" class="species" value="${currentCatch.species}"/>
                <label>Location</label>
                <input type="text" class="location" value="${currentCatch.location}"/>
                <label>Bait</label>
                <input type="text" class="bait" value="${currentCatch.bait}"/>
                <label>Capture Time</label>
                <input type="number" class="captureTime" value="${currentCatch.captureTime}"/>
                <button class="update">Update</button>
                <button class="delete">Delete</button>
            </div>
            `);

            $('.delete').on('click', deleteCatch);
            $('.update').on('click', updateCatch);

            $catches.append($appendCatch);
        }
    }
}