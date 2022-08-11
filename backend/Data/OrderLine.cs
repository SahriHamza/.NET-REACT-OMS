using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
namespace backend.Data
{
    public class OrderLine
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required]
        [ForeignKey("ProductId")]
        public long ProductId { get; set; }

        [Required]
        [ForeignKey("OrderId")]
        public long OrderId { get; set; }

        [Required]
        [Column(TypeName = "integer")]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "float")]
        public double UnitPrice { get; set; }

        [Column(TypeName = "float")]
        [DefaultValue(0)]
        public double Discount { get; set; }

        [StringLength(250)]
        [Column(TypeName = "varchar(250)")]
        public string? Description { get; set; }
    }
}
