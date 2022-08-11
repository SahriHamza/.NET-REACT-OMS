using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {

        private readonly ILogger<ClientsController> _logger;
        private readonly ClientsContext _context;

        public ProductsController(ILogger<ClientsController> logger, ClientsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetProducts")]
        [Produces("application/json")]
        public IEnumerable<Product> Get()
        {
            return _context.Products.ToArray();
        }

        [HttpGet("{id:int}")]
        [Produces("application/json")]
        public Product GetClient(int id)
        {
            return _context.Products.Where(i => i.Id == id).First();
        }


        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Add(product);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        public IActionResult Edit([FromBody] Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Update(product);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }
    }
    }