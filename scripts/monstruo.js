import Personaje from "./personaje.js";

class Monstruo extends Personaje{
    constructor(id, nombre, tipo, alias, defensa, miedo){
        super(id, nombre, tipo);
        this.alias = alias;
        this.defensa = defensa;
        this.miedo = miedo;
    }
}

export default Monstruo;