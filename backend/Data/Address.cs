using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Data
{
    public class Address
    {
        [Required]
        [Key]
        public long Id { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Name { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Street { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? City { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? State { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string?  Zip { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string? Country { get; set; }

    }
}
