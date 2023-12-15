import Monstruo from "./monstruo.js";
import crearTabla from "./tabla.js";
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

const url = "http://localhost:3001/monstruos";
const $form = document.forms[0];
const $btnGuardar = document.getElementById("btnGuardar");
const $btnEliminar = document.getElementById("btnEliminar");
const $btnCancelar = document.getElementById("btnCancelar");
const $inputMaximo = document.getElementById("inputMaximo");
const $inputPromedio = document.getElementById("inputPromedio");
const $inputMinimo = document.getElementById("inputMinimo");
const tipos = ["Esqueleto","Zombie","Vampiro","Fantasma","Bruja","Hombre Lobo"];

/* SPINNER */
//#region
const cargarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");

  if (!divSpinner.hasChildNodes()) {
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./img/halloween-ghost.gif");
    spinner.setAttribute("alt", "icono spinner");
    divSpinner.appendChild(spinner);
  }
};

const eliminarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");
  while (divSpinner.hasChildNodes()) {
    divSpinner.removeChild(divSpinner.firstChild);
  }
};
//#endregion

const añadirTipos = () => {
  const tiposSelector = document.getElementById("slcTipos");
  tipos.forEach(function(tipo) {
    var option = document.createElement("option");
    option.text = tipo;
    option.value = tipo;
    tiposSelector.appendChild(option);
  });
}

/* HTTP*/
//#region
/* GET */
const getMonstruosFetchAsync = async (filtro = "todos") => {
  try {
    cargarSpinner();
    const res = await fetch(url);
    if (!res.ok) {
      throw Promise.reject(res);
    }
    const data = await res.json();
    if (filtro === "todos") {
      aplicarReduce(data);
      actualizarTabla(data);
    } else {
      let nuevaData = data.filter(function (monstruo) {
        if (monstruo.tipo == filtro) return monstruo;
      });
      aplicarReduce(nuevaData);
      actualizarTabla(nuevaData);
    }
  } catch (err) {
    console.error(err.status, err.statusText);
  }
};
getMonstruosFetchAsync();

const getMonstruoAjax = (id) => {
  cargarSpinner();
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        $btnEliminar.disabled = false;
        $btnCancelar.disabled = false;
        $btnGuardar.disabled = false;
        llenarFormulario(data);
        eliminarSpinner();
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });

  xhr.open("GET", `${url}/${id}`);
  xhr.send();
};
/* POST */
const postMonstruoAjax = (nuevoMonstruo) => {

  cargarSpinner();
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        actualizarTabla(data);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });

  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf8");
  xhr.send(JSON.stringify(nuevoMonstruo));
};
/* DELETE */
const deleteMonstruoAxios = (id) => {
  cargarSpinner();
  axios
  .delete(`${url}/${id}`)
  .then(({data}) => {
    console.log(`Elemento eliminado`);
  })
  .catch(({message}) => {
    console.error(xhr.status, xhr.statusText);
  })
};
/* const deleteMonstruoAjax = (id) => {
  cargarSpinner();
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });

  xhr.open("DELETE", `${url}/${id}`);
  xhr.send();
}; */
/* PUT */
const putMonstruoAjax = (nuevoMonstruo) => {
  cargarSpinner();
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });

  xhr.open("PUT", `${url}/${nuevoMonstruo.id}`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf8");
  xhr.send(JSON.stringify(nuevoMonstruo));
};

/* ACTUALIZAR TABLA */
function actualizarTabla(lista) {
  const listaArray = Array.from(lista);
  listaArray.sort((a, b) => parseInt(b.miedo) - parseInt(a.miedo));
  const container = document.querySelector(".table-responsive");
  while (container.hasChildNodes()) {
    container.removeChild(container.firstElementChild);
  }
  if (listaArray) {
    container.appendChild(crearTabla(listaArray));
  }
  eliminarSpinner();
  if(localStorage.getItem("columnasSeleccionadas") != null){
    onColumnasSeleccionadas(localStorage.getItem("columnasSeleccionadas"));
  }
}
//#endregion

/* EVENTOS */
//#region
/*document.getElementById("slcFiltro").addEventListener("change", (e) => {
  if(tipos.includes(e.target.value)){
    getMonstruosFetchAsync(e.target.value);
  }else {
    getMonstruosFetchAsync();
  }
});*/

window.addEventListener("submit", () => {
  if (validarAlta()) {
    const id = $form.id,
      nombre = $form.txtNombre.value,
      alias = $form.txtAlias.value,
      defensa = $form.rdoDefensa.value,
      tipo = $form.slcTipos.value,
      miedo = parseInt($form.slideMiedo.value)

    const monstruo = new Monstruo(
      id,
      nombre,
      tipo,
      alias,
      defensa,
      miedo
    );
    if ($btnGuardar.value === "btnGuardar") {
      monstruo.id = Date.now();
      postMonstruoAjax(monstruo);
    } else {
      putMonstruoAjax(monstruo);
    }
  }
});

window.addEventListener("click", (e) => {
  if (e.target.matches("tr td")) {
    onFilaSeleccionada(e.target.parentElement.dataset.id);
  }
  switch (e.target.id) {
    case "ddiTodos":
      getMonstruosFetchAsync();
      break;
    case "ddiEsqueleto":
      getMonstruosFetchAsync("Esqueleto");
      break;
    case "ddiZombie":
      getMonstruosFetchAsync("Zombie");
      break;
    case "ddiVampiro":
      getMonstruosFetchAsync("Vampiro");
      break;
    case "ddiFantasma":
      getMonstruosFetchAsync("Fantasma");
      break;
    case "ddiBruja":
      getMonstruosFetchAsync("Bruja");
      break;
    case "ddiHombreLobo":
      getMonstruosFetchAsync("Hombre Lobo");
      break;
    default:
      break;
  }
});

window.addEventListener("load", () => {
  añadirTipos()
  document
    .getElementById("btnCancelar")
    .addEventListener("click", ocultarBotones);
  document.getElementById("btnEliminar").addEventListener("click", () => {
    deleteMonstruoAxios(parseInt($form.id));
  });
  document.getElementById("columNombre").addEventListener("change", () => {
    saveColumnasSeleccionadas();
    $("td:nth-child(1)").toggle();
    $("th:nth-child(1)").toggle();
  });
  document.getElementById("columTipo").addEventListener("change", () => {
    saveColumnasSeleccionadas();
    $("td:nth-child(2)").toggle();
    $("th:nth-child(2)").toggle();
  });
  document.getElementById("columAlias").addEventListener("change", () => {
    saveColumnasSeleccionadas();
    $("td:nth-child(3)").toggle();
    $("th:nth-child(3)").toggle();
  });
  document.getElementById("columDefensa").addEventListener("change", () => {
    saveColumnasSeleccionadas();
    $("td:nth-child(4)").toggle();
    $("th:nth-child(4)").toggle();
  });
  document.getElementById("columMiedo").addEventListener("change", () => {
    saveColumnasSeleccionadas();
    $("td:nth-child(5)").toggle();
    $("th:nth-child(5)").toggle();
  });
  if(localStorage.getItem("columnasSeleccionadas") != null){
    onColumnasSeleccionadas(localStorage.getItem("columnasSeleccionadas"));
  }
});


function saveColumnasSeleccionadas(){
  localStorage.clear();
  let arrayColumnasSeleccionadas = Array.from([]);

  if(document.getElementById("columNombre").checked) arrayColumnasSeleccionadas.push("columNombre");
  if(document.getElementById("columTipo").checked) arrayColumnasSeleccionadas.push("columTipo");
  if(document.getElementById("columAlias").checked) arrayColumnasSeleccionadas.push("columAlias");
  if(document.getElementById("columDefensa").checked) arrayColumnasSeleccionadas.push("columDefensa");
  if(document.getElementById("columMiedo").checked) arrayColumnasSeleccionadas.push("columMiedo");

  localStorage.setItem("columnasSeleccionadas", arrayColumnasSeleccionadas);
}

function onColumnasSeleccionadas(columnasArray){
  const todasLasColumnas = Array.from(["columNombre", "columTipo", "columAlias", "columDefensa", "columMiedo"]);
  todasLasColumnas.forEach((id, indice) => {
    if(columnasArray.includes(id)){
      document.getElementById(id).checked = true;
    }else{
      document.getElementById(id).checked = false;
      let numeroDeColumna = indice+1;
      $('td:nth-child('+ numeroDeColumna +')').toggle();
      $('th:nth-child('+ numeroDeColumna +')').toggle();
    }
  })
}

//#endregion

/* FORMULARIO */
//#region
function llenarFormulario(monstruo) {
  $form.id = monstruo.id;
  $form.txtNombre.value = monstruo.nombre;
  $form.txtAlias.value = monstruo.alias;
  $form.rdoDefensa.value = monstruo.defensa;
  $form.slcTipos.value = monstruo.tipo;
  $form.slideMiedo.value = monstruo.miedo;
}

function ocultarBotones() {
  $form.reset();
  $btnEliminar.setAttribute("class", "invisible");
  $btnCancelar.setAttribute("class", "invisible");
  $btnGuardar.value = "btnGuardar";
  $form.id = "";
}

function mostrarBotones() {
  document
    .getElementById("btnEliminar")
    .setAttribute("class", "btn btn-danger");
  document
    .getElementById("btnCancelar")
    .setAttribute("class", "btn btn-warning");
}

function onFilaSeleccionada(id) {
  mostrarBotones();
  $btnGuardar.value = "btnModificar";
  $btnGuardar.disabled = true;
  $btnEliminar.disabled = true;
  $btnCancelar.disabled = true;
  getMonstruoAjax(parseInt(id));
}
//#endregion


/* VALIDACIONES */
//#region
function validarString(element) {
  if (element.value.length === 0 || !isNaN(element.value)) {
    alert("Solo ingresar letras!");
    element.focus();
  } else {
    return 1;
  }
}

function validarAlta() {
  if (
    validarString($form.txtNombre) &&
    validarString($form.txtAlias)
  ) {
    return 1;
  }
  return 0;
}
//#endregion

function aplicarReduce(data) {
  let sum = data.reduce(function (anterior, actual) {
    return (anterior += actual.miedo);
  }, 0);
  $inputPromedio.setAttribute("value", `${sum / data.length}`);

  let maximo = data.reduce(function (anterior, actual) {
    if(anterior > actual.miedo)
      return anterior
    else
      return actual.miedo
  }, 0);
  $inputMaximo.setAttribute("value", `${maximo}`);

  let minimo = data.reduce(function (anterior, actual) {
    if(anterior < actual.miedo)
      return anterior
    else
      return actual.miedo
  }, 101);
  $inputMinimo.setAttribute("value", `${minimo}`);
}
