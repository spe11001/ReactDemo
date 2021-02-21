using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReactDemo.Models;

namespace ReactDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}