$(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
        const catsHtml = await $.get('./templates/catsTemplate.hbs');

        const compiledTemplate = Handlebars.compile(catsHtml);
        const context = {cats: window.cats};
        
        const renderHtml = compiledTemplate(context);

        $('#allCats').html(renderHtml);
    }
})

function showInfo(id) {
    $(`#${id}`).toggle();

    console.log(this) // this object, in our case window object;
    console.log(id) // ID passed as parameter;
    console.log(event) //Mouse event;
}
