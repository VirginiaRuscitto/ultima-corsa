function InstructionsPage() {
  return (
    <div className="instructions-container">

        <h1>Come si gioca</h1>

        <p>
            <strong>Ultima Corsa</strong> è un gioco in cui devi attraversare una città
            piena di linee della metropolitana per arrivare alla tua destinazione.
        </p>

        <p>
            Parti sempre con <strong>20 monete</strong>. Il tuo obiettivo è semplice:
            arrivare alla meta con il punteggio più alto possibile.
        </p>

        <hr />

        <h2>L’obiettivo</h2>
        <p>
            Ti verranno assegnate <strong>una stazione di partenza e una di arrivo</strong>.
            Devi capire come arrivarci scegliendo il percorso giusto.
        </p>

        <p>
            Attenzione: lungo il viaggio possono succedere eventi imprevisti
            che ti fanno guadagnare o perdere monete.
        </p>

        <hr />

        <h2>La città</h2>
        <p>
            La rete della metropolitana è sempre la stessa e include:
        </p>
        <ul>
            <li>più linee diverse</li>
            <li>molte stazioni collegate tra loro</li>
            <li>alcuni punti di cambio linea</li>
        </ul>

        <p>
            Alcune stazioni permettono di cambiare linea, altre no.
            Sta a te capire come muoverti.
        </p>

        <hr />

        <h2>Come si gioca una partita</h2>

        <h3>1. Osserva</h3>
        <p>
            All’inizio puoi guardare tutta la mappa con calma per capire come è fatta la città.
        </p>

        <h3>2. Pianifica</h3>

        <p>
        Ti vengono assegnate una stazione di partenza e una di arrivo.
        </p>

        <p>
        Hai <strong>90 secondi</strong> per costruire un percorso valido senza guardare la mappa, scegliendo
        delle tratte fra tutte quelle disponibili.
        </p>

        <p>
        Il tuo obiettivo è creare una sequenza di collegamenti che:
        </p>

        <ul>
        <li>parta dalla stazione iniziale</li>
        <li>arrivi alla destinazione finale</li>
        <li>usi solo tratte realmente collegate tra loro</li>
        </ul>

        <p>
        Quando il tempo finisce, il percorso viene automaticamente salvato così com’è.
        </p>

        <h3>3. Viaggio</h3>

        <p>
        Una volta inviato il percorso, il viaggio viene simulato tappa per tappa.
        </p>

        <p>
        Durante il percorso possono verificarsi <strong>eventi casuali </strong>
        che influenzano il tuo punteggio.
        </p>

        <p>
        Gli eventi possono farti guadagnare monete,
        perderle oppure non avere alcun effetto.
        </p>

        <p>
        Il punteggio finale dipende da ciò che accade lungo tutto il viaggio.
        </p>

        <h3>4. Risultato</h3>
        <p>
            Alla fine del viaggio scopri il tuo punteggio finale.
            Se scende sotto zero, viene comunque considerato 0.
        </p>

        <hr />

        <h2>Consiglio</h2>
        <p>
            Non esiste un unico percorso giusto: a volte il più veloce non è il più sicuro.
            Scegli bene… e buona fortuna!
        </p>

    </div>
  );
}

export default InstructionsPage;