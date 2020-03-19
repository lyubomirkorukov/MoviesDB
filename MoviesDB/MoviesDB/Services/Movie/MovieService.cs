using MoviesDB.Dal.Interfaces;
using MoviesDB.Models.App;
using MoviesDB.Models.Web;
using MoviesDB.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Services.Movie
{
    public class MovieService : IMovieService
    {
        private IMovieDal movieDal;

        public MovieService(IMovieDal movieDal)
        {
            this.movieDal = movieDal;
        }

        public PagingModel GetAll(PagingModel pagingModel)
        {
            return this.movieDal.GetAll(pagingModel);
        }

        public PagingModel Upsert(PagingModel pagingModel)
        {
            var model = this.movieDal.Get(pagingModel.Movie.Id);

            if (model == null)
            {
                this.movieDal.Add(pagingModel.Movie);
            }
            else
            {
                this.movieDal.Update(pagingModel.Movie);
            }

            return this.movieDal.GetAll(pagingModel);
        }
    }
}