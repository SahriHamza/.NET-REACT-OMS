using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Data
{
    public class Client
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [Required(ErrorMessage = "Client Name is Required")]
        [StringLength(250)]
        [Column(TypeName = "varchar(250)")]
        public string Name { get; set; }

        public Address? Address { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? CustomerNumber { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? PaymentMethod { get; set; }


    }
}
