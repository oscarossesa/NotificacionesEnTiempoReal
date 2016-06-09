using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NotificacionesEnTiempoReal.Models
{
    public class Usuario
    {
        public int ContactID { get; set; }
        public string ContactName { get; set; }
        public string ContactNo { get; set; }
        public DateTime AddedOn { get; set; }
    }
}