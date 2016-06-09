﻿jQuery.Notificador = function (options) {

    var defaults = {
        Controladores:
        {
            A: '/Home/GetNotificationContacts',
            B: '@Url.Action("GetNotificationContacts", "Home")',
            C: 'Notificador/Home/GetNotificationContacts',
            D: 'Home/GetNotificationContacts'
        },
        Tipo: 0
    };

    var config = $.extend(defaults, options);

    jQuery.Notificador.Init = function Init() {

        // signalr js code for start hub and send receive notification
        var notificationHub = $.connection.notificationHub;

        $.connection.hub.start().done();

        //signalr method for push server message to client
        notificationHub.client.notify = function (message) {
            if (message && message.toLowerCase() == "nuevocontacto") {
                jQuery.Notificador.ActualizarContadorNotificacion();
                jQuery.Notificador.ListarContactos();
            }
        }        

        jQuery.Notificador.EsconderNotificacion();

    };

    jQuery.Notificador.ActualizarContadorNotificacion = function ActualizarContadorNotificacion() {

        var count = 0;
        count = parseInt(jQuery.Notificador.CantidadUsuarios());
        $('span.count').html(count);

    };

    jQuery.Notificador.CantidadUsuarios = function CantidadUsuarios() {

        $.ajax({
            type: 'GET',
            url: config.Controladores.D,
            async: false,
            success: function (response) {
                count = parseInt(response.length);                
            },
            error: function (error) {
                console.log(error);
            }
        });

        return count;
    };
    
    jQuery.Notificador.ListarContactos = function ListarContactos() {

        $.ajax({
            type: 'GET',
            url: config.Controladores.D,
            success: function (response) {
                $('#contentContacts').empty();
                $.each(response, function (index, value) {
                    $('#contentContacts').append($('<li>' + value.ContactName + '</li>'));
                });
            },
            error: function (error) {
                console.log(error);
            }
        });

    };    

    jQuery.Notificador.VerContenidoNotificacion = function VerContenidoNotificacion() {

        $('#notiContent').empty();
        $('#notiContent').append($('<li>Loading...</li>'));
        $.ajax({
            type: 'GET',
            url: config.Controladores.D,
            success: function (response) {
                $('#notiContent').empty();
                if (response.length == 0) {
                    $('#notiContent').append($('<li>No data available</li>'));
                }
                $.each(response, function (index, value) {
                    $('#notiContent').append($('<li>New contact : ' + value.ContactName + ' (' + value.ContactNo + ') added</li>'));
                });
            },
            error: function (error) {
                console.log(error);
            }
        });

    };   

    jQuery.Notificador.EsconderNotificacion = function EsconderNotificacion() {
    
        $('html').click(function () {
            $('.noti-content').hide();
        })
    
    };
    
/*

    jQuery.Notificador.VerContactos = function VerContactos() {

    

    };

*/




    //jQuery.Notificador.Init = function Init() {

    //    updateContact();

    //    // Click on notification icon for show notification
    //    $('span.noti').click(function (e) {
    //        e.stopPropagation();
    //        $('.noti-content').show();
    //        var count = 0;
    //        count = parseInt($('span.count').html()) || 0;
    //        //only load notification if not already loaded
    //        updateNotification();
    //        //if (count > 0) {
    //        //	updateNotification();
    //        //}
    //        $('span.count', this).html('&nbsp;');
    //    })

    //    // hide notifications
    //    $('html').click(function () {
    //        $('.noti-content').hide();
    //    })

    //    // update notification
    //    function updateNotification() {
    //        $('#notiContent').empty();
    //        $('#notiContent').append($('<li>Loading...</li>'));
    //        $.ajax({
    //            type: 'GET',
    //            //url: '/home/GetNotificationContacts',
    //            //url: '@Url.Action("GetNotificationContacts", "Home")',
    //            //url: 'Home/GetNotificationContacts',
    //            url: 'Notificador/Home/GetNotificationContacts',
    //            success: function (response) {
    //                $('#notiContent').empty();
    //                if (response.length == 0) {
    //                    $('#notiContent').append($('<li>No data available</li>'));
    //                }
    //                $.each(response, function (index, value) {
    //                    $('#notiContent').append($('<li>New contact : ' + value.ContactName + ' (' + value.ContactNo + ') added</li>'));
    //                });
    //            },
    //            error: function (error) {
    //                console.log(error);
    //            }
    //        });
    //    }

    //    // update notification count
    //    function updateNotificationCount() {
    //        var count = 0;
    //        count = parseInt($('span.count').html()) || 0;
    //        count++;
    //        $('span.count').html(count);
    //    }

    //    // update notification count
    //    function updateContact() {
    //        $.ajax({
    //            type: 'GET',
    //            //url: '/Home/GetNotificationContacts',
    //            //url: '@Url.Action("GetNotificationContacts", "Home")',
    //            //url: 'Home/GetNotificationContacts',
    //            url: 'Notificador/Home/GetNotificationContacts',
    //            success: function (response) {
    //                $.each(response, function (index, value) {
    //                    $('#contentContacts').append($('<li>New contact : ' + value.ContactName + ' (' + value.ContactNo + ') added</li>'));
    //                });
    //            },
    //            error: function (error) {
    //                console.log(error);
    //            }
    //        });
    //    }

    //    // signalr js code for start hub and send receive notification
    //    var notificationHub = $.connection.notificationHub;
    //    $.connection.hub.start().done(function () {
    //        console.log('Notification hub started');
    //    });

    //    //signalr method for push server message to client
    //    notificationHub.client.notify = function (message) {
    //        if (message && message.toLowerCase() == "added") {
    //            updateNotificationCount();
    //            updateContact();
    //        }
    //    }

    //};
}