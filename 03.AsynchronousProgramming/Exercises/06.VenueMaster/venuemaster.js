function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_BJ_Ke8hZg';
    const venues = 'venues';
    const username = 'guest';
    const password = 'pass';
    const auth = btoa(username + ':' + password);

    const headers = {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/json'
    }

    $('#getVenues').click(getVenues);

    async function getVenues() {
        const venueDate = $('#venueDate').val();
        
        try {
            const venueIDs = await $.ajax({
                method: 'POST',
                url: baseUrl + `rpc/${appKey}/custom/calendar?query=${venueDate}`,
                headers
            })

            const $venueInfo = $('#venue-info');
            venueIDs.forEach(async id => {
                
                const venue = await $.ajax({
                    method: 'GET',
                    url: baseUrl + `appdata/${appKey}/venues/${id}`,
                    headers
                });

                const $divVenue = $(`
                    <div class="venue" id="${venue._id}">
                        <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
                        <div class="venue-details" style="display: none;">
                        <table>
                            <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
                            <tr>
                            <td class="venue-price">${venue.price} lv</td>
                            <td><select class="quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select></td>
                            <td><input class="purchase" type="button" value="Purchase"></td>
                            </tr>
                        </table>
                        <span class="head">Venue description:</span>
                        <p class="description">${venue.description}</p>
                        <p class="description">Starting time: ${venue.startingHour}</p>
                        </div>
                    </div>
                `);

                $venueInfo.append($divVenue);

                $(`#${id} .info`).click(() => {
                    $(`#${id} .venue-details`).css('display', 'block');                    
                });

                $(`#${id} .purchase`).click(() => {
                    const qty =  $(`#${venue._id} .quantity`).val();

                    $('#venue-info').empty();

                    
                    const purchaseInfoDiv = $(`
                    <span class="head">Confirm purchase</span>
                    <div class="purchase-info">
                      <span>${venue.name}</span>
                      <span>${qty} x ${venue.price}</span>
                      <span>Total: ${qty * venue.price} lv</span>
                      <input type="button" value="Confirm">
                    </div>
                    `);

                    $('#venue-info').append(purchaseInfoDiv);

                    $(`.purchase-info input`).click(confirmPurchase);

                    async function confirmPurchase() {
                        try {
                            const purchaseResponse = await $.ajax({
                                method: 'POST',
                                url: baseUrl + `rpc/${appKey}/custom/purchase?venue=${id}&qty=${qty}`,
                                headers
                            });

                            $('#venue-info').empty();
                            $('#venue-info').append('<div>You may print this page as your ticket</div>');
                            $('#venue-info').append(purchaseResponse.html);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                });
            }); 
            
        } catch (error) {
            console.error(error)
        }
    }
}