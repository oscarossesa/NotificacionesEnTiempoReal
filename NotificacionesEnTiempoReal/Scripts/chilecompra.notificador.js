$.Notificador = function (options) {

    var defaults = {
        Controladores:
        {
            //GetNotificationContacts: '/Home/GetNotificationContacts'
            //GetNotificationContacts: '@Url.Action("GetNotificationContacts", "Home")'
            GetNotificationContacts: 'Notificador/Home/GetNotificationContacts'
            //GetNotificationContacts: 'Home/GetNotificationContacts'
        },
        Tipo: 0
    };

    var config = $.extend(defaults, options);

    $.Notificador.Init = function Init() {

        // signalr js code for start hub and send receive notification
        var notificationHub = $.connection.notificationHub;

        $.connection.hub.start().done();

        //signalr method for push server message to client
        notificationHub.client.notify = function (message) {
            if (message && message.toLowerCase() == "nuevocontacto") {
                $.Notificador.ActualizarContadorNotificacion();
                $.Notificador.ListarContactos();
                $.Notificador.LicitacionPublicada();
            }
        }

        $.Notificador.EsconderNotificacion();

    };

    $.Notificador.ActualizarContadorNotificacion = function ActualizarContadorNotificacion() {

        var count = 0;
        count = parseInt(jQuery.Notificador.CantidadUsuarios());
        $('span.count').html(count);

    };

    $.Notificador.CantidadUsuarios = function CantidadUsuarios() {

        var count = 0;

        $.ajax({
            type: 'GET',
            url: config.Controladores.GetNotificationContacts,
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

    $.Notificador.ListarContactos = function ListarContactos() {

        $.ajax({
            type: 'GET',
            url: config.Controladores.GetNotificationContacts,
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

    $.Notificador.VerContenidoNotificacion = function VerContenidoNotificacion() {

        $('#notiContent').empty();
        $('#notiContent').append($('<li>Cargando...</li>'));
        $.ajax({
            type: 'GET',
            url: config.Controladores.GetNotificationContacts,
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

    $.Notificador.EsconderNotificacion = function EsconderNotificacion() {

        $('html').click(function () {
            $('.noti-content').hide();
        })

    };

    $.Notificador.LicitacionPublicada = function LicitacionPublicada() {

        $.notify("Se ha publicado una nueva licitación: Data Center y Servicios Asociados.", "success");

    };

    
}