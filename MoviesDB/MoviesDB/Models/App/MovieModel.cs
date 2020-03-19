using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Models.App
{
    public class MovieModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Director { get; set; }

        public DateTime? DateReleased { get; set; }
    }
}