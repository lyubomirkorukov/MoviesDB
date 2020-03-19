using MoviesDB.Models.App;
using MoviesDB.Models.Web;
using MoviesDB.Providers;
using MoviesDB.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using System.IO;
using log4net;

namespace MoviesDB.Controllers
{
    public class MovieController : Controller
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(MovieController));

        private IMovieService movieService;

        public MovieController(IMovieService movieService)
        {
            this.movieService = movieService;
        }

        public ActionResult Index()
        {
            ViewBag.Title = "Movies List";

            var model = new MovieWebModel();
            model.PageSize = ConfigurationProvider.Instance.GetPageSize();

            return View(model);
        }

        [HttpPost]
        [Route("movie/getall")]
        public ActionResult GetAll(PagingModel pagingModel)
        {
            var response = new ResponseModel();            

            try
            {
                response.Data = this.movieService.GetAll(pagingModel);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                log.Error(ex.Message);                
            }

            return Json(response);
        }

        [HttpPost]
        [Route("movie/upsert")]
        public ActionResult Upsert(PagingModel pagingModel)
        {
            var response = new ResponseModel();

            try
            {
                response.Data = this.movieService.Upsert(pagingModel);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                log.Error(ex.Message);                
            }

            return Json(response);
        }
    }
}