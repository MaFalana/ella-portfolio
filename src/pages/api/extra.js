/**************************************
TITLE: extra.js							
AUTHOR: Malik Falana (MF)			
CREATE DATE: 09/21/2023	
PURPOSE: To use jquery and functions for portfolio page
LAST MODIFIED ON: 09/22/2023	
LAST MODIFIED BY: Malik Falana (MF)
MODIFICATION HISTORY:
09/22/2023: Original Build
***************************************/


$(document).ready(function() 
{
    function displayProjects()
    {
        const url = "./projects.json";

        $.getJSON(url, function(data) // Grabs Projects from JSON file
        {
            for(var i = 0; i < data.projects.length; i++)
            {
                createProject(data.projects[i]); //assigns variable from json data
            }
        });
    }


    function createProject(source)
    {
        var html = `<div class="work__box">`;
        html += `<div class="work__text">`;
        html += `<h3>${source.title}</h3>`;
        html += `<p>${source.description}</p>`;

        html += `<ul class="work__list">`;
        for(var i = 0; i < source.tools.length; i++)
        {
            html += `<li>${source.tools[i]}</li>`; //assigns variable from json data
        }
        html += `</ul>`;

        html += `<div class="work__links">`;
        html += `<a href=${source.demo} target="_blank" class="link__text">`;
        html += `View Demo <span>&rarr;</span>`;
        html += `</a>`;
        html += `<a href=${source.git} title="View Source Code" target="_blank">`;
        html += `<img src="./images/github.svg" class="work__code" alt="GitHub">`;
        html += `</a>`;
        html += `</div>`;
        html += `</div>`;
        html += `<div class="work__image-box">`;
        html += `<img src=${source.image} class="work__image" alt="Project ${source.id}" />`;
        html += `</div>`;
        html += `</div>`;

        $("section#work.work div.row div.work__boxes").append(html); //Append to Projects Section
    }

    function displayInterests()
    {
        const activity = ["Reading", "Watching", "Music", "Gaming", "Learning"]
        
        for(var i = 0; i < activity.length; i++)
        {
          //const url = `http://127.0.0.1:5000/${activity[i]}`;
          const url = `https://portfolio-server-omega-gray.vercel.app/${activity[i]}`

          $.getJSON(url, function(data) // Grabs Projects from JSON file
          {
              createInterest(data);
          });
        } 
    }

    function createInterest(source)
    {
        var html = `<div class="work__box">`;

        html += `<div class="work__image-box">`;
        html += `<img src=${source.image} class="work__image" alt="Project ${source.id}" />`;
        html += `</div>`;

        html += `<div class="work__text">`;
        html += `<h3>${source.title}</h3>`;
        html += `<p>${source.description}</p>`;
        html += `</div>`;

        html += `</div>`;

        $("section#interests.interests div.row div.work__boxes").append(html); //Append to Interests Section
    }

    displayProjects();
    displayInterests();

});  // end of $(document).ready()