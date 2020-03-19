using MoviesDB.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Models.Web
{
    public class PagingModel
    {
        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalMovies { get; set; }

        public MovieModel Movie { get; set; }

        public IEnumerable<MovieModel> Movies { get; set; }
    }
}