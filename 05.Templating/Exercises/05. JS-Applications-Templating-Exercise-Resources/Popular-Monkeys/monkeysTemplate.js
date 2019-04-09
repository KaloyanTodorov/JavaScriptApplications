$(async () => {
   try {
       const monkeysListHtml = await $.get('./templates/monkey-list.hbs');
       const monkeyInfoHtml = await $.get('./templates/monkey-info.hbs');

       Handlebars.registerPartial('monkeyInfo', monkeyInfoHtml);
       const template = Handlebars.compile(monkeysListHtml);

       const renderedHtml = template({monkeys});

       $('body').html(renderedHtml);
   } catch (error) {
       console.error(error);
   }
})

function showInfo(id) {
    $(`#${id}`).toggle();
}