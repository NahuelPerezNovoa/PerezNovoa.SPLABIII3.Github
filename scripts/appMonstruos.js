const url = "http://localhost:3001/monstruos";
const tableContainer = document.querySelector(".table-container");
const getAnunciosAjax = () => {
  const xhr = new XMLHttpRequest();
  
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        crearAnuncios(data);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });

  xhr.open("GET", url);
  xhr.send();
};

getAnunciosAjax();

function crearAnuncios(vec) {
  vec.forEach((element) => {
    console.log(element);
    tableContainer.appendChild(crearAnuncio(element));
  });
}

function crearAnuncio(elemento) {
  const container = document.createElement("div"),
        div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        div3 = document.createElement("div"),
        div4 = document.createElement("div"),
        div5 = document.createElement("div"),
        p1 = document.createElement("p"),
        p2 = document.createElement("p"),
        p3 = document.createElement("p"),
        p4 = document.createElement("p"),
        p5 = document.createElement("p"),
        img1 = document.createElement("img"),
        img2 = document.createElement("img"),
        img3 = document.createElement("img"),
        img4 = document.createElement("img");


  container.setAttribute("class", "container");

  div1.setAttribute("class", "card-columns row pt-3 justify-content-center");
  container.appendChild(div1);

  div2.setAttribute("class", "col-6");
  div1.appendChild(div2);

  div4.setAttribute("class", "card text-start");
  div2.appendChild(div4);

  div5.setAttribute("class", "card-text");

  img1.setAttribute("src", "../img/mask.svg");
  p1.innerText = 'Alias: '+elemento.alias;
  p1.appendChild(img1);
  div5.appendChild(p1);


  p2.innerText = 'Nombre: '+elemento.defensa;
  div5.appendChild(p2);


  img2.setAttribute("src", "../img/defense.svg");
  p3.innerText = 'Defensa: '+elemento.tipo;
  p3.appendChild(img2);
  div5.appendChild(p3);

  img3.setAttribute("src", "../img/fear.svg");
  p4.innerText = 'Miedo: '+elemento.miedo;
  p4.appendChild(img3);
  div5.appendChild(p4);

  img4.setAttribute("src", "../img/monster.svg");
  p5.innerText = 'Tipo: '+elemento.tipo;
  p5.appendChild(img4);
  div5.appendChild(p5);
  
  div4.appendChild(div5);
  return container;
}
