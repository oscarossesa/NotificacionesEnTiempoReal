using System.Collections.Specialized;
using System.Configuration;
using System.Data.SqlClient;

namespace NotificacionesEnTiempoReal
{
    public class DBHelper
    {
        public enum ConexionEnum
        {
            DCCPProcurement = 0,
            CMII = 1,
            DCCPAdministracion = 2,
            DCCPPlatform = 3,
            DemoSignalr = 4
        }

        public static SqlConnection Connect(ConexionEnum conexionEnum)
        {
            //var config = ((NameValueCollection)ConfigurationManager.GetSection("ConexionesBD"))[conexionEnum.ToString()];

            return Connect(conexionEnum.ToString());
        }

        public static SqlConnection Connect(string conexion)
        {
            var config = ((NameValueCollection)ConfigurationManager.GetSection("ConexionesBD"))[conexion];

            return new SqlConnection(config);
        }
    }
}