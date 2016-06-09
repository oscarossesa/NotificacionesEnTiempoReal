jQuery.Notificador = function (options) {

    var defaults = {
        Controladores:
        {
            GetPrecioCaro: 'PrecioCaro/Index',
            GetCantidadReportes: 'PrecioCaro/CantidadReportes'
        },
        Tipo: 0
    };

    var config = $.extend(defaults, options);

    jQuery.Notificador.Init = function Init() {

        verContactos();
        actualizarContador();

        // ver contactos
        function verContactos() {
            $.ajax({
                type: 'GET',
                //url: '/Home/GetNotificationContacts',
                //url: '@Url.Action("GetNotificationContacts", "Home")',
                //url: 'Home/GetNotificationContacts',
                url: 'Notificador/Home/GetNotificationContacts',
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
        }

        // update notification count
        function actualizarContador() {
            var count = 0;

            $.ajax({
                type: 'GET',
                //url: '/Home/GetNotificationContacts',
                //url: '@Url.Action("GetNotificationContacts", "Home")',
                //url: 'Home/GetNotificationContacts',
                url: 'Notificador/Home/GetNotificationContacts',
                success: function (response) {
                    count = parseInt(response.length);
                    $('span.count').html(count);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

        // signalr js code for start hub and send receive notification
        var notificationHub = $.connection.notificationHub;

        $.connection.hub.start().done();

        //signalr method for push server message to client
        notificationHub.client.notify = function (message) {
            if (message && message.toLowerCase() == "nuevocontacto") {
                verContactos();
                actualizarContador();
            }
        }

    };

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