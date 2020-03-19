using MoviesDB.Providers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MoviesDB.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return this.Redirect("~/movie/index");
        }
    }
}