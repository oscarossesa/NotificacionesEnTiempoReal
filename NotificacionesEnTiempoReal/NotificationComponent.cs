using Dapper;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace NotificacionesEnTiempoReal
{
    public class NotificationComponent
    {
        public void RegisterNotification(DateTime currentTime)
        {
            //string conString = ConfigurationManager.ConnectionStrings["SqlConString"].ConnectionString;

            string conString = ((NameValueCollection)ConfigurationManager.GetSection("ConexionesBD"))["DemoSignalr"];

            //string sqlCommand = @"SELECT [ContactID], [ContactName], [ContactNo] from [dbo].[Contacts] where [AddedOn] > @AddedOn";

            string sqlCommand = @"SELECT [ContactID], [ContactName], [ContactNo] from [dbo].[Contacts]";

            using (SqlConnection con = new SqlConnection(conString))
            {
                SqlCommand cmd = new SqlCommand(sqlCommand, con);
                //cmd.Parameters.AddWithValue("@AddedOn", currentTime);


                if (con.State != System.Data.ConnectionState.Open)
                {
                    con.Open();
                }

                cmd.Notification = null;
                SqlDependency sqlDep = new SqlDependency(cmd);
                sqlDep.OnChange += sqlDependency_OnChange;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                }
            }
        }

        private void sqlDependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            //or you can also check => if (e.Info == SqlNotificationInfo.Insert) , if you want notification only for inserted record
            //if (e.Type == SqlNotificationType.Change)
            //{
            //    SqlDependency sqlDep = sender as SqlDependency;
            //    sqlDep.OnChange -= sqlDependency_OnChange;

            //    //from here we will send notification message to client
            //    var notificationHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            //    notificationHub.Clients.All.notify("added");
            //}

            if (e.Info == SqlNotificationInfo.Insert)
            {
                SqlDependency sqlDep = sender as SqlDependency;
                sqlDep.OnChange -= sqlDependency_OnChange;

                //from here we will send notification message to client
                var notificationHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
                notificationHub.Clients.All.notify("nuevoContacto");
            }

            //if (e.Info == SqlNotificationInfo.Insert)
            //{
            //    //This is how signalrHub can be accessed outside the SignalR Hub Notification.cs file
            //    var notificationHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

            //    NotificationComponent NC = new NotificationComponent();
            //    var list = NC.ObtenerContactos(DateTime.Now); //Dapper

            //    //LastRun = DateTime.Now.ToUniversalTime();

            //    foreach (var item in list)
            //    {
            //        //replace domain name with your own domain name
            //        notificationHub.Clients.User("<DomainName>" + item.ContactID).addLatestNotification(item);
            //    }
            //}

            //Call the RegisterNotification method again
            RegisterNotification(DateTime.Now);
        }

        //public List<Contacts> GetContacts(DateTime afterDate)
        //{
        //    using (DemoNotificacionesEnTiempoRealEntities dc = new DemoNotificacionesEnTiempoRealEntities())
        //    {
        //        return dc.Contacts.Where(a => a.AddedOn > afterDate).OrderByDescending(a => a.AddedOn).ToList();
        //    }
        //}

        public List<Contacts> ObtenerContactos(DateTime afterDate)
        {
            var lista = new List<Contacts>();

            using (var connection = DBHelper.Connect(DBHelper.ConexionEnum.DemoSignalr))
            {
                connection.Open();

                lista = connection.Query<Contacts>("ObtenerContactos", commandType: CommandType.StoredProcedure).ToList();
            }

            return lista;
        }
    }
}