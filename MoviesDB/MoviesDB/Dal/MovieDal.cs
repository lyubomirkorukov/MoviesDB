using MoviesDB.Dal.Interfaces;
using MoviesDB.Entities;
using MoviesDB.Models.App;
using MoviesDB.Models.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesDB.Dal
{
    public class MovieDal : IMovieDal
    {
        public void Add(MovieModel movie)
        {
            using (var context = new MovieDBEntities())
            {
                var entity = context.Movies.Create();

                entity.Title = movie.Title;
                entity.Director = movie.Director;
                entity.DateReleased = movie.DateReleased;

                context.Movies.Add(entity);
                context.SaveChanges();
            }
        }

        public MovieModel Get(int id)
        {
            using (var context = new MovieDBEntities())
            {
                var entity = (from m in context.Movies
                              where m.Id == id
                              select new MovieModel
                              {
                                  Id = m.Id,
                                  Title = m.Title,
                                  Director = m.Director,
                                  DateReleased = m.DateReleased
                              }).SingleOrDefault();

                return entity;
            }
        }

        public PagingModel GetAll(PagingModel pagingModel)
        {
            using (var context = new MovieDBEntities())
            {
                var entities = (from m in context.Movies
                                select new MovieModel
                                {
                                    Id = m.Id,
                                    Title = m.Title,
                                    Director = m.Director,
                                    DateReleased = m.DateReleased
                                })
                                .ToList();

                pagingModel.TotalMovies = entities.Count();

                var skipCount = (pagingModel.Page - 1) * pagingModel.PageSize;
                pagingModel.Movies = entities.OrderBy(m => m.Id).Skip(skipCount).Take(pagingModel.PageSize).ToList();
                
                return pagingModel;
            }
        }

        public void Update(MovieModel movie)
        {
            using (var context = new MovieDBEntities())
            {
                var entity = (from m in context.Movies
                              where m.Id == movie.Id
                              select m).Single(); // not using SingleOrDefault() because by convention, when we search by Id, if there are no results, we should throw an Exception

                entity.Title = movie.Title;
                entity.Director = movie.Director;
                entity.DateReleased = movie.DateReleased;

                context.SaveChanges();
            }
        }
    }
}