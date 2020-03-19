using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace MoviesDB.Providers
{
    public class ConfigurationProvider
    {
        private static ConfigurationProvider instance;

        private static readonly object lockObject = new object();

        private ConfigurationProvider()
        {
        }

        public static ConfigurationProvider Instance 
        {
            get
            {
                if (instance == null)
                {
                    lock (lockObject)
                    {
                        if (instance == null)
                        {
                            instance = new ConfigurationProvider();
                        }
                    }
                }

                return instance;
            }
        }

        public int GetPageSize()
        {
            return int.Parse(ConfigurationManager.AppSettings["PageSize"]);
        }
    }
}