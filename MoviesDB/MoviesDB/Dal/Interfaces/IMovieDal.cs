using MoviesDB.Models.App;
using MoviesDB.Models.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Dal.Interfaces
{
    public interface IMovieDal
    {
        void Add(MovieModel movie);

        void Update(MovieModel movie);

        MovieModel Get(int id);

        PagingModel GetAll(PagingModel pagingModel);
    }
}