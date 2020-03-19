using MoviesDB.Models.App;
using MoviesDB.Models.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Services.Interfaces
{
    public interface IMovieService
    {
        PagingModel GetAll(PagingModel pagingModel);

        PagingModel Upsert(PagingModel movie);
    }
}