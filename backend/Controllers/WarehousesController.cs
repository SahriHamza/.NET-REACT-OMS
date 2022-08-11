using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehousesController : ControllerBase
    {
        private readonly ILogger<ClientsController> _logger;
        private readonly ClientsContext _context;

        public WarehousesController(ILogger<ClientsController> logger, ClientsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetWarehouses")]
        [Produces("application/json")]
        public IEnumerable<Warehouse> Get()
        {
            return _context.Warehouses.ToArray();
        }

        [HttpGet("{id:int}")]
        [Produces("application/json")]
        public Warehouse GetWarehouse(int id)
        {
            return _context.Warehouses.Where(i => i.Id == id).First();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Warehouse warehouse)
        {
            if (ModelState.IsValid)
            {
                _context.Warehouses.Add(warehouse);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut]
        public IActionResult Edit([FromBody] Warehouse warehouse)
        {
            if (ModelState.IsValid)
            {
                _context.Warehouses.Update(warehouse);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }
    }
}
