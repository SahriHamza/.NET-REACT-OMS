using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using System.Text.Json;
using static System.Text.Json.JsonElement;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<ClientsController> _logger;
        private readonly ClientsContext _context;

        public OrdersController(ILogger<ClientsController> logger, ClientsContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetOrders")]
        [Produces("application/json")]
        public IEnumerable<Order> Get()
        {
            return _context.Orders.Include(i=>i.Client).ToArray();
        }

        [HttpGet("{id:int}")]
        [Produces("application/json")]
        public Order GetOrder(int id)
        {
            Order order = _context.Orders.Include(i => i.ShipAddress)
                                .Include(i => i.BillAddress)
                                .Include(i => i.Warehouse)
                                .Include(i => i.Client)
                                .Include(i => i.OrderLines)
                                .Where(i => i.Id == id).First();
            foreach(OrderLine line in order.OrderLines){
                Console.WriteLine(line.ProductId);
            }
            return order;
        }

        private string CleanOrderJsonData(JsonElement order)
        {
            //JsonElement jsonElement = new JsonElement();
            var dictionary = JsonSerializer.Deserialize<Dictionary<string, object>>(order.ToString());
            Dictionary<string, object> jsonElement = new Dictionary<string, object>();
            foreach (var item in dictionary)
            {
                if(item.Key != "ShipAddress" && item.Key != "BillAddress" 
                    && item.Key != "OrderLines" && item.Key != "Warehouse"
                    && item.Key != "Client")
                {
                    jsonElement.Add(item.Key, item.Value);
                }
            }
            string jsonString = JsonSerializer.Serialize(jsonElement);
            return jsonString;
        }

        private List<OrderLine> createOrderLines(JsonElement orderLines)
        {
            List<OrderLine> lines = new List<OrderLine>();
            var dictionary = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(orderLines.ToString());
            foreach (var orderLine in dictionary)
            {
                string jsonString = JsonSerializer.Serialize(orderLine);

                OrderLine _orderLine = JsonSerializer.Deserialize<OrderLine>(jsonString)!;
               // _orderLine.Product = product;
                lines.Add(_orderLine);
            }
                
            return lines;
        }


        [HttpPut]
        public IActionResult Edit([FromBody] JsonElement order)
        {
            int warehouseId = order.GetProperty("Warehouse").GetInt32();
            Warehouse warehouse = _context.Warehouses.Where(i => i.Id == warehouseId).FirstOrDefault();
            if (warehouse == null)
            {
                return NotFound("warehouse could not be found.");
            }
            // client
            int clientId = order.GetProperty("Client").GetInt32();
            Client client = _context.Clients.Where(i => i.Id == clientId).FirstOrDefault();
            if (client == null)
            {
                return NotFound("client could not be found.");
            }

            //shipping address
            string shipAddr = order.GetProperty("ShipAddress").ToString();
            Address shipAddress = JsonSerializer.Deserialize<Address>(shipAddr)!;
            Console.WriteLine(shipAddress.Id);
            /*try
            {
                _context.Addresses.Update(shipAddress);
                //_context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.Message);
            }*/

            //billing address
            string billAddr = order.GetProperty("BillAddress").ToString();
            Address billAddress = JsonSerializer.Deserialize<Address>(billAddr)!;

            // order lines
            JsonElement orderLines = order.GetProperty("OrderLines");
            List<OrderLine> _orderLines;
            try
            {
                _orderLines = createOrderLines(orderLines);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            string orderHeader = CleanOrderJsonData(order);
            Order _order = JsonSerializer.Deserialize<Order>(orderHeader)!;
            _order.Warehouse = warehouse;
            _order.Client = client;
            _order.BillAddress = billAddress;
            _order.ShipAddress = shipAddress;

            try
            {
                _context.Orders.Update(_order);
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(ex.Message);
            }


            foreach (OrderLine orderLine in _orderLines)
            {
                orderLine.OrderId = _order.Id;
                _context.OrderLines.Update(orderLine);
                _context.SaveChanges();
            }

            return Ok();
        }

        [HttpPost]
        public IActionResult Create([FromBody] JsonElement order)
        {
            try
            {
                // warehouse
                int warehouseId = order.GetProperty("Warehouse").GetInt32();
                Warehouse warehouse = _context.Warehouses.Where(i => i.Id == warehouseId).FirstOrDefault();
                if (warehouse == null)
                {
                    return NotFound("warehouse could not be found.");
                }
                // client
                int clientId = order.GetProperty("Client").GetInt32();
                Client client = _context.Clients.Where(i => i.Id == clientId).FirstOrDefault();
                if (client == null)
                {
                    return NotFound("client could not be found.");
                }

                //shipping address
                string shipAddr = order.GetProperty("ShipAddress").ToString();
                Address shipAddress = JsonSerializer.Deserialize<Address>(shipAddr)!;

                //billing address
                string billAddr = order.GetProperty("BillAddress").ToString();
                Address billAddress = JsonSerializer.Deserialize<Address>(shipAddr)!;

                // order lines
                JsonElement orderLines = order.GetProperty("OrderLines");
                List<OrderLine> _orderLines;
                try
                {
                    _orderLines = createOrderLines(orderLines);

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

                string orderHeader = CleanOrderJsonData(order);
                Order _order = JsonSerializer.Deserialize<Order>(orderHeader)!;
                _order.Warehouse = warehouse;
                _order.Client = client;
                _order.BillAddress = billAddress;
                _order.ShipAddress = shipAddress;

                try
                {
                    _context.Orders.Add(_order);
                    _context.SaveChanges();
                }
                catch (DbUpdateException ex)
                {
                    return BadRequest(ex.Message);
                }


                foreach (OrderLine orderLine in _orderLines)
                {
                    orderLine.OrderId = _order.Id;
                    _context.OrderLines.Add(orderLine);
                    _context.SaveChanges();
                }
            } catch(Exception ex)
            {
                return BadRequest();
            }
            

            return Ok();
        }
    }
}
