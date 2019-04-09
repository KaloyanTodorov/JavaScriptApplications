$(() => {
    $('#btnLoadTowns').on('click', loadTowns);
    
    async function loadTowns() {
        $('#root').empty();
        
        const towns = $('#towns').val().split(', ');
    
        // Create template
        const townsHtml = await $.get('./templates/towns.hbs');
        
        // Compile template
        const template = Handlebars.compile(townsHtml);

        // Render template
        const renderedHtml = template({towns});
    
        $('#root').append(renderedHtml);
    }
})

