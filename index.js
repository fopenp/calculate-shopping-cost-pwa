let lingua = navigator.language || navigator.userLanguage;
console.log(`Lingua rilevata: ${lingua}`);
if (lingua == "it-IT" || lingua == "it-CH" || lingua == "it")
    lingua = "it";
else
    lingua = "en";

let Globali = {
    valuta: 0,  // 0 => EUR ; 1 => USD
    valutaSimbolo: "€",
    chk050: true,
    chk1: true,
    chk2: true,
    chk5: true,
    radEUR: true,
    radUSD: false,
    radGGMMAA: true,
    radMMGGAA: false,
    movimenti: [],
    saldo: 0.0,
    totSpesa: 0.0,
    dadare: 0.0
}

function salvaSulloStorage() {
    const json = JSON.stringify(Globali);
    localStorage.setItem("Globali", json);
    console.log("Impostazioni globali salvate nello storage locale.");
}

function caricaDalloStorage() {
    const json = localStorage.getItem("Globali");
    if (json === null) {
        console.log("Impostazioni globali non trovate nello storage locale.");
        return;
    }
    let obj = JSON.parse(json);
    Globali = obj;
    console.log("Impostazioni globali caricate dallo storage locale.");
}

function aggiornaValutaSimboloNellePagine() {
    const cn = document.getElementsByClassName("valutaSimbolo");
    Array.prototype.forEach.call(cn, function (element) {
        element.textContent = Globali.valutaSimbolo;
    });

    document.getElementById("lblChk1").textContent = `1${Globali.valutaSimbolo}`;
    document.getElementById("lblChk2").textContent = `2${Globali.valutaSimbolo}`;
    document.getElementById("lblChk5").textContent = `5${Globali.valutaSimbolo}`;
}

function impostaChkBoxes() {
    document.getElementById("chk050").checked = Globali.chk050;
    document.getElementById("chk1").checked = Globali.chk1;
    document.getElementById("chk2").checked = Globali.chk2;
    document.getElementById("chk5").checked = Globali.chk5;
}

let barraNavId = 0;  // 0 => spesa ; 1 => saldo ; 2 => impostazioni ; 3 => movimenti ; 4 => crediti

let _barraNavPassaAlId_attuale = "";
let _barraNavPassaAlId_successivo = "";

function barraNavPassaAlId(id) {
    if (barraNavId === id)
        return;

    let attuale = "";
    let successivo = "";

    if (barraNavId === 0) {
        attuale = "spesa";
    }
    else if (barraNavId === 1) {
        attuale = "saldo";
    }
    else if (barraNavId === 2) {
        attuale = "impostazioni";
    }
    else if (barraNavId === 3) {
        attuale = "movimenti";
    }
    else if (barraNavId === 4) {
        attuale = "crediti";
    }

    if (id === 0) {
        successivo = "spesa";
    }
    else if (id === 1) {
        successivo = "saldo";
    }
    else if (id === 2) {
        successivo = "impostazioni";
    }
    else if (id === 3) {
        successivo = "movimenti";
    }
    else if (id === 4) {
        successivo = "crediti";
    }

    _barraNavPassaAlId_attuale = attuale;
    _barraNavPassaAlId_successivo = successivo;

    // Se il nuovo ID e' piu' grande, fare uno scroll a destra;
    // altrimenti, se l'ID e' piu' piccolo, fare uno scroll a sinistra.
    if (id > barraNavId) {
        document.getElementById(successivo).classList.remove("trnsTransformOpacity");
        document.getElementById(successivo).classList.remove("staiASx");
        document.getElementById(successivo).classList.add("staiADx");
        // document.getElementById(successivo).classList.remove("nodisplay");
        document.getElementById(attuale).classList.add("staiASx");
        document.getElementById(successivo).inert = false;
        const prom1 = new Promise((risolta, rifiutata) => {
            setTimeout(() => {
                document.getElementById(successivo).classList.add("trnsTransformOpacity");
                document.getElementById(successivo).classList.remove("opacity0");
        
                const prom2 = new Promise((risolta, rifiutata) => {
                    setTimeout(() => {
                        document.getElementById(_barraNavPassaAlId_successivo).classList.remove("staiADx");
                        document.getElementById(_barraNavPassaAlId_attuale).classList.add("opacity0");
                        document.getElementById(_barraNavPassaAlId_attuale).inert = true;
                    }, 50);
                });
            }, 50);
        });
    }
    else {
        document.getElementById(successivo).classList.remove("trnsTransformOpacity");
        document.getElementById(successivo).classList.remove("staiADx");
        document.getElementById(successivo).classList.add("staiASx");
        // document.getElementById(successivo).classList.remove("nodisplay");
        document.getElementById(attuale).classList.add("staiADx");
        document.getElementById(successivo).inert = false;
        const prom1 = new Promise((risolta, rifiutata) => {
            setTimeout(() => {
                document.getElementById(successivo).classList.add("trnsTransformOpacity");
                document.getElementById(successivo).classList.remove("opacity0");
        
                const prom2 = new Promise((risolta, rifiutata) => {
                    setTimeout(() => {
                        document.getElementById(_barraNavPassaAlId_successivo).classList.remove("staiASx");
                        document.getElementById(_barraNavPassaAlId_attuale).classList.add("opacity0");
                        document.getElementById(_barraNavPassaAlId_attuale).inert = true;
                    }, 50);
                });
            }, 50);
        });
    }

    barraNavId = id;
}

function btnSpesa() {
    console.log("Premuto il bottone Spesa");

    if (barraNavId === 0)
        return;


    document.getElementById("divSpesa").style.opacity = "1.0"
    document.getElementById("divSpesa").style.backgroundColor = "#353535";
    document.getElementById("divSaldo").style.opacity = "0.4"
    document.getElementById("divSaldo").style.backgroundColor = "unset";
    document.getElementById("divImpostazioni").style.opacity = "0.4"
    document.getElementById("divImpostazioni").style.backgroundColor = "unset";

    barraNavPassaAlId(0);
}

function btnSaldo() {
    console.log("Premuto il bottone Saldo");

    if (barraNavId === 1)
        return;
    

    document.getElementById("divSpesa").style.opacity = "0.4"
    document.getElementById("divSpesa").style.backgroundColor = "unset";
    document.getElementById("divSaldo").style.opacity = "1.0"
    document.getElementById("divSaldo").style.backgroundColor = "#353535";
    document.getElementById("divImpostazioni").style.opacity = "0.4"
    document.getElementById("divImpostazioni").style.backgroundColor = "unset";

    barraNavPassaAlId(1);
}

function btnImpostazioni() {
    console.log("Premuto il bottone Impostazioni");

    if (barraNavId === 2)
        return;
    
    document.getElementById("divSpesa").style.opacity = "0.4"
    document.getElementById("divSpesa").style.backgroundColor = "unset";
    document.getElementById("divSaldo").style.opacity = "0.4"
    document.getElementById("divSaldo").style.backgroundColor = "unset";
    document.getElementById("divImpostazioni").style.opacity = "1.0"
    document.getElementById("divImpostazioni").style.backgroundColor = "#353535";

    barraNavPassaAlId(2);
}

function aggiornaUIImpostazioni() {
    const radEUR = document.getElementById("radEUR");
    const radUSD = document.getElementById("radUSD");
    const radGGMMAA = document.getElementById("radGGMMAA");
    const radMMGGAA = document.getElementById("radMMGGAA");

    if (Globali.radEUR) {
        radEUR.checked = true
        radUSD.checked = false
    }
    else if (Globali.radUSD) {
        radEUR.checked = false
        radUSD.checked = true
    }

    if (Globali.radGGMMAA) {
        radGGMMAA.checked = true;
        radMMGGAA.checked = false;
    }
    else if (Globali.radMMGGAA) {
        radGGMMAA.checked = false;
        radMMGGAA.checked = true;
    }
}

function aggiornaMovimenti() {
    const txtListaMovimenti = document.getElementById("txtListaMovimenti");
    txtListaMovimenti.innerHTML = "";
    let stringa = "";

    for (let i = 0; i < Globali.movimenti.length; i++) {
        const movimento = Globali.movimenti[i];
        if (Globali.radGGMMAA) {
            stringa += `${movimento.giorno}/${movimento.mese}/${movimento.anno} `;
            if (movimento.ore < 10)
                stringa += "0";
            stringa += `${movimento.ore}:`;
            if (movimento.min < 10)
                stringa += "0";
            stringa += `${movimento.min} - ${movimento.saldo.toFixed(2)}${Globali.valutaSimbolo}<br><br>`;
        }
        else if (Globali.radMMGGAA) {
            stringa += `${movimento.mese}/${movimento.giorno}/${movimento.anno} `;
            if (movimento.ore < 10)
                stringa += "0";
            stringa += `${movimento.ore}:`;
            if (movimento.min < 10)
                stringa += "0";
            stringa += `${movimento.min} - ${movimento.saldo.toFixed(2)}${Globali.valutaSimbolo}<br><br>`;
        }
    }

    txtListaMovimenti.innerHTML = stringa;
}

function calcolaContantiDaDare() {
    /*
    if (Globali.totSpesa === 0.0)
        return;
    */

    let dadare = Globali.totSpesa - Globali.saldo;
    if (dadare < 0.0)
        dadare = 0.0;

    let dadareCents = Math.round((dadare - Math.trunc(dadare)) * 100.0);
    let dadareUnita = Math.round(dadare - (dadareCents / 100.0));
    // console.log(`calcolaContantiDaDare() - dadare unita cents: ${dadareUnita} ${dadareCents}`);
    if (dadareCents < 50 && dadareCents != 0) {
        dadareCents = 50;
        dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
    }
    if (dadareCents > 50) {
        dadareUnita += 1;
        dadareCents = 0;
        dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
    }
    if (!Globali.chk050) {
        if (dadareCents >= 50)
            dadareUnita += 1;
        dadareCents = 0;
        dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
    }
    if (!Globali.chk1) {
        let dadareMod10 = dadareUnita % 10;
        if (dadareMod10 == 1) {
            dadareUnita += 1;
            dadareCents = 0;
            dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
        }
    }
    if (!Globali.chk2) {
        let dadareMod10 = dadareUnita % 10;
        if (dadareMod10 == 2) {
            dadareUnita += 3;
            dadareCents = 0;
            dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
        }
    }
    if (!Globali.chk5) {
        let dadareMod10 = dadareUnita % 10;
        if (dadareMod10 == 5) {
            dadareUnita += 5;
            dadareCents = 0;
            dadare = 0.0 + dadareUnita + (dadareCents / 100.0)
        }
    }
    Globali.dadare = dadare;
    // console.log(`calcolaContantiDaDare() - dadare: ${dadare} - ${dadareUnita} ${dadareCents}`);
    document.getElementById("divContantiDaDare").textContent = dadare.toFixed(2);
    salvaSulloStorage();
}

function aggiornaUltimoSaldo() {
    if (Globali.movimenti.length === 0)
        return;

    const movimento = Globali.movimenti[0];
    const txtDataUltimoSaldo = document.getElementById("txtDataUltimoSaldo");
    if (Globali.radGGMMAA) {
        let stringa = "";
        stringa += `${movimento.giorno}/${movimento.mese}/${movimento.anno} `;
        if (movimento.ore < 10)
            stringa += "0";
        stringa += `${movimento.ore}:`;
        if (movimento.min < 10)
            stringa += "0";
        stringa += `${movimento.min}`;

        txtDataUltimoSaldo.textContent = stringa;
    }
    else if (Globali.radMMGGAA) {
        let stringa = "";
        stringa += `${movimento.mese}/${movimento.giorno}/${movimento.anno} `;
        if (movimento.ore < 10)
            stringa += "0";
        stringa += `${movimento.ore}:`;
        if (movimento.min < 10)
            stringa += "0";
        stringa += `${movimento.min}`;

        txtDataUltimoSaldo.textContent = stringa;
    }
}

function fnNuovoSaldo() {
    let inSaldo = document.getElementById("inSaldo").valueAsNumber;
    if (inSaldo === NaN) {
        inSaldo = 0.0;
    }
    // console.log("inSaldo: ", inSaldo);

    if (Globali.movimenti.length > 0) {
        // Se il saldo impostato e' uguale all'ultimo saldo inserito, non inserire ancora il saldo.
        if (Globali.movimenti[0].saldo === inSaldo)
            return;
    }

    Globali.saldo = inSaldo;

    const adesso = new Date();
    var movimento = {};
    movimento.saldo = inSaldo;
    movimento.giorno = adesso.getDate();  // il giorno del mese
    movimento.mese = adesso.getMonth() + 1;
    movimento.anno = adesso.getFullYear();
    movimento.ore = adesso.getHours();
    movimento.min = adesso.getMinutes();
    Globali.movimenti.unshift(movimento);

    aggiornaUltimoSaldo();
    aggiornaMovimenti();
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function btnCancellaMovimenti() {
    Globali.movimenti = [];
    document.getElementById("txtListaMovimenti").innerHTML = "";
    document.getElementById("txtDataUltimoSaldo").innerHTML = "--/--/---- --:--";
    /*
    Globali.saldo = 0.0;
    document.getElementById("inSaldo").value = "0.00";
    */
}

function aggiornaSaldo() {
    document.getElementById("inSaldo").value = Globali.saldo.toFixed(2);
}

function btnSaldoBack() {
    document.getElementById("inSaldo").value = Globali.saldo.toFixed(2);
}

function aggiornaTotSpesa() {
    let tot = document.getElementById("inTotSpesa").valueAsNumber;
    if (isNaN(tot))
        tot = 0.0;

    Globali.totSpesa = tot;

    calcolaContantiDaDare();
    salvaSulloStorage();
}

function aggiornaInTotSpesa() {
    document.getElementById("inTotSpesa").value = Globali.totSpesa.toFixed(2);
}

function fnChk050() {
    Globali.chk050 = document.getElementById("chk050").checked;
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function fnChk1() {
    Globali.chk1 = document.getElementById("chk1").checked;
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function fnChk2() {
    Globali.chk2 = document.getElementById("chk2").checked;
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function fnChk5() {
    Globali.chk5 = document.getElementById("chk5").checked;
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function fnSottrai() {
    if (Globali.totSpesa === 0.0)
        return;

    let computo = Globali.totSpesa - Globali.dadare;
    if (computo < 0.0)
        computo = 0.0;

    Globali.saldo -= computo;
    aggiornaSaldo();

    Globali.totSpesa = 0.0;
    Globali.dadare = 0.0;

    fnNuovoSaldo();
    aggiornaInTotSpesa();
    calcolaContantiDaDare();
    salvaSulloStorage();
}

function fnRadValute() {
    Globali.radEUR = document.getElementById("radEUR").checked;
    Globali.radUSD = document.getElementById("radUSD").checked;

    if (Globali.radEUR) {
        Globali.valuta = 0;
        Globali.valutaSimbolo = "€";
    }
    else if (Globali.radUSD) {
        Globali.valuta = 1;
        Globali.valutaSimbolo = "$";
    }
    aggiornaValutaSimboloNellePagine();
    salvaSulloStorage();
}

function fnRadAA() {
    Globali.radGGMMAA = document.getElementById("radGGMMAA").checked;
    Globali.radMMGGAA = document.getElementById("radMMGGAA").checked;

    aggiornaMovimenti();
    aggiornaUltimoSaldo();
    salvaSulloStorage();
}

function processaTouchMove(ev) {
    console.log("touchmove");
}

function aggiungiEventiTouch() {
    const spesa = document.getElementById("spesa");
    spesa.addEventListener("touchmove", processaTouchMove, false);
}
