
/* General External Links */
function OpenUrl(url){
    window.open(
        url,
        '_blank'
    )
}

/* Certificates.html */
function ModalDataLoad(el) {
    fetch('#')
    .then(()=>{
        var root = el.parentElement.parentElement.parentElement.parentElement;
        var title = root.querySelector('.card-header > img ').getAttribute('title');
        var content = root.querySelector('.card-body > .card-text ').innerHTML;

        var modal = document.querySelector(el.getAttribute('data-bs-target'));
        modal.querySelector('.modal-header > .modal-title').innerText = title;
        modal.querySelector('.modal-body').innerHTML = content;
    })

}

/* Certificates.html */
function CleanModal(el) {
    var modal = el.parentElement.parentElement;
        modal.querySelector('.modal-header > .modal-title').innerHTML = '';
        modal.querySelector('.modal-body').innerHTML = '';

}