using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {

        private readonly ILogger<ClientsController> _logger;
        private readonly ClientsContext _context;

        public ClientsController(ILogger<ClientsController> logger, ClientsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetClients")]
        [Produces("application/json")]
        public IEnumerable<Client> Get()
        {
            return _context.Clients.ToArray();
        }

        [HttpGet("{id:int}")]
        [Produces("application/json")]
        public Client GetClient(int id)
        {
            return _context.Clients.Include(i=>i.Address).Where(i=>i.Id == id).First();
        }

        [HttpPut]
        public IActionResult Edit([FromBody]Client client)
        {
            if (ModelState.IsValid)
            {
                _context.Clients.Update(client);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Client client)
        {
            if (ModelState.IsValid)
            {
                _context.Clients.Add(client);
                _context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }
    }
}
