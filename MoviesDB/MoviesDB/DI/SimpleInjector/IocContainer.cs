using MoviesDB.Dal;
using MoviesDB.Dal.Interfaces;
using MoviesDB.Services.Interfaces;
using MoviesDB.Services.Movie;
using SimpleInjector;
using SimpleInjector.Integration.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace MoviesDB.DI.SimpleInjector
{
    public class IocContainer
    {
        private readonly Container container;

        public IocContainer()
        {
            container = new Container();
            container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();
        }

        public void Register()
        {
            this.container.Register<IMovieService, MovieService>(Lifestyle.Scoped);

            this.container.Register<IMovieDal, MovieDal>(Lifestyle.Scoped);

            this.container.RegisterMvcControllers(Assembly.GetExecutingAssembly());

            this.container.Verify();
        }

        public Container Container
        {
            get
            {
                return this.container;
            }
        }
    }
}