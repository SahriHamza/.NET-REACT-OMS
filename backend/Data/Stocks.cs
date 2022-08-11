using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
namespace backend.Data
{
    public class Stocks
    {
        [Required]
        [Key]
        [Column(Order = 1)]
        public Warehouse Warehouse { get; set; }

        [Required]
        [Key]
        [Column(Order = 2)]
        public Product Product { get; set; }

        [Column(TypeName = "integer")]
        [DefaultValue(0)]
        public int QuantityOnHand { get; set; }

        [Column(TypeName = "integer")]
        [DefaultValue(0)]
        public int QuantityOnSO { get; set; }

        [Column(TypeName = "integer")]
        [DefaultValue(0)]
        public int QuantityOnPO { get; set; }

    }
}
