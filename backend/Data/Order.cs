using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Data
{
    public enum OrderStatus
    {
        New,
        Processing,
        Shipped,
        Invoiced
    }

    public class Order
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "Order Reference is Required")]
        [StringLength(250)]
        [Column(TypeName = "varchar(250)")]
        public string Reference { get; set; }

        [StringLength(100)]
        [Column(TypeName = "varchar(100)")]
        public string? Vendor { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? ShipVia { get; set; }

        [StringLength(100)]
        [Column(TypeName = "varchar(100)")]
        public string? Class { get; set; }

        [StringLength(100)]
        [Column(TypeName = "varchar(100)")]
        public string? ShipMethod { get; set; }

        public double? ShipPrice { get; set; }

        public double? Taxes { get; set; }

        public double? SubTotal { get; set; }

        public double? Total { get; set; }

        [Required]
        public Address ShipAddress { get; set; }

        public Address? BillAddress { get; set; }

        // Order Lines
        public List<OrderLine> OrderLines { get; set; }

        // Dates
        [Required]
        [Column(TypeName = "Date")]
        public DateTime Date { get; set; }

        [Column(TypeName = "Date")]
        public DateTime ShipDate { get; set; }

        // Client
        public Client Client { get; set; }

        // Warehouse
        [ForeignKey("WarehouseId")]
        public Warehouse Warehouse { get; set; }

        //Order Status
        public OrderStatus Status { get; set; }

    }
}
