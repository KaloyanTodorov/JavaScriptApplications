$(async () => {
    try {
        const contactListHtml = await $.get('./templates/contact-list.hbs');
        const contactInfoHtml = await $.get('./templates/contact-info.hbs');

        Handlebars.registerPartial('contactInfo', contactInfoHtml);
        const template = Handlebars.compile(contactListHtml);
        const renderedHtml = template({contacts});
        
        $('body').append(renderedHtml);
        
    } catch (error) {
        console.error(error)
    }
});

function showDetails(id) {
    $(`#${id}`).toggle();
}
