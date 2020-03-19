using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Models.Web
{
    public class ResponseModel
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public object Data { get; set; }
    }
}