/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Maquette.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'Maquette',

        settings: 'Bienvenue sur le projet maquette. </br></br> L onglet "<b>Consult DB</b>" est celui qui nous interesse'
        + '. Il vous permet d inialiser une DB en locale grâce à l API indexedDB.</br> Une fois initialisé, vous pouvez'
        + ' y ajouter des élèments, consulter tout les élèments stockés dans la DB et clear </br>la DB (efface touts les elements) .'
        + ' Il n y-a pas de réelle gestion d erreur, vous pouvez ajouter un element vide, la date de</br> naissance, dans tout les cas,'
        + ' n est pas prise en compte.</br> Une fois initialisé, vous n avez plus besoin d utiliser le bouton "<b>init DB</b>."'
    }

    //TODO - add data, formulas and/or methods to support your view
});
