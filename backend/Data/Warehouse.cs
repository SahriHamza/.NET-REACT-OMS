using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Data
{
    public class Warehouse
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "Warehouse Name is Required")]
        [StringLength(250)]
        [Column(TypeName = "varchar(250)")]
        public string Name { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Phone { get; set; }

        public Address? Address { get; set; }
    }
}
