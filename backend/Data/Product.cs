using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Data
{
    public class Product
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "Product Reference is Required")]
        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Reference { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Title { get; set; }

        [StringLength(500)]
        [Column(TypeName = "varchar(500)")]
        public string? Description { get; set; }

        [Column(TypeName = "float")]
        public double? Price { get; set; }

        [Column(TypeName = "float")]
        public double? Cost { get; set; }

        [Column(TypeName = "boolean")]
        public bool Active { get; set; }

        [StringLength(13)]
        [Column(TypeName = "varchar(50)")]
        public string? UPC { get; set; }

    }
}
