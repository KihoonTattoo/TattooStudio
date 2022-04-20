/*
    Developed by: http://github.com/CheatTrigger

    Changed the way of how to load the page
    https://stackoverflow.com/questions/65801616/execute-javascript-inside-xmlhttprequest-response
*/

function PathBuilder(el, path) {
    return ("./" + path + "/" + el.getAttribute("data-section") + ".html?ver=" + Math.floor(Math.random() * 100000));
}

//FirstLoad
document.addEventListener('DOMContentLoaded', function () {
    InternalRequest(document.querySelector("header>[data-content='true']"), 'Section');
    MenuRequest('main');
    InternalRequest(document.querySelector("footer[data-content='true']"), 'Section');

})

/* MenuController */
async function MenuRequest(section) {
    var internalContent = document.querySelector('#PageRender');
    internalContent.setAttribute('data-section', section);
    PageRenderControl(internalContent);

    //after click in menu close the accordion
    var responsiveToogle = document.querySelector('button[data-bs-target="#menu_1"][aria-expanded="true"]');
    if (responsiveToogle) {
        responsiveToogle.click();
    }
}

/* PageRender */
function DataSectionRequest(internalContent) {
    switch (internalContent.getAttribute("data-section")) {
        case 'main':
            MainRequest();
            break;
        case 'Introduction':
            IntroductionRequest();
            break;
        case 'FAQs':
            FAQsRequest();
            break;
        case 'Certificates':
            CertificatesRequest();
            break;
        default:
            break;
    }

}

async function PageRenderControl(internalContent) {
    fetch(PathBuilder(internalContent, 'Section'))
        .then(response => {
            //return response.blob();//images
            return response.text();//html
        })
        .then(content => {
            internalContent.innerHTML = content;
        })
        .then(content => {
            DataSectionRequest(internalContent);
        })
        .catch(error => {
            console.error(error.text);
        });
}

async function InternalRequest(el, section) {
    fetch(PathBuilder(el, section))
        .then(response => {
            //return response.blob();//images
            return response.text();//html
        })
        .then(content => {
            el.innerHTML = content;
            return content;
        })
        .catch(error => {
            console.error(error);
        });
}


/*JSON DataLoader */
function GetJsonData(data) {
    return fetch('./jsonData/' + data + '.json?ver=' + Math.floor(Math.random() * 100))
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.error(err);
            return null;
        });

}

/* home */
async function MainRequest() {
    var contentList = document.querySelectorAll(".container > [data-content='true']");
    contentList.forEach(
        function (e) {
            fetch(PathBuilder(e, 'View/home'))
                .then(response => {
                    return response.text();
                })
                .then(content => {
                    e.innerHTML = content;
                    DataRequest(e);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    );
}

function DataRequest(e) {
    switch (e.getAttribute("data-section")) {
        case 'Skills':
            SkillRequest();
            break;
        case 'Experience':
            ExperienceRequest();
            break;
        default:
            break;
    }
}
/* Experience */
async function ExperienceRequest() {
    var TotalExp = document.querySelector('#TotalExp');
    const Exp = await GetJsonData('Experience');

    Exp.sort((a, b) => {
        return b.Id - a.Id;
    });

    // if (Exp.length > 3) {
    //     Exp.splice(3, Exp.length);
    // }

    var CardsCounter = 0;
    var Cards = [];
    if (Exp) {
        Exp.forEach(f => {
            Cards.push(BuildExperience(f.Company, f.Link, f.Location, f.Role, f.Start, f.End, f.Description, f.Technologies, CardsCounter++));
        });
    }
  
    var div = '';
    for (let i = 0; i < Cards.length; i++) {
        div += Cards[i];
        if ((i % 3) == 2 || i == Cards.length - 1) {
            TotalExp.innerHTML += BuildCertificatesRow(div);
            div = '';
        }
    }
}
function BuildExperienceSeparator(div) {
    var divRow =
    '<div class="Row">'+
    '    {Exps}'+
    '</div>';
    return divRow.replace(/{Exps}/g, div);
}
function BuildExperience(company, link, location, role, start, end, description, technologies, CardsCounter) {
    var output =
        '<div class="col-md-4 col-xs-4 {Print}">' +
        '    <div class="card">' +
        '        <div class="card-header">' +
        '            <h3>' +
        '                <a class="link-dark" href="{Link}" target="_blank">' +
        '                    {Company}' +
        '                    <i class="bi bi-link-45deg" style="font-size: 1.5rem; color: cornflowerblue;"></i>' +
        '                </a> - {Location}' +
        '            </h3>' +
        '        </div>' +
        '        <div class="card-body">' +
        '            <h4>{Role}</h4>' +
        '            <h5>{Start} – {End}</h5>' +
        '            <p>' +
        '                {Description}' +
        '            </p>' +
        '            <p>Tools and Tecnologies: {Tecnologies}</p>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    var tool = '';
    for (var i = 0; i < technologies.length; i++) {
        tool += technologies[i].Tool;
        if (i == technologies.length -1) {
            tool += '.';
        } else {
            tool += ', ';
        }
    }
    var hidden = '';
    if (CardsCounter > 2) {
        hidden = 'bi';
    }
    return output
        .replace(/{Company}/g, company)
        .replace(/{Link}/g, link)
        .replace(/{Location}/g, location)
        .replace(/{Role}/g, role)
        .replace(/{Start}/g, start)
        .replace(/{End}/g, end)
        .replace(/{Description}/g, description)
        .replace(/{Tecnologies}/g, tool)
        .replace(/{Print}/g, hidden);
}


/* Skills */
async function SkillRequest() {
    var Dossie = document.querySelector('#skillsContent');
    const Skills = await GetJsonData('Dossie');

    Skills.sort((a, b) => {
        if (a.Type == b.Type) {
            return b.Level - a.Level;
        }
        return a.Type - b.Type;
    });

    var TypeMapping = [
        'Programming Languages', //1
        'Database',             //2
        'DevOps',               //3
        'Good Practices',       //4
        'Softwares',            //5
        'Eletronics',           //6
        'Infra',                //7
        'Patterns',             //8
        'Agile'];               //9

    var idx = -1;
    if (Skills) {
        Skills.forEach(f => {
            if (idx != f.Type) {
                idx = f.Type;
                Dossie.innerHTML += BuildSkillSeparator(idx, TypeMapping[idx - 1]);
            }
            Dossie.innerHTML += BuildSkills(f.Tool, f.Level, f.Experience, f.Observation, f.Type);
        });
    }
}
function BuildSkillSeparator(id, typeMapping) {
    return '<tr><th colspan="4">{id}. {TypeMapping}</th></tr>'
        .replace(/{id}/g, id)
        .replace(/{TypeMapping}/g, typeMapping);
}
function BuildSkills(tool, level, experience, observation, type) {
    var Skill =
        '<tr data-skill="{type}">' +
        '   <td>{tool}</td>' +
        '   <td>{level}</td>' +
        '   <td>{experience}</td>' +
        '   <td>{observation}</td>' +
        '</tr>'
    Skill = Skill
        .replace(/{tool}/g, tool)
        .replace(/{level}/g, level)
        .replace(/{experience}/g, experience)
        .replace(/{observation}/g, observation)
        .replace(/{type}/g, type);
    return Skill;
}


/* Introduction DataControl */
async function IntroductionRequest() {
    var AccordionMain = document.querySelector('ul#IntroductionParagraphs');
    const Intro = await GetJsonData('Introduction');
    var i = 0;
    if (Intro) {
        Intro.forEach(f => {
            AccordionMain.innerHTML += BuildIntroduction(f.p);
        });
    }

}
function BuildIntroduction(p) {
    var DivElement =
        '<p>' +
        '   {p}' +
        '</p>';

    DivElement = DivElement
        .replace(/{p}/g, p);

    return DivElement;
}


/*FAQs DataControl */
async function FAQsRequest() {
    var AccordionMain = document.querySelector('div#accordionFAQs');
    const Faqs = await GetJsonData('FAQs');
    var i = 0;
    if (Faqs) {
        Faqs.forEach(f => {
            AccordionMain.innerHTML += BuildAccordionFAQs(f.Q, f.A, ++i);
        });
    }

}
function BuildAccordionFAQs(question, answer, i) {
    var DivElement =
        '<div class="accordion-item">' +
        '    <h2 class="accordion-header" id="flush-{heading}">' +
        '        <button class="bg-light accordion-button collapsed" type="button" data-bs-toggle="collapse"' +
        '            data-bs-target="#flush-{collapse}" aria-expanded="false" aria-controls="flush-{collapse}">' +
        '            <h5 style="font-weight: bold">' +
        '               {i}. {heading-data}' +
        '            </h5>' +
        '        </button>' +
        '    </h2>' +
        '</div>' +
        '<div id="flush-{collapse}" class="accordion-collapse collapse" aria-labelledby="flush-{heading}"' +
        '    data-bs-parent="#accordionFAQs">' +
        '    <div class="accordion-body">' +
        '       {body-data}' +
        '    </div>' +
        '</div>';

    DivElement = DivElement
        .replace(/{heading-data}/g, question)
        .replace(/{body-data}/g, answer)
        .replace(/{heading}/g, 'heading_' + i)
        .replace(/{collapse}/g, 'collapse_' + i)
        .replace(/{i}/g, i);

    return DivElement;
}


/* Certificates DadaControl */
async function CertificatesRequest() {
    var DivCertificates = document.querySelector('div#Certificates');
    const Certificates = await GetJsonData('Certificates');
    DivCertificates.innerHTML = '';

    //Build Columns
    var columns = []
    var i = 0;
    if (Certificates) {
        Certificates.forEach(f => {
            columns.push(BuildCertificatesColumn(f.title, f.description, f.image, f.link, f.mins));
        });
    }

    //Build Rows
    var div = '';
    for (let i = 0; i < columns.length; i++) {
        div += columns[i];
        if ((i % 3) == 2 || i == columns.length - 1) {
            DivCertificates.innerHTML += BuildCertificatesRow(div);
            div = '';
        }
    }
}
function BuildCertificatesRow(content) {
    var divRow =
        '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 pb-3">' +
        '   {content}' +
        '</div>';

    return divRow.replace(/{content}/g, content);
}
function BuildCertificatesColumn(title, description, image, link, mins) {
    var divCol =
        '<div class="col">' +
        '    <div class="card shadow-sm">' +
        '        <div class="card-header">' +
        '            <img class="img-fluid" src="{img}" title="{title}" />' +
        '        </div>' +
        '        <div class="card-body">' +
        '            <p class="card-text" style="display: none;">' +
        '                   {description}' +
        '            </p>' +
        '            <div class="d-flex justify-content-between align-items-center">' +
        '                <div class="btn-group">' +
        '                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal"' +
        '                        data-bs-target="#staticBackdrop" onclick="ModalDataLoad(this)">' +
        '                        Details' +
        '                    </button>';
    if (link) {
        divCol = divCol +
            '               <button type="button" onclick="OpenUrl(\'{link}\')"' +
            '                   class="btn btn-sm btn-outline-secondary">View</button>';
    }
    divCol = divCol +
        '                </div>';
    if (mins) {
        divCol = divCol +
            '            <small class="text-muted">{mins}</small>';
    }
    divCol = divCol +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    return divCol
        .replace(/{title}/g, title)
        .replace(/{description}/g, description)
        .replace(/{img}/g, image + '?v=' + Math.floor(Math.random() * 100))
        .replace(/{link}/g, link)
        .replace(/{mins}/g, mins);
}